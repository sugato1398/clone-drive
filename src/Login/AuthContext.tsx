import React ,{useContext, createContext, useState, type ReactNode, useEffect} from 'react';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
  RespondToAuthChallengeCommand,
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from '@aws-sdk/client-cognito-identity';
import { CLIENT_ID, IDENTITY_POOL_ID, REGION, USER_POOL_ID } from '../setup/aws-config';
import { S3Client } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null
    s3Client: S3Client | null;
    signIn: (email: string, password: string) => Promise<{success:boolean; message?:string}>;
    signUp: (email: string, password: string) => Promise<{success:boolean; message?:string}>;
    confirmSignUp: (email: string, password: string) => Promise<{success:boolean; message?:string}>;
    signOut: () => Promise<void>;
    loadingAuth: boolean;  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider : React.FC<{children: ReactNode}> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<any>(null)
    const [s3Client, setS3Client] = useState<S3Client|null>(null)
    const [loadingAuth, setLoadingAuth] = useState<boolean>(false)

    const cognitoIdentityProviderClient = new CognitoIdentityProviderClient({region: REGION,});
    const cognitoIdentityClient = new CognitoIdentityClient({region: REGION,});


    useEffect(() => {
        const checkCurrentSession = async () => {
            setLoadingAuth(true)
            try{
                const storedIdToken = localStorage.getItem('idToken');

                if(storedIdToken){
                    const s3 = await getAuthenticatedS3Client(storedIdToken);

                    if(s3){
                        setIsAuthenticated(true);
                        const tokenPayload = JSON.parse(atob(storedIdToken.split('.')[1]));
                        setUser({username: tokenPayload['cognito:username'] || tokenPayload.email, sub:tokenPayload.sub})
                    }else{
                        setIsAuthenticated(false)
                        setUser(null)
                    }
                }else{
                        setIsAuthenticated(false)
                        setUser(null)
                    }
            }catch(error:any){
                console.error('error checking session:',error);
                setIsAuthenticated(false);
                setUser(null);
            }finally{
                setLoadingAuth(false)
            }
        }
        checkCurrentSession();
    },[]);

    const getAuthenticatedS3Client = async (idToken: string) => {
        try{
                const getIdCommand = new GetIdCommand({
                IdentityPoolId:IDENTITY_POOL_ID,
                Logins: {
                    [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
                },
            })

            const {IdentityId} = await cognitoIdentityClient.send(getIdCommand);

            if(!IdentityId){
                throw new Error("Failed to get identity")
            }

            // get temporary credentials
            const getCredentialsCommand = new GetCredentialsForIdentityCommand({
                IdentityId,
                Logins: {
            [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
                },
            })

            console.log('region',REGION)

            const {Credentials} = await cognitoIdentityClient.send(getCredentialsCommand)

            if (!Credentials?.AccessKeyId || !Credentials?.SecretKey || !Credentials?.SessionToken){
                throw new Error('Failed to get AWS Credentials')
            }

            // setup S3 client
            const s3 = new S3Client({
                region: REGION,
                credentials: {
                    accessKeyId:Credentials.AccessKeyId,
                    secretAccessKey:Credentials.SecretKey,
                    sessionToken:Credentials.SessionToken,
                },
                requestChecksumCalculation: "WHEN_REQUIRED" 
            });

            setS3Client(s3);
            console.log('successfully created s3 client')
            return s3
        }
        catch(error: any){
            console.error("error in fetching S3 client ",error)
            setS3Client(null)
            return null
        }

    }

    const signUp = async (email: string, password: string) => {
        try{
            const command = new SignUpCommand({
                ClientId:CLIENT_ID,
                Username: email,
                Password: password,
                UserAttributes: [{ Name: 'email', Value: email }],
            });

            await cognitoIdentityProviderClient.send(command);
            return {success: true, message: 'sign up successful, check for cofirmation code'}
        }catch(e:any){
            console.error("failed to sign up :",e)
            return {success:false, message:e.message || 'failed to sign up'}
        }

    };

    const confirmSignUp = async (email: string, code: string) => {
        try{ 
            const command = new ConfirmSignUpCommand({
                ClientId:CLIENT_ID,
                Username: email,
                ConfirmationCode: code,
            });

            await cognitoIdentityProviderClient.send(command);

            return {success: true, message: " confirmed user sign up"}
        }
        catch (error: any){
            console.error('error in confirming sign up: ',error)
            return {success: false, message: error.message || "failed to confirm email"}
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoadingAuth(true)

        try{
            const command = new InitiateAuthCommand({
                AuthFlow:AuthFlowType.USER_PASSWORD_AUTH,
                ClientId: CLIENT_ID,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                }
            });

            const authResponse = await cognitoIdentityProviderClient.send(command);

            if (authResponse.ChallengeName){
                return {success: false, message:`auth challenge: ${authResponse.ChallengeName} Not Implemented `}
            }

            const idToken = authResponse.AuthenticationResult?.IdToken
            const accessToken = authResponse.AuthenticationResult?.AccessToken

            if (!idToken){
                throw new Error('no id token received')
            }
            if (!accessToken){
                throw new Error('no id token received')
            }

            localStorage.setItem('idToken',idToken);
            localStorage.setItem('accessToken',accessToken)
            
            const s3 = await getAuthenticatedS3Client(idToken)

            if(s3){
                setIsAuthenticated(true)
                const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));

                setUser({username : tokenPayload['cognito:username'] || tokenPayload.email, sub: tokenPayload.sub});
                return {success:true, message:'signed in successfully'}
            }
            else{
                return {success:false,message: "failed to sign in to S3"}
            }

        }catch(error: any){
            console.error("Sign in error", error)
            setIsAuthenticated(false)
            setUser(null)
            return {success: false, message:error.message || " failed to sign in"}
        }finally{
            setLoadingAuth(false)
        }
    };


    const signOut = async () => {
        try{
            const command = new GlobalSignOutCommand({
                AccessToken: localStorage.getItem('accessToken') || '',
            })
            await cognitoIdentityProviderClient.send(command)
            localStorage.removeItem('idToken')
            localStorage.removeItem('accessToken')
            setIsAuthenticated(false)
            setUser(null)
            setS3Client(null)
        }catch(error: any){
            console.error('Sign out error',error);
        }
    }

    const value = {
        isAuthenticated,
        user,
        s3Client,
        signIn,
        signOut,
        confirmSignUp,
        signUp,
        loadingAuth
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context == undefined){
        throw new Error(' useAuth must be used within an AuthProvider');
    }
    return context;
}
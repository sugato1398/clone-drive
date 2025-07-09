import { useState } from "react"
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider"
import { cognitoIdentityProviderClient, USER_POOL_ID, CLIENT_ID } from "../setup/aws-config"
import type { __ServiceException } from "@aws-sdk/client-cognito-identity-provider/dist-types/models/CognitoIdentityProviderServiceException"

function Signup() {
  const [email,setemail] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState('')

  const handleSignup = async () => {
        try{
            const signupcomm = new SignUpCommand({
                ClientId: CLIENT_ID,
                Username: email,
                Password: password,
                UserAttributes:[{ Name: 'email',Value: email},]
            });

            await cognitoIdentityProviderClient.send(signupcomm);
            setMessage('Sign up successful! Please check your email for a confirmation code.');


        }
        catch(error: any){
            setMessage(`sign up failed : ${error.message}`);
                  console.error("Sign up error:", error);
        }
  }
    
    return (
        <>
        <label>
            Email: 
            <input value={email} onChange={e => setemail(e.target.value)}/>
        </label>
        <p></p>
        <label>
            Password:
            <input value={password} onChange={e => setPassword(e.target.value)} type='password'/>
        </label>
        <p></p>
        <button onClick={() => setemail(email)}>Sign Up</button>
        </>
    )
  
}
export default Signup

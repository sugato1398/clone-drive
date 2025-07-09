// src/aws-config.js (or similar)
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

export const USER_POOL_ID = "us-east-2_Hp4SSNxIw"; // e.g., us-east-1_XXXXX
export const CLIENT_ID = "6q7gaomdohqejt5ckisjioegph"; // e.g., XXXXXXXXXXXXXXXX
export const IDENTITY_POOL_ID = "us-east-2:254bd728-cb37-4779-9cb0-bcb0a4b1c2b1"; // e.g., us-east-1:XXXX-XXXX-XXXX-XXXX
export const REGION = "us-east-2"; // e.g., us-east-1
export const S3BUCKETNAME = "myawsbucket1212398"


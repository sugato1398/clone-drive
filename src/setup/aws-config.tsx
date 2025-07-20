// src/aws-config.js (or similar)

export const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID; 
export const CLIENT_ID = import.meta.env.VITE_COGNITO_APP_CLIENT_ID; 
export const IDENTITY_POOL_ID = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID; 
export const REGION = import.meta.env.VITE_AWS_REGION; 
export const S3BUCKETNAME = import.meta.env.VITE_S3_BUCKET_NAME


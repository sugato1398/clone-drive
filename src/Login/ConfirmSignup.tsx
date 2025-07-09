import { ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import React, { useState } from 'react'
import { CLIENT_ID, cognitoIdentityProviderClient } from '../setup/aws-config'

function ConfirmSignUp(){
    const [confirmcode, setconfirmcode] = useState('')
    const [username, setUsername] = useState('')

    const handleConfirmSignUp = async () => {
        try {
            const command = new ConfirmSignUpCommand({
                ClientId: CLIENT_ID,
                Username: username,
                ConfirmationCode: confirmcode
            });

            await cognitoIdentityProviderClient.send(command)

        }catch(error: any){
            console.log(`authentication error: ${error.message}`)
        }
    }
    return (
        <div>
            <label>
                Enter username
                <input value={username} onChange={(e)=> setUsername(e.target.value)} type='text'/>
            </label>
            <label> 
                Enter Confirmation Code
                <input value={confirmcode} onChange={(e)=>setconfirmcode(e.target.value)} type='text'/>
                <button> Confirm Account</button>
            </label>
        </div>
    )
}

export default ConfirmSignUp
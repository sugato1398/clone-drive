import { useState } from "react"


function SignInPage(){
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')

    const handleSignIn = async () => {

    }
    
    return (
        <div>
            <label>
                Enter username
                <input value={username} type='text' onChange={(e)=> setUsername(e.target.value)}/>
            </label>

            <label>
                Enter password
                <input value={password} type='password' onChange={(e)=>setPassword(e.target.value)}/>
            </label>

            <button onClick={()=>handleSignIn}> Sign In</button>
        </div>
    )
}
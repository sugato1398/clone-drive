import { useState } from "react"

function LoginPage() {
  const [email,setemail] = useState('')
  const [password,setPassword] = useState('')

    
    return (
        <>
        <label>
            Email: 
            <input value={email} onChange={e => setemail(e.target.value)}/>
        </label>
        <p></p>
        <label>
            Password:
            <input value={password} onChange={e => setemail(e.target.value)} type='password'/>
        </label>
        <p></p>
        <button onClick={() => setemail(email)}>Login</button>
        <p>{email}</p>
        </>
    )
  
}
export default LoginPage

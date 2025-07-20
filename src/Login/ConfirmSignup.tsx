import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import '../index.css'


const ConfirmSignUpPage: React.FC = () =>{
    const [code, setCode] = useState<string>('')
    const [message,setMessage] = useState<string>('')
    const {confirmSignUp} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const email = (location.state as {email:string})?.email || ''

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        if(!email){
            setMessage("Email not provided")
            return
        }
        const result = await confirmSignUp(email,code)
        setMessage(result.message || "")
        if(result.success){
            navigate('/login')
        }
    }

    return(
        <div className='auth-container'>
            <h2>Confirm Sign Up</h2>
            <p>A verification code has been sent to {email}.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label htmlFor="code">Verification Code:</label>
                <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                </div>
                <button type="submit">Confirm</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    )
}

export default ConfirmSignUpPage
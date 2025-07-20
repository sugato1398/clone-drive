import { useState } from "react"
import { useAuth } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import '../index.css'

const LoginPage : React.FC = () => {
    const [email,setEmail] = useState<string>('')
    const [password,setPassword] = useState<string>('')
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    const { signIn,signUp } = useAuth()
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('')

        if(isSigningUp){
            const result = await signUp(email,password);
            setMessage(result.message || '')
            if (result.success){
                navigate('/confirmSignUp',{state: {email}});
            }
        }
        else {
            const result = await signIn(email,password);
            setMessage(result.message || '');
            if(result.success){
                navigate('/');
            }
        }
    };

    return (
        <div className='auth-container'>
            <h2>{isSigningUp? 'Sign Up' : 'Sign In'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input value={email} type='email' id='email' onChange={(e)=> setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input value={password} type='password' id='password' onChange={(e)=> setPassword(e.target.value)}/>
                </div>
                <button type='submit'>{isSigningUp? 'Sign Up': "Login"}</button>
            </form>

            {message && <p className="message">{message}</p>}
            <p>
                {isSigningUp?'Already have an account':"Don't have an account"}
                <button className='link-button' onClick={()=> setIsSigningUp(!isSigningUp)}>
                    {isSigningUp?'Login': 'Sign Up'}
                </button>
            </p>
        </div>
    )
}

export default LoginPage;
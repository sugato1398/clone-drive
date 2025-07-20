
import './index.css'
import { useAuth } from './Login/AuthContext'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import ConfirmSignUp from './Login/ConfirmSignup'

import Dashboard from './Main/Dashboard'
import LoginPage from './Login/LoginPage'

const PrivateRoute: React.FC<{children: React.ReactNode}> = ({children}) =>{
  const {isAuthenticated, loadingAuth} = useAuth()
  if (loadingAuth){
    return <div> Loading authentication...</div>
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login"/>;
}

function App() {
  const {isAuthenticated,signOut} = useAuth()

  return (
    <div className='App'>
      <nav>
        <Link to='/'>Home</Link>
        {!isAuthenticated ? (<Link to='/login'>Login</Link>) :
        (<button onClick={signOut}>Sign Out</button>)}
      </nav>
      <Routes>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/confirmSignUp' element={<ConfirmSignUp/>} />
        <Route path='/' element= { <PrivateRoute><Dashboard/></PrivateRoute>} />
      </Routes>
    </div>
  )
}

export default App

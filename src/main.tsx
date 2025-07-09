import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Signup from './Login/Signup.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Signup />
  </StrictMode>,
)

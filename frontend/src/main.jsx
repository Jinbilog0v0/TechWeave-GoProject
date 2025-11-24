import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'


const GOOGLE_CLIENT_ID = "60255886290-9ujod65phbm7mrhb435gu4kj3qssb9ra.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
      </GoogleOAuthProvider>
  </StrictMode>,
)

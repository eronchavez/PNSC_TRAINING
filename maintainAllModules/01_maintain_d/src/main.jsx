import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/base.css'
import './assets/theme/theme-b.css'
import './assets/theme/theme-c.css'
import './assets/theme/theme-h.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

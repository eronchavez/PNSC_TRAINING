import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./assets/base.css"
import "./assets/themes/theme-b.css"
import "./assets/themes/theme-c.css"
import "./assets/themes/theme-h.css"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

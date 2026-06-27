import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/base.css'
import App from './App.jsx'
import './styles/themes/theme-a.css'
import './styles/themes/theme-b.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import "./styles/base.css"


import "./styles/themes/theme-a.css"
import "./styles/themes/theme-b.css"
import "./styles/themes/theme-c.css"
import "./styles/themes/theme-d.css"
import "./styles/themes/theme-e.css"
import "./styles/themes/theme-f.css"
import "./styles/themes/theme-g.css"
import "./styles/themes/theme-h.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

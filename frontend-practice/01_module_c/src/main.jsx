
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router';

/*
  Choose ONE styling option only:

  Tailwind:
  import "./styles/tailwind.css";

  Bootstrap:
  import "./styles/bootstrap.css";

  Plain CSS:
  import "./styles/plain.css";
*/

import "./styles/plain.css";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

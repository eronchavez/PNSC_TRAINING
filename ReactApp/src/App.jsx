
import './App.css'
import WelcomeMessage from './WelcomeMessage';
import {Routes,Route,Link,useNavigate} from 'react-router';
import Home from './Home';
import Contact from './Contact';
import About from './About';





function App() {
  

  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">contact</Link>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
    </div>
  )
}

export default App

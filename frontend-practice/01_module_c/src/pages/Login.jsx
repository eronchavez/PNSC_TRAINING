import { Zap, Mail, Lock, Eye, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import "../styles/login.css"


function Login() {
  const navigate = useNavigate()
  

  const [errors, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // const login = (e) => {
  //   e.preventDefault()
  //   navigate("/")
  // }
  
  async function handleSubmit(e)
  {
    e.preventDefault()
    setLoading(true)
    try 
    {
      const response = await fetch("http://localhost/PNSC_TRAINING/studysprint/api/login", {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password
        }),
        headers: {
          'Content-Type': 'application/json'
        }

      })

      const data = await response.json()
      if(response.status === 200){
        // store token sa local storage
        // navigate dashboard (/)
        localStorage.setItem('token', data.access_token)
        navigate("/", {
          replace: true
        })
        
      } else {
        
        setError(data.message)
      }
      console.log(data)

    }catch(e) 
    {
        setError(e.message)
    }finally 
    {
        setLoading(false)
    }
    
    // setError("")

    // navigate("/")
   
  }





 

  return (
    <div className="main-app">
      <header className="login-header">
        <Zap id="zap" size={35} />
        <h1>StudySprint</h1>
        <p>Focus,organize, and accelerate your academic performance</p>
      </header>

      <main>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <p>Access your tasks and focus sprints</p>

            <div className="input-container">
              <label htmlFor="email">Email</label>
              <div className="input-field">
                <Mail id="mail" />
                <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="password">Password</label>
              <div className="input-field">
                <Lock id="password-icon" />
                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Eye />
              </div>
            </div>
            <div className="errorMessage">
                {errors &&  <p style={{color:"red"}}>{errors}</p>}
            </div>
            <div className="submit-container">
              <button>{loading ? <p>Signing in...</p> : <><p> Sign in</p><ArrowRight size={15}/></> }</button>
              
            </div>
          </form>
        </div>
      
        <footer>
          <div className="sign-up">
            <p>New to StudySprint?</p>
            <p>Create an Account</p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Login

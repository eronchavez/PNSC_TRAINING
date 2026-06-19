import { Zap, Mail, Lock, Eye, ArrowRight } from "lucide-react"
import "../styles/login.css"

function Login() {
  return (
    <div className="login-page">
      <header className="login-header">
        <Zap id="zap" size={35} />
        <h1>StudySPrint</h1>
        <p>Focus, organize, and accelerate your academic performance</p>
      </header>

      <main>
        <div className="login-form">
          <form>
            <h2>Sign In</h2>
            <p>Access your tasks and focus sprints</p>

            <div className="input-container">
              <label>Email</label>
              <div className="input-field">
                <Mail />
                <input type="email" />
              </div>
            </div>

            <div className="input-container">
              <label>Password</label>
              <div className="input-field">
                <Lock />
                <input type="password" />
                <Eye />
              </div>
            </div>

            <div className="submit-container">
              <button type="button">
                <p>Sign in</p>
                <ArrowRight />
              </button>
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
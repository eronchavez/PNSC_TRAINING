import "./../styles/login.css";
import zap from "./../assets/icons/zap.png";
import mail from "./../assets/icons/mail.png";
import lock from "./../assets/icons/lock-keyhole.png";
import eye from "./../assets/icons/eye.png";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/app/dashboard");
  };

  return (
    <main>
      <div className="signIn">
        <div id="zap">
          <img src={zap} alt="zap" />
        </div>

        <h1>StudySprint</h1>
        <p>Focus, organize, and accelerate your academic performance.</p>

        <div className="signInForm">
          <h2>Sign In</h2>
          <p>Access your tasks and focus sprints</p>

          <form onSubmit={handleLogin}>
          
            <div className="inputField">
              <label>Email</label>

              <div className="inputContainer">
                <input type="text" name="email" />

                <img src={mail} alt="email" className="icon" />
              </div>
            </div>

     
            <div className="inputField">
              <label>Password</label>

              <div className="inputContainer">
                <input type="password" name="password" />

                <img src={lock} alt="lock" className="icon" />
                <img src={eye} alt="eye" className="eye" />
              </div>
            </div>

        
            <div className="sign-in-btn">
              <button type="submit">
                Sign In
              </button>
            </div>
          </form>

          <div className="createAcc">
            <p>
              New to StudySprint? <a href="#">Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
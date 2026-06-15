import "./../styles/login.css";
import {Zap, Mail, Lock, Eye, MoveRight} from "lucide-react";

import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <main>
         <div id="zap">
          <Zap color="#fff"/>
        </div>

         <h1>StudySprint</h1>
        <p>Focus, organize, and accelerate your academic performance.</p>

      <div className="signIn">
       
     
        <div className="signInForm">
          <h2>Sign In</h2>
          <p>Access your tasks and focus sprints</p>

          <form onSubmit={handleLogin}>
          
            <div className="inputField">
              <label>Email</label>

              <div className="inputContainer">
                <Mail id="mail" size={25}/>
                <input type="text" name="email" />
                
              </div>
            </div>

     
            <div className="inputField">
              <label>Password</label>

              <div className="inputContainer">
                <Eye id="eye" size={30}/>
                <input type="password" name="password" />
                <Lock id="lock" size={25}/>
              
              </div>
            </div>

        
            <div className="sign-in-btn">
              <button type="submit">
                Sign In <MoveRight />
              </button>
              
            </div>
          </form>

          
        </div>
        <div className="createAcc">
            <p>
              New to StudySprint? <a href="#">Create an account</a>
            </p>
          </div>
      </div>
    </main>
  );
}

export default Login;
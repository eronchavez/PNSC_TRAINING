
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./../styles/dashboard.css";




function AppLayout() {

    const location = useLocation();
      const navigate = useNavigate();
    
    const getTitle = () => {
        if(location.pathname.includes("dashboard")) return "Dashboard";
        if(location.pathname.includes("tasks")) return "Task";
        
    }

    const handleLogout = () => {
      navigate("/"); 
    };
    
 
 
  return (
    <div>
        <header>
          <div className="page-header">
            <h1>{getTitle()}</h1>
  
           
            <p onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </p>
          </div>
        </header>

     
        <main style={{ padding: "20px" }}>
         
          <Outlet />
        </main>

        
      {/* FOOTER */}
      <footer>
        <nav>
          <ul>
            <li>🏠 Home</li>
            <li>📋 Tasks</li>
            <li>⚙️ Settings</li>
          </ul>
        </nav>
      </footer>

       
    </div>
  );
}

export default AppLayout;
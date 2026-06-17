import { LogOut, ArrowLeft, HomeIcon,ListChecks, Settings, CirclePlus} from "lucide-react";
import { Outlet, useLocation } from "react-router";
import "../styles/applayout.css";
import { useNavigate } from "react-router";

function AppLayout() {

  const navigate = useNavigate()
  const location = useLocation()
  const canGoBack = (window.history.state?.idx ?? 0) > 0
  const token = localStorage.getItem("token")
  
    function handleAdd()
    {
        navigate("/tasks/new")
    }

    function handleEdit(taskId) 
    {
      navigate(`/tasks/${taskId}/edit`)
    }

    async function handleLogOut()
    {
        const response = await fetch("http://localhost/PNSC_TRAINING/studysprint/api/logout", {
          method: 'POST',
          headers: 
          {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        })

        const data = response.json()
        localStorage.removeItem("token")
        navigate("/login", { replace: true })

    }
    

  const getTitle = () => {
      if(location.pathname === "/") return "Dashboard"
      if(location.pathname === "/tasks") return "Tasks"
      if(location.pathname === "/tasks/new") return "New Tasks"
      if(location.pathname === "/settings") return "Settings"
      if(location.pathname.includes("/edit")) return "Edit Task"
      return "StudySprint"
  }

  return (
    <div id="main-app">
      <header className="layout-header">
        <div className="back-btn-title">
          {canGoBack && canGoBack ? <ArrowLeft color="#1d4ed8" onClick={() => navigate(-1)} style={{cursor: "pointer"}}/> : <div id='blank-arrow'> </div>}
          <h1>{getTitle()}</h1>
        </div>
        <LogOut onClick={handleLogOut}/>
      </header>

      <main>
        <Outlet />
        {
          location.pathname === "/" || location.pathname === "/tasks" || location.pathname === "/settings" 
          ? <CirclePlus id="fab" size={50} color="blue" onClick={() => handleAdd()}/> : null
        }
        
      </main>

      <footer className="layout-footer">
        <nav>
            <ul id="ul-footer">
                <li className={`li-footer ${location.pathname === "/" ? "active" : ""} `} onClick={() => navigate("/")}>
                    <HomeIcon/>
                    Home
                </li>
                <li className={`li-footer ${location.pathname === "/tasks" ? "active" : ""} `}  onClick={() => navigate("/tasks")}>
                    <ListChecks/>
                    Tasks
                </li>
                <li className={`li-footer ${location.pathname === "/settings" ? "active" : ""} `}  onClick={() => navigate("/settings")}>
                    <Settings/>
                    Settings
                </li>
            </ul>
        </nav>
      </footer>
    </div>
  );
}

export default AppLayout;

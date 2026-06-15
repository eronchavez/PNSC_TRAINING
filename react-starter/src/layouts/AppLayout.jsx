
import { Outlet, useLocation, NavLink,useNavigate } from "react-router";
import "./../styles/appLayout.css";
import { LogOut, ArrowLeft, HomeIcon,ListChecks,SquarePen, Settings} from "lucide-react";





function AppLayout() {

  const location = useLocation();
  const navigate = useNavigate();

  const backBtn = () => {
    navigate(-1);      
  }

  let headerTitle = "Dashboard";

  switch(location.pathname)
  {
    case "/": 
      headerTitle = "Dashboard";
      break;
    case "/tasks":
      headerTitle = "Tasks";
      break;
    case "/taskEditor": 
      headerTitle = "Task Editor";
      break;
    case "/settings":
      headerTitle = "Settings";
      break;
  }


  
 
  return (
    <div id="main-app">
      <header>
        <ArrowLeft onClick={backBtn} color="black"/>
        <h1>{headerTitle}</h1>
        <NavLink to="/login">
             <LogOut/>
        </NavLink>
      </header>

      <main>
        <Outlet/>
      </main>

      <footer>
        <nav>
          <NavLink to="/">
            <HomeIcon/>
            Home
          </NavLink>
          <NavLink to="/tasks">
            <ListChecks />
            Tasks
          </NavLink>
          
          <NavLink to="settings"> 
            <Settings/>
            Settings
          </NavLink>
        </nav>
      </footer>
    </div>
  );
}

export default AppLayout;
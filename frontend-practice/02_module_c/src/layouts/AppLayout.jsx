import { LogOut, ArrowLeft, CirclePlus, HomeIcon, ListChecks, Settings } from "lucide-react"
import "../styles/appLayout.css"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router"

function AppLayout()
{
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem("token")
    const canGoBack = (window.history.state?.idx ?? 0) > 0
    
    /**
     *  
     * This function is for dynamic title
     * @returns title
     * 
     */
    function getTitle()
    {
        if(location.pathname === "/") return "Dashboard"
        if(location.pathname === "/tasks") return "Tasks"
        if(location.pathname === "/tasks/new") return "Create Task"
        if(location.pathname.includes("/edit")) return "Edit Task"
        if(location.pathname === "/settings") return "Settings"
        return "Study Sprint"
    }

    async function handleLogOut() 
    {
        await fetch("http://localhost/PNSC_TRAINING/studysprint/api/logout", 
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
                
            }
        )

        localStorage.removeItem("token")
        navigate("/login", {replace: true})
    }


    return (
        <div id="main-app" >
            <header className="layout-header">
                <div className="back-btn-title">
                    {
                        canGoBack 
                        ? <ArrowLeft color="#2f26ce" onClick={() => navigate(-1)} />
                        :  <div id="blank-arrow" />
                    }
                    <h1>{getTitle()}</h1>
                </div>
                <LogOut onClick={handleLogOut}/>
            </header>

            <main>
                <Outlet />
                <CirclePlus id="fab" color="#2f26ce" onClick={navigate("/tasks/new")} />
            </main>

            <footer className="layout-footer">
                <nav id="footer-nav">
                    <NavLink to="/" className="nav-footer" end>
                        <HomeIcon/>
                        Home
                    </NavLink>

                    <NavLink to="/tasks" className="nav-footer">
                        <ListChecks/>
                        Tasks
                    </NavLink>

                    <NavLink to="/settings" className="nav-footer">
                        <Settings/>
                        Settings
                    </NavLink>
                </nav>
            </footer>

        </div>
    )

}

export default AppLayout
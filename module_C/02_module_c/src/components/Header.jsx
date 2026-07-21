import { useLocation, useNavigate } from "react-router-dom"

const titleMap = {
    "/carparks": "Carparks",
    "/events": "Events",
    "/weather": "Weather",
    "/planner": "Travel Planner",
    "/settings": "Settings"
}


export default function Header({canGoBack})
{
    const location = useLocation()
    const navigate = useNavigate()
    const title = titleMap[location.pathname] ?? "Carparks"
   
    
    return (
        <header>
            <button 
                id="backBtn"
                disabled={!canGoBack}
                onClick={() => navigate(-1)}
            >
                {"<"}
            </button>
            <h1 id="viewTitle">{title}</h1>
        </header>
    )

}
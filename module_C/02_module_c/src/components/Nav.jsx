import { NavLink } from "react-router-dom"

const links = [
    { to: "/carparks", label: "Carparks"},
    { to: "/events", label: "Events"},
    { to: "/weather", label: "Weather"},
    { to: "/planner", label: "Planner"},
    { to: "/settings", label: "Settings"},
]

export default function Nav({setCanGoback})
{
    return (
        <nav>
            {
                links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({isActive}) => "nav-btn " + (isActive ? "active" : "")}
                        onClick={() => setCanGoback(true)}
                    >
                        {link.label}
                    </NavLink>
                ))
            }
        </nav>
    )
}
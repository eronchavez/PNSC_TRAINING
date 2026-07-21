import { Outlet } from "react-router-dom"
import { useState } from "react"
import Header from "./Header.jsx"
import Nav from "./Nav.jsx"


export default function Layout()
{
    const [canGoBack, setCanGoback] = useState(false)
    return (
        <div className="app">
            <Header canGoBack={canGoBack}/>
            <main id="mainContent">
                <Outlet />
            </main>
            <Nav setCanGoback={setCanGoback}/>
        </div>
    )
}
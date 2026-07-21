
import { useState } from "react"
import Carparks from "./Carparks.jsx"
import Events from "./Events.jsx"
import Settings from "./Settings.jsx"
import Weather from "./Weather.jsx"
import Planner from "./planner.jsx"

export const API = "http://localhost/module_c_api.php"

const pages = {
  carparks: {title: "Carparks", view: Carparks},
  events: {title: "Events", view: Events},
  weather: {title: "Weather", view: Weather},
  planner: {title: "Planner", view: Planner},
  settings: {title: "Settings", view: Settings}
// 
}

export default function App()
{
  const [currentPage, setCurrentPage] = useState("carparks")
  const [focusedCarpark, setFocusedCarpark] = useState(null)

  const currentPageInfo = pages[currentPage]
  const CurrentView = currentPageInfo.view

  function switchPage(pageKey)
  {
    setCurrentPage(pageKey)
    setFocusedCarpark(null)
  }

  return (
    <div className="app">
      <header className="header">
        {focusedCarpark && 
          <button
            onClick={() => setFocusedCarpark(null)}
          >
            Back
          </button>}

          <h1>{focusedCarpark ? "Carparks details" : currentPageInfo.title}</h1>
      </header>

      <main className="content">
        <CurrentView focused={focusedCarpark} setFocused={setFocusedCarpark}/>
      </main>

      <nav className="navbar">
        {Object.keys(pages).map((pageKey) => (
          <button
            key={pageKey}
            className={currentPage === pageKey ? "active" : ""}
            onClick={() => switchPage(pageKey)}
          >
            {pages[pageKey].title}
          </button>
        ))}
      </nav>
    </div>
  )
}
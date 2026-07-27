import { useState,useEffect } from "react"
import Carparks from "./Carparks"
import Settings from "./Settings"
import Events from "./Events"

export const API = "http://localhost/module_c_api.php"

const pages = {
  carparks: {title: "Carparks", view: Carparks},
  events: {title: "Events", view: Events},
  weather: {title: "Weather", view: () => <p>Loading weather...</p>},
  planner: {title: "Planner", view: () => <p>Loading planner...</p>},
  settings: {title: "Settings", view: Settings },
}

export default function App()
{
  const [currentPage, setCurrentPage] = useState("carparks")
  const [focusedCarpark, setFocusedCarpark] = useState(null)

  const currentPageInfo = pages[currentPage]
  const CurrentView = currentPageInfo.view 

  function switchPage(page)
  {
    setFocusedCarpark(null)
    setCurrentPage(page)
  }


  return (
    <div className="app">
      <header className="header">
        <button
          id="backBtn"
          disabled={!focusedCarpark}
          onClick={() => setFocusedCarpark(null)}
          aria-label="To back"
        >
          {"<"}
        </button>
       <h1>{focusedCarpark ? "Carpark Details" : currentPageInfo.title}</h1>
      </header>
      <main className="mainContent">
        <CurrentView focused={focusedCarpark} setFocused={setFocusedCarpark}/>
      </main>
      <nav className="navBar">
        {
          Object.keys(pages).map((page) => (
            <button
              key={page}
              onClick={() => switchPage(page)}
              className={currentPage === page ? "active" : "" }
              
            >
              {pages[page].title}
            </button>
          ))
        }
      </nav>
    </div>
  )
}
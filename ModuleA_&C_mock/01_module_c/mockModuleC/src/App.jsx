import { useState } from "react"
import Carparks from "./Carparks"
import Settings from "./Settings"
import Events from "./Events"
import Weather from "./Weather"
import Planner from "./Planner"
export const API = "http://ws1.worldskills.test/module_c_api.php"

const pages = {
  carparks: {title: "Carparks", view: Carparks},
  events: {title: "Events", view:  Events},
  weather: {title: "Weather", view: Weather},
  planner: {title: "Planner", view: Planner},
  settings: {title: "Settings", view: Settings},
}

export default function App()
{

  const [currentPage, setCurrentPage] = useState("carparks")
  const [focusedCarpark,setFocusedCarpark] = useState(null)

  const currentPageInfo = pages[currentPage]
  const CurrentView = currentPageInfo.view 

  function switchPage(page)
  {
    setCurrentPage(page)
    setFocusedCarpark(null)
  }



  return (
    <div className="app">
      <header className="header">
        <button
          id="backBtn"
          disabled={!focusedCarpark}
          onClick={() => setFocusedCarpark(null)}
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
              className={currentPage === page ? "active" : ""}
              onClick={() => switchPage(page)}
            >
              {pages[page].title}
            </button>
          ))
        }

      </nav>
    </div>
  )
}
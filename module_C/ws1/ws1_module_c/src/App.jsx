import { useState } from "react"
import Carparks from "./Carparks"

export const API = "http://ws1.worldskills.test/module_c_api.php"


const pages = {
  carparks: {title: "Carparks", view: Carparks},
  events: {title: "Events", view: () => <p>Loading events...</p>},
  weather: {title: "Weather", view: () => <p>Loading weather...</p>},
  planner: {title: "Planner", view: () => <p>Loading planner...</p>},
  Settings: {title: "Settings", view: () => <p>Loading Settings...</p>},
}

export default function App()
{
  const [currentPage, setCurrentPage] = useState("carparks")
  const [focusedCarpark, setFocusedCarpark] = useState(null)

  const currentPageInfo = pages[currentPage]
  const CurrentView = currentPageInfo.view


  function switchPage(page)
  {
    setCurrentPage(page)
    setFocusedCarpark(null)
  }

  return (
    <div id="app">
      <header className="header">
        <button
          disabled={!focusedCarpark}
          id="backBtn"
          onClick={() => setFocusedCarpark(null)}
        >
          {"<"}
        </button>
        <h1>{focusedCarpark !== null ? "Carpark Details" : currentPageInfo.title }</h1>
      </header>
      <main id="main-page">
        <CurrentView  focused={focusedCarpark} setFocused={setFocusedCarpark}/>
      </main>
      <nav className="btn">
  
          {
            Object.keys(pages).map((page,index) => (
              <button
                key={page + index}
                onClick={() => switchPage(page)}
                className={currentPage === page ? "active" : ""}
              >
                {pages[page].title}
              </button>
            ))
          }
  
      </nav>
    </div>
  )
}
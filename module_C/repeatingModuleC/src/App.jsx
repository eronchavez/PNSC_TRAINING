import { useState } from 'react'
import Carparks from './Carparks'
export const API = "http://localhost/module_c_api.php"

const pages = {
  carparks: {title: "Carparks", view: Carparks},
  events: {title: "Events", view: () => <p>Loading events</p>},
  weather: {title: "Weather", view: () => <p>Loading weather</p>},
  planner: {title: "Planner", view: () => <p>Loading planner</p>},
  settings: {title: "Settings", view: () => <p>Loading settings</p>}
}



export default function App() {
  
  const [currentPage, setCurrentPage] = useState("carparks")
  const [focusedCarpark, setFocusedCarpark] = useState(null)

  const currentPageInfo  = pages[currentPage]
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
          id='backBtn'
          disabled={!focusedCarpark}
          onClick={() => setFocusedCarpark(null)}

        >
          {"<"}
        </button>
        <h1>{focusedCarpark ?  "Carpark Details" : currentPageInfo.title}</h1>
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

 

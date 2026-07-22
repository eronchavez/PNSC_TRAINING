import { useState } from 'react'

export const API = "http://localhost/module_c_api.php"
import Carparks from './Carparks'
import Events from './Events'
import Planner from './Planner'
import Weather from './Weather'
import Settings from './Settings'

const pages = {
  carparks: {title: "Carparks", view: Carparks},
  events: {title: "Events", view: Events},
  weather: {title: "Weather", view: Weather},
  planner: {title: "Planner", view: Planner},
  settings: {title: "Settings", view: Settings}
}

export default function App() {
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
    <div className="app">
      <header className="header">
        <button 
          id='backBtn' 
          disabled={!focusedCarpark}
          onClick={() => setFocusedCarpark(null)}
        >  
          {'<'} 
        </button>
        <h1>{focusedCarpark ? "Carpark details" :  currentPageInfo.title}</h1>
      </header>
      <main className="mainContent">
        <CurrentView focused={focusedCarpark} setFocused={setFocusedCarpark}/>
      </main>
      <nav className="navbar">
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


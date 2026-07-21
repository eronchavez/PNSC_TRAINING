
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import Carparks from "./pages/Carparks.jsx"
import Events from "./pages/Events.jsx"
import Weather from "./pages/Weather.jsx"
import Planner from "./pages/Planner.jsx"
import Settings from "./pages/Settings.jsx"
import CarparkDetail from "./pages/CarparkDetail.jsx"
import { createContext, useContext, useState, useEffect} from "react"

export const API_BASE = "http://localhost/module_c_api.php"
const  LYON_DEFAULT = {latitude: 45.764043, longitude: 4.835659 }

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
export function getDistanceFromLatLonInKm(latitude1, longitude1, latitude2, longitude2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(latitude2 - latitude1);
  var dLon = deg2rad(longitude2 - longitude1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

export const AppContext = createContext(null)
export function useAppContext()
{
  return useContext(AppContext)
}

function AppProvider({children})
{
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings")
    return saved ? JSON.parse(saved) : {
      theme: "system", carparkSorting: "alphabetical"
    }
  })
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings))
  },[settings])

  const [pinnedCarparks, setPinnedCarparks] = useState(() => {
    const saved = localStorage.getItem("pinnedCarparks")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("pinnedCarparks", JSON.stringify(pinnedCarparks))
  },[pinnedCarparks])


  function togglePin(name)
  {
    setPinnedCarparks((prev) => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const [userLocation, setUserLocation] = useState(null)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const lat = params.get('latitude')
    const lon = params.get('longitude')

    if(lat && lon)
    {
      setUserLocation({latitude: parseFloat(lat), longitude: parseFloat(lon)})
      return
    }
    if(navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation(
          {
            latitude: pos.coords.latitude, longitude: pos.coords.longitude
          }
        ),
        () => setUserLocation(LYON_DEFAULT)

      )
    } else 
    {
      setUserLocation(LYON_DEFAULT)
    }
  }, [])
  
    return (
    <AppContext.Provider value={{settings, setSettings, pinnedCarparks, togglePin, userLocation}}>
      {children}
    </AppContext.Provider>
  )
}





function App() {

  return (
    <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/carparks" element={<Carparks/>}/>
              <Route path="/carparks/:name" element={<CarparkDetail/>}/>
              <Route path="/events" element={<Events/>}/>
              <Route path="/weather" element={<Weather/>}/>
              <Route path="/planner" element={<Planner/>}/>
              <Route path="/settings" element={<Settings/>}/>
            </Route>
          </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App

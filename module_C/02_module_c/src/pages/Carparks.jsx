import { useState, useEffect } from "react"
import { API_BASE, useAppContext , getDistanceFromLatLonInKm} from "../App"
import { Link } from "react-router-dom"

function Carparks()
{
    const {settings, pinnedCarparks, togglePin, userLocation} = useAppContext()
    const [carparks, setCarparks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(API_BASE + "/carparks.json")
            .then((res) => res.json())
            .then((data) => {
                const list = Object.entries(data).map(([name,details]) => ({
                    name,
                    availableSpaces: details.availableSpaces,
                    latitude: details.latitude,
                    longitude: details.longitude,
                    location: details.location
                }))
                setCarparks(list)
                setLoading(false)
            })
    }, [])

    if(loading) return <p>Loading carparks...</p>

    const withPinFlag = carparks.map(carpark => ({
        ...carpark,
        isPinned: pinnedCarparks?.includes(carpark.name),
        distance: userLocation
    }))

    const sortFn = 
        settings.carparkSorting === "alphabetical"
            ? (a, b) => a.name.localeCompare(b.name)
            : () => 0

    const pinned = withPinFlag.filter(carpark => carpark.isPinned).sort(sortFn)
    const unpinned = withPinFlag.filter(carpark => !carpark.isPinned).sort(sortFn)
    const sorted = [...pinned, ...unpinned]

    return (
        <>
            {sorted.map(carpark => (
                    <Link 
                        to={`/carparks/${encodeURIComponent(carpark.name)}`} 
                        key={carpark.name} className="carpark-card-link"
                    >
                        <div className="carpark-card" key={carpark.name}>
                        <h2>{carpark.name}</h2>
                        <p>Available Spaces: {carpark.availableSpaces}</p>
                        <p>Location: {carpark.location}</p>
                        <button 
                            href="#"
                            className="pin-btn"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                togglePin(carpark.name)
                            }}
                        >
                            {carpark.isPinned ? "Unpin" : "Pin to top"}
                        </button>
                    </div>
                    </Link>
                )) 
            }
        </>
    )
}

export default Carparks
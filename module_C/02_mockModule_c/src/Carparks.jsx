import { useEffect, useState } from "react"
import { API } from "./App"


function getDistanceFromLatLonInKm(latitude1, longitude1, latitude2, longitude2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(latitude2-latitude1);  // deg2rad below
    var dLon = deg2rad(longitude2-longitude1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}


function deg2rad(deg) {
    return deg * (Math.PI/180)
}

export default function Carparks({focused, setFocused})
{
    const [carparkList, setCarparkList] = useState([])
    const [loading, setLoading] = useState(true)

    const [pinnedCarparkIds, setPinnedCarparkIds] = useState(
        () => JSON.parse(localStorage.getItem("pinnedCarparkIds") || "[]")
    )

    const [userLocation, setUserLocation] = useState(null)

  
    useEffect(() => {
        const url = new URLSearchParams(window.location.search)
        console.log(window.location.search)
        const latitude = url.get("latitude")
        const longitude = url.get("longitude")

        if(latitude && longitude)
        {
            setUserLocation({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            })
        }else if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            })
        }

        setLoading(true)
        fetch(`${API}/carparks.json`)
            .then((response) => response.json())
            .then((data) => {
                const carparks = Object.entries(data).map(([name,details]) => ({
                    id: name,
                    name,
                    ...details
                }))
                setCarparkList(carparks)
            }).finally(() => setLoading(false))

    }, [])

    
    
    function togglePin(carparkId)
    {
        const isPinned = pinnedCarparkIds.includes(carparkId)
        const updated = isPinned 
            ? pinnedCarparkIds.filter((id) => id !== carparkId)
            : [...pinnedCarparkIds, carparkId]

        setPinnedCarparkIds(updated)
        localStorage.setItem("pinnedCarparkIds", JSON.stringify(updated))
    }

    const carparkWithDistance = [...carparkList].map((carpark) => ({
        ...carpark,
        distance: userLocation ? 
            getDistanceFromLatLonInKm(
                userLocation.latitude, userLocation.longitude,
                carpark.latitude, carpark.longitude
            )
            : null
    }))

    const sortMethod = localStorage.getItem("sortMethod")

    const sortedCarparks = [...carparkWithDistance].sort((a,b) => (
        pinnedCarparkIds.includes(b.id) - pinnedCarparkIds.includes(a.id) || 
        (
            sortMethod === "distance" && a.distance !== null && b.distance !== null 
                ? a.distance - b.distance 
                : 0
        ) || 
        a.name.localeCompare(b.name)
    ))

    if(focused)
    {
        return (
            <li >
                <h3>{focused.name}</h3>
                <p>{focused.availableSpaces} available spaces</p>
                <p>Location: {focused.location}</p>
        
                {
                    focused.distance !== null && 
                    <p>{focused.distance.toFixed(1)} km away</p>
                }
            </li>
        )
    }

    if(loading) return <p>Loading Carparks...</p>

    return (
        <ul className="list">
            {
                sortedCarparks.map((carpark) => (
                    <li 
                        key={carpark.id}
                        onClick={() => setFocused(carpark)}
                    >
                        <h3>{carpark.name}</h3>
                        <p>{carpark.availableSpaces} available spaces</p>
                        <p>Location: {carpark.location}</p>
                        {
                            carpark.distance !== null && 
                            <p>{carpark.distance.toFixed(1)} km away</p>
                        }
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                togglePin(carpark.id)
                            }}
                        >
                            {pinnedCarparkIds.includes(carpark.id) ? "Unpin" : "Pin"}
                        </button>
                    </li>
                ))
            }
        </ul>
    )
}
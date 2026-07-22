import { useEffect, useState } from "react"
import { API } from "./App"

function getDistanceFromLatLonInKm(latitude1, longitude1, latitude2, longitude2) {
    var R = 6371; 
    var dLat = deg2rad(latitude2-latitude1);  
    var dLon = deg2rad(longitude2-longitude1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

export default function Carparks({ focused, setFocused }) {
    
    const [carparkList, setCarparkList] = useState([])
    const [loading, setLoading] = useState(true)
    const [userLocation, setUserLocation] = useState(null)

    const [pinnedCarparkIds, setPinnedCarparkIds] = useState(
        () => JSON.parse(localStorage.getItem("pinnedCarparkIds") || "[]")
    )

    // 1. Get user location (from URL query parameters or Chrome Geolocation API)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const latitude = urlParams.get("latitude")
        const longitude = urlParams.get("longitude")

        if (latitude && longitude) {
            setUserLocation({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) })
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            })
        }
    }, [])

    // 2. Fetch carparks list from API
    useEffect(() => {
        fetch(`${API}/carparks.json`)
            .then((response) => response.json())
            .then((data) => {
                const list = Object.entries(data).map(([name, details]) => ({
                    id: name,
                    name,
                    ...details,
                }))
                setCarparkList(list)
                setLoading(false)
            })
    }, [])

    // 3. Compute distance for each carpark if user location is available
    const carparksWithDistance = carparkList.map((carpark) => {
        const distance = userLocation
            ? getDistanceFromLatLonInKm(
                  userLocation.latitude,
                  userLocation.longitude,
                  carpark.latitude,
                  carpark.longitude
              )
            : null
        return { ...carpark, distance }
    })

    // 4. Sort carparks (Pinned items top, then distance or alphabetical)
    const sortMethod = localStorage.getItem("sortMethod") || "alphabetical"

    const sortedCarparks = [...carparksWithDistance].sort((carparkA, carparkB) => {
        const aPinned = pinnedCarparkIds.includes(carparkA.id)
        const bPinned = pinnedCarparkIds.includes(carparkB.id)

        if (aPinned !== bPinned) return aPinned ? -1 : 1
        if (sortMethod === "distance" && carparkA.distance != null && carparkB.distance != null) {
            return carparkA.distance - carparkB.distance
        }
        return carparkA.name.localeCompare(carparkB.name)
    })

    // Pin / Unpin handler
    function togglePin(carparkId) {
        const isPinned = pinnedCarparkIds.includes(carparkId)
        const updatedPinnedIds = isPinned
            ? pinnedCarparkIds.filter((id) => id !== carparkId)
            : [...pinnedCarparkIds, carparkId]

        setPinnedCarparkIds(updatedPinnedIds)
        localStorage.setItem("pinnedCarparkIds", JSON.stringify(updatedPinnedIds))
    }

    if (loading) return <p>Loading carparks...</p>

    // Render single focused carpark detail view
    if (focused) {
        const focusedCarpark = carparksWithDistance.find((item) => item.id === focused.id) || focused
        return (
            <ul className="list">
                <li>
                    <h3>{focusedCarpark.name}</h3>
                    {focusedCarpark.distance != null && (
                        <p>{focusedCarpark.distance.toFixed(1)} km away</p>
                    )}
                    <p>{focusedCarpark.availableSpaces} spaces available</p>
                </li>
            </ul>
        )
    }

    // Render list of all carparks
    return (
        <ul className="list">
            {sortedCarparks.map((carpark) => (
                <li
                    key={carpark.id}
                    onClick={() => setFocused(carpark)}
                    style={{ cursor: "pointer" }}
                >
                    <h3>{carpark.name}</h3>
                    <p>Available Spaces: {carpark.availableSpaces}</p>
                    <p>Location: {carpark.location}</p>
                    <p>Latitude: {carpark.latitude}</p>
                    <p>Longitude: {carpark.longitude}</p>
                    <button
                        onClick={(event) => {
                            event.stopPropagation()
                            togglePin(carpark.id)
                        }}
                    >
                        {pinnedCarparkIds.includes(carpark.id) ? "Unpin" : "Pin"}
                    </button>
                </li>
            ))}
        </ul>
    )
}
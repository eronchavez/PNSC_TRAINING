
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
    const [carparkList,setCarparkList] = useState([])
    const [loading, setLoading] = useState(true)

    const [pinnedCarparkIds, setPinnedCarparkIds] = useState(
        () => JSON.parse(localStorage.getItem("pinnedCarparkIds")) || []
    )


    useEffect(() => {

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
        localStorage.setItem('pinnedCarparkIds', JSON.stringify(updated))
    }

    const sortedCarparks = [...carparkList].sort((a,b) => (
        pinnedCarparkIds.includes(b.id) - pinnedCarparkIds.includes(a.id) ||
        a.name.localeCompare(b.name) 
    ))


    if(focused)
    {
        return (
            <ul className="list">
                <li>
                    <h2>{focused.name}</h2>
                    <p>{focused.availableSpaces} spaces available</p>
                </li>
            </ul>
        )
    }

    return (
        <ul className="list">
            {
                sortedCarparks.map((carpark) => (
                    <li
                        key={carpark.id}
                        onClick={() => setFocused(carpark)}
                    >
                        <h2>{carpark.name}</h2>
                        <p>{carpark.availableSpaces} spaces available</p>
                        <p>Location: {carpark.location}</p>
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
import { useState, useEffect, captureOwnerStack } from "react"
import { API } from "./App"


export default function Carparks({focused, setFocused})
{
    const [carparkList, setCarparkList] = useState([])
    const [loading, setLoading] = useState(true)

    const [pinnedCarparkIds, setPinnedCarparkIds] = useState(
        () => JSON.parse(localStorage.getItem("pinnedCarparkIds") || "[]")
    )
   

    useEffect(() => {
        fetch(`${API}/carparks.json`)
            .then((response) => response.json())
            .then((data) => {
                const list = Object.entries(data).map(([name,details]) => ({
                    id:name,
                    name,
                    ...details
                }))
                setCarparkList(list)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    function togglePin(carparkId)
    {
        const isPinned = pinnedCarparkIds.includes(carparkId)
        const updated = isPinned 
            ? pinnedCarparkIds.filter(id => id !== carparkId) // Unpin
            : [...pinnedCarparkIds, carparkId]
        setPinnedCarparkIds(updated)
        localStorage.setItem("pinnedCarparkIds", JSON.stringify(updated))
    }

    const sortedCarparks = [...carparkList].sort((a,b) => 
        (pinnedCarparkIds.includes(b.id) - pinnedCarparkIds.includes(a.id)) || 
        a.name.localeCompare(b.name)
    )
   

    if(focused)
    {
        return (
            <ul className="list">
               <li>
                    <h3>{focused.name}</h3>
                    <p>{focused.availableSpaces} available spaces</p>
               </li>
            </ul>
        )
    }
    
    return(
        <ul className="list">
            {sortedCarparks.map(carpark => (
                <li 
                    key={carpark.id}
                    onClick={() => setFocused(carpark)}
                >
                    <h3>{carpark.name}</h3>
                    <p>Available Spaces: {carpark.availableSpaces}</p>
                    <p>Location: {carpark.location}</p>
                   <button
                        onClick={(e) => {
                                e.stopPropagation()
                                togglePin(carpark.id)
                            }
                        }
                   >
                    {pinnedCarparkIds.includes(carpark.id) ? "Unpin" : "Pin"}
                   </button>
                </li>
            ))}
        </ul>
    )
}
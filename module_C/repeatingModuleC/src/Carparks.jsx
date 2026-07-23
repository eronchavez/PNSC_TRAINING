import { useEffect, useState } from "react"
import {API} from "./App"



export default function Carparks({focused, setFocused})
{
    const [carparkList, setCarparkList] = useState([])
    const [loading, setLoading] = useState(true)


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
            })
            .finally(() => setLoading(false))
    }, [])

    if(loading) return <p>Loading Carparks...</p>

    if(focused)
    {
        return (
            <ul className="list">
                <h3>{focused.name}</h3>
                <p>{focused.availableSpaces} spaces available</p>
            </ul>
        )
    }

    return (
        <ul className="list">
            {carparkList.map((carpark) => (
                <li
                    key={carpark.id}
                    onClick={() => setFocused(carpark)}
                >
                    <h3>{carpark.name}</h3>
                    <p>Available Spaces: {carpark.availableSpaces}</p>
                    <p>Location: {carpark.location}</p>
                </li>
            ))}
        </ul>
    )
}

 
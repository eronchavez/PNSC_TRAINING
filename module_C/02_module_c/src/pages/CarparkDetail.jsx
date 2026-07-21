import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import { API_BASE, useAppContext, getDistanceFromLatLonInKm } from "../App"


export default function CarparkDetail()
{
    const {name} = useParams()
    const {userLocation} = useAppContext()
    const [carpark, setCarpark] = useState(null)

    useEffect(() => {
        fetch(API_BASE + "/carparks.json")
            .then(res => res.json())
            .then(data => {
                const details = data[name]
                if(!details) return 
                setCarpark({
                    name,
                    availableSpaces: details.availableSpaces,
                     distance: userLocation
                        ? getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, details.latitude, details.longitude)
                        : 0,

                })
            })
    },[name, userLocation])

    if (!carpark) return <p>Loading ...</p>
    
    return(
        <div className="carpark-card focused">
            <h2>{carpark.name}</h2>
            <p>Available Spaces: {carpark.availableSpaces}</p>
            <p>Distance: {carpark.distance.toFixed(2)} km</p>
        </div>
    )
}
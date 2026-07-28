import { useEffect,useState } from "react"
import { API } from "./App"
import WeatherIcon from "./WeatherIcon"




export default function Weathers()
{
    const [weathers, setWeathers] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {

        fetch(`${API}/weather.json`)
            .then((response) => response.json())
            .then((data) => setWeathers(data))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div id="weatherContainer">
            {
                weathers.map((weather) => (
                    <div className="weather-card" key={weather.date}>
                        <p>{weather.date}</p>
                        <WeatherIcon status={weather.status}/>
                        <p>{weather.lower_temperature} - {weather.upper_temperature} °C</p>
                        <p>{weather.status}</p>
                    </div>
                ))
            }
        </div>
    )
}
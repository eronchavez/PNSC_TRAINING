import { useEffect, useState } from "react";
import { API } from "./App";
import WeatherIcon from "./WeatherIcon";

export function Weather()
{
    const [weathers, setWeather] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        fetch(`${API}/weather.json`)
            .then((response) => response.json())
            .then((data) => setWeather(data))
            .finally(() => setLoading(false))

    }, [])

    if(loading) return <p>Loading Weather</p>
    return (
        <div id="weatherContainer">
            {
                weathers.map((weather) => (
                    <div 
                        className="weatherCard"
                        key={weather.date}
                    >
                        <p>{weather.date}</p>
                        <WeatherIcon status={weather.status}/>
                        <p>{weather.lower_temperature} - {weather.upper_temperature}°C</p>
                        <p>{weather.status}</p>
                    </div>
                ))
            }
        </div>
    )
}
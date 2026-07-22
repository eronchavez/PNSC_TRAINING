import { API } from "./App";
import { useState, useEffect } from "react";
import WeatherIcon from "./WeatherIcon";



export default function Weather() {
    const [weathers, setWeathers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetch(`${API}/weather.json`)
            .then((response) => response.json())
            .then((data) => {
                setWeathers(data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading Weather...</p>;

    return (
        <div id="weatherContainer">
            {weathers.length > 0 ? (
                weathers.map((weather) => {
                    

                    return (
                        <div
                            key={`${weather.location}-${weather.date}`}
                            className="weather-card"
                        >
                            <p>{weather.date}</p>

                          <WeatherIcon status={weather.status}/>

                            <p>
                                {weather.lower_temperature} -{" "}
                                {weather.upper_temperature}°C
                            </p>

                            <p>{weather.status}</p>
                        </div>
                    );
                })
            ) : (
                <p>No Weathers</p>
            )}
        </div>
    );
}
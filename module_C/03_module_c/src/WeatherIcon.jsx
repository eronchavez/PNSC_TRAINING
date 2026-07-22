import { useEffect, useState } from "react"

export default function WeatherIcon({status})
{
    const [svg, setSvg] = useState("")

    useEffect(() => {
        if (status) {
            fetch(`/images/${status.toLowerCase()}.svg`)
                .then((response) => response.text())
                .then(setSvg)
        }
    }, [status])

    return (
        <div 
            className="weather-icon"
            dangerouslySetInnerHTML={{__html: svg}}
        >

        </div>
    )
}

import { useState } from "react"

export default function Settings()
{
    const [sortMethod, setSortMethod] = useState(
        () => localStorage.getItem("sortMethod") || "alphabetical"
    )

    function handleChange(event)
    {
        const value = event.target.value 
        setSortMethod(value)
        localStorage.setItem("sortMethod", value)
    }
    return (
         <div>
            <h2>Sort carparks by</h2>
            <label>
                <input
                    type="radio"
                    name="sortMethod"
                    value="alphabetical"
                    checked={sortMethod === "alphabetical"}
                    onChange={handleChange}
                />
                Alphabetical
            </label>
            <label>
                <input
                    type="radio"
                    name="sortMethod"
                    value="distance"
                    checked={sortMethod === "distance"}
                    onChange={handleChange}
                />
                Distance
            </label>
        </div>
    )
}
import { useState } from "react"



export default function Settings()
{
    const [sortMethod, setSortMethod] = useState(
        () => localStorage.getItem("sortMethod") || "alphabetical"
    )

    function handleChange(e)
    {
        const value = e.target.value
        setSortMethod(value)
        localStorage.setItem("sortMethod", value)
    }

    return (
        <div>
            <h3>Carparks Sort By</h3>
            <div>
                <label>
                    Alphabetical 
                    <input 
                        type="radio"
                        name="sortMethod"
                        value="alphabetical"
                        onChange={handleChange}
                        checked={sortMethod === "alphabetical"}
                    />
                </label>
            </div>
            <div>
                <label>
                    Distance 
                    <input 
                        type="radio"
                        name="sortMethod"
                        value="distance"
                        onChange={handleChange}
                        checked={sortMethod === "distance"}
                    />
                </label>
            </div>
        </div>
    )
}
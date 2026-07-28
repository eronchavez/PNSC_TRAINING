import { useState } from "react"


export default function Settings()
{
    const [sortMethod, setSortMethod] = useState(
        () => localStorage.getItem("sortMethod") || "alphabetical"
    )

    function handleMethod(e)
    {   
        const value = e.target.value
        setSortMethod(value)
        localStorage.setItem("sortMethod", value)
    }

    return (
        <div>
            <h1>Carparks Sort By</h1>
            <div>
                <label>
                    Alphabetical 
                    <input 
                        type="radio" 
                        name="sortMethod"
                        value="alphabetical"
                        onChange={handleMethod}
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
                        onChange={handleMethod}
                        checked={sortMethod === "distance"}
                    />
                </label>
            </div>
        </div>
    )
}
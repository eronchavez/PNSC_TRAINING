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
            <h2>Sort Carparks By: </h2>
            <div>
                <label>
                    Alphabetical 
                    <input
                        type="radio"
                        value="alphabetical"
                        name="sortMethod"
                        onChange={handleMethod}
                        checked={sortMethod === "alphabetical"}
                    >
                    </input>
                </label>
            </div>
            <div>
                <label>
                    Distance 
                    <input
                        type="radio"
                        value="distance"
                        name="sortMethod"
                        onChange={handleMethod}
                        checked={sortMethod === "distance"}
                    >
                    </input>
                </label>
            </div>
        </div>
    )

}
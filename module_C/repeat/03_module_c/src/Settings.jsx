import { useState } from "react";

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
            <h2>Sort Method By: </h2>
            <div>
                <label>
                    Alphabetical 
                    <input 
                        type="radio"
                        name="sortMethod"
                        value="alphabetical"
                        checked={sortMethod === "alphabetical"}
                        onChange={handleMethod}
                        
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
                        checked={sortMethod === "distance"}
                        onChange={handleMethod}
                        
                    />
                </label>
            </div>
        </div>
    )
}
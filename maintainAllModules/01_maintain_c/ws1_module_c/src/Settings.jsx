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
            <h2>Sort Carparks By</h2>
            <div>
                <label>
                    Alphabetical 
                    <input  
                        type="radio"
                        onChange={(e) => handleMethod(e)}
                        value="alphabetical"
                        checked={sortMethod === "alphabetical"}
                    />
                </label>
            </div>
            <div>
                <label>
                    Distance 
                    <input  
                        type="radio"
                        onChange={(e) => handleMethod(e)}
                        value="distance"
                        checked={sortMethod === "distance"}
                    />
                </label>
            </div>
        </div>
    )
    
}
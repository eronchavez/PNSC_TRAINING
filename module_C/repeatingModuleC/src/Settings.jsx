import { useState } from "react"

export default function Settings()
{
    const [sortMethod, setSortMethod] = useState(
        () => localStorage.getItem("sortMethod") || "alphabetical"
    )

    function changeMethod(e)
    {
        const value = e.target.value 
        setSortMethod(value)
        localStorage.setItem("sortMethod", value)
    }

    return (
        <div>
            <h2>Sort Carparks By</h2>
            <label>
                <input 
                    type="radio" 
                    name="sortMethod"
                    checked={sortMethod === "alphabetical"}
                    value="alphabetical"  
                    onChange={changeMethod}  
                />
                Alphabetical
            </label>
            <label>
                <input 
                    type="radio" 
                    name="sortMethod"
                    checked={sortMethod === "distance"}
                    value="distance"  
                    onChange={changeMethod}    
                />
                Distance
            </label>
        </div>
    )
}
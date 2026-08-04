import { useState } from "react";


export default function Settings()
{
    const [sortMethod, setSortMethod] = useState(
        () => localStorage.getItem("sortMethod")
    )


    function handleMethod(e)
    {
        const value = e.target.value 
        setSortMethod(value)
        localStorage.setItem("sortMethod", value)
    }

    return (
        <div>
            <h1>Sort Carparks By </h1>
            <label>
                <input 
                    type="radio" 
                    name="sortMethod"
                    value="alphabetical"
                    checked={sortMethod === "alphabetical"}    
                    onChange={handleMethod}
                />
                Alphabetical
            </label>
            <label>
                <input 
                    type="radio" 
                    name="sortMethod"
                    value="distance"
                    checked={sortMethod === "distance"}    
                    onChange={handleMethod}
                />
                Distance
            </label>
        </div>
    )
}
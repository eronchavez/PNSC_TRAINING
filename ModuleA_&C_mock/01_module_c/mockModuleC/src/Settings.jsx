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
            <h1>Sort Carparks by </h1>
            <div>
                <label>
                    Alphabetical 
                    <input
                        type="radio"
                        name="sortMethod"
                        value="alphabetical"
                        onChange={(e) => changeMethod(e)}
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
                        name="sortMethod"
                        value="distance"
                        onChange={(e) => changeMethod(e)}
                        checked={sortMethod === "distance"}
                    >
                    </input>
                </label>
            </div>

            <h2>Select Theme</h2>
            <div>
                <label>
                    Light 
                    <input
                        type="radio"
                        name="theme"
                        value="light"
                    >
                    
                    </input>
                </label>
                <label>
                    dark 
                    <input
                        type="radio"
                        name="theme"
                        value="dark"
                    >
                    
                    </input>
                </label>
                <label>
                    system 
                    <input
                        type="radio"
                        name="theme"
                        value="system"
                    >
                    
                    </input>
                </label>
            </div>
        </div>
    )
}
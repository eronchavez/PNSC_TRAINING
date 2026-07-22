import { useState } from "react"

export default function Settings({themePreference, setThemePreference})
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

    function handleThemeChange(event)
    {
        setThemePreference(event.target.value)
    }
    return (
         <div>
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
            </div> <br /> 

                        <div>
                <h2>Theme Settings</h2>
                <label> 
                    <input 
                        type="radio"
                        name="theme"
                        value="light"
                        checked={themePreference === "light"}
                        onChange={handleThemeChange}
                    />
                    Light
                </label>
                <label> 
                    <input 
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={themePreference === "dark"}
                        onChange={handleThemeChange}
                    />
                    Dark
                </label>
                <label> 
                    <input 
                        type="radio"
                        name="theme"
                        value="system"
                        checked={themePreference === "system"}
                        onChange={handleThemeChange}
                    />
                    System
                </label>
            </div>
        </div>
    )
}
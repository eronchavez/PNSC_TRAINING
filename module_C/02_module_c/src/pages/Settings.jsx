import { useAppContext } from "../App"


function Settings()
{

    const {settings, setSettings} = useAppContext()


    return(
        <section className="settings">
            <h3>Carpark Sorting</h3>
            <div>
                <div>
                    <input 
                        type="radio" 
                        name="carparkSorting"
                        value="alphabetical"
                        checked={settings.carparkSorting === "alphabetical"}   
                        onChange={(e) => setSettings({...settings, carparkSorting: e.target.value})} 
                    />
                    Alphabetical
                </div>
                <div>
                    <input 
                        type="radio" 
                        name="carparkSorting"
                        value="distance"
                        checked={settings.carparkSorting === "distance"}   
                        onChange={(e) => setSettings({...settings, carparkSorting: e.target.value})} 
                    />
                    Distance
                </div>
            </div>
        </section>
    )
}

export default Settings
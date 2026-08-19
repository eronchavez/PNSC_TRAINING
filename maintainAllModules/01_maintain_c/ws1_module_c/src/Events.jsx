import { useEffect, useState } from "react";
import { API } from "./App";


export default function Events()
{
    const [eventList, setEventList] = useState([])
    const [loading, setLoading] = useState(true)
    const [beginningDate, setBeginningDate] = useState("")
    const [endingDate, setEndingDate] = useState("")

    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)

    useEffect(() => {

        const params = new URLSearchParams()
        params.set("page", page)
        if(beginningDate) params.set("beginning_date", beginningDate)
        if(endingDate) params.set("ending_date", endingDate)

        setLoading(true)

        fetch(`${API}/events.json?${params.toString()}`)
            .then((response) => response.json())
            .then((data) => {
                const events = data.events || []
                const filteredEvents = events.filter((event) => {
                    const start = !beginningDate || event.date >= beginningDate
                    const end = !endingDate || event.date <= endingDate 
                    return start && end 
                })
                setHasMore(events.length > 0)
                page === 1 ? setEventList(filteredEvents) : setEventList((prev) => [...prev, ...filteredEvents])
            }).finally(() => setLoading(false))


    }, [beginningDate, endingDate, page, ])

    useEffect(() => {

        const observer = new IntersectionObserver(
            ([entry]) => {
                if(entry.isIntersecting && !loading && hasMore)
                {
                    setPage((page) => page + 1)
                }
            },{
                rootMargin: "100px"
            }
        )

        const trigger = document.getElementById("trigger")
        if(trigger) observer.observe(trigger)
        return () => observer.disconnect()
 
    }, [loading, hasMore, page])

    const handleDateChange = (setter) => (e) => {
        setter(e.target.value)
        setHasMore(true)
        setPage(1)
    }

    if(loading) return <p>Loading Events...</p>

    return (
        <div>
            <div>
                <label>
                    beginning_date 
                    <input 
                        type="date" 
                        name="beginning_date"
                        value={beginningDate}
                        onChange={handleDateChange(setBeginningDate)} 
                      
                    />
                </label>
            </div>
            <div>
                <label>
                    ending_date 
                    <input 
                        type="date" 
                        name="ending_date"
                        value={endingDate}
                        onChange={handleDateChange(setEndingDate)} 
                      
                    />
                </label>
            </div>

            {
                eventList.length === 0 && <p>No Events Found</p>
            }

            <ul className="event-list list">
                {
                    eventList.map((event, index) => (
                        <li
                            key={`${event.date}-${index}`}
                        >
                            <h2>{event.title}</h2>
                            <img src={`http://ws1.worldskills.test${event.image}`} alt={event.name} loading="lazy"/>
                            <p>{event.date}</p>
                        </li>
                    ))
                }
                
            </ul>

                <div id="trigger" style={{height: "1px"}}></div>
        </div>
    )
    
}
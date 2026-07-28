import { useEffect, useState } from "react"
import { API } from "./App"

export default function Events()
{
    const [eventList, setEventList] = useState([])
    const [loading, setLoading] = useState(true)
    const [beginningDate, setBeginningDate] = useState("")
    const [endingDate, setEndingDate] = useState("")
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)

    
    useEffect(() => {
        const params = new URLSearchParams
        params.set("page", page)
        if(beginningDate) params.set("beginning_date", beginningDate)
        if(endingDate) params.set("ending_date", endingDate)
        
        setLoading(true)
        fetch(`${API}/events.json?${params.toString()}`)
            .then((response) => response.json())
            .then((data) => {
                const events = data.events || []
                setHasMore(events.length > 0)
                if(page === 1) 
                {
                    setEventList(events)
                }else{
                    setEventList((prev) => [...prev, ...events])
                }
            }).finally(() => setLoading(false))

    }, [page,beginningDate,endingDate])

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

        const trigger = document.getElementById("scroll-trigger")
        if(trigger) observer.observe(trigger)

        return () => observer.disconnect()

    }, [page,loading])

   

    const handleDateChange = (setter) => (e) => {
        setter(e.target.value)
        setHasMore(true)
        setPage(1)
    }

     if(loading) return <p>Loading Events...</p>
     if(eventList.length === 0) return <p>No Events Found</p>

     return (
        <div>
            <div>
                <label>
                    Start Date 
                    <input 
                        type="date"
                        name="beginningDate"
                        value={beginningDate}
                        onChange={handleDateChange(setBeginningDate)}
                    />
                </label>
            </div>
            <div>
                <label>
                    End Date 
                    <input 
                        type="date"
                        name="endingDate"
                        value={endingDate}
                        onChange={handleDateChange(setEndingDate)}
                    />
                </label>
            </div>
            
            <ul className="event-list">
                {
                    eventList.map((event,index) => (
                        <li
                            key={`${event.title}-${event.date}-${index}`}
                        >
                            <img src={`http://localhost${event.image}`} alt={event.title} loading="lazy"/>
                            <p>{event.title}</p>
                            <p>{event.date}</p>
                        </li>
                    ))
                }
            </ul>
            
            <div id="scroll-trigger" style={{height: "1px"}}></div>
        </div>
     )


}
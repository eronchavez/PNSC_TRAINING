import { useState, useEffect } from "react"
import { API } from "./App"



export default function Events()
{
    const [eventList, setEventlist] = useState([])
    const [loading, setLoading] = useState(true)
    const[beginningDate, setBeginningDate] = useState("")
    const [endingDate, setEndingDate] = useState("")
    const [hasMore,setHasMore] = useState(true)
    const [page,setPage] = useState(1)
    /**
     * Fetch of events and for query
     */
    useEffect(() => {

        const params = new URLSearchParams()
        params.set("page", page)
        if(beginningDate) params.set("beginning_date", beginningDate)
        if(endingDate) params.set("ending_date", endingDate)

        setLoading(true)
        fetch(`${API}/events.json?${params.toString()}`)
            .then((response) => response.json())
            .then((data) => {
                let events = data.events || []
                setHasMore(events.length > 0)

                events = events.filter((event) => {
                    const afterStart = !beginningDate || event.date >= beginningDate
                    const beforeEnd = !endingDate || event.date <= endingDate
                    return afterStart && beforeEnd
                })

                
            page === 1 ? setEventlist(events) : setEventlist((prev) => [...prev, ...events])
            }).finally(() => setLoading(false))


    }, [page,beginningDate,endingDate])

    /**
     * Observe for inifite scrolling 
     */
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

    }, [page,loading,hasMore])


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
                    Start Date 
                    <input
                        type="date"
                        name="beginning_date"
                        value={beginningDate}
                        onChange={handleDateChange(setBeginningDate)}
                    > 
                    </input>
                </label>
            </div>
            <div>
                <label>
                    End Date 
                    <input
                        type="date"
                        name="ending_date"
                        value={endingDate}
                        onChange={handleDateChange(setEndingDate)}
                    > 
                    </input>
                </label>
            </div>

            {eventList.length === 0 && <p>No events Found</p>}
            <ul className="event-list">
                {
                    eventList.map((event,index) => (
                        <li
                            key={`${event.title}-${event.date}-${index}`}
                        >
                            <img src={`http://localhost${event.image}`} alt={event.title} loading="lazy"/>
                            <h2>{event.title}</h2>
                            <p>{event.date}</p>
                        </li>
                    ))
                }
            </ul>
            <div id="trigger" style={{height: "1px"}}></div>
        </div>
    )
}
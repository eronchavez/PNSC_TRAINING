import { useEffect, useState } from "react"
import { API } from "./App"

export default function Events()
{
    const [eventList, setEventList] = useState([])
    const [loading, setLoading] = useState(false)
    const [beginningDate, setBeginningDate] = useState("")
    const [endingDate, setEndingDate] = useState("")
    const [hasMore, setHasMore] = useState(true)
    const [page,setPage] = useState(1)

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
                setHasMore(events.length > 0)
                if(page === 1)
                {
                    setEventList(events)
                }else{
                    setEventList((prev) => [...prev, ...events])
                }
            }).finally(() => setLoading(false))

    }, [page, beginningDate, endingDate])

    useEffect(() => {

        const observer = new IntersectionObserver(
            ([entry]) => {
                if(entry.isIntersecting && !loading && hasMore)
                {
                    setPage((page) => page + 1)
                }
            }, {
                rootMargin: "100px"
            }
        )

        const trigger = document.getElementById("scroll-trigger")
        if(trigger) observer.observe(trigger)
        
        return () => observer.disconnect()

    }, [page,loading,hasMore])


    const handleDateChange = (setter) => (e) => {
        setter(e.target.value)
        setPage(1)
        setHasMore(true)
    }

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

            <ul className="event-list">
                {
                    eventList.map((event, index) => (
                        <li
                            key={`${event.title}-${event.date}-${index}`}
                        >
                            <img src={`http://ws1.worldskills.test${event.image}`} alt={event.title} loading="lazy"/>
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
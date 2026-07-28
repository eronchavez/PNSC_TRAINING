import { useState, useEffect } from "react"
import { API } from "./App"


export default function Events()
{
  const [eventList, setEventList] = useState([])
  const [loading, setLoading] = useState(true)

  const [beginningDate, setBeginningDate] = useState("")
  const [endingDate, setEndingDate] = useState("")

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    params.set("page", page)
    if(beginningDate) params.set("beginning_date", beginningDate)
    if(endingDate) params.set("ending_date", endingDate)
    
    console.log(`${API}/events.json?${params}`)
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


  }, [page, endingDate, beginningDate])

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting && !loading && hasMore)
        {
          setPage((page) => page + 1 )
        }
      }, {
        rootMargin: "100px"
      }
    )

    const trigger = document.getElementById("scroll-trigger")
    if(trigger) observer.observe(trigger)

    return () => observer.disconnect() 


  }, [loading,hasMore])

  const handleDateChange = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
    setHasMore(true)
  }

  return (
    <div className="filters">
      <div>
        <label>
          Start Date 
          <input 
            type="date" 
            name="beginningDate"
            onChange={handleDateChange(setBeginningDate)}
            value={beginningDate}
          />
        </label>
      </div>
      <div>
        <label>
          end Date 
          <input 
            type="date" 
            name="endingDate"
            onChange={handleDateChange(setEndingDate)}
            value={endingDate}
          />
        </label>
      </div>

      <ul className="list">
        {
          eventList.map((event, index) => (
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
// src/Events.jsx — full file, final version

import { useEffect, useState } from "react"
import { API } from "./App"

export default function Events() {

  const [eventList, setEventList] = useState([])
  const [loading, setLoading] = useState(false)


  const [beginningDate, setBeginningDate] = useState("")
  const [endingDate, setEndingDate] = useState("")

  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const params = new URLSearchParams()
    if(beginningDate) params.set("beginning_date", beginningDate)
    if(endingDate) params.set("beggining_date", endingDate)
    
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
  }, [page,beginningDate, endingDate])


  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting && !loading && hasMore)
        {
          setPage((page) => page + 1)
        }
      },
      {
        rootMargin: "100px"
      }
    )

    const trigger = document.getElementById("scroll-trigger")
    if(trigger) observer.observe(trigger)
    return () => observer.disconnect()

  }, [loading, hasMore])


  const handleDateChange = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
    setHasMore(true)
  }

  return (
    <div className="filters">
      <div>
        <label htmlFor="start-date">Start Date</label>
        <input
          type="date"
          id="start-date"
          value={beginningDate}
          onChange={handleDateChange(setBeginningDate)}
        />
      </div>

      <div>
        <label htmlFor="end-date">End Date</label>
        <input
          type="date"
          id="end-date"
          value={endingDate}
          onChange={handleDateChange(setEndingDate)}
        />
      </div>

      <ul className="list">
        {eventList.map((event, index) => (
          <li key={`${event.title}-${event.date}-${index}`}>
            <img
              src={`http://localhost${event.image}`}
              alt={event.title}
              loading="lazy"
            />
            <p>{event.title}</p>
            <p>{event.date}</p>
          </li>
        ))}
      </ul>

      {loading && <p>Loading Events...</p>}

      {!loading && eventList.length === 0 && (
        <p>No events found.</p>
      )}

      <div id="scroll-trigger" style={{ height: "1px" }} />
    </div>
  )
}
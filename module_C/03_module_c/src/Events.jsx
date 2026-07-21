import { useEffect, useState } from "react"
import { API } from "./App"

export default function Events() {
    const searchParams = new URLSearchParams(window.location.search)
    const [eventList, setEventList] = useState([])
    const [nextPageUrl, setNextPageUrl] = useState(null)
    const [loading, setLoading] = useState(false)

    const [beginningDate, setBeginningDate] = useState(searchParams.get("beginning_date") || "")

    const [endingDate, setEndingDate] = useState(searchParams.get("ending_date") || "")

    // Helper function that handles fetching for both initial filters and infinite scroll
    function fetchEvents(requestUrl, isNextPage = false) {
        if (loading) return
        setLoading(true)

        fetch(requestUrl)
            .then((response) => response.json())
            .then((data) => {
                const fetchedEvents = data.events || []
                
                // Replace list if filtering, or append list if loading next page
                setEventList((previousEvents) =>
                    isNextPage ? [...previousEvents, ...fetchedEvents] : fetchedEvents
                )
                setNextPageUrl(data.pages?.next || null)
            })
            .finally(() => setLoading(false))
    }

    // 1. Fetch initial events or update when dates change
    useEffect(() => {
        const queryParams = new URLSearchParams()
        if (beginningDate) queryParams.set("beginning_date", beginningDate)
        if (endingDate) queryParams.set("ending_date", endingDate)

        const initialUrl = `${API}/events.json${queryParams.toString() ? "?" + queryParams : ""}`
        fetchEvents(initialUrl, false)
    }, [beginningDate, endingDate])

    // 2. Add scroll listener for infinite scrolling
    useEffect(() => {
        const contentContainer = document.querySelector(".content")

        function handleScroll() {
            if (!contentContainer || !nextPageUrl || loading) return
            const distanceFromBottom =
                contentContainer.scrollHeight -
                contentContainer.scrollTop -
                contentContainer.clientHeight
            if (distanceFromBottom < 100) {
                fetchEvents("http://localhost" + nextPageUrl, true)
            }
        }


        contentContainer?.addEventListener("scroll", handleScroll)
        return () => contentContainer?.removeEventListener("scroll", handleScroll)
    }, [nextPageUrl, loading])

    if (loading && eventList.length === 0) {
        return <p>Loading...</p>
    }

    return (
        <div className="events">
            <div className="filters">
                <div>
                    <label htmlFor="start-date">Start Date</label>
                    <br />
                    <input
                        id="start-date"
                        type="date"
                        value={beginningDate}
                        onChange={(event) => setBeginningDate(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="end-date">End Date</label>
                    <br />
                    <input
                        id="end-date"
                        type="date"
                        value={endingDate}
                        onChange={(event) => setEndingDate(event.target.value)}
                    />
                </div>
            </div>

            <ul className="list">
                {eventList.map((event) => (
                    <li key={`${event.title}-${event.date}`}>
                        <img
                            src={`http://localhost${event.image}`}
                            alt={event.title}
                        />
                        <div>
                            <p>{event.title}</p>
                            <p>{event.date}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {loading && <p>Loading more events...</p>}
        </div>
    )
}
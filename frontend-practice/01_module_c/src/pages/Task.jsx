
import { Search, MoreVertical } from "lucide-react"
import { useState, useEffect} from "react"
import "./../styles/task.css"

function Task()
{
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const token = localStorage.getItem("token")


  // Task Controls: Such as Searching,Filtering and Sorting
  const [search, setSearch] = useState("")
  const [subject, setSubject] = useState("")
  const [priority, setPriority] = useState("")
  const [completed, setCompleted] = useState("")
  const [sort, setSort] = useState("")
  const [direction, setDirection] = useState("asc")

  async function fetchTasks()
  {
    try
    {

      const params = new URLSearchParams()

      if(search) params.append("search", search)
      if(subject) params.append("subject", subject)
      if(priority) params.append("priority", priority)
      if(completed !== "") params.append("completed", completed)
      if(sort) params.append("sort", sort)
      if(direction) params.append("direction", direction)

      

      const response = await fetch(`http://localhost/PNSC_TRAINING/studysprint/api/tasks?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      })

      const data = await response.json()

      if(!response.ok)
      {
        setError(data.message || "Server Error")
      }

      setTasks(data.data)


    }catch(e)
    {
      setError(e.message)
    }finally 
    {
      setLoading(false)
    }
  }


  function formatDueDate(dateString)
  {
    const date = new Date(dateString)
    const now = new Date()

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })

    const isOverDue = date <= new Date(now.toDateString())

    const diffDays = Math.round((date - now ) / (1000 * 60 * 60 * 24))

    const dayLabel = 
      date.toDateString() === now.toDateString()
      ? "Today" 
      : diffDays === 1 
      ? "Tomorrow"
      : diffDays >= -7 diffDays <= 7
      




    
  }
  useEffect(() => {
    fetchTasks()
  }, [search, subject, priority, completed, sort, direction])

  
  if(loading) return <h3>Loading...</h3>
  if(error) return <h3>{error}</h3>

  return (

    <>
      <div>
        <div className="task-controls">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
           />
           
           <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="Web">Web</option>
              <option value="UI Design">UI Design</option>
              <option value="prep">Prep</option>
            </select>


            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>

            </select>

            <select
              value={completed}
              onChange={(e) => setCompleted(e.target.value)}
            >
              <option value="">All </option>
              <option value="1">Completed</option>
              <option value="0">Not Completed</option>

            </select>


            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">All</option>
              <option value="title">Title</option>
              <option value="subject">subject</option>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
              <option value="completed">Completed</option>

            </select>

            <select 
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>

            </select>
        </div>

        {tasks.map(task => (
          <div key={task.id}>
              <h3>{task.title}</h3> <br />
          </div>
        ))}
      </div>

    </>

  )

}



export default Task
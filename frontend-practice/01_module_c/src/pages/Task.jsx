import { Search, MoreVertical, Clock, Check } from "lucide-react"
import { useState, useEffect } from "react"
import "./../styles/task.css"
import { useNavigate } from "react-router"

function Task() {
  const navigate = useNavigate()

  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState("")
  const [tasks,     setTasks]     = useState([])
  const [openMenuId, setOpenMenuId] = useState(null)

  const token = localStorage.getItem("token")

  const [search,    setSearch]    = useState("")
  const [subject,   setSubject]   = useState("")
  const [priority,  setPriority]  = useState("")
  const [completed, setCompleted] = useState("")
  const [sort,      setSort]      = useState("")
  const [direction, setDirection] = useState("asc")

  // derive unique filter options from fetched tasks
  // [...new Set()] removes duplicates
  const subjects   = [...new Set(tasks.map(t => t.subject))]
  const priorities = [...new Set(tasks.map(t => t.priority))]

  function handleEdit(taskId) {
    navigate(`/tasks/${taskId}/edit`)
  }

  async function handleDelete(taskId) {
    if (!window.confirm("Delete this task?")) return
    try {
      const response = await fetch(
        // BUG 2 FIX: http:// not http:
        `http://localhost/PNSC_TRAINING/studysprint/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }
      )
      if (!response.ok) {
        const data = await response.json()
        alert(data.message || "Failed to delete")
        return
      }
      // remove from state immediately — no need to re-fetch
      setTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (e) { alert(e.message) }
  }

  // Pattern B — defined outside useEffect so it can be called from anywhere
  async function fetchTasks() {
    try {
      const params = new URLSearchParams()
      if (search)          params.append("search",    search)
      if (subject)         params.append("subject",   subject)
      if (priority)        params.append("priority",  priority)
      if (completed !== "") params.append("completed", completed)
      if (sort)            params.append("sort",      sort)
      if (direction)       params.append("direction", direction)

      const response = await fetch(
        `http://localhost/PNSC_TRAINING/studysprint/api/tasks?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      )
      const data = await response.json()
      if (!response.ok) { setError(data.message || "Server Error"); return }
      setTasks(data.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function formatDueDate(dateString, isCompleted = false) {
    const date = new Date(dateString)
    const now  = new Date()
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const isOverDue = date <= new Date(now.toDateString())
    const isToday   = date.toDateString() === now.toDateString()
    const diffDays  = Math.round((date - now) / (1000 * 60 * 60 * 24))

    if (isCompleted) {
      return {
        text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        isOverDue: false,
      }
    }

    const dayLabel =
      isToday        ? "Today"
      : diffDays === 1 ? "Tomorrow"
      : diffDays >= -7 && diffDays <= 7
        ? date.toLocaleDateString("en-US", { weekday: "long" })
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    return { text: `${dayLabel}, ${time}`, isOverDue, isToday }
  }

  // BUG 1 FIX: two separate useEffects — one for click outside, one for fetch
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".menu-wrapper")) setOpenMenuId(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, []) // runs once on mount

  useEffect(() => {
    fetchTasks()
  }, [search, subject, priority, completed, sort, direction]) // runs when filters change

  if (loading) return <h2>Loading Tasks...</h2>
  if (error)   return <h2>{error}</h2>

  return (
    <>
      <div id="main-task">
        <div className="task-header">
          <div className="search-bar">
            <Search size={30} />
            <input
              type="text"
              placeholder="Search tasks by title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="task-controls">
          {/* DYNAMIC subject filter — options come from fetched tasks */}
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* DYNAMIC priority filter */}
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All Priority</option>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select value={completed} onChange={(e) => setCompleted(e.target.value)}>
            <option value="">All</option>
            <option value="1">Completed</option>
            <option value="0">Not Completed</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Default</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="due_date">Due Date</option>
          </select>

          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div id="to-do-cards">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              // BUG 3 FIX: dropdown is INSIDE the card, inside menu-wrapper
              <div
                key={task?.id}
                className={`task-card ${formatDueDate(task.due_date, task.completed).isToday ? "today" : ""}`}
              >
                <input
                  type="checkbox"
                  defaultChecked={task.completed}
                  id={`circle-check-${task.id}`}
                  className="circle-check"
                />
                <label htmlFor={`circle-check-${task.id}`}></label>

                <div className="task-card-content">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="sub-task">
                    <div id="subject"><p>{task.subject.toUpperCase()}</p></div>

                    {task.completed ? (
                      <div className="completed-task">
                        <Check size={15} color="green" />
                        <p>Completed {formatDueDate(task.due_date, task.completed).text}</p>
                      </div>
                    ) : (
                      <div className={formatDueDate(task.due_date).isOverDue ? "due-red" : ""}>
                        <p className="not-completed">
                          <Clock size={15} />
                          {formatDueDate(task.due_date, task.completed).text}
                        </p>
                      </div>
                    )}

                    <div className={`level priority-${task.priority.toLowerCase()}`}>
                      <p>{task.priority}</p>
                    </div>
                  </div>
                </div>

                {/* menu-wrapper contains trigger + dropdown together */}
                <div className="menu-wrapper">
                  <div
                    className="menu-trigger"
                    onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                  >
                    <MoreVertical size={20} />
                  </div>

                  {openMenuId === task.id && (
                    <div className="dropdown-menu">
                      <div className="dropdown-item" onClick={() => { setOpenMenuId(null); handleEdit(task.id) }}>
                        Edit
                      </div>
                      {/* BUG 4 FIX: calls handleDelete not handleEdit */}
                      <div className="dropdown-item delete-item" onClick={() => { setOpenMenuId(null); handleDelete(task.id) }}>
                        Delete Task
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div id="no-task"><p>No tasks Found</p></div>
          )}
        </div>
      </div>
    </>
  )
}

export default Task
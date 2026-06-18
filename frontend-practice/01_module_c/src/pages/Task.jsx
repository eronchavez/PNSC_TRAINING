import { Search, MoreVertical, Clock, Check, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import "./../styles/task.css"
import { useNavigate } from "react-router"

function Task() {
  const navigate = useNavigate()

  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState("")
  const [tasks,      setTasks]      = useState([])
  const [openMenuId, setOpenMenuId] = useState(null)

  // NEW: modal state
  // null = modal closed
  // when user clicks "Delete Task", we store that task's id and title here
  // modal reads from this to show the task name in the confirmation text
  const [deleteTarget, setDeleteTarget] = useState(null)
  // deleteTarget will look like: { id: 5, title: "Create PWA manifest" }

  const token = localStorage.getItem("token")

  const [search,    setSearch]    = useState("")
  const [subject,   setSubject]   = useState("")
  const [priority,  setPriority]  = useState("")
  const [completed, setCompleted] = useState("")
  const [sort,      setSort]      = useState("")
  const [direction, setDirection] = useState("asc")

  const subjects   = [...new Set(tasks.map(task => task.subject))]
  const priorities = [...new Set(tasks.map(task => task.priority))]

  function handleEdit(taskId) {
    navigate(`/tasks/${taskId}/edit`)
  }

  // CONCEPT 1: PATCH completed + optimistic UI
  async function handleTaskCompletion(isChecked, taskId) {

    // OPTIMISTIC UI: update state BEFORE the API responds
    // this makes the UI feel instant — no waiting for the server
    // we update the specific task in the array whose id matches taskId
    setTasks(prev => prev.map(task =>
      // if this is the task being toggled, return a new object with completed updated
      // if it's a different task, return it unchanged
      task.id === taskId ? { ...task, completed: isChecked } : task
    ))

    try {
      const response = await fetch(
        `http://localhost/PNSC_TRAINING/studysprint/api/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: isChecked ? 1 : 0 })
        }
      )

      // FIX: was missing await — data was a Promise not an object
      const data = await response.json()

      if (!response.ok) {
        // REVERT: if API failed, undo the optimistic update
        // flip isChecked back to its previous value
        setTasks(prev => prev.map(task =>
          task.id === taskId ? { ...task, completed: !isChecked } : task
        ))
        setError(data.message || "Failed to update")
      }

    } catch (error) {
      // REVERT on network error too
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, completed: !isChecked } : task
      ))
      setError(error.message)
    }
  }

  // CONCEPT 2: open modal — just sets deleteTarget, does NOT delete yet
  // called when user clicks "Delete Task" in the dropdown
  function openDeleteModal(taskId, taskTitle) {
    setDeleteTarget({ id: taskId, title: taskTitle })
    setOpenMenuId(null) // close the dropdown
  }

  // called when user clicks Cancel in the modal
  function closeDeleteModal() {
    setDeleteTarget(null)
  }

  // called when user clicks "Delete Task" button inside the modal
  async function confirmDelete() {
    // deleteTarget.id has the id we stored when modal was opened
    const taskId = deleteTarget.id

    // close modal immediately — don't wait for API
    setDeleteTarget(null)

    try {
      const response = await fetch(
        `http://localhost/PNSC_TRAINING/studysprint/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        }
      )

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || "Failed to delete")
        return
      }

      // remove from state — no re-fetch needed
      setTasks(prev => prev.filter(task => task.id !== taskId))

    } catch (error) {
      setError(error.message)
    }
  }

  async function fetchTasks() {
    try {
      const params = new URLSearchParams()
      if (search)           params.append("search",    search)
      if (subject)          params.append("subject",   subject)
      if (priority)         params.append("priority",  priority)
      if (completed !== "") params.append("completed", completed)
      if (sort)             params.append("sort",      sort)
      if (direction)        params.append("direction", direction)

      const response = await fetch(
        `http://localhost/PNSC_TRAINING/studysprint/api/tasks?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      )
      const data = await response.json()
      if (!response.ok) { setError(data.message || "Server Error"); return }
      setTasks(data.data || [])
    } catch (error) {
      setError(error.message)
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
      isToday          ? "Today"
      : diffDays === 1 ? "Tomorrow"
      : diffDays >= -7 && diffDays <= 7
        ? date.toLocaleDateString("en-US", { weekday: "long" })
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    return { text: `${dayLabel}, ${time}`, isOverDue, isToday }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".menu-wrapper")) setOpenMenuId(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [search, subject, priority, completed, sort, direction])

  if (loading) return <h2>Loading Tasks...</h2>
  if (error)   return <h2>{error}</h2>

  return (
    <>
      <div id="main-task">

        {/* CONCEPT 2: DELETE MODAL */}
        {/* deleteTarget !== null means modal is open */}
        {/* renders on top of everything because of position:fixed in CSS */}
        {deleteTarget !== null && (
          <div className="modal-overlay">
            <div className="modal">

              {/* red trash icon circle — matches your reference image */}
              <div className="modal-icon">
                <Trash2 size={28} color="red" />
              </div>

              <h3 className="modal-title">Delete this task?</h3>

              {/* shows the actual task name so user knows what they're deleting */}
              <p className="modal-message">
                Are you sure you want to delete <strong>{deleteTarget.title}</strong>? This action cannot be undone.
              </p>

              <div className="modal-buttons">
                {/* Cancel — just closes the modal, nothing deleted */}
                <button className="modal-cancel" onClick={closeDeleteModal}>
                  Cancel
                </button>

                {/* Confirm — actually runs the delete */}
                <button className="modal-confirm" onClick={confirmDelete}>
                  Delete Task
                </button>
              </div>

            </div>
          </div>
        )}

        <div className="task-header">
          <div className="search-bar">
            <Search size={30} />
            <input
              type="text"
              placeholder="Search tasks by title or subject..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="task-controls">
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="">All Priority</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>

          <select value={completed} onChange={(event) => setCompleted(event.target.value)}>
            <option value="">All</option>
            <option value="1">Completed</option>
            <option value="0">Not Completed</option>
          </select>

          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="">Default</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="due_date">Due Date</option>
          </select>

          <select value={direction} onChange={(event) => setDirection(event.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div id="to-do-cards">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task?.id}
                className={`task-card ${formatDueDate(task.due_date, task.completed).isToday ? "today" : ""}`}
              >
                <input
                  type="checkbox"
                  // CHANGED: defaultChecked → checked
                  // defaultChecked only works on first render — ignores state changes
                  // checked={} keeps checkbox in sync with task.completed in state
                  // this is required for optimistic UI to work visually
                  checked={!!task.completed}
                  id={`circle-check-${task.id}`}
                  className="circle-check"
                  onChange={(event) => handleTaskCompletion(event.target.checked, task.id)}
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

                <div className="menu-wrapper">
                  <div
                    className="menu-trigger"
                    onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                  >
                    <MoreVertical size={20} />
                  </div>

                  {openMenuId === task.id && (
                    <div className="dropdown-menu">
                      <div
                        className="dropdown-item"
                        onClick={() => { setOpenMenuId(null); handleEdit(task.id) }}
                      >
                        Edit
                      </div>
                      <div
                        className="dropdown-item delete-item"
                        // CHANGED: was handleDelete(task.id)
                        // now opens modal instead — passes both id AND title
                        // title is needed to show "delete Create PWA manifest?" in the modal
                        onClick={() => openDeleteModal(task.id, task.title)}
                      >
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
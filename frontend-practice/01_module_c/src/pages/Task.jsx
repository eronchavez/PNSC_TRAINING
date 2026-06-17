import {
  Search,
  ListFilter,
  MoreVertical,
  Clock,
  PilcrowSquare,
  Check,
} from "lucide-react";
import { useState, useEffect } from "react";
import "./../styles/task.css";

function Task() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");

  // filters
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("");
  const [completed, setCompleted] = useState("");

  //Sort
  const [sort, setSort] = useState("");
  const [direction, setDirection] = useState("asc");

  /**
   * Fetch tasks
   */
  async function fetchTasks() {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (subject) params.append("subject", subject);
      if (priority) params.append("priority", priority);
      if (completed !== "") params.append("completed", completed);

      if (sort) params.append("sort", sort);
      if (direction) params.append("direction", direction);

      const response = await fetch(
        `http://localhost/PNSC_TRAINING/studysprint/api/tasks?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();
      

      if (!response.ok) {
        setError(data.message || "Server Error");
      }
      setTasks(data.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }


  /**
   * Convert to human readable date
   *
   * @param {*} dateString formatted due date 
   * @param {*} isCompleted 
   * @returns formatted date object
   */
  
  function formatDueDate(dateString, isCompleted = false) {
    const date = new Date(dateString);
    const now = new Date();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isOverDue = date <= new Date(now.toDateString());

    const isToday = date.toDateString() === now.toDateString()
    // Compare due date if the date is the same today
    const diffDays = Math.round((date - now) / (1000 * 60 * 60 * 24));

    if (isCompleted) {
      const completedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return {
        text: completedDate,
        isOverDue: false,
      };
    }

    const dayLabel =
      date.toDateString() === now.toDateString()
        ? "Today"
        : diffDays === 1
          ? "Tomorrow"
          : diffDays >= -7 && diffDays <= 7
            ? date.toLocaleDateString("en-US", { weekday: "long" })
            : date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

    return {
      text: `${dayLabel}, ${time}`,
      isOverDue,
      isToday
    };
  }

  
  useEffect(() => {
    fetchTasks();
  }, [search, subject, priority, completed, sort, direction]);

  if (loading) {
    return <h2>Loading Tasks...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

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
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="task-controls">
          <div>
            {/* Subject Filter */}
            <select
              name="subject"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              <option value="FRONTEND">frontend</option>
              <option value="BACKEND">backend</option>
              <option value="WEB">web</option>
            </select>
          </div>
          {/* Priority Filter */}
          <div>
            <select
              name="priority"
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="LOW">low</option>
              <option value="MEDIUM">medium</option>
              <option value="HIGH">high</option>
            </select>
          </div>

          {/* Completion filter */}
          <div>
            <select
              name="completed"
              id="completed"
              value={completed}
              onChange={(e) => setCompleted(e.target.value)}
            >
              <option value="">All</option>
              <option value="1">Completed</option>
              <option value="0"> Not Completed</option>
            </select>
          </div>
          {/* SORT UI */}
          <div>
            <select
              name="sort"
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="due_date">Due Date</option>
            </select>
          </div>
          {/* Sort Direction */}
          <div>
            <select
              name="direction"
              id="direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div id="to-do-cards">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task?.id} className={formatDueDate(task.due_date, task.completed).isToday ? "task-card today" : "task-card"}>
                <input
                  type="checkbox"
                  defaultChecked={task.completed}
                  key={task.id}
                  id={`circle-check-${task.id}`}
                  className="circle-check"
              
                />
                <label htmlFor={`circle-check-${task.id}`}></label>
                <div className="task-card-content">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="sub-task">
                    <div id="subject">
                      <p>{task.subject.toUpperCase()}</p>
                    </div>
                    {task.completed ? (
                      <div className="completed-task">
                        <Check size={15} color="green"/>
                        <p>
                          Completed{" "}
                          {formatDueDate(task.due_date, task.completed).text}
                        </p>
                      </div>
                    ) : (
                      <p
                        className={
                          formatDueDate(task.due_date).isOverDue
                            ? "due-red"
                            : ""
                        }
                      >
                       <div className="not-completed">
                           <Clock size={15}/>
                        {formatDueDate(task.due_date, task.completed).text}
                       </div>
                      </p>
                    )}
                    <div
                      className={`level priority-${task.priority.toLowerCase()}`}
                    >
                      <p>{task.priority}</p>
                    </div>
                  </div>
                </div>
                <MoreVertical />
              </div>
            ))
          ) : (
            <div id="no-task">
              <p>No tasks Found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Task;

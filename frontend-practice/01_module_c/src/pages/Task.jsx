import {
  Search,
  ListFilter,
  MoreVertical,
  Clock,
  PilcrowSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import "./../styles/task.css";

// const toDoList = [
//   {
//     id: 1,
//     title: "Refactor task card component",
//     subject: "FRONTEND",
//     date: "Friday, 8:00 AM",
//     level: "Easy",
//   },
//   {
//     id: 2,
//     title: "Implement authentication flow",
//     subject: "BACKEND",
//     date: "Monday, 10:00 AM",
//     level: "High",
//     isCompleted: false,
//   },
//   {
//     id: 3,
//     title: "Design dashboard UI layout",
//     subject: "UI/UX",
//     date: "Wednesday, 2:00 PM",
//     level: "Medium",
//     isCompleted: true,
//   },
//   {
//     id: 4,
//     title: "Fix responsive bugs on mobile view",
//     subject: "FRONTEND",
//     date: "Thursday, 6:00 PM",
//     level: "High",
//     isCompleted: false,
//   },
//   {
//     id: 5,
//     title: "Optimize database queries",
//     subject: "DATABASE",
//     date: "Saturday, 9:00 AM",
//     level: "Medium",
//     isCompleted: true,
//   },
// ];

function Task() {
  // const [tasks, setTasks] = useState(toDoList);

  //   search
  // const [searchTerm, setSearchTerm] = useState("");

  // // derived search
  // const filteredTask = tasks.filter(
  //   (task) =>
  //     task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     task.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  // );

  // // derived sort
  // const priorityOrder = {
  //   Easy: 1,
  //   Medium: 2,
  //   High: 3,
  // };

  // const sortedFilteredTask = [...filteredTask].sort(
  //   (a, b) => priorityOrder[b.level] - priorityOrder[a.level],
  // );

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

  function formatDueDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const diffDays = Math.round((date - now) / (1000 * 60 * 60 * 24));

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

    return `${dayLabel}, ${time}`;
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
          <div className="categories">
            <div className="category">
              <p>All</p>
            </div>
            <div className="category">
              <p>To-Do</p>
            </div>
            <div className="category">
              <p>Completed</p>
            </div>
            <div className="category">
              <p>High Priority</p>
            </div>
            <div className="category" id="due-date">
              <ListFilter size={20} />
              <p>Due Date Latest</p>
            </div>
            {/* Subject Filter */}
            <div>
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
          </div>
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
        <div id="to-do-cards">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task?.id} className="task-card">
                <input type="checkbox" id="circle-check" key={task.id} />
                <label htmlFor="circle-check"></label>
                <div className="task-card-content">
                  <h3>{task.title}</h3>
                  <div className="sub-task">
                    <div id="subject">
                      <p>{task.subject}</p>
                    </div>
                    <p>{formatDueDate(task.due_date)}</p>
                    <div id="level">
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

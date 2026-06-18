import { ToggleLeft, CircleCheck, Save, Trash2 } from "lucide-react";
import "./../styles/taskEditor.css";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";

function TaskEditor() {
  const { id } = useParams();
  const mode = id ? "edit" : "add";

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [priority, setPriority] = useState("Medium");

  // token
  const token = localStorage.getItem("token");
  // error message
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit") return;

    async function fetchTask() {
      try {
        const response = await fetch(
          `http://localhost/PNSC_TRAINING/studysprint/api/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        const data = await response.json();
        console.log(data)

        if (!response.ok) {
          setError(data.message || "Failed to load task");
          return;
        }

        setTitle(data.title);
        setSubject(data.subject);
        setPriority(data.priority);
        setDueDate(data.due_date.replace(" ", "T").slice(0,16))
        setCompleted(data.completed);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [id]);

  async function handleAddTask(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost/PNSC_TRAINING/studysprint/api/tasks",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            subject: subject,
            priority: priority,
            due_date: dueDate,
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setSuccessMessage("Task Created Successfully!");

      setTitle("");
      setSubject("");
      setPriority("Medium");
      setDueDate("");
      navigate("/tasks")
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateTask(e) {
    e.preventDefault();

    setError("");
    setSuccessMessage("");
    

    try {
      const response = await fetch(
        `http://localhost/PNSC_TRAINING/studysprint/api/tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            subject: subject,
            priority: priority,
            due_date: dueDate,
            completed: completed ? 1 : 0,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to Update");
        return;
      }

      navigate("/tasks", { replace: true });
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDeleteTask() {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;

    try {
      const response = await fetch(
        `http://localhost/PNSC_TRAINING/studysprint/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to delete");
        return;
      }

      navigate("/tasks", {replace: true})
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <h2>Loading task...</h2>
  return (
    <div>
      <div className="task-editor">
        <form id="form" onSubmit={mode === "add" ? handleAddTask : handleUpdateTask}>
          <label htmlFor="task-title">TASK TITLE</label>
          <div className="inputField">
            <input
              required
              type="text"
              name="task-title"
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <label htmlFor="subject">SUBJECT</label>
          <div className="inputField">
            <input
              required
              type="text"
              name="subject"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <label htmlFor="date">DUE DATE & TIME</label>
          <div className="inputField">
            <input
              type="datetime-local"
              name="dueDate"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div id="prio-level">
            <label>PRIORITY LEVEL</label>
            <ul id="prio-level-ul">
              {["Low", "Medium", "High"].map((level) => (
                <li
                  key={level}
                  onClick={() => setPriority(level)}
                  className={priority === level ? "selected" : ""}
                >
                  {level}
                </li>
              ))}
            </ul>
            {mode === "edit" && (
              <>
                <div id="mark-completed">
                  <CircleCheck color="blue" size={30} />
                  <div className="text-completed">
                    <p>
                      Mark as Completed <br /> Move task to archived sprint
                    </p>

                    <label className="switch">
                      <input
                        type="checkbox"
                        defaultChecked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {mode === "add" && (
              <>
                <div className="action-buttons">
                  <button className="save" type="submit">
                    {loading ? (
                      <p>Creating task...</p>
                    ) : (
                      <p className="save">
                        {" "}
                        <Save /> Create task 
                      </p>
                    )}
                  </button>
                </div>
                {error && (
                  <p className="errorMsg" style={{ color: "red" }}>
                    {error}
                  </p>
                )}
                {successMessage && <p>{successMessage}</p>}
              </>
            )}

             {mode === "edit" && (
              <>
                <div className="action-buttons">
                  <button className="save" type="submit">
                    <Save />
                    <p>Save Changes</p>
                  </button>
                  <div className="delete" onClick={handleDeleteTask}>
                    <Trash2 />
                    <p>Delete Task</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>

     
    </div>
  );
}

export default TaskEditor;

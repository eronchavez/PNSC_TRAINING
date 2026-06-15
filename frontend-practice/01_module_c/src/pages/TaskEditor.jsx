import { ToggleLeft, CircleCheck, Save, Trash2 } from "lucide-react";
import "./../styles/taskEditor.css";
import { useLocation } from "react-router";

function TaskEditor() {
  const location = useLocation();
  const mode = location.state?.mode;
  return (
    <div>
      <div className="task-editor">
        <form id="form">
          <label htmlFor="task-title">TASK TITLE</label>
          <div className="inputField">
            <input type="text" name="task-title" id="task-title" />
          </div>

          <label htmlFor="subject">SUBJECT</label>
          <div className="inputField">
            <input type="text" name="subject" id="subject" />
          </div>

          <label htmlFor="date">DUE DATE & TIME</label>
          <div className="inputField">
            <input type="date" name="date" id="date" />
          </div>

          <div id="prio-level">
            <label>PRIORITY LEVEL</label>
            <ul id="prio-level-ul">
              <li>Low</li>
              <li>Medium</li>
              <li>High</li>
            </ul>
          </div>

          {mode === "edit" && (
            <>
              <div id="mark-completed">
                <CircleCheck color="blue" size={30} />
                <div className="text-completed">
                  <p>
                    Mark as Completed <br /> Move task to archived sprint
                  </p>

                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </>
          )}
        </form>
      </div>

      {mode === "add" && (
        <>
          <div className="action-buttons">
            <div className="save">
              <Save />
              <p>Create Task</p>
            </div>
          </div>
        </>
      )}

      {mode === "edit" && (
        <>
          <div className="action-buttons">
            <div className="save">
              <Save />
              <p>Save Changes</p>
            </div>
            <div className="delete">
              <Trash2 />
              <p>Delete Task</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskEditor;

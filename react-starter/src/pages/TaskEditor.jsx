import { File } from "lucide-react";
import "./../styles/taskEditor.css";

function TaskEditor()
{
    return (
        <div className="main-editor">
            <div className="addTask">
                <form action="">
                    <h2>TASK TITLE</h2>
                    <input type="text" placeholder="Task title" />
                    <h2>SUBJECT</h2>
                    <input type="text" placeholder="Subject" />
                    <h2>DUE DATE & TIME</h2>
                    <input type="date" />

                    <h2>PRIORITY LEVEL</h2>
                    <div id="prio-level">
                        <ul>
                            <li>Low</li>
                            <li>Medium</li>
                            <li>High</li>
                        </ul>
                    </div>
                </form>

            </div>
            <div className="createBtn">
                <File/>
                Create Task
            </div>
        </div>
    );
}

export default TaskEditor;
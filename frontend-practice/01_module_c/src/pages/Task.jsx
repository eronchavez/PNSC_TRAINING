import { Search, ListFilter, MoreVertical, Clock, PilcrowSquare } from "lucide-react";
import { useState } from "react";
import "./../styles/task.css";

const toDoList = [
  {
    id: 1,
    title: "Refactor task card component",
    subject: "FRONTEND",
    date: "Friday, 8:00 AM",
    level: "Easy",
  },
  {
    id: 2,
    title: "Implement authentication flow",
    subject: "BACKEND",
    date: "Monday, 10:00 AM",
    level: "High",
    isCompleted: false
  },
  {
    id: 3,
    title: "Design dashboard UI layout",
    subject: "UI/UX",
    date: "Wednesday, 2:00 PM",
    level: "Medium",
    isCompleted: true
  },
  {
    id: 4,
    title: "Fix responsive bugs on mobile view",
    subject: "FRONTEND",
    date: "Thursday, 6:00 PM",
    level: "High",
    isCompleted: false
  },
  {
    id: 5,
    title: "Optimize database queries",
    subject: "DATABASE",
    date: "Saturday, 9:00 AM",
    level: "Medium",
    isCompleted: true
  },
];

function Task() {
  const [tasks, setTasks] = useState(toDoList);

    //   search 
    const [searchTerm, setSearchTerm] = useState("")

    // derived search
    const filteredTask = tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchTerm.toLowerCase()) 
    )

    // derived sort
    const priorityOrder = {
        Easy: 1,
        Medium: 2,
        High: 3
    }

    const sortedFilteredTask = [...filteredTask].sort((a,b) => priorityOrder[b.level] - priorityOrder[a.level] )


    

  return (
    <>
      <div id="main-task">
        <div className="task-header">
          <div className="search-bar">
            <Search size={30} />
            <input
              type="text"
              placeholder="Search tasks by title or subject ..."
              onChange={(e) => setSearchTerm(e.target.value)}
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
          </div>
        </div>

        <div id="to-do-cards">
            {
            sortedFilteredTask.length > 0 ?
            sortedFilteredTask.map((task) => (
                <div key={task.id} className="task-card">
                    <input type="checkbox" id="circle-check" key={task.id}/>
                    <label htmlFor="circle-check"></label>
                    <div className="task-card-content" >
                        <h3>{task.title}</h3>
                        <div className="sub-task">
                            <div id="subject">
                                <p>{task.subject}</p>
                            </div>
                            <p>{task.date}</p>
                            <div id="level">
                                <p>{task.level}</p>
                            </div>
                        </div>
                    </div>
                    <MoreVertical/>
                </div>
            )) 
            : 
                <div id="no-task">
                     <p>No tasks Found</p>
                </div>
            }
        </div>
      </div>
    </>
  );
}

export default Task;

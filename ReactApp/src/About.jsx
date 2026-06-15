import { useState } from "react";

const products = [
    {
        id: 1,
        name: "Computer",
        isAvailable: false

    }

]

const initialTasks = [
  { id: 1, title: "Study React", completed: false },
  { id: 2, title: "Practice Laravel API", completed: true },
  { id: 3, title: "Build dashboard page", completed: false },
];

function About()
{
    


    const [tasks, setTasks] = useState(initialTasks)
    // state for search term
    const [searchTerm, setSearchTerm] = useState("")

    // derived state that would hold all tasks that include the search term
    const filteredTasks= tasks.filter(task => task.title.includes(searchTerm))
    const completedCount = tasks.filter(task => !task.completed).length

    function toggleTaskCompletion(id)
    {
        const updatedTasks = tasks.map(task => {
            if(task.id === id)
            {
                return {
                    ...task, completed: !task.completed
                }
            }

            return task
        })

        setTasks(updatedTasks)

    }

    
    return (
        <div>
             <p>Total Completed Task: {completedCount}</p>
            <input type="text" onChange={(e) => setSearchTerm(e.target.value)}/>

            {filteredTasks.length > 0 ? 
            (<ul> 
                {filteredTasks.map((task) => <li onClick={() => toggleTaskCompletion(task.id)} key={task.id}>{task.title} {task.completed ? "Not Completed" : "Completed"}</li>)}
            </ul>) 
            : 
            "No Tasks"}
           

        </div>
    );
}

export default About 
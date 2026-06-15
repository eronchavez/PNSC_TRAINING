
// Setting default value if it is empty.
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};


// Read the tasks and display it
function renderTasks()
{
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    for ( const id in tasks)
    {
        list.innerHTML += `
            <li> 
               ${tasks[id]}

               <button onclick="editTask('${id}')">Edit Task</button>
               <button onclick="deleteTask('${id}')">Delete Task</button>
               
            </li>
        `;
    }

    //Save object to LocalStorage 
    localStorage.setItem("tasks", JSON.stringify(tasks));
    const data = JSON.stringify(tasks);

    localStorage.setItem("tasks", data);

    console.log(data);
}


function addTask()
{
    const input = document.querySelector("#taskInput");
    if(input.value.trim() === "") return;

    const id = Date.now();

    tasks[id] = input.value;

    input.value = "";

    renderTasks();


}

function editTask(id)
{
    const newTask = prompt("Edit Task", tasks[id]);

    if (
        newTask !== null && newTask.trim() !== ""
    ){
        tasks[id] = newTask;
        renderTasks();
    }
}


function deleteTask(id)
{
    delete tasks[id];

    renderTasks();
}
renderTasks();

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import Tasks from "./pages/Tasks";
import TaskEditor from "./pages/TaskEditor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },

  {
    path: "/app",
    element: <AppLayout />,

    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      }, 
      {
        path: "tasks",
        element: <Tasks />
      },
      {
        path: "taskEditor",
        element: <TaskEditor /> 
      }
    ]
  }
]);

function App() {
 
  return <RouterProvider router={router}/>

}

export default App;

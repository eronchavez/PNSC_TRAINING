
import { Routes, Route, RouterProvider } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import Tasks from "./pages/Tasks";
import TaskEditor from "./pages/TaskEditor";
import Settings from "./pages/Settings";

      

function App() {
 
  return (
    <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/" element={<AppLayout/>}>
            <Route index element={<Dashboard/>}></Route>
            <Route path="/tasks" element={<Tasks/>}></Route>
            <Route path="/taskEditor" element={<TaskEditor/>}></Route>
            <Route path="/settings" element={<Settings/>}></Route>
        </Route>
    </Routes>
  )

}

export default App;

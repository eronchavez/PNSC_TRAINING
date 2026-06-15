import {Routes,Route,Navigate} from "react-router"
import Login from "./pages/Login"
import AppLayout from "./layouts/AppLayout"
import Dashboard from "./pages/Dashboard"
import TaskEditor from "./pages/TaskEditor"
import Task from "./pages/Task"
import Settings from "./pages/Settings"


function RequireAuth({
  children
})
{
  const isLoggedIn = !!localStorage.getItem("token")
  return isLoggedIn ? children : <Navigate replace to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/" element={
        <RequireAuth>
          <AppLayout/>
        </RequireAuth>
      }>
        <Route index element={<Dashboard/>}></Route> 
        <Route element={<TaskEditor/>} path="/taskEditor"></Route>
        <Route element={<Task/>} path="/tasks"></Route>
        <Route element={<Settings/>} path="/settings"></Route>
      </Route>
    </Routes>
  )
}

export default App;

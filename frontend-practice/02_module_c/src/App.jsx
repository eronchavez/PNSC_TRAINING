import { Routes, Route, Navigate } from "react-router"
import AppLayout from "./layouts/AppLayout"
import Dashboard from "./pages/Dashboard"

function RequireAuth({ children }) {
  const isLoggedIn = !!localStorage.getItem("token")
  return isLoggedIn ? children : <Navigate replace to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<h1>Login</h1>} />
      <Route path="/" element={
        <RequireAuth>
          <AppLayout />
        </RequireAuth>
      }>
        <Route index element={<Dashboard/>} />
        <Route path="/tasks" element={<h1>Tasks</h1>} />
        <Route path="/tasks/new" element={<h1>New Task</h1>} />
        <Route path="/tasks/:id/edit" element={<h1>Edit Task</h1>} />
        <Route path="/settings" element={<h1>Settings</h1>} />
      </Route>
    </Routes>
  )
}

export default App
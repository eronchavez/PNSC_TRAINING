/* eslint-disable no-undef */
import "./../styles/dashboard.css"
import {
  Calendar,
  ClockAlert,
  CircleCheck,
  Lightbulb,
  CirclePlus,
} from "lucide-react";
import studyImg from "./../images/study.jpg"
import { useNavigate } from "react-router"
import { useState, useEffect } from "react"

function Dashboard() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const token = localStorage.getItem("token")

  
  const [summary, setSummary] = useState({
    todayCount: 0,
    overdueCount: 0,
    completedCount: 0,
    tipTitle: "",
    tipContent: "",
    user: ""

  })



// Set time for greeting
  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good Evening";
  }

  function handleAdd() {
    navigate("/tasks/new")
  }

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch(
          "http://localhost/PNSC_TRAINING/studysprint/api/dashboard", 
          {
            method: 'GET',
            //  body: JSON.stringify({
            //     today_count: today_count,
            //     overdue_count: overdue_count,
            //     completed_count: completed_count
            // }),
            headers: 
            {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }

           
           
          }
        )
        const data = await response.json()
        setSummary({
          todayCount: data.summary.today_count,
          overdueCount: data.summary.overdue_count,
          completedCount: data.summary.completed_count,
          tipTitle: data.tip.title,
          tipContent: data.tip.content,
          user: data.user

        })


      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()


  }, [])

  if (loading) {
    return <h2>Loading Dashboard...</h2>
  }

  if (error) {
    return <h2>{error}</h2>
  }

  return (
    <main id="main-dashboard">
      <section className="upper-dashboard">
        <div className="greeting">
          <h1>WELCOME BACK</h1>
          <p>{getGreeting()}, {summary.user}!</p>
        </div>

        <div className="cards">
          <div className="card">
            <Calendar color="blue" />
            <p>{summary.todayCount}</p>
            <p>TODAY</p>
          </div>

          <div className="card">
            <ClockAlert color="red" />
            <p>{summary.overdueCount}</p>
            <p>OVERDUE</p>
          </div>
        </div>

        <div className="horizontal-cards">
          <div className="hori-card" id="completed-task">
            <div className="check-completed">
              <CircleCheck color="green" />
              <p>COMPLETED TASKS</p>
            </div>
            <p>{summary.completedCount}</p>
          </div>

          <div
            className="hori-card"
            id="edit-task"
            onClick={() => handleAdd(true)}
          >
            <CirclePlus color="white" />
            <p id="add-task">Add Task</p>
          </div>
        </div>
      </section>

      <section className="lower-dashboard">
        <div id="plan-better">
          <h2>Plan Better</h2>
          <img src={studyImg} alt="Study" id="studyImg" />
          <p>
            Productivity isn't about doing more, it's about doing what matters.
            By structuring your day into deep-focus sprints, you minimize the
            friction of starting. Our study app helps you visualize your
            academic path, ensuring that every hour spent is an investment in
            you mastery. Master the art of teh schedule and reclaim your time
            for the things you love most.
          </p>
        </div>

        <div id="study-tip">
         <div id="light-background">
             <Lightbulb id="light-bulb" size={40} color="orange" />
         </div>

          <div id="tip">

            <p id="tip-title">{summary.tipTitle}</p>
            <p id="tip-content">{summary.tipContent}</p>
          </div>

        </div>
      </section>
    </main>
  )
}

export default Dashboard

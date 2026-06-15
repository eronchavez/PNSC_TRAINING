import "./../styles/dashboard.css"
import {
  Calendar,
  ClockAlert,
  CircleCheck,
  Lightbulb,
  SquarePen,
} from "lucide-react";
import studyImg from "./../images/study.jpg"
import { useNavigate } from "react-router"
import { useState, useEffect } from "react"

function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [today_count, setTodayCount] = useState("")
  const [overdue_count, setOverDueCount] = useState("")
  const [completed_count, setCompletedCount] = useState("")
  const [tip_title, setTipTitle] = useState("")
  const [tip_content, setTipContent] = useState("")
  const [user, setUser] = useState("")
  const token = localStorage.getItem("token")

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good Evening";
  }

  function handleEdit() {
    navigate("/taskEditor", {
      state: { mode: "edit" },
    });
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
        );
        const data = await response.json();

        setSummary(data.summary)
        setTodayCount(data.summary.today_count)
        setOverDueCount(data.summary.overdue_count)
        setCompletedCount(data.summary.completed_count)

        setTipTitle(data.tip.title)
        setTipContent(data.tip.content)

        setUser(data.user)
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (loading) {
    return <h2>Loading Dashboard...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <main id="main-dashboard">
      <section className="upper-dashboard">
        <div className="greeting">
          <h1>WELCOME BACK</h1>
          <p>{getGreeting()}, {user}!</p>
        </div>

        <div className="cards">
          <div className="card">
            <Calendar color="blue" />
            <p>{today_count}</p>
            <p>TODAY</p>
          </div>

          <div className="card">
            <ClockAlert color="red" />
            <p>{overdue_count}</p>
            <p>OVERDUE</p>
          </div>
        </div>

        <div className="horizontal-cards">
          <div className="hori-card" id="completed-task">
            <div className="check-completed">
              <CircleCheck color="green" />
              <p>COMPLETED TASKS</p>
            </div>
            <p>{completed_count}</p>
          </div>

          <div
            className="hori-card"
            id="edit-task"
            onClick={() => handleEdit(true)}
          >
            <SquarePen color="white" />
            <p>Edit Task</p>
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

            <p id="tip-title">{tip_title}</p>
            <p id="tip-content">{tip_content}</p>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Dashboard;

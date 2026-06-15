
import { useNavigate } from "react-router-dom";

import calendar from "./../assets/icons/calendar.png";
import clock from "./../assets/icons/clock-alert.png";
import check from "./../assets/icons/circle-check.png";
import plus from "./../assets/icons/circle-plus.png";
import studyImg from "./../assets/images/study.jpg";

function Dashboard() {
 


  return (
    <div>

     


      <main>
        <img src={plus} alt="add" id="fixed-icon" />

        {/* SUMMARY */}
        <section id="summary">
          <div id="greet">
            <h2>WELCOME BACK</h2>
            <h3>Good afternoon, Student User!</h3>
          </div>

          <div className="grid">
            <div className="cards">
              <div className="card">
                <img src={calendar} alt="calendar" />
                <p>0</p>
                <p>Today</p>
              </div>

              <div className="card">
                <img src={clock} alt="overdue" />
                <p>4</p>
                <p>OVERDUE</p>
              </div>
            </div>

            <div className="horizontal-card">
              <div id="completed-task">
                <img src={check} alt="completed" />
                <p>COMPLETED TASKS</p>
                <p>2</p>
              </div>

              <div id="add-task">
                <img src={plus} alt="add task" />
                <p>Add Task</p>
              </div>
            </div>
          </div>
        </section>


        <section>
          <div className="plan-better">
            <h2>Plan Better</h2>
            <img src={studyImg} alt="study" />
             <p>
                    Productivity isn't about doing more, it's about doing what matters. By structuring your day into deep-focus sprints,
                    you minimize the friction of starting. Our study app helps you visualize your academic path, ensuring that every hour
                    spent is an investment in your mastery. Master the art of teh schedule and reclaim your time for the things you love most.
                </p>
          </div>

          <div className="study-tip">
            <div className="light">
              <div className="light-circle">
                💡
              </div>
            </div>

            <div id="study-tip-text">
              <p>STUDY TIP</p>
              <p>
                Wrong answers can teach you a lot if you take time to understand them.
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

export default Dashboard;
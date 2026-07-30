import { useEffect, useState } from "react"

export default function Planner() {
    
  const [travelPlans, setTravelPlans] = useState(() =>
    JSON.parse(localStorage.getItem("travel_plans") || "[]"),
  )
  const [planFormDraft, setPlanFormDraft] = useState(null)

  useEffect(() => {
    localStorage.setItem("travel_plans", JSON.stringify(travelPlans))

  }, [travelPlans])

  function updatePlanFormField(fieldName, newValue) {
    setPlanFormDraft((prev) => ({ ...prev, [fieldName]: newValue }))
  }

  function openBlankPlanForm()
  {
    setPlanFormDraft({
        date: "",
        todoDescription: "",
        time: "",
        place: "",
        image: ""
    })
  }

  function handlePlanFormSubmit(e)
    {
        e.preventDefault()
        const {date,todoDescription,time, place, image} = planFormDraft

        if(!image || !todoDescription.trim() || !time || !place.trim() || !date)
        {
            alert("All fields are required")
            return 
        }

        const updatedTravelPlans = [...travelPlans, {...planFormDraft, id: Date.now().toString() }]
        setTravelPlans(updatedTravelPlans)
        setPlanFormDraft(null)
    }


  return (
    <div className="planner">
      <button 
        className="fab" 
        onClick={openBlankPlanForm}
      >
        +
    </button>

      <div className="card-list">
        {travelPlans.map((plan) => (
          <div className="card-container" key={plan.id}>
                <div className="card-date">{plan.date}</div>
                <div className="card">
                    <img src={plan.image} alt={plan.todoDescription}/>
                    <div className="details">
                        <div className="details-title">{plan.todoDescription}</div>
                        <div className="details-place">{plan.place}</div>
                        <div className="details-time">{plan.time}</div>
                    </div>
                </div>
          </div>
        ))}
      </div>

      {
        planFormDraft && (
            <div className="overlay">
                <form className="modal" onSubmit={handlePlanFormSubmit}>
                      <h2>Add Plan</h2>
                    <div className="field">
                        <label>Date</label>
                        <input
                            type="date"
                            value={planFormDraft.date}
                            onChange={(e) => updatePlanFormField("date", e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label>
                            To-Do Item 
                          </label>
                            <input 
                                type="text"
                                value={planFormDraft.todoDescription}
                                onChange={(e) => updatePlanFormField("todoDescription", e.target.value)}
                            />
                    </div>
                    <div className="field">
                        <label>Time</label>
                        <input 
                            type="time"
                            value={planFormDraft.time}
                            onChange={(e) => updatePlanFormField("time", e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label>Place</label>
                        <input 
                            type="text"
                            value={planFormDraft.place}
                            onChange={(e) => updatePlanFormField("place", e.target.value)}

                        />
                    </div>
                    <div className="field">
                        <label>Image</label>
                        <input 
                            type="text"
                            value={planFormDraft.image}
                            onChange={(e) => updatePlanFormField("image", e.target.value)}
                        />
                    </div>
                   <div className="actions">
                     <button type="button" className="btn" onClick={() => setPlanFormDraft(null)}>Cancel</button>
                     <button type="submit" className="btn btn-sub">Save</button>
                   </div>
                </form>

            </div>
        )
      }
    </div>
  )
}

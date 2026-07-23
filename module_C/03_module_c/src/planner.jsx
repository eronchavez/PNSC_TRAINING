import React, { useState, useEffect, useRef } from "react"

export default function Planner() {
  const [plans, setPlans] = useState(() => JSON.parse(localStorage.getItem("travel_plans") || "[]"))
  const [form, setForm] = useState(() => JSON.parse(localStorage.getItem("travel_plan_form") || "null"))
  const hasScrolledRef = useRef(false)

  useEffect(() => {
    localStorage.setItem("travel_plans", JSON.stringify(plans))
  }, [plans])

  useEffect(() => {
    localStorage.setItem("travel_plan_form", JSON.stringify(form))
  }, [form])

  
  const sortedPlans = [...plans].sort((planA, planB) => {
    const dateA = planA.isMulti ? planA.startDate : planA.date
    const dateB = planB.isMulti ? planB.startDate : planB.date
    return dateA.localeCompare(dateB) || planA.time.localeCompare(planB.time)
  })

 
  useEffect(() => {
    if (plans.length > 0 && !hasScrolledRef.current) {
      const localTimeOffset = new Date().getTimezoneOffset() * 60000
      const todayISOString = new Date(Date.now() - localTimeOffset).toISOString().slice(0, 10)
      
      const earliestPlan = sortedPlans.find((plan) => {
        const planCompareDate = plan.isMulti ? plan.endDate : plan.date
        return planCompareDate >= todayISOString
      })

      if (earliestPlan) {
        hasScrolledRef.current = true
        setTimeout(() => {
          const element = document.getElementById(`card-${earliestPlan.id}`)
          element?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 150)
      }
    }
  }, [plans])

  const updateFormField = (fieldName, fieldValue) => {
    setForm((prevForm) => ({ ...prevForm, [fieldName]: fieldValue }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => updateFormField("image", reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { isMulti, date, startDate, endDate, todo, time, place, image } = form

    if (!image || !todo.trim() || !time || !place.trim() || (isMulti ? (!startDate || !endDate) : !date)) {
      alert("All fields are required!")
      return
    }
    if (isMulti && startDate > endDate) {
      alert("End date cannot be earlier than start date.")
      return
    }

    const updatedPlans = form.id
      ? plans.map((plan) => (plan.id === form.id ? form : plan))
      : [...plans, { ...form, id: Date.now().toString() }]

    setPlans(updatedPlans)
    setForm(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const parts = dateString.split("-")
    const localDate = new Date(parts[0], parts[1] - 1, parts[2])
    return localDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="planner">
      
      <button
        className="fab"
        onClick={() =>
          setForm({ id: "", isMulti: false, date: "", startDate: "", endDate: "", todo: "", time: "", place: "", image: "" })
        }
      >
        +
      </button>

   
      <div className="card-list">
        {sortedPlans.map((plan) => (
          <div className="card-container" id={`card-${plan.id}`} key={plan.id}>
            <div className="card-date">
              {plan.isMulti ? `${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}` : formatDate(plan.date)}
            </div>
            
            <div className="card">
              <img src={plan.image} alt={plan.todo} />
              
              <div className="details">
                <div className="details-text">
                  <div className="details-title">{plan.todo}</div>
                  <div className="details-place">{plan.place}</div>
                  <div className="details-time">{plan.time}</div>
                </div>
                <button className="edit-btn" onClick={() => setForm({ ...plan })}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      {form && (
        <div className="overlay">
          <form className="modal" onSubmit={handleSubmit}>
            <h3>{form.id ? "Edit Plan" : "Add Plan"}</h3>
            
            <div className="toggle">
              <button type="button" className={!form.isMulti ? "active" : ""} onClick={() => updateFormField("isMulti", false)}>Single Day</button>
              <button type="button" className={form.isMulti ? "active" : ""} onClick={() => updateFormField("isMulti", true)}>Multiple Days</button>
            </div>

            {!form.isMulti ? (
              <div className="field">
                <label>Date</label>
                <input type="date" value={form.date} onChange={(event) => updateFormField("date", event.target.value)} />
              </div>
            ) : (
              <div className="row">
                <div className="field" style={{ flex: 1 }}>
                  <label>Start Date</label>
                  <input type="date" value={form.startDate} onChange={(event) => updateFormField("startDate", event.target.value)} />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label>End Date</label>
                  <input type="date" value={form.endDate} onChange={(event) => updateFormField("endDate", event.target.value)} />
                </div>
              </div>
            )}

            <div className="field">
              <label>To-Do Item</label>
              <input type="text" value={form.todo} onChange={(event) => updateFormField("todo", event.target.value)} />
            </div>
            
            <div className="field">
              <label>Time</label>
              <input type="time" value={form.time} onChange={(event) => updateFormField("time", event.target.value)} />
            </div>
            
            <div className="field">
              <label>Place</label>
              <input type="text" value={form.place} onChange={(event) => updateFormField("place", event.target.value)} />
            </div>
            
            <div className="field">
              <label>Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {form.image && (
                <img src={form.image} alt="" className="img-preview" />
              )}
            </div>

            <div className="actions">
              <button type="button" className="btn" onClick={() => setForm(null)}>Cancel</button>
              <button type="submit" className="btn btn-sub">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
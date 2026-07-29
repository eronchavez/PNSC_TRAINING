import { useState } from "react"



export default function Planner()
{
    const [showModal, setShowModal] = useState(false)

    const onClose = () => {
        setShowModal(false)
    }
    return (
        <>
            <button onClick={() => setShowModal(true)} id="planner-btn">
                +
            </button>

           {
                showModal === true && 
                     <div className="modal">
                        <form action="">
                            <label>Single Date
                                <input type="date" name="date"/>
                            </label>
                            <label>Multiple Date
                                <input type="datetime-local" name="multiple-date"/>
                            </label>
                            
                            <label>Image
                                <input type="file" name="image"/>
                            </label>
                            <label>To do
                                <input type="text" name="to-do"/>
                            </label>
                            <label>
                                Time
                                <input type="time" />
                            </label>
                            
                            

                            
                            
                        </form>
                        <button onClick={onClose}>Close</button>
                    </div>
           }
        </>
    )
}
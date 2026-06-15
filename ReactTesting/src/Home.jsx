import { useState } from "react"
import {  useNavigate } from "react-router"


function Home()
{
    const [count, setCount] = useState(1)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    function handleSubmit(e)
    {
        e.preventDefault();
         console.log(formData)
       
    }

    function handleChange(e)
    {
        const {name,value} = e.target
        setFormData({
            ...formData,
            [name] : value,
        })
    }

    return ( 
      <div>
        <h1>Home</h1>
        {/* <p>{count}</p>
        <button onClick={() => setCount(count - 1)}>Click me</button> */}

       <form onSubmit={handleSubmit}>

            <input type="text" value={formData.name} onChange={handleChange} name="name"/>

            <input type="email" value={formData.email} onChange={handleChange} name="email"/>
            {errors.email && <p style={{color:"red"}}>{errors.email}</p>}
            
            <input type="password" value={formData.password} onChange={handleChange} name="password"/>
            {errors.password && <p style={{color:"red"}}>{errors.password}</p>}

            <input type="submit" value="Register"/>
            
       </form>
      </div>    
    );
}

export default Home
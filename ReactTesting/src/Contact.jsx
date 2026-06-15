import {  useState } from "react-router"

function Contact()
{

    const [inputData, setData] = useState({
        name: "",
        username: "",
        age: 0,
    })

    function handleSubmit(e)
    {
        e.preventDefault();
        console.log(inputData);
    }

    function handleChange(e)
    {
        const {name, value} = e.target
        setData({
            ...inputData,
            [name] : value,

        })
    }
    return (
        <div>
            <h1>Contact</h1>
            <form onSubmit={handleSubmit}>

                <input type="text" value={inputData.name} onChange={handleChange}/>
                
            </form>
        </div>
        

    );
}

export default Contact
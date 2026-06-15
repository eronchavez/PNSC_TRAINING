import { useEffect, useState } from "react";


function Contact()
{
    const [posts, setPost] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")


    async function fetchPosts(){
        try {
            // const userId = new URLSearchParams(window.location.search).get('userId')

            const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            })
            const data = await response.json()
            console.log(data)
            setPost(data)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false);
            
        }
    }

    async function addPost(e){
        e.preventDefault()

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    body: body,
                    userId: 1,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            })
            const data = await response.json()
            setSuccessMsg("Post successfully created.")
        } catch (error) {
            setError(error.message)
        }
    }

    useEffect(() => {
        
        fetchPosts()
    }, [])

    if(loading) {
        return <p>Loading...</p>
    }
    if(error) {
        return <p>Error: {error}</p>
    }

    return (
        <>
            {/* <h1>{posts.map((post) => post.title)}</h1> */}

            <form action="POST" onSubmit={addPost}>

                <label htmlFor="title" >Title: </label>
                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <br /> <br />
                <label htmlFor="body">Body: </label>
                <textarea name="body" id="body" value={body}  onChange={(e) => setBody(e.target.value)}/>

                <input type="submit" /> 
                

            </form>

            <p>{posts.map((post) => post.title)}</p>

            {successMsg && <p>{successMsg}</p>}
        </>
    );
}

export default Contact
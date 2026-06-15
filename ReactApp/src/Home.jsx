import {Routes,Route,Link,useNavigate} from 'react-router';

function Home()
{
    const navigate = useNavigate();
    return (
        <div>
            <h1>Home</h1>
            <button onClick={ () => navigate('/contact')}>Click</button>
            <button onClick={() => navigate(-1)}>Back Button</button>
            
        </div>
    );
}

export default Home
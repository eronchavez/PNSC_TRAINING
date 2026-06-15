import Test from "./Test";
function WelcomeMessage({message})
{
    return (
        <div>
        
            <p>{message.name} {message.greeting}</p>
        
            <Test></Test>
        </div>
    );
}


export default WelcomeMessage
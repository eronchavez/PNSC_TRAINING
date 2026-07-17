
let currentNumber = 0;

function counter()
{
    const number = 10000000000000000000;
    const countDisplay = document.getElementById('counter');

    if(currentNumber < number)
    {
        currentNumber++;
    }

    countDisplay.textContent = currentNumber;
}


setInterval(counter, 10);

counter();
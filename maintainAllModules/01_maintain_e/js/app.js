// markers 
const markers = document.querySelectorAll(".marker");
const attractionCards = document.querySelectorAll(".attractionCard");


markers.forEach((marker,index) => {
    const card = attractionCards[index];
    if(!card) return 

    marker.addEventListener("mouseover", () => card.classList.add("focus"));
    marker.addEventListener("mouseout", () => card.classList.remove("focus"));
})


// read loud

document.getElementById("readLoud")?.addEventListener("click", (e) => {
    e.preventDefault();

    const speech = new SpeechSynthesisUtterance(
        "Contact: 04 72 10 30 30 Address: Mairie de Lyon, 69205 Lyon cedex 01" 
    );
    speech.lang = "fr-FR";
    window.speechSynthesis.speak(speech);
});
// video 
const video = document.querySelector("video");
if(video)
{
    const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? entry.target.play() : entry.target.pause()),
        {threshold: 0.5}
    );

    observer.observe(video);

    document.addEventListener("visibilitychange", () => {
        if(document.visibilityState === "hidden") video.pause();
        else video.play();
    });
}



function CouponGame()
{
    const result = document.getElementById("result");
    const drawBtn = document.getElementById("drawBtn");
    const restart = document.getElementById("restart");

    const prizes = ["No Coupon", "10% Coupon", "100% Coupont Discount!!"];

    drawBtn.onclick = () => {
        const random = Math.floor(Math.random() * prizes.length);
        result.textContent = prizes[random];
        result.classList.add("active");
        drawBtn.disabled = true;
        restart.disabled = false;
    }

    restart.onclick = () => {
        result.textContent = "";
        result.classList.remove("active");
        drawBtn.disabled = false;
        restart.disabled = true;
    }
}



async function loadReviews()
{
    const slides = document.getElementById("reviewSlides");
    const res = await fetch("review.json");
    const {reviews} = await res.json(); 

    slides.innerHTML = reviews.map(({author, content, rating }) => `   
        <div class="reviewCard">
            <p>${"⭐".repeat(rating)}</p>
            <p>${content}</p>
            <p>${author}</p>
        </div>
    `).join("");
}

// Review
let currentReview = 0;

function updateSlider()
{
    const cards = document.querySelectorAll("#reviewSlides .reviewCard");

    cards.forEach((card,index) => {
        card.className = "reviewCard " + (
            index === currentReview ? "center" :
            index === currentReview - 1 ? "left" : 
            index === currentReview + 1 ? "right" :
            "hidden"
        );
    });

    document.getElementById("prev").disabled = currentReview === 0;
    document.getElementById("next").disabled = currentReview === cards.length - 1;
}


document.getElementById("prev").addEventListener("click", () => {
    if(currentReview > 0)
    {
        currentReview--;
        updateSlider();
    }
});


document.getElementById("next").addEventListener("click", () => {
   
    const total = document.querySelectorAll("#reviewSlides .reviewCard").length;

    if(currentReview < total - 1)
    {
        currentReview++;
        updateSlider()
    }
});



loadReviews();
CouponGame();









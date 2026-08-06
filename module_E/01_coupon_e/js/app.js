//map

const markers = document.querySelectorAll(".marker");
const attractionCards = document.querySelectorAll(".attractionCard");

markers.forEach((marker,index) => {
    const card = attractionCards[index];
    if(!card) return;

    marker.addEventListener("mouseover", () => card.classList.add("focus"));
    marker.addEventListener("mouseout", () => card.classList.remove("focus"));
});

// read it loud 
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
    const observser = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? entry.target.play() : entry.target.pause()),
        {threshold: 0.5}
    );

    observser.observe(video);

    document.addEventListener("visibilitychange", () => {
        if(document.visibilityState === "hidden") video.pause();
        else video.play();
    });
}

// Reviews 

async function loadReviews()
{
    const slides = document.getElementById("reviewSlides");
    const res = await fetch("review.json");
    const {reviews} = await res.json();

    slides.innerHTML = reviews.map(({author, content, rating}) => `
        <div class="reviewCard"> 
            <p>${"⭐".repeat(rating)}</p>
            <p>${content}</p>
            <p>${author}</p>
        </div>
    `).join("");

    updateSlide();
}

let currentReview = 0;

function updateSlide()
{
    const cards = document.querySelectorAll(".reviewCard");

    cards.forEach((card, index) => {
        card.className = "reviewCard " + (
            index === currentReview ? "center" : 
            index === currentReview - 1 ? "left" :
            index === currentReview + 1 ? "right" :
            "hidden"
        );
    });


    document.getElementById("next").disabled = currentReview === cards.length - 1;
    document.getElementById("prev").disabled = currentReview === 0;
}


document.getElementById("prev").addEventListener("click", () => {
    if(currentReview > 0)
    {
        currentReview--;
        updateSlide();
    }
});
document.getElementById("next").addEventListener("click", () => {
    const total = document.querySelectorAll(".reviewCard").length;

    if(currentReview < total - 1)
    {
        currentReview++;
        updateSlide();
    }
});



function couponGame()
{
    const result = document.getElementById("result");
    const restart = document.getElementById("restart");
    const drawBtn = document.getElementById("drawBtn");

    const prizes = ["No Coupon", "10% Coupon", "100% Coupon Discount"];

    drawBtn.onclick = () => {
        const random = Math.floor(Math.random() * prizes.length);
        result.textContent = prizes[random];

        drawBtn.disabled = true;
        restart.disabled = false;
    }

    restart.onclick = () => {
        result.textContent = ""
        drawBtn.disabled = false;
        restart.disabled = true;
    }
}
couponGame();
loadReviews();

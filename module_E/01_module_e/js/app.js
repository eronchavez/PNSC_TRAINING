// Map markers
const markers = document.querySelectorAll(".marker");
const attractionCards = document.querySelectorAll(".attractionCard");

markers.forEach((marker, index) => {
  const card = attractionCards[index];
  if (!card) return;

  marker.addEventListener("mouseover", () => card.classList.add("focus"));
  marker.addEventListener("mouseout", () => card.classList.remove("focus"));
});


// Read loud
document.getElementById("readLoud")?.addEventListener("click", (e) => {
  e.preventDefault();
  const speech = new SpeechSynthesisUtterance(
    "Contact: 04 72 10 30 30 Address: Mairie de Lyon, 69205 cedex 01"
  );
  speech.lang = "fr-FR";
  window.speechSynthesis.speak(speech);
});


// Video: play when in view, pause when scrolled away or tab hidden
const video = document.querySelector("video");

if (video) {
  const observer = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? entry.target.play() : entry.target.pause()),
    { threshold: 0.5 }
  );
  observer.observe(video);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") video.pause();
    else video.play();
  });
}


// Coupon event
function couponGame() {
  const result = document.getElementById("result");
  const drawBtn = document.getElementById("drawBtn");
  const restart = document.getElementById("restart");

  const prizes = ["No Coupon", "10% Coupon", "100% Coupon Discount!!"];

  drawBtn.onclick = () => {
    result.textContent = prizes[Math.floor(Math.random() * prizes.length)];
    result.classList.remove("active");
    void result.offsetWidth; // restart the pop animation on repeat clicks
    result.classList.add("active");

    drawBtn.disabled = true;
    restart.disabled = false;
    restart.classList.add("highlight");
  };

  restart.onclick = () => {
    result.textContent = "";
    result.classList.remove("active");

    drawBtn.disabled = false;
    restart.disabled = true;
    restart.classList.remove("highlight");
  };
}


// Reviews slider
let currentReview = 0;

async function loadReviews() {
  const slides = document.getElementById("reviewSlides");
  if (!slides) return;

  const res = await fetch("review.json");
  const { reviews } = await res.json();

  slides.innerHTML = reviews
    .map(
      ({ rating, content, author }) => `
      <div class="reviewCard">
        <p class="reviewRating">${"⭐".repeat(rating)}</p>
        <q class="reviewContent">${content}</q>
        <p class="reviewAuthor">${author}</p>
      </div>`
    )
    .join("");

  updateReviewSlider();
}

function updateReviewSlider() {
  const cards = document.querySelectorAll("#reviewSlides .reviewCard");

  cards.forEach((card, index) => {
    card.className =
      "reviewCard " +
      (index === currentReview
        ? "center"
        : index === currentReview - 1
        ? "left"
        : index === currentReview + 1
        ? "right"
        : "hidden");
  });

  document.getElementById("prev").disabled = currentReview === 0;
  document.getElementById("next").disabled = currentReview === cards.length - 1;
}

document.getElementById("prev")?.addEventListener("click", () => {
  if (currentReview > 0) {
    currentReview--;
    updateReviewSlider();
  }
});

document.getElementById("next")?.addEventListener("click", () => {
  const total = document.querySelectorAll("#reviewSlides .reviewCard").length;
  if (currentReview < total - 1) {
    currentReview++;
    updateReviewSlider();
  }
});


(async function init() {
  await loadReviews();
  couponGame();
})();
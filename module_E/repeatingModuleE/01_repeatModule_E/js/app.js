// markers
const markers = document.querySelectorAll(".marker");
const attractionCards = document.querySelectorAll(".attractionCard");

markers.forEach((marker,index) => {
    const card = attractionCards[index];
    if(!card) return;
    
    marker.addEventListener("mouseover", () => card.classList.add("focus"));
    marker.addEventListener("mouseout", () => card.classList.remove("focus"));
})

// Read Loud 
document.getElementById("readLoud")?.addEventListener("click", (e) => {
    const speech = new SpeechSynthesisUtterance(
        "Contact: 04 72 10 30 30 Address: Mairie de Lyon, 69205 Lyon cedex 01"
    );
    speech.lang = "fr-FR";
    window.speechSynthesis.speak(speech);
});

// Video
const video = document.querySelector("video");

if(video)
{
    const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? entry.target.play() : entry.target.pause()),
        {threshold: 0.5}
    );

    observer.observe(video)

    document.addEventListener("visibilitychange", () => {
        if(document.visibilityState === "hidden") video.pause();
        else video.play();
    });
}
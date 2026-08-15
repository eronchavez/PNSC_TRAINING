const MAX_LENGTH = 120;
const WARNING_AT = 20;

const composer = document.querySelector(".composer");
const message = document.querySelector("#message");
const counter = document.querySelector("#counter");
const progress = document.querySelector(".budget");
const bar = progress.querySelector("span");

function updateCounter() {
    const used = message.value.length;
    const remaining = MAX_LENGTH - used;

    counter.value = `${remaining} remaining`;
    counter.textContent = `${remaining} remaining`;
    progress.setAttribute("aria-valuenow", String(used));
    progress.setAttribute("aria-valuetext", `${used} of ${MAX_LENGTH} characters used`);
    bar.style.width = `${(used / MAX_LENGTH) * 100}%`;

    composer.classList.toggle("is-warning", remaining <= WARNING_AT && remaining > 0);
    composer.classList.toggle("is-limit", remaining === 0);
}

message.addEventListener("input", updateCounter);
updateCounter();

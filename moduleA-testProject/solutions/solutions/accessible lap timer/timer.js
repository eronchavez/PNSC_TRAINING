"use strict";

const display = document.querySelector("#display");
const stateLabel = document.querySelector("#state");
const toggleButton = document.querySelector("#toggle");
const lapButton = document.querySelector("#lap");
const resetButton = document.querySelector("#reset");
const lapList = document.querySelector("#lap-list");
const lapCount = document.querySelector("#lap-count");

let running = false;
let startedAt = 0;
let accumulatedMilliseconds = 0;
let animationFrame = null;
const laps = [];

function elapsedAt(timestamp = performance.now()) {
    return accumulatedMilliseconds + (running ? timestamp - startedAt : 0);
}

function formatTime(milliseconds) {
    const hundredths = Math.floor(milliseconds / 10) % 100;
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 60000);

    return [minutes, seconds, hundredths]
        .map((value) => String(value).padStart(2, "0"))
        .join(":")
        .replace(/:(\d{2})$/, ".$1");
}

function paint(timestamp) {
    display.textContent = formatTime(elapsedAt(timestamp));

    if (running) {
        animationFrame = requestAnimationFrame(paint);
    }
}

function renderControls() {
    toggleButton.textContent = running
        ? "Pause"
        : accumulatedMilliseconds > 0
            ? "Resume"
            : "Start";
    lapButton.disabled = !running;
    resetButton.disabled = !running && accumulatedMilliseconds === 0 && laps.length === 0;
    stateLabel.textContent = running
        ? "Running"
        : accumulatedMilliseconds > 0
            ? "Paused"
            : "Ready";
    stateLabel.classList.toggle("running", running);
}

function toggleTimer() {
    const now = performance.now();

    if (running) {
        accumulatedMilliseconds = elapsedAt(now);
        running = false;
        cancelAnimationFrame(animationFrame);
        display.textContent = formatTime(accumulatedMilliseconds);
    } else {
        startedAt = now;
        running = true;
        animationFrame = requestAnimationFrame(paint);
    }

    renderControls();
}

function renderLaps() {
    lapCount.textContent = `${laps.length} ${laps.length === 1 ? "lap" : "laps"}`;

    if (laps.length === 0) {
        lapList.innerHTML = '<li class="empty">No laps recorded yet.</li>';
        return;
    }

    let fastest = null;
    let slowest = null;

    if (laps.length >= 2) {
        fastest = Math.min(...laps.map((lap) => lap.split));
        slowest = Math.max(...laps.map((lap) => lap.split));
    }

    lapList.innerHTML = [...laps]
        .reverse()
        .map((lap) => {
            const isFastest = fastest !== null && lap.split === fastest;
            const isSlowest = slowest !== null && lap.split === slowest;
            const classes = [isFastest ? "fastest" : "", isSlowest ? "slowest" : ""]
                .filter(Boolean)
                .join(" ");
            const tags = [
                isFastest ? '<small class="tag fast">Fastest</small>' : "",
                isSlowest ? '<small class="tag slow">Slowest</small>' : "",
            ].join("");

            return `<li class="${classes}">
                <span class="lap-label">Lap ${lap.number}${tags}</span>
                <span>${formatTime(lap.total)}</span>
                <span>+${formatTime(lap.split)}</span>
            </li>`;
        })
        .join("");
}

function recordLap() {
    if (!running) {
        return;
    }

    const total = elapsedAt();
    const previousTotal = laps.length > 0 ? laps.at(-1).total : 0;

    laps.push({
        number: laps.length + 1,
        total,
        split: total - previousTotal,
    });
    renderLaps();
}

function resetTimer() {
    running = false;
    cancelAnimationFrame(animationFrame);
    accumulatedMilliseconds = 0;
    startedAt = 0;
    laps.length = 0;
    display.textContent = "00:00.00";
    renderLaps();
    renderControls();
}

function isEditable(element) {
    return element.matches("input, textarea, select, [contenteditable='true']");
}

toggleButton.addEventListener("click", toggleTimer);
lapButton.addEventListener("click", recordLap);
resetButton.addEventListener("click", resetTimer);

document.addEventListener("keydown", (event) => {
    if (isEditable(event.target) || event.repeat) {
        return;
    }

    if (event.code === "Space") {
        event.preventDefault();
        toggleTimer();
    } else if (event.key.toLowerCase() === "l") {
        recordLap();
    } else if (event.key.toLowerCase() === "r") {
        resetTimer();
    }
});

renderControls();
renderLaps();

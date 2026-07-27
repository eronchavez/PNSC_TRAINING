"use strict";

const passwordInput = document.querySelector("#password");
const meter = document.querySelector("#strength-meter");
const meterFill = document.querySelector("#meter-fill");
const strengthLabel = document.querySelector("#strength-label");
const togglePassword = document.querySelector("#toggle-password");

const labels = ["Weak", "Weak", "Fair", "Good", "Strong", "Excellent"];

const tests = {
    length: (value) => value.length >= 10,
    upper: (value) => /[A-Z]/.test(value),
    lower: (value) => /[a-z]/.test(value),
    digit: (value) => /\d/.test(value),
    special: (value) => /[^A-Za-z0-9]/.test(value),
};

function updateStrength() {
    const value = passwordInput.value;
    let score = 0;

    Object.entries(tests).forEach(([rule, test]) => {
        const met = test(value);
        const item = document.querySelector(`[data-rule="${rule}"]`);

        item.classList.toggle("met", met);
        score += Number(met);
    });

    meterFill.style.width = `${score * 20}%`;
    meterFill.className = `meter-fill score-${score}`;
    strengthLabel.textContent = labels[score];
    meter.setAttribute("aria-valuenow", String(score));
    meter.setAttribute("aria-valuetext", labels[score]);
}

passwordInput.addEventListener("input", updateStrength);

togglePassword.addEventListener("click", () => {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    togglePassword.textContent = isVisible ? "Show" : "Hide";
    togglePassword.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
    togglePassword.setAttribute("aria-pressed", String(!isVisible));
    passwordInput.focus();
});

updateStrength();

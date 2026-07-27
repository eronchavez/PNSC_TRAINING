"use strict";

const form = document.querySelector("#bracket-form");
const input = document.querySelector("#brackets");
const resultValue = document.querySelector("#result strong");
const error = document.querySelector("#error");
const sampleResults = document.querySelector("#sample-results");

const samples = [
    ["([])", 0],
    ["([)]", 2],
    ["{{[", 3],
    ["())", 1],
    ["", 0],
];

function calculate() {
    if (!/^[()[\]{}]*$/.test(input.value)) {
        error.textContent = "Use bracket characters only: ( ) [ ] { }";
        return;
    }

    error.textContent = "";
    resultValue.textContent = String(minimumInsertions(input.value));
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
});

sampleResults.innerHTML = samples
    .map(([sample, expected]) => {
        const actual = minimumInsertions(sample);
        const display = sample === "" ? "(empty)" : sample;

        return `<tr>
            <td>${display}</td>
            <td>${expected}</td>
            <td class="${actual === expected ? "pass" : ""}">${actual === expected ? "Pass" : `Fail: ${actual}`}</td>
        </tr>`;
    })
    .join("");

calculate();

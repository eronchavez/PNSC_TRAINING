const cases = [
    { readings: [8, 2, 4, 7], limit: 4, expected: 2 },
    { readings: [10, 1, 2, 4, 7, 2], limit: 5, expected: 4 },
    { readings: [4, 2, 2, 2, 4, 4, 2, 2], limit: 0, expected: 3 },
    { readings: [], limit: 3, expected: 0 },
];

const form = document.querySelector("#runner-form");
const readingsInput = document.querySelector("#readings");
const limitInput = document.querySelector("#limit");
const result = document.querySelector("#result");
const testList = document.querySelector("#test-list");

function renderTests() {
    testList.replaceChildren(...cases.map(test => {
        const actual = longestStableWindow(test.readings, test.limit);
        const li = document.createElement("li");
        li.className = actual === test.expected ? "pass" : "fail";
        li.append(`${JSON.stringify(test.readings)}, ${test.limit}`);
        const status = document.createElement("strong");
        status.textContent = `${actual === test.expected ? "PASS" : "FAIL"} · ${actual}`;
        li.append(status);
        return li;
    }));
}

form.addEventListener("submit", event => {
    event.preventDefault();
    const readings = readingsInput.value.trim() === ""
        ? []
        : readingsInput.value.split(",").map(value => Number(value.trim()));
    const limit = Number(limitInput.value);

    if (readings.some(value => !Number.isFinite(value)) || !Number.isFinite(limit) || limit < 0) {
        result.textContent = "Enter finite numbers and a non-negative limit.";
        return;
    }
    result.textContent = `Result: ${longestStableWindow(readings, limit)}`;
});

renderTests();

const text = document.getElementById('message');
const counter = document.getElementById('counter');
const fill = document.querySelector('.budget span');
const budget = document.querySelector('.budget');

text.oninput = () => {
  const used = text.value.length, remaining = 120 - used;
  counter.textContent = remaining + ' remaining';
  fill.style.width = used / 120 * 100 + '%';
  budget.setAttribute('aria-valuenow', used);
  const state = remaining === 0 ? 'limit' : remaining <= 20 ? 'warn' : '';
  budget.className = 'budget ' + state;
  counter.className = state;
};


const text = document.getElementById('message');
const counter = document.getElementById('counter');
const fill = document.querySelector('.budget span');
const budget = document.querySelector('.budget');

text.oninput = () => {
    const used = text.value.length, remaining = 120 - used;
    counter.textContent = remaining + ' remaining';
    fill.style.width = used / 120 * 100 + '%';
    budget.setAttribute('aria-valuenow', used);
    const state = remaining === 0 ? 'limit' : remaining <= 20 ? "warn" : "";
    budget.className = 'budget ' + state;
    counter.className = state;
}

text.oninput = () => {
    const used = text.value.length, remaining = 120 - used;
    counter.textContent = remaining + ' remaining';
    fill.style.width = used / 120 * 100 + "%";
    budget.setAttribute('aria-valuenow', used);
    const state = remaining === 0 ? 'limit' : remaining <= 20 ? 'warn' : "";
    budget.className = 'budget ' + state;
    counter.className = state;
}


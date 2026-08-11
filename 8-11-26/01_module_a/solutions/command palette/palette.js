const commands = [
    { id: "new-file", icon: "+", label: "Create file", description: "Add a blank file to the workspace", shortcut: "N" },
    { id: "open-project", icon: "↗", label: "Open project", description: "Choose a recent project", shortcut: "O" },
    { id: "format-code", icon: "{ }", label: "Format code", description: "Format the active document", shortcut: "F" },
    { id: "toggle-theme", icon: "◐", label: "Toggle theme", description: "Switch the editor color theme", shortcut: "T" },
    { id: "run-tests", icon: "✓", label: "Run tests", description: "Execute the current test suite", shortcut: "R" },
    { id: "deploy", icon: "↑", label: "Deploy project", description: "Publish the current build", shortcut: "D" },
];

const dialog = document.querySelector("#palette");
const openButton = document.querySelector("#open-palette");
const closeButton = document.querySelector("#close-palette");
const search = document.querySelector("#command-search");
const list = document.querySelector("#command-list");
const emptyState = document.querySelector("#empty-state");
const lastAction = document.querySelector("#last-action");

let filtered = [...commands];
let activeIndex = 0;
let returnFocus = null;

function renderCommands() {
    list.replaceChildren(...filtered.map((command, index) => {
        const item = document.createElement("li");
        item.id = `command-${command.id}`;
        item.className = "command";
        item.role = "option";
        item.tabIndex = -1;
        item.dataset.index = String(index);
        item.setAttribute("aria-selected", String(index === activeIndex));

        const icon = document.createElement("span");
        icon.className = "command-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = command.icon;

        const text = document.createElement("span");
        const strong = document.createElement("strong");
        strong.textContent = command.label;
        const small = document.createElement("small");
        small.textContent = command.description;
        text.append(strong, small);

        const shortcut = document.createElement("kbd");
        shortcut.textContent = command.shortcut;
        item.append(icon, text, shortcut);
        return item;
    }));

    emptyState.hidden = filtered.length !== 0;
    search.setAttribute("aria-activedescendant", filtered.length ? `command-${filtered[activeIndex].id}` : "");
}

function openPalette() {
    returnFocus = document.activeElement;
    search.value = "";
    filtered = [...commands];
    activeIndex = 0;
    renderCommands();
    dialog.showModal();
    search.focus();
}

function closePalette() {
    dialog.close();
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
}

function moveActive(nextIndex) {
    if (!filtered.length) return;
    activeIndex = (nextIndex + filtered.length) % filtered.length;
    renderCommands();
    document.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
}

function executeActive(index = activeIndex) {
    const command = filtered[index];
    if (!command) return;
    lastAction.textContent = `Executed: ${command.label}`;
    closePalette();
}

search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    filtered = commands.filter(command =>
        `${command.label} ${command.description}`.toLowerCase().includes(query)
    );
    activeIndex = 0;
    renderCommands();
});

search.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") { event.preventDefault(); moveActive(activeIndex + 1); }
    if (event.key === "ArrowUp") { event.preventDefault(); moveActive(activeIndex - 1); }
    if (event.key === "Home") { event.preventDefault(); moveActive(0); }
    if (event.key === "End") { event.preventDefault(); moveActive(filtered.length - 1); }
    if (event.key === "Enter") { event.preventDefault(); executeActive(); }
});

list.addEventListener("mousemove", event => {
    const item = event.target.closest(".command");
    if (item) moveActive(Number(item.dataset.index));
});
list.addEventListener("click", event => {
    const item = event.target.closest(".command");
    if (item) executeActive(Number(item.dataset.index));
});

openButton.addEventListener("click", openPalette);
closeButton.addEventListener("click", closePalette);
dialog.addEventListener("cancel", event => { event.preventDefault(); closePalette(); });
dialog.addEventListener("click", event => {
    if (event.target === dialog) closePalette();
});
document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.open) closePalette(); else openPalette();
    }
});

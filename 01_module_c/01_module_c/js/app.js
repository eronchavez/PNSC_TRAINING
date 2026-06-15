const API_BASE = "http://localhost/module_c_api.php";

const state = {
    history: [],
    current: "carparks",
    userLocation: null,
    settings: {
        theme: "system",
        carparkSorting: "alphabetical"
    },
    pinnedCarparks: [], // Array of pinned carpark names
    focusedCarpark: null, // Name of the currently focused carpark (if any)
    events: [],
    eventFilters: {
        beginningDate: '',
        endingDate: ''
    },
    planner: {
        plans: [],
        ui: {
            mode: "list",  // "list" | "create" | "edit"
            editingId: null
        }
    }
};

const titleMap = {
    carparks: "Carparks",
    events: "Events",
    weather: "Weather",
    planner: "Travel Planner",
    settings: "Settings"
};

const main = document.getElementById("mainContent");
const backBtn = document.getElementById("backBtn");
const viewTitle = document.getElementById("viewTitle");
const navButtons = document.querySelectorAll(".nav-btn");   

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem("settings");
    if (saved) {
        state.settings = JSON.parse(saved);
    }
    const pinnedCarparks = localStorage.getItem("pinnedCarparks");
    if (pinnedCarparks) {
        state.pinnedCarparks = JSON.parse(pinnedCarparks);
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(state.settings));
}

// Focus on a specific carpark
function focusCarpark(carparkName) {
    state.focusedCarpark = carparkName;
    state.history.push(state.current);
    renderCarparks();
    setHeader("carparks");
}

// Save pinned carparks to localStorage
function savePinnedCarparks() {
    localStorage.setItem("pinnedCarparks", JSON.stringify(state.pinnedCarparks));
}

// Toggle pin status for a carpark
function togglePin(carparkName) {
    const index = state.pinnedCarparks.indexOf(carparkName);
    if (index > -1) {
        // Unpin
        state.pinnedCarparks.splice(index, 1);
    } else {
        // Pin
        state.pinnedCarparks.push(carparkName);
    }
    savePinnedCarparks();
    renderCarparks(); // Re-render to show changes
}

function setActiveNav(view) {
    navButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.view === view);
    });
}

function setHeader(view) {
    viewTitle.textContent = titleMap[view] ?? "Carparks";
    backBtn.disabled = state.history.length === 0;
}

function pushView(view) {
    if (view === state.current) return;
    state.history.push(state.current);
    state.current = view;
    render();
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => pushView(btn.dataset.view));
});

// Go back to previous view
function goBack() {
    if (state.history.length === 0) return;
    
    // If we're in a focused carpark view, unfocus
    if (state.focusedCarpark) {
        state.focusedCarpark = null;
        state.history.pop();
        renderCarparks();
        setHeader("carparks");
        return;
    }
    
    const previousView = state.history.pop();
    state.current = previousView;
    render();
}

backBtn.addEventListener("click", goBack);

/* ----- Render different views ----- */
async function renderCarparks() {
    const res = await fetch(API_BASE + "/carparks.json");
    const data = await res.json();
    
    // Ensure user location is available
    if (!state.userLocation) {
        await getUserLocation();
    }
    
    // Convert carparks object to array
    let carparks = Object.entries(data).map(([name, details]) => ({
        name: name,
        availableSpaces: details.availableSpaces,
        latitude: details.latitude,
        longitude: details.longitude,
        location: details.location,
        distance: state.userLocation ? getDistanceFromLatLonInKm(
            state.userLocation.latitude,
            state.userLocation.longitude,
            details.latitude,
            details.longitude
        ) : 0,
        isPinned: state.pinnedCarparks.includes(name)
    }));
    
    // If a carpark is focused, show only that one
    if (state.focusedCarpark) {
        const focused = carparks.find(c => c.name === state.focusedCarpark);
        if (focused) {
            main.innerHTML = `
                <div class="carpark-card focused">
                    <h2>${focused.name}</h2>
                    <p>Available Spaces: ${focused.availableSpaces}</p>
                    <p>Distance: ${focused.distance.toFixed(2)} km</p>
                </div>
            `;
        }
        return;
    }

    // Separate pinned and unpinned carparks
    const pinnedCarparks = carparks.filter(c => c.isPinned);
    const unpinnedCarparks = carparks.filter(c => !c.isPinned);
    
    // Sort unpinned carparks based on settings
    if (state.settings.carparkSorting === "alphabetical") {
        unpinnedCarparks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.settings.carparkSorting === "distance") {
        unpinnedCarparks.sort((a, b) => a.distance - b.distance);
    }
    
    // Sort pinned carparks the same way
    if (state.settings.carparkSorting === "alphabetical") {
        pinnedCarparks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.settings.carparkSorting === "distance") {
        pinnedCarparks.sort((a, b) => a.distance - b.distance);
    }
    
    // Combine pinned first, then unpinned
    const sortedCarparks = [...pinnedCarparks, ...unpinnedCarparks];
    
    main.innerHTML = `
        ${sortedCarparks.map(c => `
            <div class="carpark-card ${c.isPinned ? 'pinned' : ''}" data-carpark="${c.name}">
                <h2>${c.name}</h2>
                <p>Available Spaces: ${c.availableSpaces}</p>
                <p>Location: ${c.location}</p>
                <p>Distance: ${c.distance.toFixed(2)} km</p>
                <a href="#" class="pin-btn" data-carpark="${c.name}">
                    ${c.isPinned ? 'Unpin' : 'Pin to Top'}
                </a>
            </div>
        `).join("")}
    `;
    
    // Add event listeners for pin buttons
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const carparkName = e.target.dataset.carpark;
            togglePin(carparkName);
        });
    });

    // Add event listeners for carpark cards to focus
    document.querySelectorAll('.carpark-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't focus if clicking the pin button
            if (e.target.classList.contains('pin-btn')) return;
            const carparkName = card.dataset.carpark;
            focusCarpark(carparkName);
        });
    });
}

async function renderEvents() {
    const res = await fetch(API_BASE + "/events.json");
    const data = await res.json();
    state.events = data.events;

    // Get current filter values from inputs (if they exist)
    // const beginningDate = document.querySelector('input[name="beginning_date"]')?.value || '';
    // const endingDate = document.querySelector('input[name="ending_date"]')?.value || '';
    const beginningDate = state.eventFilters.beginningDate;
    const endingDate = state.eventFilters.endingDate;

    // Filter events based on date range
    let filteredEvents = state.events;
    if (beginningDate || endingDate) {
        filteredEvents = state.events.filter(event => {
            const eventDate = new Date(event.date);
            const beginDate = beginningDate ? new Date(beginningDate) : null;
            const endDate = endingDate ? new Date(endingDate) : null;
            
            if (beginDate && endDate) {
                return eventDate >= beginDate && eventDate <= endDate;
            } else if (beginDate) {
                return eventDate >= beginDate;
            } else if (endDate) {
                return eventDate <= endDate;
            }
            return true;
        });
    }

    //Display filtered events
    main.innerHTML = `
        <div>
            <p>Start Date: <input type="date" name="beginning_date" value="${state.eventFilters.beginningDate}"></p>
            <p>End Date: <input type="date" name="ending_date" value="${state.eventFilters.endingDate}"></p>
        </div>
        ${filteredEvents.length > 0 ? 
            filteredEvents.map(event => `
                <div class="events-card">
                    <h3>${event.title}</h3>
                    <img src="http://localhost${event.image}" alt="${event.title}" style="max-width: 100%; width:100%; height: auto;">
                    <p>${event.date}</p>
                </div> 
            `).join("") : 
            '<p>No events found for the selected date range.</p>'
        }
    `;

    // Add event listeners to date inputs
    document.querySelector('input[name="beginning_date"]').addEventListener('change', (e) => {
        state.eventFilters.beginningDate = e.target.value;
        renderEvents();
    });
    document.querySelector('input[name="ending_date"]').addEventListener('change', (e) => {
        state.eventFilters.endingDate = e.target.value;
        renderEvents();
    });
}

async function renderWeather() {
    const res = await fetch(API_BASE + "/weather.json");
    const data = await res.json();

    const weatherHTML = await Promise.all(
        data.map(async weather => {
            const svgRes = await fetch(`images/${weather.status}.svg`);
            const svgText = await svgRes.text();

            return `
                <div class="weather-card">
                    <p>${weather.date}</p>
                    <div class="weather-icon">
                        ${svgText}
                    </div>
                    <p>${weather.lower_temperature} - ${weather.upper_temperature}°C</p>
                    <p>${weather.status}</p>
                </div>
            `;
        })
    );

    main.innerHTML = `
        <div id="weatherContainer">
            ${weatherHTML.join("")}
        </div>
    `;
}

function renderPlanner() {
    const { mode, editingId } = state.planner.ui;
    const sortedPlans = getSortedPlans();

    const editingPlan = editingId
        ? state.planner.plans.find(plan => plan.id === editingId)
        : null;

    if (mode === "create" || mode === "edit") {
        main.innerHTML = `
            <section class="planner">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
                    <h2>${mode === "create" ? "Add Travel Plan" : "Edit Travel Plan"}</h2>
                    <button id="plannerCancelBtn" type="button">Cancel</button>
                </div>

                <form id="plannerForm">
                    <p>
                        <label>
                            <input type="radio" name="planType" value="single" ${!editingPlan || editingPlan.type === "single" ? "checked" : ""}>
                            Single Day
                        </label>
                        <label style="margin-left:12px;">
                            <input type="radio" name="planType" value="multi" ${editingPlan && editingPlan.type === "multi" ? "checked" : ""}>
                            Multiple Days
                        </label>
                    </p>

                    <p>
                        Start Date:
                        <input type="date" name="startDate" value="${editingPlan?.startDate || ""}" required>
                    </p>

                    <p id="plannerEndDateWrap" style="${editingPlan?.type === "multi" ? "" : "display:none;"}">
                        End Date:
                        <input type="date" name="endDate" value="${editingPlan?.endDate || ""}">
                    </p>

                    <p>
                        Time:
                        <input type="time" name="time" value="${editingPlan?.time || ""}" required>
                    </p>

                    <p>
                        Place:
                        <input type="text" name="place" value="${editingPlan?.place || ""}" required>
                    </p>

                    <p>
                        To-do:
                        <input type="text" name="todo" value="${editingPlan?.todo || ""}" required>
                    </p>

                    <p>
                        Image:
                        <input type="file" name="imageFile" accept="image/*" ${mode === "create" ? "required" : ""}>
                    </p>

                    ${
                        editingPlan?.image
                            ? `<p><img src="${editingPlan.image}" alt="${editingPlan.todo}" style="max-width:100%; height:auto;"></p>`
                            : ""
                    }

                    <button type="submit">${mode === "create" ? "Save Plan" : "Update Plan"}</button>
                </form>
            </section>
        `;

        const plannerForm = document.getElementById("plannerForm");
        const cancelBtn = document.getElementById("plannerCancelBtn");
        const planTypeInputs = document.querySelectorAll('input[name="planType"]');
        const endDateWrap = document.getElementById("plannerEndDateWrap");

        planTypeInputs.forEach(input => {
            input.addEventListener("change", (e) => {
                endDateWrap.style.display = e.target.value === "multi" ? "block" : "none";
            });
        });

        cancelBtn.addEventListener("click", () => {
            state.planner.ui = {
                mode: "list",
                editingId: null
            };
            savePlanner();
            renderPlanner();
        });

        plannerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(plannerForm);

            const type = formData.get("planType");
            const startDate = formData.get("startDate").trim();
            const endDate = formData.get("endDate").trim();
            const time = formData.get("time").trim();
            const place = formData.get("place").trim();
            const todo = formData.get("todo").trim();
            const imageFile = formData.get("imageFile");

            if (!startDate || !time || !place || !todo) {
                alert("Please complete all required fields.");
                return;
            }

            if (type === "multi" && !endDate) {
                alert("Please provide the end date for a multi-day plan.");
                return;
            }

            if (type === "multi" && endDate < startDate) {
                alert("End date cannot be earlier than start date.");
                return;
            }

            let imageValue = editingPlan?.image || "";

            if (imageFile && imageFile.size > 0) {
                imageValue = await fileToBase64(imageFile);
            }

            if (!imageValue) {
                alert("Please provide an image.");
                return;
            }

            if (mode === "create") {
                state.planner.plans.push({
                    id: generatePlanId(),
                    type,
                    startDate,
                    endDate: type === "multi" ? endDate : "",
                    image: imageValue,
                    todo,
                    time,
                    place,
                    createdAt: Date.now()
                });
            } else if (mode === "edit" && editingPlan) {
                editingPlan.type = type;
                editingPlan.startDate = startDate;
                editingPlan.endDate = type === "multi" ? endDate : "";
                editingPlan.image = imageValue;
                editingPlan.todo = todo;
                editingPlan.time = time;
                editingPlan.place = place;
            }

            state.planner.plans.sort(planSorter);
            state.planner.ui = {
                mode: "list",
                editingId: null
            };

            savePlanner();
            renderPlanner();
        });

        return;
    }

    main.innerHTML = `
        <section class="planner">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; position:sticky; top:0; background:inherit; z-index:5; padding-bottom:12px;">
                <h2>Travel Planner</h2>
                <button id="plannerAddBtn" type="button" aria-label="Add travel plan">+</button>
            </div>

            <div id="plannerList">
                ${
                    sortedPlans.length
                        ? sortedPlans.map(plan => `
                            <article class="planner-card" data-plan-id="${plan.id}">
                                <p><strong>${formatPlannerDate(plan)}</strong></p>
                                <div style="display:flex; gap:12px; align-items:flex-start;">
                                    <img src="${plan.image}" alt="${plan.todo}" style="width:120px; height:90px; object-fit:cover;">
                                    <div>
                                        <p><strong>${plan.todo}</strong></p>
                                        <p>${plan.place}</p>
                                        <p>${plan.time}</p>
                                        <button class="plannerEditBtn" data-plan-id="${plan.id}" type="button">Edit</button>
                                        <button class="plannerDeleteBtn" data-plan-id="${plan.id}" type="button">Delete</button>
                                    </div>
                                </div>
                            </article>
                        `).join("")
                        : "<p>No travel plans yet.</p>"
                }
            </div>
        </section>
    `;

    document.getElementById("plannerAddBtn").addEventListener("click", () => {
        state.planner.ui = {
            mode: "create",
            editingId: null
        };
        savePlanner();
        renderPlanner();
    });

    document.querySelectorAll(".plannerEditBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            state.planner.ui = {
                mode: "edit",
                editingId: btn.dataset.planId
            };
            savePlanner();
            renderPlanner();
        });
    });

    document.querySelectorAll(".plannerDeleteBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const planId = btn.dataset.planId;
            state.planner.plans = state.planner.plans.filter(plan => plan.id !== planId);
            savePlanner();
            renderPlanner();
        });
    });

    scrollPlannerToUpcoming();
}

function scrollPlannerToUpcoming() {
    const sortedPlans = getSortedPlans();
    const today = getTodayString();

    const targetPlan = sortedPlans.find(plan => plan.startDate >= today);

    if (!targetPlan) return;

    requestAnimationFrame(() => {
        const el = document.querySelector(`[data-plan-id="${targetPlan.id}"]`);
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

function generatePlanId() {
    return "plan_" + Date.now();
}

function planSorter(a, b) {
    const aDateTime = new Date(`${a.startDate}T${a.time || "00:00"}`);
    const bDateTime = new Date(`${b.startDate}T${b.time || "00:00"}`);
    return aDateTime - bDateTime;
}

function getSortedPlans() {
    return [...state.planner.plans].sort(planSorter);
}

function formatPlannerDate(plan) {
    if (plan.type === "multi" && plan.endDate) {
        return `${plan.startDate} - ${plan.endDate}`;
    }
    return plan.startDate;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function loadPlanner() {
    const savedPlans = localStorage.getItem("plannerPlans");
    const savedPlannerUI = localStorage.getItem("plannerUI");

    if (savedPlans) {
        state.planner.plans = JSON.parse(savedPlans);
    }

    if (savedPlannerUI) {
        state.planner.ui = JSON.parse(savedPlannerUI);
    }
}

function savePlanner() {
    localStorage.setItem("plannerPlans", JSON.stringify(state.planner.plans));
    localStorage.setItem("plannerUI", JSON.stringify(state.planner.ui));
}

function applyTheme() {
    const theme = state.settings.theme;
    
    if (theme === "dark") {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
    } else if (theme === "light") {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
    } else if (theme === "system") {
        // Use system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
            document.body.classList.add("dark-theme");
            document.body.classList.remove("light-theme");
        } else {
            document.body.classList.add("light-theme");
            document.body.classList.remove("dark-theme");
        }
    }
}

function renderSettings() {
    main.innerHTML = `
        <section class="settings">
            <h3>Theme</h3>
            <div>
                <div>
                    <input type="radio" name="theme" value="dark" ${state.settings.theme === "dark" ? "checked" : ""}> Dark
                </div>
                <div>
                    <input type="radio" name="theme" value="light" ${state.settings.theme === "light" ? "checked" : ""}> Light
                </div>
                <div>
                    <input type="radio" name="theme" value="system" ${state.settings.theme === "system" ? "checked" : ""}> System
                </div>
            </div>
        </section>
        <hr>
        <section class="settings">
            <h3>Carpark Sorting</h3>
            <div>
                <div>
                    <input type="radio" name="carparkSorting" value="alphabetical" ${state.settings.carparkSorting === "alphabetical" ? "checked" : ""}> Alphabetical
                </div>
                <div>
                    <input type="radio" name="carparkSorting" value="distance" ${state.settings.carparkSorting === "distance" ? "checked" : ""}> Distance
                </div>
            </div>
        </section>
    `;

    // event listener for theme settings change
    document.querySelectorAll('input[name="theme"]').forEach(input => {
        input.addEventListener("change", (e) => {
            state.settings.theme = e.target.value;
            saveSettings();
            applyTheme(); // Apply the theme immediately
        });
    });
    // event listener for change in carpark sorting
    document.querySelectorAll('input[name="carparkSorting"]').forEach(input => {
        input.addEventListener("click", (e) => {
            console.log("Carpark sorting changed to:", e.target.value);
            state.settings.carparkSorting = e.target.value;
            saveSettings();
        });
    });
}

// Get user location from URL params or geolocation
function getUserLocation() {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("latitude");
    const lon = params.get("longitude");
    
    if (lat && lon) {
        state.userLocation = {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon)
        };
        return Promise.resolve(state.userLocation);
    }
    
    // Try to get actual geolocation
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    state.userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    resolve(state.userLocation);
                },
                () => {
                    // Default to Lyon city center if geolocation fails
                    state.userLocation = {
                        latitude: 45.764043,
                        longitude: 4.835659
                    };
                    resolve(state.userLocation);
                }
            );
        } else {
            // Default location
            state.userLocation = {
                latitude: 45.764043,
                longitude: 4.835659
            };
            resolve(state.userLocation);
        }
    });
}

function getDistanceFromLatLonInKm(latitude1, longitude1, latitude2, longitude2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(latitude2-latitude1);  // deg2rad below
    var dLon = deg2rad(longitude2-longitude1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(latitude1)) * Math.cos(deg2rad(latitude2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

/* ---------- Main render ---------- */

async function render() {
    setActiveNav(state.current);
    setHeader(state.current);

    // TODO: Add view-specific rendering logic here
    switch(state.current) {
        case "carparks":
            renderCarparks();
            break;
        case "events":
            renderEvents();
            break;
        case "weather":
            renderWeather();
            break;
        case "planner":
            renderPlanner();
            break;
        case "settings":
            renderSettings();
    }
}

loadSettings();
loadPlanner();
applyTheme();
getUserLocation().then(() => render());
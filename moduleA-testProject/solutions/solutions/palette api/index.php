<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Palette API</title>
    <style>
        .request-row { display: grid; grid-template-columns: 86px 1fr auto; gap: 10px; align-items: end; }
        input[type="color"] { min-height: 50px; padding: 4px; cursor: pointer; }
        .palette { display: grid; grid-template-columns: repeat(5, 1fr); min-height: 270px; margin-top: 18px; overflow: hidden; border: 1px solid var(--line); border-radius: 14px; }
        .swatch { display: flex; flex-direction: column; justify-content: space-between; padding: 18px 12px; }
        .swatch span { font-size: .7rem; font-weight: 800; text-transform: uppercase; }
        .swatch code { font-size: .77rem; font-weight: 800; }
        .json { margin-top: 18px; padding: 18px; overflow: auto; color: #cfeaf0; background: #040b10; border: 1px solid var(--line); border-radius: 10px; font: .78rem/1.55 ui-monospace, monospace; }
        .endpoint { color: var(--cyan); overflow-wrap: anywhere; }
    </style>
</head>
<body>
    <main>
        <h1>Palette API</h1>
        <p class="lead">Generate five deterministic RGB shades. Each swatch selects black or white text using WCAG relative luminance and contrast ratios.</p>

        <section class="panel">
            <form id="palette-form">
                <div class="request-row">
                    <div>
                        <label for="picker">Picker</label>
                        <input id="picker" type="color" value="#336699">
                    </div>
                    <div>
                        <label for="hex">Hex color</label>
                        <input id="hex" value="#336699" pattern="#?[0-9A-Fa-f]{6}" autocomplete="off">
                    </div>
                    <button type="submit">Request palette</button>
                </div>
            </form>
            <p id="status" class="status" role="status"></p>
            <p>Endpoint: <a id="endpoint" class="endpoint" href="palette/?color=%23336699">palette/?color=%23336699</a></p>
            <div id="palette" class="palette" aria-label="Generated color palette"></div>
            <pre id="json" class="json" tabindex="0"></pre>
        </section>
    </main>
    <script>
        const form = document.querySelector("#palette-form");
        const picker = document.querySelector("#picker");
        const hex = document.querySelector("#hex");
        const status = document.querySelector("#status");
        const endpoint = document.querySelector("#endpoint");
        const palette = document.querySelector("#palette");
        const json = document.querySelector("#json");

        async function loadPalette() {
            status.textContent = "Loading…";
            status.className = "status";
            const url = `palette/?color=${encodeURIComponent(hex.value)}`;
            endpoint.href = url;
            endpoint.textContent = url;

            try {
                const response = await fetch(url, { headers: { Accept: "application/json" } });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Unable to generate palette.");
                }

                palette.innerHTML = data.shades.map((shade) => `
                    <div class="swatch" style="background:${shade.color};color:${shade.text}">
                        <span>${shade.factor.toFixed(2)}×</span>
                        <code>${shade.color}<br>text ${shade.text}</code>
                    </div>
                `).join("");
                json.textContent = JSON.stringify(data, null, 2);
                picker.value = data.source.toLowerCase();
                status.textContent = "HTTP 200 · application/json · five shades";
                status.className = "status success";
            } catch (error) {
                palette.innerHTML = "";
                json.textContent = "";
                status.textContent = error.message;
                status.className = "status error";
            }
        }

        picker.addEventListener("input", () => {
            hex.value = picker.value.toUpperCase();
            loadPalette();
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            loadPalette();
        });

        loadPalette();
    </script>
</body>
</html>

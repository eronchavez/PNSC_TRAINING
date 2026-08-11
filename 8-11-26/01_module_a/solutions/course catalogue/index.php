<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Simulated Course Catalogue</title>
</head>
<body>
<main class="shell">
    <h1>Simulated Course Catalogue</h1>
    <p class="lead">The endpoint behaves like a normal catalogue service, but retrieves from a fixed in-memory array on every request.</p>

    <form class="panel" id="filters">
        <div class="form-row">
            <div><label for="search">Search</label><input id="search" name="search" placeholder="PHP"></div>
            <div><label for="level">Level</label><select id="level" name="level"><option value="">All</option><option>beginner</option><option>intermediate</option><option>advanced</option></select></div>
            <div><label for="sort">Sort</label><select id="sort" name="sort"><option value="title">Title</option><option value="duration">Shortest</option><option value="-duration">Longest</option></select></div>
            <div><label for="per_page">Per page</label><input id="per_page" name="per_page" type="number" min="1" max="20" value="6"></div>
        </div>
        <input type="hidden" name="page" value="1">
        <div class="actions"><button type="submit">Request catalogue</button></div>
    </form>

    <section class="panel">
        <h2>JSON response</h2>
        <pre id="output" aria-live="polite">Submit the form to load records.</pre>
    </section>
</main>
<script>
const form = document.querySelector('#filters');
const output = document.querySelector('#output');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    output.textContent = 'Loading simulated records…';
    try {
        const response = await fetch(`api.php?${new URLSearchParams(new FormData(form))}`);
        const body = await response.json();
        output.textContent = JSON.stringify(body, null, 2);
    } catch {
        output.textContent = 'Unable to complete the request.';
    }
});
</script>
</body>
</html>

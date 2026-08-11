<?php
declare(strict_types=1);

$source = $_POST['scores'] ?? "Ada,88\nBen,74\nCora,92\nDino,88";
$rows = [];
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach (preg_split('/\R/', $source) ?: [] as $lineNumber => $line) {
        if (trim($line) === '') {
            continue;
        }

        $parts = str_getcsv($line);
        if (count($parts) !== 2) {
            $errors[] = 'Line ' . ($lineNumber + 1) . ': expected name,score.';
            continue;
        }

        $name = trim((string) $parts[0]);
        $scoreText = trim((string) $parts[1]);
        if ($name === '' || mb_strlen($name) > 60) {
            $errors[] = 'Line ' . ($lineNumber + 1) . ': name must contain 1-60 characters.';
            continue;
        }
        if (filter_var($scoreText, FILTER_VALIDATE_FLOAT) === false) {
            $errors[] = 'Line ' . ($lineNumber + 1) . ': score must be numeric.';
            continue;
        }

        $score = (float) $scoreText;
        if ($score < 0 || $score > 100) {
            $errors[] = 'Line ' . ($lineNumber + 1) . ': score must be from 0 to 100.';
            continue;
        }
        $rows[] = ['name' => $name, 'score' => $score];
    }
}

$summary = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $rows !== []) {
    $scores = array_column($rows, 'score');
    sort($scores, SORT_NUMERIC);
    $count = count($scores);
    $middle = intdiv($count, 2);
    $median = $count % 2 === 1
        ? $scores[$middle]
        : ($scores[$middle - 1] + $scores[$middle]) / 2;
    $passed = count(array_filter($scores, static fn(float $score): bool => $score >= 75));
    $highest = max($scores);
    $topNames = array_column(
        array_filter($rows, static fn(array $row): bool => $row['score'] === $highest),
        'name'
    );
    natcasesort($topNames);

    $summary = [
        'count' => $count,
        'average' => array_sum($scores) / $count,
        'median' => $median,
        'passed' => $passed,
        'pass_rate' => ($passed / $count) * 100,
        'highest' => $highest,
        'top_names' => implode(', ', $topNames),
    ];
}

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function number(float $value): string
{
    return number_format($value, 2, '.', '');
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Score Summary Report</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <main>
        <h1>Score summary</h1>
        <p class="lead">Enter one <code>name,score</code> record per line. Scores must be from 0 to 100; 75 is passing.</p>

        <section class="panel">
            <form method="post">
                <label for="scores">Records</label>
                <textarea id="scores" name="scores" required><?= h($source) ?></textarea>
                <button>Analyze scores</button>
            </form>

            <?php if ($errors !== []): ?>
                <section class="errors" aria-labelledby="error-heading">
                    <h2 id="error-heading">Rejected lines</h2>
                    <ul>
                        <?php foreach ($errors as $error): ?><li><?= h($error) ?></li><?php endforeach; ?>
                    </ul>
                </section>
            <?php endif; ?>

            <?php if ($summary !== null): ?>
                <section class="results" aria-labelledby="result-heading">
                    <h2 id="result-heading">Valid-record summary</h2>
                    <dl class="summary-grid">
                        <div><dt>Valid records</dt><dd><?= $summary['count'] ?></dd></div>
                        <div><dt>Average</dt><dd><?= number($summary['average']) ?></dd></div>
                        <div><dt>Median</dt><dd><?= number($summary['median']) ?></dd></div>
                        <div><dt>Pass rate</dt><dd><?= number($summary['pass_rate']) ?>%</dd></div>
                    </dl>
                    <p class="top-score">Highest: <strong><?= number($summary['highest']) ?></strong> — <?= h($summary['top_names']) ?></p>
                    <table>
                        <thead><tr><th>Name</th><th>Score</th><th>Result</th></tr></thead>
                        <tbody>
                        <?php foreach ($rows as $row): ?>
                            <tr>
                                <td><?= h($row['name']) ?></td>
                                <td><?= number($row['score']) ?></td>
                                <td><?= $row['score'] >= 75 ? 'Pass' : 'Fail' ?></td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </section>
            <?php endif; ?>
        </section>
    </main>
</body>
</html>

<?php
declare(strict_types=1);

$text = '';
$report = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $text = isset($_POST['text']) && is_string($_POST['text']) ? $_POST['text'] : '';
    preg_match_all('/[A-Za-z]+/', strtolower($text), $matches);
    $words = $matches[0];
    $frequencies = array_count_values($words);

    uksort($frequencies, static function (string $first, string $second) use ($frequencies): int {
        $frequencyComparison = $frequencies[$second] <=> $frequencies[$first];

        return $frequencyComparison !== 0
            ? $frequencyComparison
            : strcmp($first, $second);
    });

    $report = [
        'total' => count($words),
        'unique' => count($frequencies),
        'top' => array_slice($frequencies, 0, 5, true),
    ];
}

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Word Frequency Report</title>
</head>
<body>
    <main>
        <h1>Word Frequency Report</h1>
        <p class="lead">Words contain letters A–Z only. Case, punctuation, apostrophes, numbers, and markup are handled according to the task rules.</p>

        <form class="panel" method="post" action="">
            <label for="text">Text to analyze</label>
            <textarea id="text" name="text" required><?= escape($text) ?></textarea>
            <button type="submit">Analyze text</button>
        </form>

        <?php if ($report !== null): ?>
            <section class="panel report" aria-labelledby="report-heading">
                <h2 id="report-heading">Results</h2>
                <div class="metrics">
                    <div class="metric"><span>Total words</span><strong><?= $report['total'] ?></strong></div>
                    <div class="metric"><span>Unique words</span><strong><?= $report['unique'] ?></strong></div>
                </div>
                <h3>Five most frequent words</h3>
                <?php if ($report['top'] === []): ?>
                    <p class="empty">No words were found.</p>
                <?php else: ?>
                    <ol class="frequency-list">
                        <?php foreach ($report['top'] as $word => $count): ?>
                            <li><span><?= escape($word) ?></span><strong><?= $count ?></strong></li>
                        <?php endforeach; ?>
                    </ol>
                <?php endif; ?>
            </section>
        <?php endif; ?>
    </main>
</body>
</html>

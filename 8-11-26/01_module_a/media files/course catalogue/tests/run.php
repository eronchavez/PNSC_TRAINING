<?php
declare(strict_types=1);

require dirname(__DIR__) . '/src/CourseCatalogue.php';

function expect(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

$catalogue = new CourseCatalogue();
$result = $catalogue->search(['search' => 'PHP', 'per_page' => 2, 'page' => 1]);
expect($result['meta']['total'] === 5, 'Literal search should find five PHP courses.');
expect(count($result['data']) === 2, 'Pagination should return two records.');
expect($result['meta']['has_next'] === true, 'First page should have a next page.');

$advanced = $catalogue->search(['level' => 'advanced', 'sort' => '-duration', 'per_page' => 20]);
expect($advanced['data'][0]['title'] === 'Progressive Web App Architecture', 'Descending duration sort failed.');

try {
    $catalogue->search(['per_page' => 200]);
    throw new RuntimeException('Invalid per_page should fail.');
} catch (InvalidArgumentException $expected) {
}

echo "C8 tests passed.\n";

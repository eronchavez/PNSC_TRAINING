<?php
declare(strict_types=1);

require __DIR__ . '/src/CourseCatalogue.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

try {
    usleep(50_000); // Simulate retrieval latency without an external service.
    $response = (new CourseCatalogue())->search($_GET);
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
} catch (InvalidArgumentException $exception) {
    http_response_code(400);
    echo json_encode([
        'error' => [
            'code' => 'INVALID_QUERY',
            'message' => $exception->getMessage(),
        ],
    ], JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
}

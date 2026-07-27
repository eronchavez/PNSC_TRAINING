<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(array $payload, int $status): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function linearChannel(int $channel): float
{
    $normalized = $channel / 255;

    return $normalized <= 0.04045
        ? $normalized / 12.92
        : (($normalized + 0.055) / 1.055) ** 2.4;
}

function recommendedTextColor(int $red, int $green, int $blue): string
{
    $luminance = 0.2126 * linearChannel($red)
        + 0.7152 * linearChannel($green)
        + 0.0722 * linearChannel($blue);
    $blackContrast = ($luminance + 0.05) / 0.05;
    $whiteContrast = 1.05 / ($luminance + 0.05);

    return $blackContrast >= $whiteContrast ? '#000000' : '#FFFFFF';
}

$input = $_GET['color'] ?? null;

if (!is_string($input) || !preg_match('/^#?[0-9A-Fa-f]{6}$/', $input)) {
    respond(['error' => 'Provide color as exactly six hexadecimal digits, with an optional leading #.'], 422);
}

$hex = strtoupper(ltrim($input, '#'));
$source = '#' . $hex;
$channels = [
    hexdec(substr($hex, 0, 2)),
    hexdec(substr($hex, 2, 2)),
    hexdec(substr($hex, 4, 2)),
];
$factors = [0.50, 0.75, 1.00, 1.25, 1.50];
$shades = [];

foreach ($factors as $factor) {
    [$red, $green, $blue] = array_map(
        static fn (int $channel): int => max(0, min(255, (int) round($channel * $factor))),
        $channels
    );

    $shades[] = [
        'factor' => $factor,
        'color' => sprintf('#%02X%02X%02X', $red, $green, $blue),
        'text' => recommendedTextColor($red, $green, $blue),
    ];
}

respond(['source' => $source, 'shades' => $shades], 200);

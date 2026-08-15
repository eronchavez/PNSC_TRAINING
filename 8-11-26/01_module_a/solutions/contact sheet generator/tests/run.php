<?php
declare(strict_types=1);

if (!extension_loaded('gd')) {
    echo "SKIP: C10 requires GD.\n";
    exit(0);
}

require dirname(__DIR__) . '/src/ContactSheet.php';

function expect(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

$paths = [];
$files = [];
foreach ([[180, 90], [90, 180], [140, 140]] as $index => [$width, $height]) {
    $path = tempnam(sys_get_temp_dir(), 'sheet-test-');
    $image = imagecreatetruecolor($width, $height);
    imagefill($image, 0, 0, imagecolorallocate($image, 30 + $index * 40, 90, 160));
    imagepng($image, $path);
    imagedestroy($image);
    $paths[] = $path;
    $files[] = ['name' => "sample-{$index}.png", 'tmp_name' => $path, 'size' => filesize($path)];
}

$sheet = (new ContactSheet())->build($files);
expect(imagesx($sheet) === 1200, 'Canvas width must be 1200.');
expect(imagesy($sheet) === 310, 'One-row canvas height is incorrect.');

ob_start();
imagepng($sheet);
$bytes = (string) ob_get_clean();
expect(str_starts_with($bytes, "\x89PNG\r\n\x1a\n"), 'Output is not a PNG.');
imagedestroy($sheet);

foreach ($paths as $path) {
    unlink($path);
}

echo "C10 tests passed.\n";

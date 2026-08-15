<?php
declare(strict_types=1);

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!extension_loaded('gd')) {
            throw new RuntimeException('The GD extension is required.');
        }

        $input = $_FILES['images'] ?? null;
        if (!is_array($input) || !is_array($input['name'] ?? null)) {
            throw new InvalidArgumentException('Choose at least two images.');
        }

        $files = [];
        foreach ($input['name'] as $index => $name) {
            $uploadError = $input['error'][$index] ?? UPLOAD_ERR_NO_FILE;
            if ($uploadError !== UPLOAD_ERR_OK) {
                throw new InvalidArgumentException("Upload " . ($index + 1) . " failed with code {$uploadError}.");
            }
            $files[] = [
                'name' => $name,
                'tmp_name' => $input['tmp_name'][$index],
                'size' => $input['size'][$index],
            ];
        }

        require __DIR__ . '/src/ContactSheet.php';
        $image = (new ContactSheet())->build($files);
        header('Content-Type: image/png');
        header('Content-Disposition: inline; filename="contact-sheet.png"');
        header('Cache-Control: no-store');
        imagepng($image);
        imagedestroy($image);
        exit;
    } catch (Throwable $exception) {
        $error = $exception->getMessage();
    }
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Image Contact Sheet Generator</title>
</head>
<body>
<main class="shell">
    <h1>Image Contact Sheet Generator</h1>
    <p class="lead">Upload 2–12 JPEG or PNG files. The server composes and streams one labelled PNG without retaining the source files or output.</p>

    <?php if ($error): ?><p class="error"><?= e($error) ?></p><?php endif; ?>
    <form class="panel" method="post" enctype="multipart/form-data">
        <label for="images">Images</label>
        <input id="images" name="images[]" type="file" accept="image/png,image/jpeg" multiple required>
        <p class="muted">Maximum 3 MiB and 24 megapixels per image.</p>
        <div class="actions"><button type="submit">Generate PNG</button></div>
    </form>
</main>
</body>
</html>

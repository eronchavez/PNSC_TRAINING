<?php
declare(strict_types=1);

final class ContactSheet
{
    private const MAX_FILES = 12;
    private const MAX_FILE_BYTES = 3_145_728;
    private const MAX_PIXELS = 24_000_000;

    public function build(array $files): GdImage
    {
        if (count($files) < 2 || count($files) > self::MAX_FILES) {
            throw new InvalidArgumentException('Upload from 2 to 12 images.');
        }

        $decoded = [];
        foreach ($files as $index => $file) {
            $decoded[] = $this->decode($file, $index + 1);
        }

        $columns = 3;
        $rows = (int) ceil(count($decoded) / $columns);
        $canvasWidth = 1200;
        $margin = 30;
        $gap = 18;
        $cellWidth = (int) floor(($canvasWidth - (2 * $margin) - (($columns - 1) * $gap)) / $columns);
        $cellHeight = 250;
        $canvasHeight = (2 * $margin) + ($rows * $cellHeight) + (($rows - 1) * $gap);

        $canvas = imagecreatetruecolor($canvasWidth, $canvasHeight);
        $background = imagecolorallocate($canvas, 246, 249, 253);
        $panel = imagecolorallocate($canvas, 255, 255, 255);
        $border = imagecolorallocate($canvas, 206, 217, 230);
        $text = imagecolorallocate($canvas, 25, 43, 67);
        imagefill($canvas, 0, 0, $background);

        foreach ($decoded as $index => $item) {
            $column = $index % $columns;
            $row = intdiv($index, $columns);
            $x = $margin + ($column * ($cellWidth + $gap));
            $y = $margin + ($row * ($cellHeight + $gap));
            imagefilledrectangle($canvas, $x, $y, $x + $cellWidth, $y + $cellHeight, $panel);
            imagerectangle($canvas, $x, $y, $x + $cellWidth, $y + $cellHeight, $border);

            $targetWidth = $cellWidth - 24;
            $targetHeight = 190;
            $scale = min($targetWidth / $item['width'], $targetHeight / $item['height']);
            $width = max(1, (int) round($item['width'] * $scale));
            $height = max(1, (int) round($item['height'] * $scale));
            $imageX = $x + (int) (($cellWidth - $width) / 2);
            $imageY = $y + 12 + (int) (($targetHeight - $height) / 2);

            imagecopyresampled($canvas, $item['image'], $imageX, $imageY, 0, 0, $width, $height, $item['width'], $item['height']);
            $caption = $this->caption($item['name'], 44);
            imagestring($canvas, 4, $x + 12, $y + 215, $caption, $text);
            imagedestroy($item['image']);
        }

        return $canvas;
    }

    private function decode(array $file, int $position): array
    {
        $path = (string) ($file['tmp_name'] ?? '');
        $name = basename((string) ($file['name'] ?? "image-{$position}"));
        $size = (int) ($file['size'] ?? 0);

        if ($path === '' || !is_file($path) || $size < 1 || $size > self::MAX_FILE_BYTES) {
            throw new InvalidArgumentException("Image {$position} is missing or exceeds 3 MiB.");
        }

        $info = @getimagesize($path);
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($path);
        if (
            $info === false ||
            !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG], true) ||
            !in_array($mime, ['image/jpeg', 'image/png'], true)
        ) {
            throw new InvalidArgumentException("Image {$position} must be a decodable JPEG or PNG.");
        }
        if (($info[0] * $info[1]) > self::MAX_PIXELS) {
            throw new InvalidArgumentException("Image {$position} exceeds 24 megapixels.");
        }

        $bytes = file_get_contents($path);
        $image = $bytes === false ? false : @imagecreatefromstring($bytes);
        if (!$image instanceof GdImage) {
            throw new InvalidArgumentException("Image {$position} could not be decoded.");
        }

        return ['image' => $image, 'width' => $info[0], 'height' => $info[1], 'name' => $name];
    }

    private function caption(string $name, int $limit): string
    {
        $clean = preg_replace('/[^\x20-\x7E]/', '?', $name) ?? 'image';
        return strlen($clean) <= $limit ? $clean : substr($clean, 0, $limit - 3) . '...';
    }
}

<?php
session_start();

$uploadDir = 'uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files'])) {
    $uploadedFilesData = [];
    $totalFiles = count($_FILES['files']['name']);

    for ($i = 0; $i < $totalFiles; $i++) {
        $fileTmpName = $_FILES['files']['tmp_name'][$i];
        $fileName = $_FILES['files']['name'][$i];
        $fileType = $_FILES['files']['type'][$i];
        $fileSize = $_FILES['files']['size'][$i];
        $error = $_FILES['files']['error'][$i];

        if ($error === UPLOAD_ERR_OK) {
            $destination = $uploadDir . basename($fileName);
            $fileTypeExtension = pathinfo($fileName, PATHINFO_EXTENSION);
            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];

            if (in_array(strtolower($fileTypeExtension), $allowedTypes)) {
                $newFileName = time() . '_' . preg_replace('/[^A-Za-z0-9\._]/', '_', $fileName);
                $destination = $uploadDir . $newFileName;

                $fileInfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_file($fileInfo, $fileTmpName);

                if (in_array(strtolower($mimeType), ['image/jpeg', 'image/png', 'image/gif'])) {
                    $originalFile = $fileTmpName;
                    $finalFile = $destination;

                    $imageCompression = false;
                    if (strtolower($fileTypeExtension) == 'jpg' || strtolower($fileTypeExtension) == 'jpeg') {
                        $imageCompression = true;
                        $tempPath = $destination . '.tmp';
                        $sourcePath = $originalFile;

                        $imageData = file_get_contents($sourcePath);
                        $imageInfo = getimagesize($sourcePath);
                        $mime = $imageInfo['mime'];

                        if ($mime == 'image/jpeg') {
                            $newImageData = imagejpeg($imageData, $tempPath, 85);
                        } elseif ($mime == 'image/png') {
                            $newImageData = imagepng($imageData, $tempPath);
                        } else {
                            $newImageData = $imageData;
                        }

                        if ($imageCompression) {
                            file_put_contents($finalFile, $newImageData);
                            unlink($sourcePath);
                        } else {
                        
                            copy($originalFile, $finalFile);
                        }
                    } else {
                      
                        copy($originalFile, $finalFile);
                    }

                    $uploadedFilesData[] = [
                        'name' => $newFileName,
                        'type' => $mimeType,
                        'size' => filesize($finalFile),
                        'thumbnail' => imagecreatefromstring(file_get_contents($finalFile)) ? imagepng($finalFile) : null, 
                    ];

                } else {
                  
                     copy($fileTmpName, $destination);
                     $uploadedFilesData[] = [
                        'name' => $newFileName,
                        'type' => $mimeType ?: 'application/octet-stream',
                        'size' => filesize($destination),
                        'thumbnail' => null,
                    ];
                }

            } else {
                // Validation error for file type
                 $uploadedFilesData[] = [
                    'name' => 'Error: Invalid file type.',
                    'type' => '',
                    'size' => 0,
                    'thumbnail' => null,
                ];
            }
        } else {
             $uploadedFilesData[] = [
                'name' => 'Error: Upload failed.',
                'type' => '',
                'size' => 0,
                'thumbnail' => null,
            ];
        }
    }

    $_SESSION['uploaded_files'] = $uploadedFilesData;
    header('Location: index.php');
    exit;
}


$uploadedFiles = $_SESSION['uploaded_files'] ?? [];
unset($_SESSION['uploaded_files']);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Advanced File Uploader</title>
    <style>
        input[type="file"]{
            display: block;
            width: 500px;
            height: 200px;
            border: 2px dashed gray;
            background-color: lightgray;
        }
      
        #preview-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        .file-item {
            border: 1px solid #ddd;
            padding: 15px;
            width: 200px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        }
        .thumbnail {
            max-width: 100%;
            height: auto;
            display: block;
            margin-top: 10px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
    <h1>File Uploader</h1>

   

    <form action="index.php" method="post" enctype="multipart/form-data">
        <input type="file" name="files[]" multiple id="fileInput" accept=".jpg, .jpeg, .png, .gif">
        <button type="submit">Upload Files</button>
    </form>

    <h2>Upload Progress & Previews</h2>
    <?php if (!empty($uploadedFiles)): ?>
        <div id="preview-container">
            <?php foreach ($uploadedFiles as $file): ?>
                <div class="file-item">
                    <h3><?= htmlspecialchars($file['name']) ?></h3>
                    <p>Size: <?= number_format($file['size'] / 1024, 2) ?> KB</p>
                    <?php if ($file['thumbnail']): ?>
                        <img src="<?= htmlspecialchars($file['thumbnail']) ?>" class="thumbnail" alt="Preview">
                    <?php else: ?>
                        <p>No thumbnail generated.</p>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <p>No files have been successfully uploaded yet.</p>
    <?php endif; ?>

</body>
</html>
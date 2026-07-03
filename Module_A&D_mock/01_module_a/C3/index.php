<?php

if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_FILES['inputFile'])) {
    $files = $_FILES['inputFile'];
    $fileCount = count($files['name']);
    for ($i = 0; $i < $fileCount; $i++) {
        $fileName = basename($files['name'][$i]);
        $tempFilePath = $files['tmp_name'][$i];
      
        echo "<div><strong>Uploaded File:</strong> " . htmlspecialchars($fileName) . "</div>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Advanced File Upload with Progress and Preview</title>
</head>
<body>
<form action="" method="POST" enctype="multipart/form-data">
<h1>Upload Files</h1>
<input 
type="file"
multiple
name="inputFile[]"
>
<input type="submit">
</form>
</body>
</html>
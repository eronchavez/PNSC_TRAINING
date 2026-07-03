<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $inputText = $_POST['textField'];
    $totalLetters = 0;
    $uppercaseCount = 0;
    $lowercaseCount = 0;
    for ($i = 0; $i < strlen($inputText); $i++) {
        $char = $inputText[$i];
        if (ctype_alpha($char)) { 
            $totalLetters++; 
            if (ctype_upper($char)) {
                $uppercaseCount++;
            } elseif (ctype_lower($char)) {
                $lowercaseCount++;
            }
        }
    }

    $_SESSION['results'] = [
        'totalLetters' => $totalLetters,
        'uppercaseCount' => $uppercaseCount,
        'lowercaseCount' => $lowercaseCount
    ];
} else {
    unset($_SESSION['results']);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Count Letters and Case Count</title>
</head>
<body>
<form method="POST">
<textarea name="textField" id="textField" value="<?php echo isset($inputText) ? $inputText : " "  ?>"></textarea>
<input type="submit" value="count">
</form>
   <?php
if (isset($_SESSION['results'])) {
    ?>
    <h1>Results</h1>
    <p>Total letters: <?php echo $_SESSION['results']['totalLetters'] ?? 0; ?></p>
    <p>Uppercase: <?php echo $_SESSION['results']['uppercaseCount'] ?? 0; ?></p>
    <p>Lowercase: <?php echo $_SESSION['results']['lowercaseCount'] ?? 0; ?></p>
    <?php 
}
?>

    



</body>
</html>
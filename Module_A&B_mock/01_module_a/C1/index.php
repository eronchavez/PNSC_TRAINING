<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C1: Count Letters and Case Count</title>
</head>
<body>

    <form action="" method="post">
        <textarea name="inputText" id="inputText"></textarea><br>
        <button type="submit">Count</button>

    </form>

    <?php
        if($_SERVER['REQUEST_METHOD'] === 'POST')
            {
                $inputText = $_POST['inputText'];

                $totalLetters = preg_match_all('/[a-zA-Z]/', $inputText);
                $upperCaseCount = preg_match_all('/[A-Z]/', $inputText);
                $lowerCaseCount = preg_match_all('/[a-z]/', $inputText);

                echo '<div class="result">';
                echo "Total Letters: " . $totalLetters . "<br>"; 
                echo "UpperCase: " . $upperCaseCount . "<br>"; 
                echo "LowerCase: " . $lowerCaseCount . "<br>"; 
                echo '</div>'; 
            }

           


    ?>
    
</body>
</html>
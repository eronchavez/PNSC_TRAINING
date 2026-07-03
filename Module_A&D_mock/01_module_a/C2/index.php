<?php 

    if($_SERVER['REQUEST_METHOD'] === "POST")
        {
            $color1 = $_POST['color1'];
            $color2 = $_POST['color2'];

        }
    $gradient = "linear-gradient(to right, $color1, $color2)"
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gradient Generator</title>
</head>
<body>
    <h1>Gradient Generator</h1>
    <form method="POST" action="">
       Color 1: <input type="color" name="color1" value="<?php echo isset($color1) ? $color1 : '#000000'; ?>" required><br><br>
        Color 2: <input type="color" name="color2" value="<?php echo isset($color2) ? $color2 : '#ffffff'; ?>" required><br><br>
        <button>Genereate Gradient</button>

    </form>

    <?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    ?>
        <h2>Selected Colors:</h2>
        <p>Color 1: <?php echo $color1; ?></p>
        <p>Color 2: <?php echo $color2; ?></p>

        <h2>Gradient Preview:</h2>
        <div style="width: 200px; height: 200px; background: <?php echo $gradient; ?>;"></div>
    <?php
    }
    ?>



    
</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gradient Generator</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .gradient-preview {
            width: 200px;
            height: 200px;
            margin-top: 20px;
            border: 1px solid #ccc;
        }
    </style>
</head>
<body>
  
    <form method="post" action="">
        <label for="color1">Color 1:</label><br>
        <input type="color" id="color1" name="color1" value="#ff0000"><br><br>
        
        <label for="color2">Color 2:</label><br>
        <input type="color" id="color2" name="color2" value="#0000ff"><br><br>
        
        <button type="submit">Generate Gradient</button> <br> <br>
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $color1 = $_POST['color1'];
        $color2 = $_POST['color2'];

        
        echo 'Selected Color 1:' , $color1 . '<br>' . '<br>';
        echo 'Selected Color 2:' , $color2;
        echo '<div class="gradient-preview" style="background: linear-gradient(to right, ' . $color1 . ', ' . $color2 . ');"></div>';
      
    
    }
    ?>
</body>
</html>
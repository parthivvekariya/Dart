<?php

    include('connect.php');

    $name = $_POST["name"];
    $about = $_POST["about"];
    $value = $_POST["value"];
    
    if ($name == "" && $about == "" && $value == "") 
    {
        echo '0';
    }
    else
    {
        $stmt = mysqli_prepare($con, "INSERT INTO product (name, about, value) VALUES (?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "sss", $name, $about, $value);
        mysqli_stmt_execute($stmt);
        
        if (mysqli_affected_rows($con) > 0) {
            echo '1'; // Insertion successful
        } else {
            echo '0'; // Insertion failed
        }
        mysqli_stmt_close($stmt);
    }



?>
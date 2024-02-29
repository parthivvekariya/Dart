<?php

    include('connect.php');
    
    $id =$_POST["id"];
    $name = $_POST["name"];
    $about = $_POST["about"];
    $value = $_POST["value"];

    
    $sql ="update product set name='$name',about='$about',value='$value' where id  ='$id'";
    
    if(mysqli_query($con,$sql))
    {
        echo 'Updated Succesfully';
    }
    else
    {
        echo 'Something went wrong';
    }
    


?>
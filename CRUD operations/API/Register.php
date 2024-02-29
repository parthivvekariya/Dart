<?php

    include('connect.php');
    
    $First_Name = $_POST["First_Name"];
    $Last_Name = $_POST["Last_Name"];
    $Gender = $_POST["Gender"];
    $Email = $_POST["Email"];
    $Phone = $_POST["Phone"];
    $Password = $_POST["Password"];


    if($First_Name=="" && $Last_Name=="" && $Gender=="" && $Email=="" && $Phone=="" && $Password=="")
    {
        
        echo '0';
        
    }
    else
    {
        $sql = "insert into admin(fname,lname,Gender,emil,pnumber,pass) values ('$First_Name','$Last_Name', '$Gender','$Email','$Phone','$Password')";
        mysqli_query($con,$sql);
}
?>
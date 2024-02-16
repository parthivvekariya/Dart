<?php
    include('connect.php');
    
    $sql = "SELECT * FROM image";
    $r = mysqli_query($con, $sql);
    
    $response = array();
    
    while ($row = mysqli_fetch_array($r)) 
    {
        
        $value["id"] = $row["id"];
        $value["i_name"] = $row["i_name"];
        $value["image"] = $row["image"];
        
        array_push($response, $value);
    }

    echo json_encode($response);
?>

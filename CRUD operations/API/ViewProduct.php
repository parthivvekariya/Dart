<?php

    include('connect.php');
    $sql = "SELECT * FROM product";
    $r = mysqli_query($con,$sql);
    $response = array();
    
    While($row = mysqli_fetch_array($r))
    {
        $value["id"] = $row["id"];
        $value["name"] = $row["name"];
        $value["about"] = $row["about"];
        $value["value"] = $row["value"];
        
        array_push($response,$value);
        
    }
    
    echo json_encode($response);
    mysqli_close($con);


?>
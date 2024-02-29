<?php
    
    include('connect.php');
    
    $mob=$_REQUEST["pnumber"];
    $pass=$_REQUEST["pass"];
    
    $sql="select * from admin where pnumber='$mob' and pass ='$pass'";
    
    
    $ex=mysqli_query($con,$sql);
    
    $no=mysqli_num_rows($ex);
    
    
    if($no>0)
    {
    $fet=mysqli_fetch_object($ex);
    echo json_encode(['code'=>200]);
    }
    else
    {
    echo "0";
    }

?>
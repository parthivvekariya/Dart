<?php
include('../connect.php');

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $upload_url = 'https://roasting-conflict.000webhostapp.com/API/uploadimages/images/';

    // Sanitize input data
    $category_name = mysqli_real_escape_string($con, $_POST['data']);

    // Handle file upload
    if (isset($_FILES['profile_pic'])) {
        $fileinfo = pathinfo($_FILES['profile_pic']['name']);
        $extension = $fileinfo['extension'];
        $random = 'image_' . rand(1000,9999);
        $file_url = $upload_url . $random . '.' . $extension;
        $file_path = $_SERVER['DOCUMENT_ROOT'] . "/API/uploadimages/images/" . $random . '.' . $extension;
        
        // Move uploaded file
        if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $file_path)) {
            // File uploaded successfully, insert into database
            $insert = "INSERT INTO image (i_name, image) VALUES ('$category_name', '$file_url')";
            if (mysqli_query($con, $insert)) {
                echo "Record inserted successfully.";
            } else {
                echo "Error inserting record: " . mysqli_error($con);
            }
        } else {
            echo "Error uploading file.";
        }
    } else {
        echo "No file uploaded.";
    }
} else {
    echo "Invalid request method.";
}
?>

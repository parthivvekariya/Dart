<?php
include('connect.php');

// Check if 'id' parameter is provided
if (isset($_POST["id"])) {
    // Get the 'id' parameter
    $id = $_POST["id"];

    // Prepare the DELETE statement using a prepared statement
    $sql = "DELETE FROM product WHERE id = ?";

    // Create a prepared statement
    if ($stmt = mysqli_prepare($con, $sql)) {
        // Bind the 'id' parameter as an integer
        mysqli_stmt_bind_param($stmt, "i", $id);

        // Execute the statement
        if (mysqli_stmt_execute($stmt)) {
            // Check if any rows were affected
            if (mysqli_stmt_affected_rows($stmt) > 0) {
                // Record deleted successfully
                echo 'Record Deleted Successfully';
            } else {
                // No records were deleted (perhaps the provided 'id' does not exist)
                echo 'No Records Found for Deletion';
            }
        } else {
            // Error executing the statement
            echo 'Error Deleting Record: ' . mysqli_error($con);
        }

        // Close the statement
        mysqli_stmt_close($stmt);
    } else {
        // Error preparing the statement
        echo 'Error Preparing Statement: ' . mysqli_error($con);
    }
} else {
    // 'id' parameter not provided
    echo 'Invalid Request: Missing "id" Parameter';
}

// Close the database connection
mysqli_close($con);
?>

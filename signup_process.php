<?php
// Establish database connection
$servername = "localhost";
$username = "nbrown86";
$password = "nbrown86";
$dbname = "nbrown86";

$conn = new mysqli($servername, $username, $email, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $hashed_password = md5($password); // Hash the password using MD5

    // SQL query to insert username and hashed password into the users table
    $sql = "INSERT INTO user (username, password) VALUES ('$username', '$email', '$hashed_password')";
    if ($conn->query($sql) === TRUE) {
        // Signup successful, redirect to login page
        header("Location: login.php");
        exit();
    } else {
        // Error occurred during signup, display error message
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close database connection
$conn->close();
?>

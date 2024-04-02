<?php
session_start();

// Establish database connection
$servername = "localhost";
$username = "nbrown86";
$password = "nbrown86";
$dbname = "nbrown86";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $hashed_password = md5($password); // Hash the entered password using MD5

    // SQL query to check if username and hashed password match any records in the users table
    $sql = "SELECT * FROM user WHERE username='$username' AND password='$hashed_password'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        // User authenticated, set session variables and redirect to newemployee.php page
        $_SESSION['username'] = $username;
        header("Location: newemployee.php");
        exit();
    } else {
        // Incorrect username or password, display error message
        echo "Incorrect username or password. <a href='forgot_password.php'>Forgot Password?</a>";
    }
}

// Close database connection
$conn->close();
?>
<?php
session_start();

$host = "127.0.0.1"
//$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "user";
$port = "3306";

$conn = new mysqli($host, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $hashed_password = md5($password);

    $sql = "SELECT * FROM user WHERE username='$username' AND password='$hashed_password'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $_SESSION['username'] = $username;
        header("Location: homepage.html");
        exit();
    } else {
        echo "Incorrect username or password. <a href='login_screen.html'>Return here.</a>";
    }
}

// Close database connection
$conn->close();
?>
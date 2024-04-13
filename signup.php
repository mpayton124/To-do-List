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
    $email = $_POST['email'];
    $password = $_POST['password'];
    $hashed_password = md5($password);

    $sql = "INSERT INTO user (username, password) VALUES ('$username', '$email', '$hashed_password')";
    if ($conn->query($sql) === TRUE) {
        header("Location: login.php");
        exit();
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
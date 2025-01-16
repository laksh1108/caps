<?php
// db.php

// Database connection credentials
$host = 'localhost';       // Host (default: localhost)
$dbname = 'blogs';       // Your database name
$username = 'root';        // Your MySQL username (default is 'root')
$password = '';            // Your MySQL password (default is empty for XAMPP)

try {
    // PDO connection to the database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    // Log the connection failure
    echo "<script>console.error('Database connection failed: " . $e->getMessage() . "');</script>";
    die("Database connection failed: " . $e->getMessage());
}
?>

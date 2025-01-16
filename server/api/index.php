<?php
// index.php

// Include the database connection
require_once 'db.php';

// Set headers for JSON response
header("Content-Type: application/json; charset=UTF-8");

// Check database connection status
if ($pdo) {
    echo json_encode(['message' => 'API is running and connected to the database.']);
} else {
    echo json_encode(['message' => 'Failed to connect to the database.']);
}
?>

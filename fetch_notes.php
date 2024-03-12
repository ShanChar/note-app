<?php
$servername = "localhost";
$username = "root";
$password = "ShanChar123#";
$database = "crud";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetching all notes that exists
$sql = "SELECT id, title, content FROM notes";
$result = $conn->query($sql);

$notes = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
}

// Returning the notes as JSON
header('Content-Type: application/json');
echo json_encode($notes);


$conn->close();
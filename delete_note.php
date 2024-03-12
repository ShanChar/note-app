<?php
$servername = "localhost";
$username = "root";
$password = "ShanChar123#";
$database = "crud";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$noteId = $_GET['id'];

$sql = "DELETE FROM notes WHERE id = $noteId";

if ($conn->query($sql) === TRUE) {
    $response = array('success' => true);
} else {
    $response = array('success' => false, 'error' => $conn->error);
}


// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
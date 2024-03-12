<?php
$servername = "localhost";
$username = "root";
$password = "ShanChar123#";
$database = "crud";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the note data from the request
$title = $_POST['title'];
$content = $_POST['content'];
$id = isset($_POST['id']) ? $_POST['id'] : null;

if ($id) {
    $stmt = $conn->prepare("UPDATE notes SET title = ?, content = ? WHERE id = ?");
    $stmt->bind_param("ssi", $title, $content, $id);
} else {
    $stmt = $conn->prepare("INSERT INTO notes (title, content) VALUES (?, ?)");
    $stmt->bind_param("ss", $title, $content);
}

if ($stmt->execute()) {
    $response = array('success' => true);
} else {
    $response = array('success' => false, 'error' => $stmt->error);
}

// Closing the prepared statement
$stmt->close();

// Returning the response as JSON
header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
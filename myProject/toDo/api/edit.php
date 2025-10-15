<?php

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

// Validate incoming parameters
if (!isset($_POST['id']) || !isset($_POST['text'])) {
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

$id = intval($_POST['id']);
$text = trim($_POST['text']);

if ($text === '') {
    echo json_encode(['error' => 'Text cannot be empty']);
    exit;
}

// Prepare and execute update statement
$stmt = $mysqli->prepare("UPDATE tasks SET text = ? WHERE id = ?");
if (!$stmt) {
    echo json_encode(['error' => 'Prepare failed: ' . $mysqli->error]);
    exit;
}

$stmt->bind_param('si', $text, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Update failed: ' . $stmt->error]);
}

$stmt->close();
$mysqli->close();

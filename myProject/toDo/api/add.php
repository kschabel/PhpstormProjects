<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$task = trim($_POST['task'] ?? '');
if ($task === '') {
    echo json_encode(['error' => 'Empty task']);
    exit;
}

// Insert new task
$stmt = $mysqli->prepare("INSERT INTO tasks (text, status) VALUES (?, 'pending')");
$stmt->bind_param('s', $task);
$stmt->execute();
$stmt->close();

// Return updated list
include __DIR__ . '/get.php';

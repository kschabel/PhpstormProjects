<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$id = intval($_POST['id'] ?? 0);
if ($id <= 0) {
    echo json_encode(['error' => 'Invalid id']);
    exit;
}

// Delete task
$stmt = $mysqli->prepare("DELETE FROM tasks WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->close();

// Return updated list
include __DIR__ . '/get.php';

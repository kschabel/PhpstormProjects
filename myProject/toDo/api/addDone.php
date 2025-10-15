<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$id = intval($_POST['id'] ?? 0);
if ($id <= 0) {
    echo json_encode(['error' => 'Invalid id']);
    exit;
}

$stmt = $mysqli->prepare("UPDATE tasks SET status = 'done' WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->close();

echo json_encode(['success' => true]);
die();
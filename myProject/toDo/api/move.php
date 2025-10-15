<?php
require_once __DIR__ . '/db.php';

// Check inputs
if (!isset($_POST['id']) || !isset($_POST['status'])) {
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

$id = intval($_POST['id']);
$status = trim($_POST['status']);

// Validate new status
$allowed = ['pending', 'done', 'expired'];
if (!in_array($status, $allowed)) {
    echo json_encode(['error' => 'Invalid status']);
    exit;
}

// Update db
$stmt = $mysqli->prepare("UPDATE tasks SET status = ? WHERE id = ?");
$stmt->bind_param('si', $status, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Update failed: ' . $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>

<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

// Get optional status parameter
$status = $_GET['status'] ?? null;

// Prepare query depending on status
if ($status && in_array($status, ['pending','done','expired'])) {
    $stmt = $mysqli->prepare("SELECT id, text FROM tasks WHERE status=? ORDER BY id DESC");
    $stmt->bind_param('s', $status);
    $stmt->execute();
    $result = $stmt->get_result();
    $tasks = [];
    while($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
    echo json_encode($tasks);
    $stmt->close();
} else {
    // Return all tasks categorized
    $categories = ['pending','done','expired'];
    $data = [];
    foreach($categories as $cat) {
        $stmt = $mysqli->prepare("SELECT id, text FROM tasks WHERE status=? ORDER BY id DESC");
        $stmt->bind_param('s', $cat);
        $stmt->execute();
        $res = $stmt->get_result();
        $tasks = [];
        while($row = $res->fetch_assoc()) {
            $tasks[] = $row;
        }
        $data[$cat] = $tasks;
        $stmt->close();
    }
    echo json_encode($data);
}

$mysqli->close();


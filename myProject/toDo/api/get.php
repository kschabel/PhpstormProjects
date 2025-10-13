<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$sql = "SELECT id, text, status, created_at FROM tasks ORDER BY created_at DESC";
$result = $mysqli->query($sql);

$output = [
    'pending' => [],
    'done' => [],
    'expired' => []
];

while ($row = $result->fetch_assoc()) {
    $output[$row['status']][] = [
        'id' => (int)$row['id'],
        'text' => $row['text'],
        'created_at' => $row['created_at']
    ];
}

echo json_encode($output);

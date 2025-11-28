<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['title']) || empty($data['title'])) {
    echo json_encode(['success' => false, 'message' => 'Title is required']);
    exit;
}

$title = $data['title'];
$description = $data['description'] ?? '';

$sql = "INSERT INTO quizzes (title, description, created_at) 
        VALUES (?, ?, NOW())";
$stmt = executeQuery($sql, [$title, $description]);

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'quiz_id' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create quiz']);
}
?>
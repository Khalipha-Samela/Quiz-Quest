<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['quiz_id']) || empty($data['quiz_id'])) {
    echo json_encode(['success' => false, 'message' => 'Quiz ID is required']);
    exit;
}

if (!isset($data['title']) || empty($data['title'])) {
    echo json_encode(['success' => false, 'message' => 'Title is required']);
    exit;
}

$quizId = $data['quiz_id'];
$title = $data['title'];
$description = $data['description'] ?? '';
$timeLimit = $data['time_limit'] ?? 30;

$sql = "INSERT INTO rounds (quiz_id, title, description, time_limit) VALUES (?, ?, ?, ?)";
$stmt = executeQuery($sql, [$quizId, $title, $description, $timeLimit]);

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'round_id' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create round']);
}
?>
<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['question_id']) || empty($data['question_id'])) {
    echo json_encode(['success' => false, 'message' => 'Question ID is required']);
    exit;
}

$questionId = $data['question_id'];

$sql = "DELETE FROM questions WHERE question_id = ?";
$stmt = executeQuery($sql, [$questionId]);

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Question not found or already deleted']);
}
?>
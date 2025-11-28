<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['quiz_id']) || empty($data['quiz_id'])) {
    echo json_encode(['success' => false, 'message' => 'Quiz ID is required']);
    exit;
}

$quizId = $data['quiz_id'];

$sql = "DELETE FROM quizzes WHERE quiz_id = ?";
$stmt = executeQuery($sql, [$quizId]);

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Quiz not found or already deleted']);
}
?>
<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$requiredFields = ['session_id', 'player_id', 'question_id', 'points_earned', 'answered_correctly'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || $data[$field] === '') {
        echo json_encode(['success' => false, 'message' => "$field is required"]);
        exit;
    }
}

$sessionId = $data['session_id'];
$playerId = $data['player_id'];
$questionId = $data['question_id'];
$pointsEarned = $data['points_earned'];
$answeredCorrectly = $data['answered_correctly'];
$answerText = $data['answer_text'] ?? '';

$sql = "INSERT INTO player_scores (session_id, player_id, question_id, points_earned, answered_correctly, answer_text) 
        VALUES (?, ?, ?, ?, ?, ?)";
$stmt = executeQuery($sql, [$sessionId, $playerId, $questionId, $pointsEarned, $answeredCorrectly, $answerText]);

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'score_id' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to record score']);
}
?>
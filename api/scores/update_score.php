<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['score_id']) || empty($data['score_id'])) {
    echo json_encode(['success' => false, 'message' => 'Score ID is required']);
    exit;
}

if (!isset($data['points_earned']) || $data['points_earned'] === '') {
    echo json_encode(['success' => false, 'message' => 'Points earned is required']);
    exit;
}

if (!isset($data['answered_correctly']) || $data['answered_correctly'] === '') {
    echo json_encode(['success' => false, 'message' => 'Answered correctly flag is required']);
    exit;
}

$scoreId = $data['score_id'];
$pointsEarned = $data['points_earned'];
$answeredCorrectly = $data['answered_correctly'];

$sql = "UPDATE player_scores SET points_earned = ?, answered_correctly = ? WHERE score_id = ?";
$stmt = executeQuery($sql, [$pointsEarned, $answeredCorrectly, $scoreId]);

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Score not found or no changes made']);
}
?>
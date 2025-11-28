<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['quiz_id']) || empty($data['quiz_id'])) {
    echo json_encode(['success' => false, 'message' => 'Quiz ID is required']);
    exit;
}

if (!isset($data['player_id']) || empty($data['player_id'])) {
    echo json_encode(['success' => false, 'message' => 'Player ID is required']);
    exit;
}

$quizId = $data['quiz_id'];
$playerId = $data['player_id'];

$sql = "INSERT INTO game_sessions (quiz_id) VALUES (?)";
$stmt = executeQuery($sql, [$quizId]);

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'session_id' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create game session']);
}
?>
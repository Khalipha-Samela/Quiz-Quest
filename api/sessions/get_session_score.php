<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

if (!isset($_GET['session_id']) || empty($_GET['session_id'])) {
    echo json_encode(['success' => false, 'message' => 'Session ID is required']);
    exit;
}

$sessionId = $_GET['session_id'];

$sql = "SELECT SUM(points_earned) as total_score FROM player_scores WHERE session_id = ?";
$stmt = executeQuery($sql, [$sessionId]);
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['success' => true, 'total_score' => $row['total_score'] ?? 0]);
} else {
    echo json_encode(['success' => false, 'message' => 'Session not found']);
}
?>
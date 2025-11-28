<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || empty($data['username'])) {
    echo json_encode(['success' => false, 'message' => 'Username is required']);
    exit;
}

$username = $data['username'];

// Check if player exists
$sql = "SELECT * FROM players WHERE username = ?";
$stmt = executeQuery($sql, [$username]);
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $player = $result->fetch_assoc();
    echo json_encode(['success' => true, 'player_id' => $player['player_id']]);
    exit;
}

// Create new player
$sql = "INSERT INTO players (username) VALUES (?)";
$stmt = executeQuery($sql, [$username]);

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'player_id' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create player']);
}
?>
<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['round_id']) || empty($data['round_id'])) {
    echo json_encode(['success' => false, 'message' => 'Round ID is required']);
    exit;
}

$roundId = $data['round_id'];

$sql = "DELETE FROM rounds WHERE round_id = ?";
$stmt = executeQuery($sql, [$roundId]);

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Round not found or already deleted']);
}
?>
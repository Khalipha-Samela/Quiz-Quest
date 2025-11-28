<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

if (!isset($_GET['quiz_id']) || empty($_GET['quiz_id'])) {
    echo json_encode(['success' => false, 'message' => 'Quiz ID is required']);
    exit;
}

$quizId = $_GET['quiz_id'];

$sql = "SELECT * FROM rounds WHERE quiz_id = ? ORDER BY round_id";
$stmt = executeQuery($sql, [$quizId]);
$result = $stmt->get_result();

$rounds = [];
while ($row = $result->fetch_assoc()) {
    $rounds[] = $row;
}

echo json_encode($rounds);
?>
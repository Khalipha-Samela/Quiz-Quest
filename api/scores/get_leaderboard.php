<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$quizId = isset($_GET['quiz_id']) ? $_GET['quiz_id'] : '';

$sql = "SELECT p.username, SUM(ps.points_earned) as total_score 
        FROM player_scores ps
        JOIN players p ON ps.player_id = p.player_id";

if (!empty($quizId)) {
    $sql .= " JOIN game_sessions gs ON ps.session_id = gs.session_id
              WHERE gs.quiz_id = ?";
}

$sql .= " GROUP BY p.player_id
          ORDER BY total_score DESC
          LIMIT 10";

$stmt = executeQuery($sql, !empty($quizId) ? [$quizId] : []);
$result = $stmt->get_result();

$leaderboard = [];
while ($row = $result->fetch_assoc()) {
    $leaderboard[] = $row;
}

echo json_encode($leaderboard);
?>
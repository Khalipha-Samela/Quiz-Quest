<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$player = isset($_GET['player']) ? $_GET['player'] : '';
$date = isset($_GET['date']) ? $_GET['date'] : '';
$difficulty = isset($_GET['difficulty']) ? $_GET['difficulty'] : '';

$sql = "SELECT 
            ps.*,
            p.username,
            q.title AS quiz_title,
            qn.question_text,
            qn.difficulty,
            DATE_FORMAT(gs.session_date, '%Y-%m-%d %H:%i:%s') AS session_date
        FROM player_scores ps
        JOIN players p ON ps.player_id = p.player_id
        JOIN game_sessions gs ON ps.session_id = gs.session_id
        JOIN quizzes q ON gs.quiz_id = q.quiz_id
        JOIN questions qn ON ps.question_id = qn.question_id
        WHERE 1=1";

$params = [];

if (!empty($player)) {
    $sql .= " AND p.username LIKE ?";
    $params[] = "%$player%";
}

if (!empty($date)) {
    $sql .= " AND DATE(gs.session_date) = ?";
    $params[] = $date;
}

if (!empty($difficulty)) {
    $sql .= " AND qn.difficulty = ?";
    $params[] = $difficulty;
}

$sql .= " ORDER BY gs.session_date DESC";

$stmt = executeQuery($sql, $params);
$result = $stmt->get_result();

$scores = [];
while ($row = $result->fetch_assoc()) {
    $scores[] = $row;
}

echo json_encode($scores);
?>
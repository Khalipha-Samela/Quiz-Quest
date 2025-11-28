<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

if (!isset($_GET['round_id']) || empty($_GET['round_id'])) {
    echo json_encode(['success' => false, 'message' => 'Round ID is required']);
    exit;
}

$roundId = $_GET['round_id'];

// Get questions for the round
$sql = "SELECT * FROM questions WHERE round_id = ? ORDER BY question_id";
$stmt = executeQuery($sql, [$roundId]);
$result = $stmt->get_result();

$questions = [];
while ($row = $result->fetch_assoc()) {
    $questions[] = $row;
}

// Get answers for each question
foreach ($questions as &$question) {
    $sql = "SELECT * FROM answers WHERE question_id = ?";
    $stmt = executeQuery($sql, [$question['question_id']]);
    $result = $stmt->get_result();
    
    $question['answers'] = [];
    while ($answer = $result->fetch_assoc()) {
        $question['answers'][] = $answer;
    }
    
    // For open-ended questions, find the correct answer
    if ($question['question_type'] === 'open_ended') {
        foreach ($question['answers'] as $answer) {
            if ($answer['is_correct']) {
                $question['correct_answer'] = $answer['answer_text'];
                break;
            }
        }
    }
}

echo json_encode($questions);
?>
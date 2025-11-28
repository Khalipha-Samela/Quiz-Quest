<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

if (!isset($_GET['quiz_id']) || empty($_GET['quiz_id'])) {
    echo json_encode(['success' => false, 'message' => 'Quiz ID is required']);
    exit;
}

$quizId = $_GET['quiz_id'];

// Get quiz info
$sql = "SELECT * FROM quizzes WHERE quiz_id = ?";
$stmt = executeQuery($sql, [$quizId]);
$quiz = $stmt->get_result()->fetch_assoc();

if (!$quiz) {
    echo json_encode(['success' => false, 'message' => 'Quiz not found']);
    exit;
}

// Get rounds for the quiz
$sql = "SELECT * FROM rounds WHERE quiz_id = ? ORDER BY round_id";
$stmt = executeQuery($sql, [$quizId]);
$result = $stmt->get_result();

$rounds = [];
while ($row = $result->fetch_assoc()) {
    $rounds[] = $row;
}

// Get questions for each round
foreach ($rounds as &$round) {
    $sql = "SELECT * FROM questions WHERE round_id = ? ORDER BY question_id";
    $stmt = executeQuery($sql, [$round['round_id']]);
    $result = $stmt->get_result();
    
    $round['questions'] = [];
    while ($question = $result->fetch_assoc()) {
        // Get answers for each question
        $sql = "SELECT * FROM answers WHERE question_id = ?";
        $stmt2 = executeQuery($sql, [$question['question_id']]);
        $result2 = $stmt2->get_result();
        
        $question['answers'] = [];
        while ($answer = $result2->fetch_assoc()) {
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
        
        $round['questions'][] = $question;
    }
}

$quiz['rounds'] = $rounds;

echo json_encode($quiz);
?>
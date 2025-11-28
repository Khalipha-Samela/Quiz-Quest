<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data');
    }

    // Validate required fields
    validateRequired($data, [
        'round_id', 
        'question_text', 
        'question_type', 
        'difficulty'
    ]);

    // Sanitize and validate input
    $roundId = (int)$data['round_id'];
    $questionText = trim($data['question_text']);
    $questionType = $data['question_type'];
    $difficulty = $data['difficulty'];
    $points = isset($data['points']) ? max(1, (int)$data['points']) : 1;

    // Validate question type and difficulty
    if (!in_array($questionType, ['multiple_choice', 'open_ended'])) {
        throw new Exception('Invalid question type');
    }
    if (!in_array($difficulty, ['easy', 'medium', 'hard'])) {
        throw new Exception('Invalid difficulty level');
    }

    $conn->begin_transaction();

    // Insert question
    $sql = "INSERT INTO questions (round_id, question_text, question_type, difficulty, points) 
            VALUES (?, ?, ?, ?, ?)";
    $stmt = executeQuery($sql, [$roundId, $questionText, $questionType, $difficulty, $points]);
    $questionId = $conn->insert_id;
    
    // Handle question type specific data
    if ($questionType === 'multiple_choice') {
        if (!isset($data['options']) || !is_array($data['options']) || count($data['options']) < 2) {
            throw new Exception('Multiple choice questions require at least 2 options');
        }
        
        if (!isset($data['correct_option']) || !is_numeric($data['correct_option'])) {
            throw new Exception('Please select the correct option');
        }
        
        $correctOption = (int)$data['correct_option'];
        if ($correctOption < 0 || $correctOption >= count($data['options'])) {
            throw new Exception('Invalid correct option index');
        }
        
        // Insert each option
        foreach ($data['options'] as $index => $optionText) {
            $optionText = trim($optionText);
            if (empty($optionText)) {
                throw new Exception('Option text cannot be empty');
            }
            
            $isCorrect = ($index === $correctOption);
            $sql = "INSERT INTO answers (question_id, answer_text, is_correct) 
                    VALUES (?, ?, ?)";
            executeQuery($sql, [$questionId, $optionText, $isCorrect ? 1 : 0]);
        }
    } else {
        if (!isset($data['correct_answer']) || empty(trim($data['correct_answer']))) {
            throw new Exception('Correct answer is required for open-ended questions');
        }
        
        $correctAnswer = trim($data['correct_answer']);
        $sql = "INSERT INTO answers (question_id, answer_text, is_correct) 
                VALUES (?, ?, ?)";
        executeQuery($sql, [$questionId, $correctAnswer, 1]);
    }
    
    $conn->commit();
    successResponse(['question_id' => $questionId], 'Question created successfully');
    
} catch (Exception $e) {
    $conn->rollback();
    handleError($e->getMessage());
}
<?php
include __DIR__ . '/../../config.php';
header('Content-Type: application/json');

$sql = "SELECT * FROM quizzes ORDER BY title";
$result = $conn->query($sql);

if (!$result) {
    die(json_encode(["error" => $conn->error]));
}

$quizzes = [];
while ($row = $result->fetch_assoc()) {
    $quizzes[] = $row;
}

echo json_encode($quizzes);
?>
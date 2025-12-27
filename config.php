<?php
// Database configuration
define('DB_HOST', 'db.fr-pari1.bengt.wasmernet.com');
define('DB_USER', 'ff2bd29b749e8000ae6c62ba0c34');
define('DB_PASS', '0694ff2b-d29b-75d4-8000-3b4b7595f3ff');
define('DB_NAME', 'dbbLGHe47dU9vFxGVcnLNq68');

// Create database connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset
$conn->set_charset("utf8mb4");

// Helper function to execute prepared statements
function executeQuery($sql, $params = []) {
    global $conn;
    $stmt = $conn->prepare($sql);
    
    if (!empty($params)) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    return $stmt;
}

function validateRequired($data, $fields) {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            handleError("$field is required");
        }
    }
}

function handleError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

function successResponse($data = [], $message = '') {
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}


?>
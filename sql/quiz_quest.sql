CREATE DATABASE IF NOT EXISTS quiz_quest
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE quiz_quest;

-- =====================
-- QUIZZES
-- =====================
CREATE TABLE quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- ROUNDS
-- =====================
CREATE TABLE rounds (
    round_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    time_limit INT DEFAULT 30,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

-- =====================
-- QUESTIONS
-- =====================
CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    round_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'open_ended') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    points INT DEFAULT 1,
    FOREIGN KEY (round_id) REFERENCES rounds(round_id) ON DELETE CASCADE
);

-- =====================
-- ANSWERS
-- =====================
CREATE TABLE answers (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct TINYINT(1) DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- =====================
-- PLAYERS
-- =====================
CREATE TABLE players (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- GAME SESSIONS
-- =====================
CREATE TABLE game_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

-- =====================
-- PLAYER SCORES
-- =====================
CREATE TABLE player_scores (
    score_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    player_id INT NOT NULL,
    question_id INT NOT NULL,
    points_earned INT DEFAULT 0,
    answered_correctly TINYINT(1) DEFAULT 0,
    answer_text TEXT,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

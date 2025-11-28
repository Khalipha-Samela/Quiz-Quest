-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2025 at 05:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quiz_quest`
--
CREATE DATABASE IF NOT EXISTS `quiz_quest` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `quiz_quest`;

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `answer_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer_text` text NOT NULL,
  `is_correct` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`answer_id`, `question_id`, `answer_text`, `is_correct`) VALUES
(1, 1, 'Rome', 1),
(2, 1, 'Madrid', 0),
(3, 1, 'Athens', 0),
(4, 1, 'Berlin', 0),
(5, 2, '7', 1),
(10, 4, 'Nikola Tesla', 0),
(11, 4, 'Thomas Edison', 1),
(12, 4, 'Albert Einstein', 0),
(13, 4, 'Alexander Graham Bell', 0),
(14, 5, 'Italy', 0),
(15, 5, 'Greece', 1),
(16, 5, 'France', 0),
(17, 5, 'Germany', 0),
(18, 6, 'O-', 0),
(19, 6, 'AB-', 1),
(20, 6, 'B+', 0),
(21, 6, 'A-', 0),
(22, 7, '1914', 1),
(23, 8, 'Brad Pitt', 0),
(24, 8, 'Leonardo DiCaprio', 1),
(25, 8, 'Tom Cruise', 0),
(26, 8, 'Johnny Depp', 0),
(27, 9, 'Pulp Fiction', 0),
(28, 9, 'Forrest Gump', 1),
(29, 9, 'The Shawshank Redemption', 0),
(30, 9, 'Braveheart', 0),
(31, 10, 'Frozen', 1),
(32, 11, 'T\'Challa', 1),
(33, 11, 'Erik Killmonger', 0),
(34, 11, 'Shuri', 0),
(35, 11, 'M\'Baku', 0),
(36, 12, 'Justin Guarini', 0),
(37, 12, 'Kelly Clarkson', 1),
(38, 12, 'Carrie Underwood', 0),
(39, 12, 'Jennifer Hudson', 0);

-- --------------------------------------------------------

--
-- Table structure for table `game_sessions`
--

CREATE TABLE `game_sessions` (
  `session_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `session_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game_sessions`
--

INSERT INTO `game_sessions` (`session_id`, `quiz_id`, `session_date`) VALUES
(1, 1, '2025-08-29 16:27:30'),
(2, 2, '2025-08-29 17:09:07'),
(3, 1, '2025-08-30 15:51:29');

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `player_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`player_id`, `username`, `email`, `created_at`) VALUES
(1, 'Max', NULL, '2025-08-29 16:27:30'),
(2, 'Jake', NULL, '2025-08-29 17:09:07');

-- --------------------------------------------------------

--
-- Table structure for table `player_scores`
--

CREATE TABLE `player_scores` (
  `score_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `points_earned` int(11) DEFAULT 0,
  `answered_correctly` tinyint(1) DEFAULT 0,
  `answer_text` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `player_scores`
--

INSERT INTO `player_scores` (`score_id`, `session_id`, `player_id`, `question_id`, `points_earned`, `answered_correctly`, `answer_text`) VALUES
(1, 1, 1, 1, 2, 1, 'Rome'),
(2, 1, 1, 2, 2, 1, '7'),
(4, 1, 1, 4, 3, 1, 'Thomas Edison'),
(5, 1, 1, 5, 3, 1, 'Greece'),
(6, 1, 1, 6, 5, 1, 'AB-'),
(7, 1, 1, 7, 5, 1, '1914'),
(8, 2, 2, 8, 2, 1, 'Leonardo DiCaprio'),
(9, 2, 2, 9, 2, 1, 'Forrest Gump'),
(10, 2, 2, 10, 2, 1, 'Frozen'),
(11, 2, 2, 11, 2, 1, 'T\'Challa'),
(12, 2, 2, 12, 5, 1, 'Kelly Clarkson'),
(13, 3, 2, 1, 2, 1, 'Rome'),
(14, 3, 2, 2, 2, 1, '7'),
(15, 3, 2, 4, 3, 1, 'Thomas Edison'),
(16, 3, 2, 5, 3, 1, 'Greece'),
(17, 3, 2, 6, 5, 1, 'AB-'),
(18, 3, 2, 7, 5, 1, '1914');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `round_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('multiple_choice','open_ended') NOT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL,
  `points` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `round_id`, `question_text`, `question_type`, `difficulty`, `points`) VALUES
(1, 1, 'What is the capital of Italy?', 'multiple_choice', 'easy', 2),
(2, 1, 'How many continents are there in the world?', 'open_ended', 'easy', 2),
(4, 1, 'Who invented the light bulb?', 'multiple_choice', 'medium', 3),
(5, 1, 'Which country hosted the first modern Olympic Games in 1896?', 'multiple_choice', 'medium', 3),
(6, 1, 'What is the rarest blood type in humans?', 'multiple_choice', 'hard', 5),
(7, 1, 'In what year did World War I begin?', 'open_ended', 'hard', 5),
(8, 2, 'Who starred as \"Jack\" in Titanic?', 'multiple_choice', 'easy', 1),
(9, 2, 'Which movie won Best Picture in 1994?', 'multiple_choice', 'easy', 2),
(10, 2, 'Which Disney movie features the song \"Let It Go\"?', 'open_ended', 'easy', 2),
(11, 2, 'In the Marvel movies, who is the \"Black Panther\"?', 'multiple_choice', 'medium', 2),
(12, 2, 'Who won the first season of Amerian Idol in 2002?', 'multiple_choice', 'hard', 5);

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `quiz_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`quiz_id`, `title`, `description`, `created_at`) VALUES
(1, 'Brain Warm-Up', 'Start light with fun and straightforward trivia.', '2025-08-29 16:16:40'),
(2, 'Movie & Pop Culture', 'Test your knowledge of films, music, and celebrity culture! From classic blockbusters to trending stars, this round is all about what\'s on the screen and in the spotlight.', '2025-08-29 16:30:26');

-- --------------------------------------------------------

--
-- Table structure for table `rounds`
--

CREATE TABLE `rounds` (
  `round_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `time_limit` int(11) DEFAULT 30
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rounds`
--

INSERT INTO `rounds` (`round_id`, `quiz_id`, `title`, `description`, `time_limit`) VALUES
(1, 1, 'Quick Facts (General Knowlege)', 'A light and simple start with everyday facts to warm up your brain and get you into quiz mode.', 30),
(2, 2, 'Silver Screen Classics', 'Questions about iconic movies and legendary actors.', 30);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `game_sessions`
--
ALTER TABLE `game_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`player_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `player_scores`
--
ALTER TABLE `player_scores`
  ADD PRIMARY KEY (`score_id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `player_id` (`player_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `round_id` (`round_id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`quiz_id`);

--
-- Indexes for table `rounds`
--
ALTER TABLE `rounds`
  ADD PRIMARY KEY (`round_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `game_sessions`
--
ALTER TABLE `game_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `player_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `player_scores`
--
ALTER TABLE `player_scores`
  MODIFY `score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rounds`
--
ALTER TABLE `rounds`
  MODIFY `round_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `game_sessions`
--
ALTER TABLE `game_sessions`
  ADD CONSTRAINT `game_sessions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE CASCADE;

--
-- Constraints for table `player_scores`
--
ALTER TABLE `player_scores`
  ADD CONSTRAINT `player_scores_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `game_sessions` (`session_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `player_scores_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `player_scores_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`round_id`) REFERENCES `rounds` (`round_id`) ON DELETE CASCADE;

--
-- Constraints for table `rounds`
--
ALTER TABLE `rounds`
  ADD CONSTRAINT `rounds_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`quiz_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

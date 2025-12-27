USE quiz_quest;

-- =====================
-- QUIZZES
-- =====================
INSERT INTO quizzes (title, description) VALUES
('Brain Warm-Up', 'Start light with fun and straightforward trivia.'),
('Movie & Pop Culture', 'Test your knowledge of films, music, and celebrity culture.');

-- =====================
-- ROUNDS
-- =====================
INSERT INTO rounds (quiz_id, title, description, time_limit) VALUES
(1, 'Quick Facts (General Knowledge)', 'Everyday facts to warm up your brain.', 30),
(2, 'Silver Screen Classics', 'Iconic movies and legendary actors.', 30);

-- =====================
-- QUESTIONS
-- =====================
INSERT INTO questions (round_id, question_text, question_type, difficulty, points) VALUES
(1, 'What is the capital of Italy?', 'multiple_choice', 'easy', 2),
(1, 'How many continents are there in the world?', 'open_ended', 'easy', 2),
(1, 'Who invented the light bulb?', 'multiple_choice', 'medium', 3),
(1, 'Which country hosted the first modern Olympic Games in 1896?', 'multiple_choice', 'medium', 3),
(1, 'What is the rarest blood type in humans?', 'multiple_choice', 'hard', 5),
(1, 'In what year did World War I begin?', 'open_ended', 'hard', 5),
(2, 'Who starred as "Jack" in Titanic?', 'multiple_choice', 'easy', 1),
(2, 'Which movie won Best Picture in 1994?', 'multiple_choice', 'easy', 2),
(2, 'Which Disney movie features the song "Let It Go"?', 'open_ended', 'easy', 2),
(2, 'In the Marvel movies, who is the "Black Panther"?', 'multiple_choice', 'medium', 2),
(2, 'Who won the first season of American Idol in 2002?', 'multiple_choice', 'hard', 5);

-- =====================
-- ANSWERS
-- =====================
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(1, 'Rome', 1), (1, 'Madrid', 0), (1, 'Athens', 0), (1, 'Berlin', 0),
(3, 'Nikola Tesla', 0), (3, 'Thomas Edison', 1), (3, 'Albert Einstein', 0), (3, 'Alexander Graham Bell', 0),
(4, 'Italy', 0), (4, 'Greece', 1), (4, 'France', 0), (4, 'Germany', 0),
(5, 'O-', 0), (5, 'AB-', 1), (5, 'B+', 0), (5, 'A-', 0),
(7, 'Brad Pitt', 0), (7, 'Leonardo DiCaprio', 1), (7, 'Tom Cruise', 0), (7, 'Johnny Depp', 0),
(8, 'Pulp Fiction', 0), (8, 'Forrest Gump', 1), (8, 'The Shawshank Redemption', 0), (8, 'Braveheart', 0),
(10, 'T\'Challa', 1), (10, 'Erik Killmonger', 0), (10, 'Shuri', 0), (10, 'M\'Baku', 0),
(11, 'Justin Guarini', 0), (11, 'Kelly Clarkson', 1), (11, 'Carrie Underwood', 0), (11, 'Jennifer Hudson', 0);

-- =====================
-- PLAYERS
-- =====================
INSERT INTO players (username, email) VALUES
('Max', NULL),
('Jake', NULL);

-- =====================
-- GAME SESSIONS
-- =====================
INSERT INTO game_sessions (quiz_id) VALUES
(1), (2), (1);

-- =====================
-- PLAYER SCORES
-- =====================
INSERT INTO player_scores (session_id, player_id, question_id, points_earned, answered_correctly, answer_text) VALUES
(1, 1, 1, 2, 1, 'Rome'),
(1, 1, 2, 2, 1, '7'),
(1, 1, 3, 3, 1, 'Thomas Edison'),
(2, 2, 7, 1, 1, 'Leonardo DiCaprio'),
(2, 2, 8, 2, 1, 'Forrest Gump'),
(3, 2, 1, 2, 1, 'Rome');

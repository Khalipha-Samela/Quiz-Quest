<?php
include 'config.php';
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Quest: The Ultimate Trivia Challenge</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Orbitron:wght@700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h1>Quiz Quest: The Ultimate Trivia Challenge</h1>
            <p>Test your knowledge and climb the leaderboard!</p>
        </header>
        
        <ul class="nav-tabs">
            <li><a href="#dashboard" class="active">Dashboard</a></li>
            <li><a href="#create-quiz">Create Quiz</a></li>
            <li><a href="#manage-rounds">Manage Rounds</a></li>
            <li><a href="#add-questions">Add Questions</a></li>
            <li><a href="#play-quiz">Play Quiz</a></li>
            <li><a href="#scores">Scores</a></li>
            <li><a href="#leaderboard">Leaderboard</a></li>
        </ul>
        
        <!-- Dashboard Tab -->
        <div id="dashboard" class="tab-content active">
            <h2>Welcome to Quiz Quest!</h2>
            <p>Select an option from the tabs above to get started.</p>
            
            <div class="flex-container">
                <div class="flex-item">
                    <h3>Recent Quizzes</h3>
                    <?php
                    $sql = "SELECT * FROM quizzes ORDER BY created_at DESC LIMIT 5";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<div class="quiz-card" data-tab="play-quiz" data-quiz-id="' . $row['quiz_id'] . '">';
                            echo '<h3>' . htmlspecialchars($row['title']) . '</h3>';
                            echo '<p>' . htmlspecialchars($row['description']) . '</p>';
                            echo '<div class="meta">';
                            echo '<span>Created: ' . date('M d, Y', strtotime($row['created_at'])) . '</span>';
                            echo '<span class="btn">Play Now</span>';
                            echo '</div>';
                            echo '</div>';
                        }
                    } else {
                        echo '<p>No quizzes found. Create your first quiz!</p>';
                    }
                    ?>
                </div>
                
                <div class="flex-item">
                    <h3>Top Players</h3>
                    <div class="leaderboard">
                        <?php
                        $sql = "SELECT p.username, SUM(ps.points_earned) as total_score 
                                FROM player_scores ps
                                JOIN players p ON ps.player_id = p.player_id
                                GROUP BY p.player_id
                                ORDER BY total_score DESC
                                LIMIT 5";
                        $result = $conn->query($sql);
                        
                        if ($result->num_rows > 0) {
                            $rank = 1;
                            while($row = $result->fetch_assoc()) {
                                echo '<div class="leaderboard-item">';
                                echo '<span class="leaderboard-rank">' . $rank . '</span>';
                                echo '<span class="leaderboard-name">' . htmlspecialchars($row['username']) . '</span>';
                                echo '<span class="leaderboard-score">' . $row['total_score'] . ' pts</span>';
                                echo '</div>';
                                $rank++;
                            }
                        } else {
                            echo '<p>No player scores yet.</p>';
                        }
                        ?>
                    </div>
                    
                    <h3 style="margin-top: 30px;">Quick Stats</h3>
                    <div class="quiz-card">
                        <?php
                        // Get total quizzes
                        $sql = "SELECT COUNT(*) as total_quizzes FROM quizzes";
                        $result = $conn->query($sql);
                        $total_quizzes = $result->fetch_assoc()['total_quizzes'];
                        
                        // Get total questions
                        $sql = "SELECT COUNT(*) as total_questions FROM questions";
                        $result = $conn->query($sql);
                        $total_questions = $result->fetch_assoc()['total_questions'];
                        
                        // Get total players
                        $sql = "SELECT COUNT(*) as total_players FROM players";
                        $result = $conn->query($sql);
                        $total_players = $result->fetch_assoc()['total_players'];
                        ?>
                        <p>Total Quizzes: <strong><?php echo $total_quizzes; ?></strong></p>
                        <p>Total Questions: <strong><?php echo $total_questions; ?></strong></p>
                        <p>Registered Players: <strong><?php echo $total_players; ?></strong></p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Create Quiz Tab -->
        <div id="create-quiz" class="tab-content">
            <h2>Create a New Quiz</h2>
            <form id="quiz-form">
                <div class="form-group">
                    <label for="quiz-title">Quiz Title</label>
                    <input type="text" id="quiz-title" name="quiz-title" required>
                </div>
                
                <div class="form-group">
                    <label for="quiz-description">Description</label>
                    <textarea id="quiz-description" name="quiz-description" rows="3"></textarea>
                </div>
                
                <button type="submit" class="btn">Create Quiz</button>
            </form>
            
            <div id="quiz-response" style="margin-top: 20px;"></div>
            
            <h3 style="margin-top: 30px;">Your Quizzes</h3>
            <table id="quizzes-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $sql = "SELECT * FROM quizzes ORDER BY created_at DESC";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<tr>';
                            echo '<td>' . htmlspecialchars($row['title']) . '</td>';
                            echo '<td>' . htmlspecialchars($row['description']) . '</td>';
                            echo '<td>' . (!empty($row['created_at']) ? date('M d, Y', strtotime($row['created_at'])) : 'Not available') . '</td>';
                            echo '<td>';
                            echo '<button class="btn btn-danger" onclick="deleteQuiz(' . $row['quiz_id'] . ')">Delete</button>';
                            echo '</td>';
                            echo '</tr>';
                        }
                    } else {
                        echo '<tr><td colspan="4">No quizzes found</td></tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
        
        <!-- Manage Rounds Tab -->
        <div id="manage-rounds" class="tab-content">
            <h2>Manage Quiz Rounds</h2>
            
            <div class="form-group">
                <label for="round-quiz-select">Select Quiz</label>
                <select id="round-quiz-select" onchange="loadRounds(this.value)">
                    <option value="">-- Select a Quiz --</option>
                    <?php
                    $sql = "SELECT * FROM quizzes ORDER BY title";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<option value="' . $row['quiz_id'] . '">' . htmlspecialchars($row['title']) . '</option>';
                        }
                    }
                    ?>
                </select>
            </div>
            
            <div id="rounds-container" style="margin-top: 20px;">
                <p>Please select a quiz to view or add rounds.</p>
            </div>
        </div>
        
        <!-- Add Questions Tab -->
        <div id="add-questions" class="tab-content">
            <h2>Add Questions to Rounds</h2>
            
            <div class="form-group">
                <label for="question-quiz-select">Select Quiz</label>
                <select id="question-quiz-select" onchange="loadRoundsForQuestions(this.value)">
                    <option value="">-- Select a Quiz --</option>
                    <?php
                    $sql = "SELECT * FROM quizzes ORDER BY title";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<option value="' . $row['quiz_id'] . '">' . htmlspecialchars($row['title']) . '</option>';
                        }
                    }
                    ?>
                </select>
            </div>
            
            <div id="questions-round-container" style="margin-top: 20px;">
                <p>Please select a quiz to view or add questions.</p>
            </div>
        </div>
        
        <!-- Play Quiz Tab -->
        <div id="play-quiz" class="tab-content">
            <h2>Play Quiz</h2>
            
            <div class="form-group">
                <label for="play-quiz-select">Select Quiz</label>
                <select id="play-quiz-select" onchange="loadQuizDetails(this.value)">
                    <option value="">-- Select a Quiz --</option>
                    <?php
                    $sql = "SELECT * FROM quizzes ORDER BY title";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<option value="' . $row['quiz_id'] . '">' . htmlspecialchars($row['title']) . '</option>';
                        }
                    }
                    ?>
                </select>
            </div>
            
            <div id="player-setup" style="display: none; margin-top: 20px;">
                <h3>Player Setup</h3>
                <div class="form-group">
                    <label for="player-username">Your Username</label>
                    <input type="text" id="player-username" name="player-username" required>
                </div>
                <button class="btn" onclick="startQuiz()">Start Quiz</button>
            </div>
            
            <div id="quiz-play-area" style="display: none; margin-top: 20px;">
                <h3 id="round-title"></h3>
                <div class="timer" id="quiz-timer">30</div>
                
                <div class="progress-bar">
                    <div class="progress" id="quiz-progress" style="width: 0%"></div>
                </div>
                
                <div id="question-display">
                    <!-- Questions will be loaded here -->
                </div>
                
                <div id="quiz-navigation" style="text-align: center; margin-top: 20px;">
                    <button id="next-question-btn" class="btn" onclick="nextQuestion()" style="display: none;">Next Question</button>
                    <button id="finish-round-btn" class="btn btn-success" onclick="finishRound()" style="display: none;">Finish Round</button>
                </div>
            </div>
            
            <div id="quiz-results" style="display: none; margin-top: 20px;">
                <h3>Quiz Results</h3>
                <div id="score-display"></div>
                <button class="btn" onclick="resetQuiz()">Play Another Quiz</button>
            </div>
        </div>
        
        <!-- Scores Tab -->
        <div id="scores" class="tab-content">
            <h2>Score Management</h2>
            
            <div class="flex-container">
                <div class="flex-item">
                    <h3>Search Scores</h3>
                    <form id="score-search-form">
                        <div class="form-group">
                            <label for="search-player">Player Name</label>
                            <input type="text" id="search-player" name="search-player">
                        </div>
                        
                        <div class="form-group">
                            <label for="search-date">Quiz Date</label>
                            <input type="date" id="search-date" name="search-date">
                        </div>
                        
                        <div class="form-group">
                            <label for="search-difficulty">Difficulty Level</label>
                            <select id="search-difficulty" name="search-difficulty">
                                <option value="">-- Any Difficulty --</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn">Search</button>
                    </form>
                </div>
                
                <div class="flex-item">
                    <h3>Update Scores</h3>
                    <form id="score-update-form" style="display: none;">
                        <input type="hidden" id="update-score-id">
                        
                        <div class="form-group">
                            <label for="update-player">Player</label>
                            <input type="text" id="update-player" readonly>
                        </div>
                        
                        <div class="form-group">
                            <label for="update-question">Question</label>
                            <input type="text" id="update-question" readonly>
                        </div>
                        
                        <div class="form-group">
                            <label for="update-points">Points</label>
                            <input type="number" id="update-points" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="update-correct">Correct?</label>
                            <select id="update-correct" required>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-success">Update</button>
                        <button type="button" class="btn btn-danger" onclick="cancelUpdate()">Cancel</button>
                    </form>
                </div>
            </div>
            
            <div id="search-results" style="margin-top: 20px;">
                <h3>Search Results</h3>
                <table id="scores-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Quiz</th>
                            <th>Question</th>
                            <th>Difficulty</th>
                            <th>Points</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Results will be loaded here -->
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Leaderboard Tab -->
        <div id="leaderboard" class="tab-content">
            <h2>Leaderboard</h2>
            
            <div class="form-group">
                <label for="leaderboard-quiz-select">Filter by Quiz (optional)</label>
                <select id="leaderboard-quiz-select" onchange="loadLeaderboard()">
                    <option value="">-- All Quizzes --</option>
                    <?php
                    $sql = "SELECT * FROM quizzes ORDER BY title";
                    $result = $conn->query($sql);
                    
                    if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                            echo '<option value="' . $row['quiz_id'] . '">' . htmlspecialchars($row['title']) . '</option>';
                        }
                    }
                    ?>
                </select>
            </div>
            
            <div class="leaderboard" id="leaderboard-results" style="margin-top: 20px;">
                <h3>Top Players</h3>
                <?php
                $sql = "SELECT p.username, SUM(ps.points_earned) as total_score 
                        FROM player_scores ps
                        JOIN players p ON ps.player_id = p.player_id
                        GROUP BY p.player_id
                        ORDER BY total_score DESC
                        LIMIT 10";
                $result = $conn->query($sql);
                
                if ($result->num_rows > 0) {
                    $rank = 1;
                    while($row = $result->fetch_assoc()) {
                        echo '<div class="leaderboard-item">';
                        echo '<span class="leaderboard-rank">' . $rank . '</span>';
                        echo '<span class="leaderboard-name">' . htmlspecialchars($row['username']) . '</span>';
                        echo '<span class="leaderboard-score">' . $row['total_score'] . ' pts</span>';
                        echo '</div>';
                        $rank++;
                    }
                } else {
                    echo '<p>No player scores yet.</p>';
                }
                ?>
            </div>
        </div>
    </div>
    
    <!-- Modal for question results -->
    <div class="modal" id="result-modal">
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <span class="result-emoji" id="result-emoji"></span>
            <h2 id="result-title"></h2>
            <p id="result-message"></p>
            <button class="btn" onclick="closeModal()">Continue</button>
        </div>
    </div>
    
    <script src="js/utils.js"></script>
    <script src="js/navigation.js"></script>
    <script src="js/state.js"></script>
    <script src="js/quiz_play.js"></script>
    <script src="js/quizzes.js"></script>
    <script src="js/rounds.js"></script>
    <script src="js/questions.js"></script>
    <script src="js/scores.js"></script>
    <script src="js/app.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
</body>
</html>
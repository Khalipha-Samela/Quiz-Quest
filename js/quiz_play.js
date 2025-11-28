async function loadQuizDetails(quizId) {
    if (!quizId) return;
    try {
        const response = await fetch(`api/quizzes/get_quiz_details.php?quiz_id=${quizId}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        quizState.currentQuiz = data;

        quizState.totalQuestions = 0;
        if (data.rounds) {
            data.rounds.forEach(r => quizState.totalQuestions += r.questions?.length || 0);
        }

        document.getElementById('player-setup').style.display = 'block';
        document.getElementById('quiz-play-area').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'none';
    } catch (err) {
        console.error('Error loading quiz details:', err);
        showError('Failed to load quiz details');
        throw err;
    }
}

async function startQuiz() {
    const quizId = document.getElementById('play-quiz-select').value;
    const username = document.getElementById('player-username').value.trim();

    if (!quizId) return showError('Please select a quiz first');
    if (!username) return showError('Please enter a username');

    try {
        const playerResp = await fetch('api/players/get_or_create_player.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        if (!playerResp.ok) throw new Error('Failed to create player');
        const playerData = await playerResp.json();
        if (!playerData.success) throw new Error(playerData.message);
        quizState.playerId = playerData.player_id;

        const sessionResp = await fetch('api/sessions/create_game_session.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quiz_id: quizId, player_id: quizState.playerId })
        });
        if (!sessionResp.ok) throw new Error('Failed to create session');
        const sessionData = await sessionResp.json();
        if (!sessionData.success) throw new Error(sessionData.message);

        quizState.sessionId = sessionData.session_id;
        quizState.currentRoundIndex = 0;
        quizState.currentQuestionIndex = 0;
        quizState.questionsAnswered = 0;

        document.getElementById('player-setup').style.display = 'none';
        document.getElementById('quiz-play-area').style.display = 'block';
        document.getElementById('quiz-progress').style.width = '0%';

        loadNextQuestion();
    } catch (err) {
        console.error('Error starting quiz:', err);
        showError('Error starting quiz: ' + err.message);
    }
}

function loadNextQuestion() {
    if (!quizState.currentQuiz ||
        quizState.currentRoundIndex >= quizState.currentQuiz.rounds.length) {
        finishQuiz(); return;
    }

    const round = quizState.currentQuiz.rounds[quizState.currentRoundIndex];
    if (quizState.currentQuestionIndex >= round.questions.length) {
        quizState.currentRoundIndex++;
        quizState.currentQuestionIndex = 0;
        if (quizState.currentRoundIndex >= quizState.currentQuiz.rounds.length) {
            finishQuiz(); return;
        }
        loadNextQuestion(); return;
    }

    displayQuestion(round);
    startTimer(round.time_limit);
}

function displayQuestion(round) {
    const q = round.questions[quizState.currentQuestionIndex];
    document.getElementById('round-title').textContent = round.title;

    const progress = (quizState.questionsAnswered / quizState.totalQuestions) * 100;
    document.getElementById('quiz-progress').style.width = `${progress}%`;

    document.getElementById('question-display').innerHTML = `
        <div class="question-container">
            <h4>
                Question ${quizState.currentQuestionIndex + 1} of ${round.questions.length}
                <span class="badge-${q.difficulty}">${q.difficulty}</span>
                <span style="float:right;">${q.points} pts</span>
            </h4>
            <p>${escapeHtml(q.question_text)}</p>
            <div class="options-container">
                ${q.question_type === 'multiple_choice' ?
                    q.answers.map((a, i) => `
                        <div class="option" onclick="selectAnswer(${i})" id="option-${i}">
                            ${escapeHtml(a.answer_text)}
                        </div>
                    `).join('') :
                    `<textarea id="open-ended-answer" rows="3" placeholder="Your answer..."></textarea>`
                }
            </div>
        </div>
    `;

    quizState.selectedAnswer = null;
    document.getElementById('next-question-btn').style.display = 'inline-block';
    document.getElementById('finish-round-btn').style.display = 'none';
}

function selectAnswer(i) {
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    const opt = document.getElementById(`option-${i}`);
    if (opt) {
        opt.classList.add('selected');
        quizState.selectedAnswer = i;
    }
}

function showResult(isCorrect, message) {
    const modal = document.getElementById('result-modal');
    if (!modal) return;
    const emoji = document.getElementById('result-emoji');
    const title = document.getElementById('result-title');
    const msg = document.getElementById('result-message');

    if (isCorrect) {
        emoji.textContent = '✓'; emoji.className = 'result-emoji result-correct';
        title.textContent = 'Correct!'; title.className = 'result-correct';
        createConfetti();
    } else {
        emoji.textContent = '✗'; emoji.className = 'result-emoji result-incorrect';
        title.textContent = 'Incorrect'; title.className = 'result-incorrect';
    }
    msg.textContent = message;
    modal.style.display = 'flex';
}
function closeModal() {
    const modal = document.getElementById('result-modal');
    if (modal) modal.style.display = 'none';
}

function nextQuestion() {
    const round = quizState.currentQuiz.rounds[quizState.currentRoundIndex];
    const q = round.questions[quizState.currentQuestionIndex];
    if (q.question_type === 'multiple_choice') {
        if (quizState.selectedAnswer === null) return alert('Please select an answer');
        submitAnswer(quizState.selectedAnswer);
    } else {
        const ans = document.getElementById('open-ended-answer').value.trim();
        if (!ans) return alert('Please enter an answer');
        submitAnswer(ans);
    }
    const check = setInterval(() => {
        if (document.getElementById('result-modal').style.display === 'none') {
            clearInterval(check); loadNextQuestion();
        }
    }, 100);
}

async function submitAnswer(answer) {
    try {
        clearTimer();
        quizState.questionsAnswered++;
        const round = quizState.currentQuiz.rounds[quizState.currentRoundIndex];
        const q = round.questions[quizState.currentQuestionIndex];

        let isCorrect = false, points = 0, ansText = '', correctText = '';
        if (q.question_type === 'multiple_choice') {
            ansText = answer !== null ? q.answers[answer]?.answer_text : 'No answer';
            isCorrect = answer !== null && q.answers[answer]?.is_correct;
            correctText = q.answers.find(a => a.is_correct)?.answer_text || '';
        } else {
            ansText = answer || 'No answer';
            isCorrect = ansText.toLowerCase() === q.correct_answer.toLowerCase();
            correctText = q.correct_answer;
        }
        points = isCorrect ? q.points : 0;
        showResult(isCorrect, isCorrect ? `You earned ${points} points!` : `Correct: ${correctText}`);

        const resp = await fetch('api/scores/record_score.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: quizState.sessionId,
                player_id: quizState.playerId,
                question_id: q.question_id,
                points_earned: points,
                answered_correctly: isCorrect,
                answer_text: ansText,
                difficulty: q.difficulty
            })
        });
        const data = await resp.json();
        if (!data.success) throw new Error(data.message || 'Failed to record score');

        quizState.currentQuestionIndex++;
        if (quizState.currentQuestionIndex >= round.questions.length) {
            document.getElementById('next-question-btn').style.display = 'none';
            document.getElementById('finish-round-btn').style.display = 'inline-block';
        } else {
            document.getElementById('next-question-btn').style.display = 'inline-block';
            document.getElementById('finish-round-btn').style.display = 'none';
        }
    } catch (err) {
        console.error('Error in submitAnswer:', err);
        showError('Error processing your answer: ' + err.message);
    }
}

function finishRound() {
    const round = quizState.currentQuiz.rounds[quizState.currentRoundIndex];
    const q = round.questions[quizState.currentQuestionIndex];
    if (q.question_type === 'multiple_choice') {
        submitAnswer(quizState.selectedAnswer);
    } else {
        const ans = document.getElementById('open-ended-answer').value.trim();
        submitAnswer(ans);
    }
    const check = setInterval(() => {
        if (document.getElementById('result-modal').style.display === 'none') {
            clearInterval(check); loadNextQuestion();
        }
    }, 100);
}

async function finishQuiz() {
    clearTimer();
    document.getElementById('quiz-play-area').style.display = 'none';
    document.getElementById('quiz-progress').style.width = '100%';
    try {
        const resp = await fetch(`api/sessions/get_session_score.php?session_id=${quizState.sessionId}`);
        if (!resp.ok) throw new Error('Failed to get final score');
        const data = await resp.json();

        const div = document.getElementById('quiz-results');
        div.style.display = 'block';

        let msg = '';
        if (data.total_score >= 40) { msg = '🎊 Excellent!'; createConfetti(); }
        else if (data.total_score >= 20) msg = '🎉 Good job!';
        else msg = '😇 Keep practicing!';
        div.innerHTML = `
            <h3>Quiz Completed!</h3>
            <p>Your score: <strong style="font-size:1.5rem;color:var(--accent);">${data.total_score}</strong></p>
            <p>${msg}</p>
            <button class="btn" onclick="resetQuiz()">Play Again</button>
        `;
    } catch (err) {
        console.error('Error finishing quiz:', err);
        showError('Failed to load results');
    }
}

function resetQuiz() {
    resetQuizState();
    document.getElementById('play-quiz-select').value = '';
    document.getElementById('player-username').value = '';
    document.getElementById('player-setup').style.display = 'none';
    document.getElementById('quiz-play-area').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'none';
}

// Quiz State
let quizState = {
    currentQuiz: null,
    currentRoundIndex: 0,
    currentQuestionIndex: 0,
    playerId: null,
    sessionId: null,
    timeLeft: 0,
    selectedAnswer: null,
    totalQuestions: 0,
    questionsAnswered: 0
};

function resetQuizState() {
    quizState = {
        currentQuiz: null,
        currentRoundIndex: 0,
        currentQuestionIndex: 0,
        playerId: null,
        sessionId: null,
        timeLeft: 0,
        selectedAnswer: null,
        totalQuestions: 0,
        questionsAnswered: 0
    };
    clearTimer();
}

// Timer handling
let quizTimer = null;

function clearTimer() {
    if (quizTimer) {
        clearInterval(quizTimer);
        quizTimer = null;
    }
    if (quizState.timerTimeout) {
        clearTimeout(quizState.timerTimeout);
        quizState.timerTimeout = null;
    }
}

function startTimer(seconds) {
    clearTimer();
    quizState.timeLeft = seconds;
    updateTimerDisplay();
    quizTimer = setInterval(() => {
        quizState.timeLeft--;
        updateTimerDisplay();
        if (quizState.timeLeft <= 0) {
            clearInterval(quizTimer);
            timeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const el = document.getElementById('quiz-timer');
    if (!el) return;
    el.textContent = quizState.timeLeft;
    if (quizState.timeLeft <= 5) {
        el.style.color = 'var(--danger)';
    } else if (quizState.timeLeft <= 10) {
        el.style.color = 'var(--warning)';
    } else {
        el.style.color = 'var(--accent)';
    }
}

function timeUp() {
    showResult(false, "Time's up!");
    submitAnswer(null);
}

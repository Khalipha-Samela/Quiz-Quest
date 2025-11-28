// Tab Switching
function switchTab(tabId, quizId = null) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-tabs a').forEach(tab => tab.classList.remove('active'));

    const tabContent = document.getElementById(tabId);
    if (tabContent) tabContent.classList.add('active');

    const tabLink = document.querySelector(`.nav-tabs a[href="#${tabId}"]`);
    if (tabLink) tabLink.classList.add('active');

    if (quizId && tabId === 'play-quiz') {
        const select = document.getElementById('play-quiz-select');
        if (select) {
            select.value = quizId;
            const loadPromise = loadQuizDetails(quizId);
            if (loadPromise?.then) loadPromise.catch(err => showError('Failed to load quiz details'));
        }
    }

    switch(tabId) {
        case 'leaderboard': loadLeaderboard()?.catch(err => showError('Failed to load leaderboard')); break;
        case 'scores': loadAllScores()?.catch(err => showError('Failed to load scores')); break;
    }
}

// Init selects
async function initQuizSelects() {
    try {
        const response = await fetch('api/quizzes/get_quizzes.php');
        if (!response.ok) throw new Error('Failed to load quizzes');
        const data = await response.json();
        const selects = [
            document.getElementById('play-quiz-select'),
            document.getElementById('leaderboard-quiz-select'),
            document.getElementById('round-quiz-select'),
            document.getElementById('questions-quiz-select')
        ].filter(Boolean);

        selects.forEach(select => {
            select.innerHTML = '<option value="">Select a quiz</option>';
            data.forEach(quiz => {
                select.innerHTML += `<option value="${quiz.quiz_id}">${escapeHtml(quiz.title)}</option>`;
            });
        });
    } catch (err) {
        console.error('Error initializing quiz selects:', err);
        throw err;
    }
}

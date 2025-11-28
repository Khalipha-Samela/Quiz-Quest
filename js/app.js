// Initialize App
async function initApp() {
    try {
        await initQuizSelects();
        document.getElementById('score-search-form')?.addEventListener('submit', e => {
            e.preventDefault();
            loadAllScores().catch(() => showError('Failed to load scores'));
        });

        document.getElementById('quiz-form')?.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            btn.disabled = true;
            try {
                const title = document.getElementById('quiz-title').value.trim();
                if (!title) throw new Error('Quiz title required');
                const desc = document.getElementById('quiz-description').value.trim();
                const resp = await fetch('api/quizzes/create_quiz.php', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description: desc })
                });
                const data = await resp.json();
                if (data.success) { showSuccess('Quiz created!'); this.reset(); loadQuizzesTable(); }
                else throw new Error(data.message);
            } catch (err) {
                showError(err.message);
            } finally { btn.disabled = false; }
        });

        document.querySelectorAll('.nav-tabs a').forEach(tab => {
            tab.addEventListener('click', e => {
                e.preventDefault();
                switchTab(tab.getAttribute('href').substring(1));
            });
        });

        document.addEventListener('click', e => {
            const card = e.target.closest('.quiz-card');
            if (card) switchTab(card.dataset.tab, card.dataset.quizId);
        });

        if (window.location.hash) switchTab(window.location.hash.substring(1));
        else switchTab('home');

        resetQuizState();
    } catch (err) {
        console.error('Init error:', err);
        showError('Failed to initialize app');
    }
}
document.addEventListener('DOMContentLoaded', initApp);

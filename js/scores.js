function loadAllScores() {
    const player = document.getElementById('search-player').value.trim();
    const date = document.getElementById('search-date').value;
    const difficulty = document.getElementById('search-difficulty').value;

    let url = 'api/scores/get_scores.php?';
    if (player) url += `player=${encodeURIComponent(player)}&`;
    if (date) url += `date=${date}&`;
    if (difficulty) url += `difficulty=${difficulty}&`;

    return fetch(url)
        .then(r => r.json())
        .then(data => {
            const tbody = document.querySelector('#scores-table tbody');
            tbody.innerHTML = '';
            if (data.length > 0) {
                data.forEach(s => {
                    let badge = s.difficulty === 'easy' ? '<span class="badge badge-easy">Easy</span>'
                        : s.difficulty === 'medium' ? '<span class="badge badge-medium">Medium</span>'
                        : '<span class="badge badge-hard">Hard</span>';
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${escapeHtml(s.username)}</td>
                        <td>${escapeHtml(s.quiz_title)}</td>
                        <td>${escapeHtml(s.question_text)}</td>
                        <td>${badge}</td>
                        <td>${s.points_earned}</td>
                        <td>${formatDate(s.session_date)}</td>
                        <td><button class="btn btn-warning"
                            onclick="showUpdateForm(${s.score_id}, '${escapeHtml(s.username)}',
                                '${escapeHtml(s.question_text)}', ${s.points_earned}, ${s.answered_correctly ? 1 : 0})">
                            Update</button></td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="7">No scores found</td></tr>';
            }
        });
}

function showUpdateForm(id, player, question, points, correct) {
    document.getElementById('update-score-id').value = id;
    document.getElementById('update-player').value = player;
    document.getElementById('update-question').value = question;
    document.getElementById('update-points').value = points;
    document.getElementById('update-correct').value = correct;
    document.getElementById('score-update-form').style.display = 'block';
}
function cancelUpdate() {
    document.getElementById('score-update-form').style.display = 'none';
}

document.getElementById('score-update-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('update-score-id').value;
    const points = document.getElementById('update-points').value;
    const correct = document.getElementById('update-correct').value;

    fetch('api/scores/update_score.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score_id: id, points_earned: points, answered_correctly: correct })
    })
    .then(r => r.json())
    .then(d => {
        if (d.success) {
            showSuccess('Score updated');
            cancelUpdate();
            loadAllScores();
        } else throw new Error(d.message);
    })
    .catch(err => showError(err.message));
});

async function loadLeaderboard() {
    const quizId = document.getElementById('leaderboard-quiz-select').value;
    let url = 'api/scores/get_leaderboard.php';
    if (quizId) url += `?quiz_id=${quizId}`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        const c = document.getElementById('leaderboard-results');
        c.innerHTML = '<h3>Top Players</h3>';
        if (data.length > 0) {
            data.forEach((p, i) => {
                let trophy = i === 0 ? '🏆 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : '';
                const div = document.createElement('div');
                div.className = 'leaderboard-item';
                div.innerHTML = `
                    <span class="leaderboard-rank">${trophy}${i + 1}</span>
                    <span class="leaderboard-name">${escapeHtml(p.username)}</span>
                    <span class="leaderboard-score">${p.total_score} pts</span>
                `;
                c.appendChild(div);
            });
        } else c.innerHTML += '<p>No scores yet.</p>';
    } catch (err) {
        showError('Failed to load leaderboard: ' + err.message);
    }
}

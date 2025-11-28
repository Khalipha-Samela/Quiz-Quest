// Quiz Management
async function loadQuizzesTable() {
    try {
        const resp = await fetch('api/quizzes/get_quizzes.php');
        if (!resp.ok) throw new Error('Failed to load quizzes');
        const data = await resp.json();
        const tbody = document.querySelector('#quizzes-table tbody');
        tbody.innerHTML = '';
        if (data.length > 0) {
            data.forEach(q => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${escapeHtml(q.title)}</td>
                    <td>${escapeHtml(q.description)}</td>
                    <td>${formatDate(q.created_at)}</td>
                    <td><button class="btn btn-danger" onclick="deleteQuiz(${q.quiz_id})">Delete</button></td>
                `;
                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="4">No quizzes found</td></tr>';
        }
    } catch (err) {
        console.error('Error loading quizzes:', err);
        showError('Failed to load quizzes');
    }
}

async function deleteQuiz(id) {
    if (!confirm('Delete this quiz and all its data?')) return;
    try {
        const resp = await fetch('api/quizzes/delete_quiz.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quiz_id: id })
        });
        const data = await resp.json();
        if (data.success) { showSuccess('Quiz deleted!'); loadQuizzesTable(); }
        else throw new Error(data.message);
    } catch (err) {
        console.error('Error deleting quiz:', err);
        showError('Failed to delete quiz: ' + err.message);
    }
}

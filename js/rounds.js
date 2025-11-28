async function loadRounds(quizId) {
    if (!quizId) return;
    
    try {
        const response = await fetch(`api/rounds/get_rounds.php?quiz_id=${quizId}`);
        if (!response.ok) throw new Error('Failed to load rounds');
        
        const data = await response.json();
        const container = document.getElementById('rounds-container');
        if (!container) return;
        
        if (data.length > 0) {
            let html = `
                <h3>Rounds for Selected Quiz</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Round Title</th>
                            <th>Description</th>
                            <th>Time Limit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            data.forEach(round => {
                html += `
                    <tr>
                        <td>${escapeHtml(round.title)}</td>
                        <td>${escapeHtml(round.description)}</td>
                        <td>${round.time_limit} seconds</td>
                        <td>
                            <button class="btn btn-danger" onclick="deleteRound(${round.round_id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            `;
            
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>No rounds found for this quiz.</p>';
        }
        
        // Add form to create new round
        container.innerHTML += `
            <h3 style="margin-top: 30px;">Add New Round</h3>
            <form id="round-form">
                <input type="hidden" id="round-quiz-id" value="${quizId}">
                
                <div class="form-group">
                    <label for="round-title">Round Title</label>
                    <input type="text" id="round-title" name="round-title" required>
                </div>
                
                <div class="form-group">
                    <label for="round-description">Description</label>
                    <textarea id="round-description" name="round-description" rows="3"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="round-time-limit">Time Limit (seconds)</label>
                    <input type="number" id="round-time-limit" name="round-time-limit" min="10" value="30" required>
                </div>
                
                <button type="submit" class="btn">Add Round</button>
            </form>
        `;
        
        // Add event listener for the new form
        document.getElementById('round-form')?.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            
            try {
                submitButton.disabled = true;
                
                const quizId = document.getElementById('round-quiz-id').value;
                const title = document.getElementById('round-title').value.trim();
                const description = document.getElementById('round-description').value.trim();
                const timeLimit = document.getElementById('round-time-limit').value;
                
                if (!title) {
                    throw new Error('Round title is required');
                }
                
                const response = await fetch('api/rounds/create_round.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        quiz_id: quizId, 
                        title, 
                        description, 
                        time_limit: timeLimit 
                    }),
                });
                
                if (!response.ok) throw new Error('Failed to create round');
                
                const data = await response.json();
                if (data.success) {
                    showSuccess('Round created successfully!');
                    document.getElementById('round-form').reset();
                    await loadRounds(quizId);
                } else {
                    throw new Error(data.message || 'Failed to create round');
                }
            } catch (error) {
                console.error('Error creating round:', error);
                showError('Failed to create round: ' + error.message);
            } finally {
                submitButton.disabled = false;
            }
        });
    } catch (error) {
        console.error('Error loading rounds:', error);
        showError('Failed to load rounds');
    }
}

async function deleteRound(id) {
    if (!confirm('Delete this round and its questions?')) return;
    try {
        const resp = await fetch('api/rounds/delete_round.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ round_id: id })
        });
        const data = await resp.json();
        if (data.success) {
            showSuccess('Round deleted');
            const quizId = document.getElementById('round-quiz-select').value;
            loadRounds(quizId);
        } else throw new Error(data.message);
    } catch (err) {
        showError('Failed to delete round: ' + err.message);
    }
}

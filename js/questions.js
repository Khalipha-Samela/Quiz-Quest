async function loadRoundsForQuestions(quizId) {
    if (!quizId) return;

    try {
        const response = await fetch(`api/rounds/get_rounds.php?quiz_id=${quizId}`);
        if (!response.ok) throw new Error('Failed to load rounds');
        
        const data = await response.json();
        const container = document.getElementById('questions-round-container');
        if (!container) return;
            
        if (data.length > 0) {
            let html = `
                <h3>Rounds for Selected Quiz</h3>
                <div class="rounds-list">
            `;
            
            data.forEach(round => {
                html += `
                    <div class="round-item" style="margin-bottom: 30px;">
                        <h4>${escapeHtml(round.title)}</h4>
                        <p>${escapeHtml(round.description)}</p>
                            
                        <button class="btn" onclick="showQuestionForm(${round.round_id})">Add Question</button>
                            
                        <div id="questions-round-${round.round_id}" style="margin-top: 20px;">
                            <!-- Questions will be loaded here -->
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
            container.innerHTML = html;
            
            // Load questions for each round
            await Promise.all(data.map(round => loadQuestionsForRound(round.round_id)));
        } else {
            container.innerHTML = '<p>No rounds found for this quiz. Please add rounds first.</p>';
        }
    } catch (error) {
        console.error('Error loading rounds for questions:', error);
        showError('Failed to load rounds');
    }
}

function showQuestionForm(roundId) {
    const container = document.getElementById(`questions-round-${roundId}`);
    if (!container) return;
    
    container.innerHTML = `
        <h5>Add New Question</h5>
        <form id="question-form-${roundId}" class="question-form">
            <input type="hidden" name="round_id" value="${roundId}">
            
            <div class="form-group">
                <label for="question-text-${roundId}">Question Text</label>
                <textarea id="question-text-${roundId}" name="question_text" rows="3" required></textarea>
            </div>
            
            <div class="form-group">
                <label for="question-type-${roundId}">Question Type</label>
                <select id="question-type-${roundId}" name="question_type" required onchange="toggleAnswerOptions(${roundId})">
                    <option value="">-- Select Type --</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="open_ended">Open Ended</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="question-difficulty-${roundId}">Difficulty</label>
                <select id="question-difficulty-${roundId}" name="difficulty" required>
                    <option value="">-- Select Difficulty --</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="question-points-${roundId}">Points</label>
                <input type="number" id="question-points-${roundId}" name="points" min="1" value="1" required>
            </div>
            
            <div id="answer-options-${roundId}" style="display: none;">
                <h5>Answer Options (for multiple choice)</h5>
                <div id="options-container-${roundId}">
                    <div class="option-group">
                        <input type="text" name="options[]" placeholder="Option text" required>
                        <label><input type="radio" name="correct_option" value="0" required> Option</label>
                    </div>
                    <div class="option-group">
                        <input type="text" name="options[]" placeholder="Option text" required>
                        <label><input type="radio" name="correct_option" value="1"> Option</label>
                    </div>
                </div>
                <button type="button" class="btn btn-warning" onclick="addOption(${roundId})">Add Option</button>
            </div>
            
            <div id="correct-answer-${roundId}" style="display: none;">
                <div class="form-group">
                    <label for="correct-answer-text-${roundId}">Correct Answer (for open ended)</label>
                    <input type="text" id="correct-answer-text-${roundId}" name="correct_answer">
                </div>
            </div>
            
            <button type="submit" class="btn">Add Question</button>
        </form>
    `;
    
    // Add event listener for the form
    document.getElementById(`question-form-${roundId}`)?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitButton = this.querySelector('button[type="submit"]');
        
        try {
            submitButton.disabled = true;
            await handleQuestionFormSubmit(this);
        } catch (error) {
            console.error('Error submitting question:', error);
            showError(error.message);
        } finally {
            submitButton.disabled = false;
        }
    });
}

function toggleAnswerOptions(roundId) {
    const questionType = document.getElementById(`question-type-${roundId}`).value;
    const answerOptions = document.getElementById(`answer-options-${roundId}`);
    const correctAnswer = document.getElementById(`correct-answer-${roundId}`);
    
    if (questionType === 'multiple_choice') {
        if (answerOptions) answerOptions.style.display = 'block';
        if (correctAnswer) correctAnswer.style.display = 'none';
        
        // Make multiple choice fields required
        document.querySelectorAll(`#options-container-${roundId} input[name="options[]"]`).forEach(input => {
            input.required = true;
        });
        document.querySelectorAll(`#options-container-${roundId} input[name="correct_option"]`).forEach(input => {
            input.required = true;
        });
        
        // Make open-ended field not required
        const correctAnswerInput = document.getElementById(`correct-answer-text-${roundId}`);
        if (correctAnswerInput) correctAnswerInput.required = false;
    } 
    else if (questionType === 'open_ended') {
        if (answerOptions) answerOptions.style.display = 'none';
        if (correctAnswer) correctAnswer.style.display = 'block';
        
        // Make open-ended field required
        const correctAnswerInput = document.getElementById(`correct-answer-text-${roundId}`);
        if (correctAnswerInput) correctAnswerInput.required = true;
        
        // Make multiple choice fields not required
        document.querySelectorAll(`#options-container-${roundId} input[name="options[]"]`).forEach(input => {
            input.required = false;
        });
        document.querySelectorAll(`#options-container-${roundId} input[name="correct_option"]`).forEach(input => {
            input.required = false;
        });
    } 
    else {
        if (answerOptions) answerOptions.style.display = 'none';
        if (correctAnswer) correctAnswer.style.display = 'none';
        
        // Make all fields not required
        document.querySelectorAll(`#options-container-${roundId} input[name="options[]"]`).forEach(input => {
            input.required = false;
        });
        document.querySelectorAll(`#options-container-${roundId} input[name="correct_option"]`).forEach(input => {
            input.required = false;
        });
        const correctAnswerInput = document.getElementById(`correct-answer-text-${roundId}`);
        if (correctAnswerInput) correctAnswerInput.required = false;
    }
}

async function handleQuestionFormSubmit(form) {
    const fd = new FormData(form);
    const type = fd.get('question_type');
    const data = {
        round_id: fd.get('round_id'),
        question_text: fd.get('question_text'),
        question_type: type,
        difficulty: fd.get('difficulty'),
        points: fd.get('points')
    };

    if (type === 'multiple_choice') {
        const options = [];
        let correct = null;
        form.querySelectorAll('input[name="options[]"]').forEach((el, i) => {
            options.push(el.value.trim());
            if (form.querySelector(`input[name="correct_option"][value="${i}"]`)?.checked) correct = i;
        });
        if (correct === null) return alert('Mark a correct option');
        data.options = options;
        data.correct_option = correct;
    } else if (type === 'open_ended') {
        const ans = fd.get('correct_answer')?.trim();
        if (!ans) return alert('Enter correct answer');
        data.correct_answer = ans;
    }

    try {
        const resp = await fetch('api/questions/create_question.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const res = await resp.json();
        if (res.success) {
            alert('Question added!');
            form.reset();
            loadQuestionsForRound(data.round_id);
        } else throw new Error(res.message);
    } catch (err) {
        showError('Failed to add question: ' + err.message);
    }
}

function addOption(roundId) {
    const c = document.getElementById(`options-container-${roundId}`);
    const count = c.children.length;
    const div = document.createElement('div');
    div.className = 'option-group';
    div.innerHTML = `
        <input type="text" name="options[]" placeholder="Option text" required>
        <label><input type="radio" name="correct_option" value="${count}" required> Correct</label>
    `;
    c.appendChild(div);
}

async function loadQuestionsForRound(roundId) {
    try {
        const response = await fetch(`api/questions/get_questions.php?round_id=${roundId}`);
        if (!response.ok) throw new Error('Failed to load questions');
        
        const data = await response.json();
        const container = document.getElementById(`questions-round-${roundId}`);
        if (!container) return;
        
        const questionsContainer = document.createElement('div');
        questionsContainer.className = 'questions-list';
        
        if (data.length > 0) {
            questionsContainer.innerHTML = '<h5>Existing Questions</h5>';
            
            data.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-item';
                questionDiv.style.marginBottom = '20px';
                questionDiv.style.padding = '10px';
                questionDiv.style.border = '1px solid rgba(255,255,255,0.1)';
                questionDiv.style.borderRadius = '5px';
                
                // Add difficulty badge
                let difficultyBadge = '';
                if (question.difficulty === 'easy') {
                    difficultyBadge = '<span class="badge badge-easy">Easy</span>';
                } else if (question.difficulty === 'medium') {
                    difficultyBadge = '<span class="badge badge-medium">Medium</span>';
                } else {
                    difficultyBadge = '<span class="badge badge-hard">Hard</span>';
                }
                
                questionDiv.innerHTML = `
                    <p><strong>Question:</strong> ${escapeHtml(question.question_text)}</p>
                    <p><strong>Type:</strong> ${question.question_type.replace('_', ' ')} ${difficultyBadge}</p>
                    <p><strong>Points:</strong> ${question.points}</p>
                    <button class="btn btn-danger" onclick="deleteQuestion(${question.question_id}, ${roundId})">Delete</button>
                `;
                
                questionsContainer.appendChild(questionDiv);
            });
        } else {
            questionsContainer.innerHTML = '<p>No questions yet for this round.</p>';
        }
        
        // Insert after the form if it exists, or at the end
        const form = container.querySelector('.question-form');
        if (form) {
            form.insertAdjacentElement('afterend', questionsContainer);
        } else {
            container.appendChild(questionsContainer);
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Failed to load questions');
    }
}

async function deleteQuestion(id, roundId) {
    if (!confirm('Delete this question?')) return;
    try {
        const resp = await fetch('api/questions/delete_question.php', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question_id: id })
        });
        const data = await resp.json();
        if (data.success) {
            showSuccess('Question deleted');
            loadQuestionsForRound(roundId);
        } else throw new Error(data.message);
    } catch (err) {
        showError('Failed to delete question: ' + err.message);
    }
}

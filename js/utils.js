// Utility Functions
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
    if (!dateString || dateString === '0000-00-00 00:00:00') return 'Not available';
    try {
        const dateParts = dateString.split(' ')[0].split('-');
        const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        if (isNaN(date.getTime())) return dateString;
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    } catch (e) {
        console.error('Date format error:', e);
        return dateString;
    }
}

function showError(message) {
    const alertsContainer = document.getElementById('alerts-container') || document.body;
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger';
    alertDiv.textContent = message;
    alertsContainer.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

function showSuccess(message) {
    const alertsContainer = document.getElementById('alerts-container') || document.body;
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.textContent = message;
    alertsContainer.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    container.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none; z-index: 1000;
    `;
    document.body.appendChild(container);

    const colors = ['#3a86ff','#8338ec','#06d6a0','#ffd166','#ef476f'];
    const confettiElements = [];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.position = 'absolute';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animation = `fall ${Math.random() * 2 + 2}s linear ${Math.random() * 2}s forwards`;
        container.appendChild(confetti);
        confettiElements.push(confetti);
    }

    setTimeout(() => {
        confettiElements.forEach(c => c.style.animation = 'none');
        container.remove();
    }, 5000);
}

const gameModeSelect = document.getElementById('game-mode');
const questionsContainer = document.getElementById('questions-container');
const descriptionEl = document.getElementById('mode-description');

const classicDescription = "<b>Mode Klasik</b> adalah mode santai tanpa batas waktu. Kamu bisa mengatur sendiri jumlah soalnya.";
const timeAttackDescription = "<b>Mode Time Attack</b> menantangmu menyelesaikan soal sebanyak mungkin sebelum waktu habis. Waktu bergantung pada tingkat kesulitan.";

const classicInput = `
    <input type="number" class="form-control" id="num-questions" name="num-questions" value="10" min="5" max="46">
    <label for="num-questions">Jumlah Soal</label>
`;
const timeAttackInput = `
    <select class="form-select" id="num-questions" name="num-questions">
        <option value="10">Cepat (10 Soal)</option>
        <option value="20">Sedang (20 Soal)</option>
        <option value="46">Maraton (46 Soal)</option>
    </select>
    <label for="num-questions">Jumlah Soal</label>
`;

function updateForm() {
    if (gameModeSelect.value === 'time-attack') {
        questionsContainer.innerHTML = timeAttackInput;
        descriptionEl.innerHTML = timeAttackDescription;
    } else {
        questionsContainer.innerHTML = classicInput;
        descriptionEl.innerHTML = classicDescription;
    }
}

// Initial setup
updateForm();
gameModeSelect.addEventListener('change', updateForm);

document.getElementById('settings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    localStorage.setItem('gameMode', gameModeSelect.value);
    localStorage.setItem('difficulty', document.getElementById('difficulty').value);
    localStorage.setItem('numQuestions', document.getElementById('num-questions').value);
    localStorage.setItem('quizType', 'hiragana');
    window.location.href = 'quiz.html';
});
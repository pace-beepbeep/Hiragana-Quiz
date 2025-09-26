// --- ELEMEN HTML ---
const hiraganaCharEl = document.getElementById('hiragana-char');
const optionsContainerEl = document.getElementById('options-container');
const resultTextEl = document.getElementById('result-text');
const nextButtonEl = document.getElementById('next-button');
const questionCounterEl = document.getElementById('question-counter');
const progressBarEl = document.getElementById('progress-bar');
const timerDisplayEl = document.getElementById('timer-display');
const timeLeftEl = document.getElementById('time-left');

// --- PENGATURAN & STATE KUIS ---
const numQuestions = parseInt(localStorage.getItem('numQuestions')) || 10;
const gameMode = localStorage.getItem('gameMode') || 'classic';
const difficulty = localStorage.getItem('difficulty') || 'medium';

let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let timer;
let allHiraganaData = []; // Akan diisi dari JSON

// --- FUNGSI LOGIKA ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateQuizQuestions(hiraganaData) {
    let questionPool = [...hiraganaData.basic];
    if (difficulty === 'medium') {
        const extraChars = shuffleArray([...hiraganaData.advanced]).slice(0, Math.floor(hiraganaData.advanced.length * 0.25));
        questionPool.push(...extraChars);
    } else if (difficulty === 'hard') {
        // Untuk mode sulit, kita gabungkan semua hiragana
        questionPool.push(...hiraganaData.advanced);
    }
    allHiraganaData = [...hiraganaData.basic, ...hiraganaData.advanced];
    quizQuestions = shuffleArray(questionPool).slice(0, numQuestions);
}

function getNumberOfOptions() {
    if (difficulty === 'easy') return 2;
    if (difficulty === 'hard') return 6;
    return 4;
}

function loadQuestion() {
    const progressPercentage = ((currentQuestionIndex) / numQuestions) * 100;
    progressBarEl.style.width = `${progressPercentage}%`;
    resultTextEl.textContent = '';
    nextButtonEl.classList.add('d-none');
    optionsContainerEl.innerHTML = '';
    const currentQuestion = quizQuestions[currentQuestionIndex];
    hiraganaCharEl.textContent = currentQuestion.hiragana;
    questionCounterEl.textContent = `Soal ${currentQuestionIndex + 1} / ${numQuestions}`;
    const numOptions = getNumberOfOptions();
    const options = [currentQuestion.romaji];
    const wrongAnswers = allHiraganaData.map(item => item.romaji).filter(r => r !== currentQuestion.romaji);
    options.push(...shuffleArray(wrongAnswers).slice(0, numOptions - 1));
    shuffleArray(options).forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline-secondary';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, button));
        optionsContainerEl.appendChild(button);
    });
}

function checkAnswer(selectedRomaji, selectedButton) {
    const correctAnswer = quizQuestions[currentQuestionIndex].romaji;
    const buttons = optionsContainerEl.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) button.classList.add('btn-correct');
        else button.classList.add('btn-faded');
    });
    if (selectedRomaji !== correctAnswer) {
        selectedButton.classList.remove('btn-faded');
        selectedButton.classList.add('btn-incorrect');
        resultTextEl.textContent = 'Salah!';
        resultTextEl.style.color = 'var(--bs-danger)';
    } else {
        score++;
        resultTextEl.textContent = 'Benar!';
        resultTextEl.style.color = 'var(--bs-success)';
    }
    nextButtonEl.classList.remove('d-none');
}

function goToResultsPage(timesUp = false) {
    clearInterval(timer);
    const finalScore = Math.round((score / numQuestions) * 100);
    localStorage.setItem('finalScore', finalScore);
    localStorage.setItem('correctAnswers', score);
    localStorage.setItem('totalQuestions', numQuestions);
    if (timesUp) localStorage.setItem('timesUp', 'true');
    window.location.href = 'hasil.html';
}

// --- FUNGSI TIMER (tetap sama) ---
function getTotalTime() {
    if (difficulty === 'easy') return 3 * 60;
    if (difficulty === 'hard') return 1.5 * 60;
    return 2 * 60;
}

function startGlobalTimer() {
    let timeLeft = getTotalTime();
    timerDisplayEl.classList.remove('d-none');

    timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        timeLeftEl.textContent = `${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            goToResultsPage(true);
        }
        timeLeft--;
    }, 1000);
}

// --- EVENT LISTENERS ---
nextButtonEl.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < numQuestions) {
        loadQuestion();
    } else {
        progressBarEl.style.width = `100%`;
        setTimeout(() => goToResultsPage(false), 500);
    }
});

// --- INISIALISASI KUIS UTAMA ---
async function startQuiz() {
    localStorage.removeItem('timesUp');
    try {
        // 1. Ambil data dari file JSON
        const response = await fetch('data.json');
        const hiraganaData = await response.json();

        // 2. Lanjutkan logika kuis setelah data berhasil didapat
        generateQuizQuestions(hiraganaData);
        loadQuestion();
        if (gameMode === 'time-attack') {
            startGlobalTimer();
        }
    } catch (error) {
        console.error("Gagal memuat data hiragana:", error);
        document.body.innerHTML = "<p>Gagal memuat data kuis. Silakan kembali dan coba lagi.</p>";
    }
}

// Mulai kuis
startQuiz();
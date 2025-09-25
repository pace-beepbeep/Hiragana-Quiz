// --- DATABASE KUIS (TIDAK BERUBAH) ---
const basicHiragana = [
    { hiragana: "あ", romaji: "a" }, { hiragana: "い", romaji: "i" }, { hiragana: "う", romaji: "u" }, { hiragana: "え", romaji: "e" }, { hiragana: "お", romaji: "o" },
    { hiragana: "か", romaji: "ka" }, { hiragana: "き", romaji: "ki" }, { hiragana: "く", romaji: "ku" }, { hiragana: "け", romaji: "ke" }, { hiragana: "こ", romaji: "ko" },
    { hiragana: "さ", romaji: "sa" }, { hiragana: "し", romaji: "shi" }, { hiragana: "す", romaji: "su" }, { hiragana: "せ", romaji: "se" }, { hiragana: "そ", romaji: "so" },
    { hiragana: "た", romaji: "ta" }, { hiragana: "ち", romaji: "chi" }, { hiragana: "つ", romaji: "tsu" }, { hiragana: "て", romaji: "te" }, { hiragana: "と", romaji: "to" },
    { hiragana: "な", romaji: "na" }, { hiragana: "に", romaji: "ni" }, { hiragana: "ぬ", romaji: "nu" }, { hiragana: "ね", romaji: "ne" }, { hiragana: "の", romaji: "no" },
    { hiragana: "は", romaji: "ha" }, { hiragana: "ひ", romaji: "hi" }, { hiragana: "ふ", romaji: "fu" }, { hiragana: "へ", romaji: "he" }, { hiragana: "ほ", romaji: "ho" },
    { hiragana: "ま", romaji: "ma" }, { hiragana: "み", romaji: "mi" }, { hiragana: "む", romaji: "mu" }, { hiragana: "め", romaji: "me" }, { hiragana: "も", romaji: "mo" },
    { hiragana: "や", romaji: "ya" }, { hiragana: "ゆ", romaji: "yu" }, { hiragana: "よ", romaji: "yo" },
    { hiragana: "ら", romaji: "ra" }, { hiragana: "り", romaji: "ri" }, { hiragana: "る", romaji: "ru" }, { hiragana: "れ", romaji: "re" }, { hiragana: "ろ", romaji: "ro" },
    { hiragana: "わ", romaji: "wa" }, { hiragana: "を", romaji: "wo" }, { hiragana: "ん", romaji: "n" }
];
const advancedHiragana = [
    { hiragana: "が", romaji: "ga" }, { hiragana: "ぎ", romaji: "gi" }, { hiragana: "ぐ", romaji: "gu" }, { hiragana: "げ", romaji: "ge" }, { hiragana: "ご", romaji: "go" }, { hiragana: "ざ", romaji: "za" }, { hiragana: "じ", romaji: "ji" }, { hiragana: "ず", romaji: "zu" }, { hiragana: "ぜ", romaji: "ze" }, { hiragana: "ぞ", romaji: "zo" }, { hiragana: "だ", romaji: "da" }, { hiragana: "ぢ", romaji: "ji" }, { hiragana: "づ", romaji: "zu" }, { hiragana: "で", romaji: "de" }, { hiragana: "ど", romaji: "do" }, { hiragana: "ば", romaji: "ba" }, { hiragana: "び", romaji: "bi" }, { hiragana: "ぶ", romaji: "bu" }, { hiragana: "べ", romaji: "be" }, { hiragana: "ぼ", romaji: "bo" }, { hiragana: "ぱ", romaji: "pa" }, { hiragana: "ぴ", romaji: "pi" }, { hiragana: "ぷ", romaji: "pu" }, { hiragana: "ぺ", romaji: "pe" }, { hiragana: "ぽ", romaji: "po" }, { hiragana: "きゃ", romaji: "kya" }, { hiragana: "きゅ", romaji: "kyu" }, { hiragana: "きょ", romaji: "kyo" }, { hiragana: "ぎゃ", romaji: "gya" }, { hiragana: "ぎゅ", romaji: "gyu" }, { hiragana: "ぎょ", romaji: "gyo" }, { hiragana: "にゃ", romaji: "nya" }, { hiragana: "にゅ", romaji: "nyu" }, { hiragana: "にょ", romaji: "nyo" }, { hiragana: "ひゃ", romaji: "hya" }, { hiragana: "ひゅ", romaji: "hyu" }, { hiragana: "ひょ", romaji: "hyo" }, { hiragana: "みゃ", romaji: "mya" }, { hiragana: "みゅ", romaji: "myu" }, { hiragana: "みょ", romaji: "myo" }, { hiragana: "りゃ", romaji: "rya" }, { hiragana: "りゅ", romaji: "ryu" }, { hiragana: "りょ", romaji: "ryo" }
];
const allHiraganaData = [...basicHiragana, ...advancedHiragana];

// --- AMBIL PENGATURAN KUIS ---
const numQuestions = parseInt(localStorage.getItem('numQuestions')) || 10;
const gameMode = localStorage.getItem('gameMode') || 'classic';
const difficulty = localStorage.getItem('difficulty') || 'medium';

// --- ELEMEN HTML ---
const hiraganaCharEl = document.getElementById('hiragana-char');
const optionsContainerEl = document.getElementById('options-container');
const resultTextEl = document.getElementById('result-text');
const nextButtonEl = document.getElementById('next-button');
const questionCounterEl = document.getElementById('question-counter');
const progressBarEl = document.getElementById('progress-bar');
const timerDisplayEl = document.getElementById('timer-display');
const timeLeftEl = document.getElementById('time-left');

// --- STATE KUIS ---
let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let timer; // Hanya ada satu timer global

// --- FUNGSI LOGIKA (Tidak banyak berubah) ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateQuizQuestions() {
    let questionPool = [...basicHiragana];
    if (difficulty === 'medium') {
        const extraChars = shuffleArray([...advancedHiragana]).slice(0, Math.floor(advancedHiragana.length * 0.25));
        questionPool.push(...extraChars);
    } else if (difficulty === 'hard') {
        const extraChars = shuffleArray([...advancedHiragana]).slice(0, Math.floor(advancedHiragana.length * 0.6));
        questionPool.push(...extraChars);
    }
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
    // Timer tidak dihentikan di sini lagi
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
    clearInterval(timer); // Hentikan timer global saat kuis selesai
    const finalScore = Math.round((score / numQuestions) * 100);
    localStorage.setItem('finalScore', finalScore);
    localStorage.setItem('correctAnswers', score);
    localStorage.setItem('totalQuestions', numQuestions);
    if (timesUp) localStorage.setItem('timesUp', 'true');
    window.location.href = 'hasil.html';
}

// === FUNGSI TIMER BARU ===
function getTotalTime() {
    // Waktu dalam detik berdasarkan kesulitan
    if (difficulty === 'easy') return 3 * 60;   // 3 menit
    if (difficulty === 'hard') return 1.5 * 60; // 1.5 menit (90 detik)
    return 2 * 60;                              // 2 menit (Normal)
}

function startGlobalTimer() {
    let timeLeft = getTotalTime();
    timerDisplayEl.classList.remove('d-none');

    timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds; // Format 09, 08, etc.

        timeLeftEl.textContent = `${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            goToResultsPage(true);
        }
        timeLeft--;
    }, 1000);
}
// =========================

nextButtonEl.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < numQuestions) {
        loadQuestion();
    } else {
        progressBarEl.style.width = `100%`;
        setTimeout(() => goToResultsPage(false), 500);
    }
});

function startQuiz() {
    localStorage.removeItem('timesUp');
    generateQuizQuestions();
    loadQuestion();
    if (gameMode === 'time-attack') {
        startGlobalTimer();
    }
}

startQuiz();
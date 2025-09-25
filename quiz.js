// --- DATABASE KUIS ---
const hiraganaData = [
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

// --- AMBIL PENGATURAN KUIS DARI LOCALSTORAGE ---
const numQuestions = parseInt(localStorage.getItem('numQuestions')) || 10;
const quizType = localStorage.getItem('quizType') || 'hiragana';

// --- ELEMEN HTML ---
const hiraganaCharEl = document.getElementById('hiragana-char');
const optionsContainerEl = document.getElementById('options-container');
const resultTextEl = document.getElementById('result-text');
const nextButtonEl = document.getElementById('next-button');
const questionCounterEl = document.getElementById('question-counter');

// --- STATE KUIS ---
let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];

// --- FUNGSI-FUNGSI ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateQuizQuestions() {
    let allData = [];
    if (quizType === 'hiragana') {
        allData = [...hiraganaData];
    }
    // Tambahkan 'else if' untuk katakana di masa depan
    
    const shuffledData = shuffleArray(allData);
    quizQuestions = shuffledData.slice(0, numQuestions);
}

function loadQuestion() {
    resultTextEl.textContent = '';
    resultTextEl.className = '';
    nextButtonEl.classList.add('hidden');
    optionsContainerEl.innerHTML = '';

    const currentQuestion = quizQuestions[currentQuestionIndex];
    hiraganaCharEl.textContent = currentQuestion.hiragana;
    questionCounterEl.textContent = `Soal ${currentQuestionIndex + 1} / ${numQuestions}`;

    // Buat Opsi Jawaban (1 benar, 3 salah)
    const options = [currentQuestion.romaji];
    const allRomaji = hiraganaData.map(item => item.romaji);
    const wrongAnswers = allRomaji.filter(r => r !== currentQuestion.romaji);
    shuffleArray(wrongAnswers);
    options.push(...wrongAnswers.slice(0, 3));
    
    shuffleArray(options).forEach(option => {
        const button = document.createElement('button');
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
        if (button.textContent !== correctAnswer) {
            button.classList.add('faded');
        }
    });

    if (selectedRomaji === correctAnswer) {
        score++;
        selectedButton.classList.add('correct');
        resultTextEl.textContent = 'Benar! 🎉';
        resultTextEl.classList.add('text-correct');
    } else {
        selectedButton.classList.add('incorrect-choice');
        buttons.forEach(button => {
            if (button.textContent === correctAnswer) {
                button.classList.add('correct');
                button.classList.remove('faded');
            }
        });
        resultTextEl.textContent = `Salah! Jawaban: ${correctAnswer}`;
        resultTextEl.classList.add('text-incorrect');
    }
    
    nextButtonEl.classList.remove('hidden');
}

function goToResultsPage() {
    const finalScore = Math.round((score / numQuestions) * 100);
    localStorage.setItem('finalScore', finalScore);
    localStorage.setItem('correctAnswers', score);
    localStorage.setItem('totalQuestions', numQuestions);
    window.location.href = 'hasil.html';
}

nextButtonEl.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < numQuestions) {
        loadQuestion();
    } else {
        goToResultsPage();
    }
});

// --- INISIALISASI KUIS ---
function startQuiz() {
    generateQuizQuestions();
    loadQuestion();
}

startQuiz();
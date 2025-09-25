// --- DATA KUIS (SEMUA HIRAGANA DASAR) ---
const quizData = [
    // a, i, u, e, o
    { hiragana: "あ", romaji: "a" }, { hiragana: "い", romaji: "i" }, { hiragana: "う", romaji: "u" }, { hiragana: "え", romaji: "e" }, { hiragana: "お", romaji: "o" },
    // ka, ki, ku, ke, ko
    { hiragana: "か", romaji: "ka" }, { hiragana: "き", romaji: "ki" }, { hiragana: "く", romaji: "ku" }, { hiragana: "け", romaji: "ke" }, { hiragana: "こ", romaji: "ko" },
    // sa, shi, su, se, so
    { hiragana: "さ", romaji: "sa" }, { hiragana: "し", romaji: "shi" }, { hiragana: "す", romaji: "su" }, { hiragana: "せ", romaji: "se" }, { hiragana: "そ", romaji: "so" },
    // ta, chi, tsu, te, to
    { hiragana: "た", romaji: "ta" }, { hiragana: "ち", romaji: "chi" }, { hiragana: "つ", romaji: "tsu" }, { hiragana: "て", romaji: "te" }, { hiragana: "と", romaji: "to" },
    // na, ni, nu, ne, no
    { hiragana: "な", romaji: "na" }, { hiragana: "に", romaji: "ni" }, { hiragana: "ぬ", romaji: "nu" }, { hiragana: "ね", romaji: "ne" }, { hiragana: "の", romaji: "no" },
    // ha, hi, fu, he, ho
    { hiragana: "は", romaji: "ha" }, { hiragana: "ひ", romaji: "hi" }, { hiragana: "ふ", romaji: "fu" }, { hiragana: "へ", romaji: "he" }, { hiragana: "ほ", romaji: "ho" },
    // ma, mi, mu, me, mo
    { hiragana: "ま", romaji: "ma" }, { hiragana: "み", romaji: "mi" }, { hiragana: "む", romaji: "mu" }, { hiragana: "め", romaji: "me" }, { hiragana: "も", romaji: "mo" },
    // ya, yu, yo
    { hiragana: "や", romaji: "ya" }, { hiragana: "ゆ", romaji: "yu" }, { hiragana: "よ", romaji: "yo" },
    // ra, ri, ru, re, ro
    { hiragana: "ら", romaji: "ra" }, { hiragana: "り", romaji: "ri" }, { hiragana: "る", romaji: "ru" }, { hiragana: "れ", romaji: "re" }, { hiragana: "ろ", romaji: "ro" },
    // wa, wo
    { hiragana: "わ", romaji: "wa" }, { hiragana: "を", romaji: "wo" },
    // n
    { hiragana: "ん", romaji: "n" }
];

// Tidak perlu lagi membuat URL gambar

// --- ELEMEN HTML ---
const hiraganaCharEl = document.getElementById('hiragana-char'); // Diubah dari hiraganaImageEl
const optionsContainerEl = document.getElementById('options-container');
const resultTextEl = document.getElementById('result-text');
const nextButtonEl = document.getElementById('next-button');

// --- STATE KUIS ---
let currentQuestionIndex = 0;
let shuffledQuizData = [];

// --- FUNGSI-FUNGSI ---

// Fungsi untuk mengacak urutan array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fungsi untuk memulai kuis atau memuat pertanyaan berikutnya
function loadQuestion() {
    resultTextEl.textContent = '';
    resultTextEl.className = '';
    nextButtonEl.classList.add('hidden');
    optionsContainerEl.innerHTML = '';

    const currentQuestion = shuffledQuizData[currentQuestionIndex];
    
    // === BAGIAN YANG DIUBAH ===
    // Tampilkan karakter hiragana sebagai teks di dalam div
    hiraganaCharEl.textContent = currentQuestion.hiragana;
    // =========================

    const options = [currentQuestion.romaji];
    const wrongAnswers = shuffledQuizData
        .filter(item => item.romaji !== currentQuestion.romaji)
        .map(item => item.romaji);
    shuffleArray(wrongAnswers);
    options.push(...wrongAnswers.slice(0, 3));
    shuffleArray(options);

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, button));
        optionsContainerEl.appendChild(button);
    });
}

// Fungsi untuk memeriksa jawaban (Tidak ada perubahan di sini)
function checkAnswer(selectedRomaji, selectedButton) {
    const correctAnswer = shuffledQuizData[currentQuestionIndex].romaji;
    const buttons = optionsContainerEl.querySelectorAll('button');

    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent !== correctAnswer) {
            button.classList.add('faded');
        }
    });

    if (selectedRomaji === correctAnswer) {
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

// Event listener untuk tombol lanjut (Tidak ada perubahan di sini)
nextButtonEl.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex >= shuffledQuizData.length) {
        currentQuestionIndex = 0;
        alert("Hebat! Kamu sudah menyelesaikan semua karakter. Kuis akan diulang.");
        shuffleArray(shuffledQuizData);
    }
    loadQuestion();
});

// --- INISIALISASI KUIS ---
function startQuiz() {
    shuffledQuizData = [...quizData];
    shuffleArray(shuffledQuizData);
    currentQuestionIndex = 0;
    loadQuestion();
}

startQuiz();
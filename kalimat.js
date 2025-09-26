// --- ELEMEN HTML ---
const hiraganaSentenceEl = document.getElementById('hiragana-sentence');
const romajiSentenceEl = document.getElementById('romaji-sentence');
const optionsContainerEl = document.getElementById('options-container');
const resultTextEl = document.getElementById('result-text');
const nextButtonEl = document.getElementById('next-button');
const questionCounterEl = document.getElementById('question-counter');
const hintButtonEl = document.getElementById('hint-button');
const meaningTextEl = document.getElementById('meaning-text');

// --- STATE KUIS ---
const difficulty = localStorage.getItem('sentenceDifficulty') || 'easy';
let currentQuestionIndex = 0;
let currentBlankIndex = 0; // Untuk melacak blank ke berapa yang sedang dijawab
let score = 0;
let quizQuestions = [];
let hiraganaParticles = [];
let userAnswers = []; // Menyimpan jawaban sementara untuk soal multi-blank

// --- FUNGSI LOGIKA ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion() {
    // Reset UI
    resultTextEl.textContent = '';
    nextButtonEl.classList.add('d-none');
    optionsContainerEl.innerHTML = '';
    hintButtonEl.disabled = false;
    hintButtonEl.classList.remove('d-none');
    meaningTextEl.classList.add('d-none');
    currentBlankIndex = 0; // Reset blank index untuk soal baru
    userAnswers = []; // Reset jawaban sementara

    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionCounterEl.textContent = `Soal ${currentQuestionIndex + 1} / ${quizQuestions.length}`;

    displayCurrentSentenceState();
    loadOptionsForCurrentBlank();
}

// Fungsi baru untuk menampilkan kalimat sesuai state jawaban
function displayCurrentSentenceState() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    let hiraganaDisplay = currentQuestion.sentence;
    let romajiDisplay = currentQuestion.romaji;

    for (let i = 0; i < currentQuestion.blank.length; i++) {
        if (i < currentBlankIndex) { // Jika blank sudah dijawab
            hiraganaDisplay = hiraganaDisplay.replace('__', `<span class="correct-answer">${userAnswers[i].blank}</span>`);
            romajiDisplay = romajiDisplay.replace('__', `<span class="correct-answer-romaji">${userAnswers[i].answer}</span>`);
        } else if (i === currentBlankIndex) { // Blank yang aktif
            hiraganaDisplay = hiraganaDisplay.replace('__', `<span class="blank-space">[ ? ]</span>`);
            romajiDisplay = romajiDisplay.replace('__', `<span class="blank-space-romaji">[ ... ]</span>`);
        } else { // Blank yang akan datang
            hiraganaDisplay = hiraganaDisplay.replace('__', `<span class="blank-space-future">[ ? ]</span>`);
            romajiDisplay = romajiDisplay.replace('__', `<span class="blank-space-future-romaji">[ ... ]</span>`);
        }
    }
    hiraganaSentenceEl.innerHTML = hiraganaDisplay;
    romajiSentenceEl.innerHTML = romajiDisplay;
}

// Fungsi baru untuk memuat pilihan jawaban untuk blank yang aktif
function loadOptionsForCurrentBlank() {
    optionsContainerEl.innerHTML = '';
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswerForBlank = currentQuestion.answer[currentBlankIndex];

    const correctAnswerObject = hiraganaParticles.find(p => p.romaji === correctAnswerForBlank);
    const options = [correctAnswerObject];
    const wrongAnswers = hiraganaParticles.filter(p => p.romaji !== correctAnswerForBlank);
    options.push(...shuffleArray(wrongAnswers).slice(0, 3));

    shuffleArray(options).forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline-secondary';
        button.textContent = `${option.hiragana} (${option.romaji})`;
        button.dataset.romaji = option.romaji;
        button.addEventListener('click', () => checkAnswer(button.dataset.romaji, button));
        optionsContainerEl.appendChild(button);
    });
}

function checkAnswer(selectedRomaji, selectedButton) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer[currentBlankIndex];
    const buttons = optionsContainerEl.querySelectorAll('button');

    buttons.forEach(button => button.disabled = true); // Nonaktifkan pilihan

    if (selectedRomaji === correctAnswer) {
        selectedButton.classList.add('btn-correct');
        resultTextEl.textContent = 'Benar!';
        resultTextEl.style.color = 'var(--bs-success)';
        
        // Simpan jawaban yang benar
        userAnswers.push({ blank: currentQuestion.blank[currentBlankIndex], answer: correctAnswer });
        currentBlankIndex++;

        // Cek apakah masih ada blank lain di soal ini
        if (currentBlankIndex < currentQuestion.answer.length) {
            setTimeout(() => {
                displayCurrentSentenceState();
                loadOptionsForCurrentBlank();
                resultTextEl.textContent = '';
            }, 1000); // Tunggu sebentar lalu lanjut ke blank berikutnya
        } else {
            // Soal ini selesai
            score++;
            showFinalResultForQuestion();
        }
    } else {
        // Jawaban salah, soal ini dianggap gagal
        selectedButton.classList.add('btn-incorrect');
        resultTextEl.textContent = 'Salah!';
        resultTextEl.style.color = 'var(--bs-danger)';
        showFinalResultForQuestion(true); // Tampilkan jawaban benar
    }
}

function showFinalResultForQuestion(isWrong = false) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    // Tampilkan semua jawaban yang benar
    let finalHiragana = currentQuestion.sentence;
    let finalRomaji = currentQuestion.romaji;
    for (let i = 0; i < currentQuestion.blank.length; i++) {
        const spanClass = isWrong && i >= currentBlankIndex ? 'correct-answer-missed' : 'correct-answer';
        finalHiragana = finalHiragana.replace('__', `<span class="${spanClass}">${currentQuestion.blank[i]}</span>`);
        finalRomaji = finalRomaji.replace('__', `<span class="${spanClass}-romaji">${currentQuestion.answer[i]}</span>`);
    }
    hiraganaSentenceEl.innerHTML = finalHiragana;
    romajiSentenceEl.innerHTML = finalRomaji;
    
    meaningTextEl.textContent = `Artinya: "${currentQuestion.arti}"`;
    meaningTextEl.classList.remove('d-none');
    hintButtonEl.classList.add('d-none');
    nextButtonEl.classList.remove('d-none');
}

function goToResultsPage() {
    const finalScore = Math.round((score / quizQuestions.length) * 100);
    localStorage.setItem('finalScore', finalScore);
    localStorage.setItem('correctAnswers', score);
    localStorage.setItem('totalQuestions', quizQuestions.length);
    localStorage.setItem('quizType', 'kalimat'); // Tandai jenis kuis
    window.location.href = 'hasil.html';
}

// Event Listeners
nextButtonEl.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
    } else {
        goToResultsPage();
    }
});

// Hint tidak lagi praktis untuk multi-blank, jadi kita sederhanakan
hintButtonEl.addEventListener('click', () => {
    alert('Hint hanya tersedia untuk soal dengan satu bagian kosong.');
});

// INISIALISASI KUIS
async function startQuiz() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        quizQuestions = shuffleArray(data.sentenceQuestions[difficulty] || data.sentenceQuestions['easy']);
        hiraganaParticles = data.particles;

        // Tambahkan partikel khusus yang mungkin hanya ada di soal medium/sulit
        const extraParticles = [
            { hiragana: "まで", romaji: "made" }, { hiragana: "から", romaji: "kara" }, { hiragana: "の", romaji: "no" }
        ];
        hiraganaParticles.push(...extraParticles);

        loadQuestion();
    } catch (error) {
        console.error("Gagal memuat data kuis kalimat:", error);
        document.body.innerHTML = "<p>Gagal memuat data kuis. Silakan kembali dan coba lagi.</p>";
    }
}

startQuiz();
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
let currentBlankIndex = 0;
let score = 0;
let quizQuestions = [];
let hiraganaParticles = [];
let userAnswers = [];

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
    currentBlankIndex = 0;
    userAnswers = [];

    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionCounterEl.textContent = `Soal ${currentQuestionIndex + 1} / ${quizQuestions.length}`;

    // Logika baru: Cek apakah ini mode sulit dengan 2 jawaban
    if (difficulty === 'hard' && currentQuestion.answer.length > 1) {
        displayMultiBlankQuestion();
        loadMultiBlankOptions();
    } else {
        displayCurrentSentenceState();
        loadSingleBlankOptions();
    }
}

// --- LOGIKA UNTUK SOAL DENGAN SATU JAWABAN (SEQUENTIAL) ---

function displayCurrentSentenceState() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    let hiraganaDisplay = currentQuestion.sentence;
    let romajiDisplay = currentQuestion.romaji;

    for (let i = 0; i < currentQuestion.blank.length; i++) {
        if (i < currentBlankIndex) {
            hiraganaDisplay = hiraganaDisplay.replace('__', `<span class="correct-answer">${userAnswers[i].blank}</span>`);
            romajiDisplay = romajiDisplay.replace('__', `<span class="correct-answer-romaji">${userAnswers[i].answer}</span>`);
        } else if (i === currentBlankIndex) {
            hiraganaDisplay = hiraganaDisplay.replace('__', `<span class="blank-space">[ ? ]</span>`);
            romajiDisplay = romajiDisplay.replace('__', `<span class="blank-space-romaji">[ ... ]</span>`);
        } else {
            hiraganaDisplay = hiraganaDisplay.replace('__', `<span class="blank-space-future">[ ? ]</span>`);
            romajiDisplay = romajiDisplay.replace('__', `<span class="blank-space-future-romaji">[ ... ]</span>`);
        }
    }
    hiraganaSentenceEl.innerHTML = hiraganaDisplay;
    romajiSentenceEl.innerHTML = romajiDisplay;
}

function loadSingleBlankOptions() {
    optionsContainerEl.innerHTML = '';
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswerForBlank = currentQuestion.answer[currentBlankIndex];
    const correctAnswerObject = hiraganaParticles.find(p => p.romaji === correctAnswerForBlank) || { hiragana: '?', romaji: correctAnswerForBlank };
    const options = [correctAnswerObject];
    const wrongAnswers = hiraganaParticles.filter(p => p.romaji !== correctAnswerForBlank);
    options.push(...shuffleArray(wrongAnswers).slice(0, 3));

    shuffleArray(options).forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline-secondary';
        button.textContent = `${option.hiragana} (${option.romaji})`;
        button.dataset.romaji = option.romaji;
        button.addEventListener('click', () => checkSingleAnswer(button.dataset.romaji, button));
        optionsContainerEl.appendChild(button);
    });
}

function checkSingleAnswer(selectedRomaji, selectedButton) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer[currentBlankIndex];
    const buttons = optionsContainerEl.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);

    if (selectedRomaji === correctAnswer) {
        selectedButton.classList.add('btn-correct');
        resultTextEl.textContent = 'Benar!';
        resultTextEl.style.color = 'var(--bs-success)';
        userAnswers.push({ blank: currentQuestion.blank[currentBlankIndex], answer: correctAnswer });
        currentBlankIndex++;

        if (currentBlankIndex < currentQuestion.answer.length) {
            setTimeout(() => {
                displayCurrentSentenceState();
                loadSingleBlankOptions();
                resultTextEl.textContent = '';
            }, 1000);
        } else {
            score++;
            showFinalResultForQuestion();
        }
    } else {
        selectedButton.classList.add('btn-incorrect');
        resultTextEl.textContent = 'Salah!';
        resultTextEl.style.color = 'var(--bs-danger)';
        showFinalResultForQuestion(true);
    }
}


// --- LOGIKA BARU UNTUK SOAL SULIT DENGAN 2 JAWABAN SEKALIGUS ---

function displayMultiBlankQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    let hiraganaDisplay = currentQuestion.sentence.replace(/__/g, `<span class="blank-space">[ ? ]</span>`);
    let romajiDisplay = currentQuestion.romaji.replace(/__/g, `<span class="blank-space-romaji">[ ... ]</span>`);
    hiraganaSentenceEl.innerHTML = hiraganaDisplay;
    romajiSentenceEl.innerHTML = romajiDisplay;
}

function loadMultiBlankOptions() {
    optionsContainerEl.innerHTML = '';
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const numOptions = 4;

    const correctAnswerRomaji = currentQuestion.answer;
    const correctAnswerHiragana = correctAnswerRomaji.map(r => (hiraganaParticles.find(p => p.romaji === r) || {}).hiragana || '?');
    
    const correctOption = {
        text: `${correctAnswerHiragana.join(', ')} (${correctAnswerRomaji.join(', ')})`,
        value: correctAnswerRomaji.join(',')
    };
    const options = [correctOption];

    const wrongParticles = hiraganaParticles.filter(p => !correctAnswerRomaji.includes(p.romaji));

    while (options.length < numOptions) {
        let wrongPair = shuffleArray([...wrongParticles]).slice(0, 2);
        if (wrongPair.length < 2) break;
        let wrongOption = {
            text: `${wrongPair[0].hiragana}, ${wrongPair[1].hiragana} (${wrongPair[0].romaji}, ${wrongPair[1].romaji})`,
            value: `${wrongPair[0].romaji},${wrongPair[1].romaji}`
        };
        if (!options.some(o => o.value === wrongOption.value)) {
            options.push(wrongOption);
        }
    }

    shuffleArray(options).forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline-secondary';
        button.textContent = option.text;
        button.dataset.romajiPair = option.value;
        button.addEventListener('click', () => checkMultiAnswer(button.dataset.romajiPair, button));
        optionsContainerEl.appendChild(button);
    });
}

function checkMultiAnswer(selectedPair, selectedButton) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctPair = currentQuestion.answer.join(',');
    const buttons = optionsContainerEl.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.dataset.romajiPair === correctPair) {
            button.classList.add('btn-correct');
        } else {
            button.classList.add('btn-faded');
        }
    });

    if (selectedPair === correctPair) {
        score++;
        resultTextEl.textContent = 'Benar!';
        resultTextEl.style.color = 'var(--bs-success)';
    } else {
        selectedButton.classList.remove('btn-faded');
        selectedButton.classList.add('btn-incorrect');
        resultTextEl.textContent = 'Salah!';
        resultTextEl.style.color = 'var(--bs-danger)';
    }
    showFinalResultForQuestion(selectedPair !== correctPair);
}


// --- FUNGSI BERSAMA ---

function showFinalResultForQuestion(isWrong = false) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    let finalHiragana = currentQuestion.sentence;
    let finalRomaji = currentQuestion.romaji;

    currentQuestion.blank.forEach((blankChar, i) => {
        const spanClass = isWrong ? 'correct-answer-missed' : 'correct-answer';
        finalHiragana = finalHiragana.replace('__', `<span class="${spanClass}">${blankChar}</span>`);
        finalRomaji = finalRomaji.replace('__', `<span class="${spanClass}-romaji">${currentQuestion.answer[i]}</span>`);
    });

    hiraganaSentenceEl.innerHTML = finalHiragana;
    romajiSentenceEl.innerHTML = finalRomaji;
    meaningTextEl.textContent = `Artinya: "${currentQuestion.arti}"`;
    meaningTextEl.classList.remove('d-none');
    hintButtonEl.classList.add('d-none');
    nextButtonEl.classList.remove('d-none');
}

function goToResultsPage() {
    const finalScore = quizQuestions.length > 0 ? Math.round((score / quizQuestions.length) * 100) : 0;
    localStorage.setItem('finalScore', finalScore);
    localStorage.setItem('correctAnswers', score);
    localStorage.setItem('totalQuestions', quizQuestions.length);
    localStorage.setItem('quizType', 'kalimat');
    window.location.href = 'hasil.html';
}

nextButtonEl.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
    } else {
        goToResultsPage();
    }
});

hintButtonEl.addEventListener('click', () => {
    alert('Hint hanya tersedia untuk soal dengan satu bagian kosong.');
});

// INISIALISASI KUIS
async function startQuiz() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        const allQuestionsForDifficulty = data.sentenceQuestions[difficulty] || data.sentenceQuestions['easy'];
        const shuffledQuestions = shuffleArray(allQuestionsForDifficulty);
        quizQuestions = shuffledQuestions.slice(0, 15);
        
        if (quizQuestions.length === 0) {
            document.body.innerHTML = "<p>Tidak ada soal yang tersedia untuk tingkat kesulitan ini. Silakan kembali.</p>";
            return;
        }

        hiraganaParticles = data.particles;
        const extraParticles = [
            { hiragana: "まで", romaji: "made" }, { hiragana: "から", romaji: "kara" }, { hiragana: "の", romaji: "no" }
        ];
        hiraganaParticles.push(...extraParticles);
        hiraganaParticles = hiraganaParticles.filter((particle, index, self) =>
            index === self.findIndex((p) => (p.romaji === particle.romaji && p.hiragana === particle.hiragana))
        );

        loadQuestion();
    } catch (error) {
        console.error("Gagal memuat data kuis kalimat:", error);
        document.body.innerHTML = "<p>Gagal memuat data kuis. Silakan kembali dan coba lagi.</p>";
    }
}

startQuiz();
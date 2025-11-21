// Game State
let currentQuestion = 0;
let score = 0;
let startTime = null;
let timerInterval = null;
let correctAnswer = 0;

// DOM Elements
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');
const questionElement = document.getElementById('question');
const questionNumberElement = document.getElementById('questionNumber');
const timerElement = document.getElementById('timer');
const answerButtons = [
    document.getElementById('answer1'),
    document.getElementById('answer2'),
    document.getElementById('answer3'),
    document.getElementById('answer4')
];
const finalScoreElement = document.getElementById('finalScore');
const finalTimeElement = document.getElementById('finalTime');
const restartBtn = document.getElementById('restartBtn');

// Initialize Game
function initGame() {
    currentQuestion = 0;
    score = 0;
    startTime = Date.now();
    
    // Clear existing timer if any
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Start timer
    timerInterval = setInterval(updateTimer, 1000);
    
    // Show game screen
    gameScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    
    // Load first question
    loadQuestion();
}

// Update Timer
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = elapsed;
}

// Generate Random Math Problem (answer <= 10)
function generateProblem() {
    const operators = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let num1, num2, answer;
    
    if (operator === '+') {
        // For addition: ensure num1 + num2 <= 10
        answer = Math.floor(Math.random() * 11); // 0 to 10
        num1 = Math.floor(Math.random() * (answer + 1));
        num2 = answer - num1;
    } else {
        // For subtraction: ensure result >= 0 and <= 10
        num1 = Math.floor(Math.random() * 11); // 0 to 10
        num2 = Math.floor(Math.random() * (num1 + 1));
        answer = num1 - num2;
    }
    
    return {
        question: `${num1} ${operator} ${num2}`,
        answer: answer
    };
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate Answer Options
function generateOptions(correctAnswer) {
    const options = [correctAnswer];
    
    // Create pool of all possible answers (0-10) excluding correct answer
    const availableOptions = [];
    for (let i = 0; i <= 10; i++) {
        if (i !== correctAnswer) {
            availableOptions.push(i);
        }
    }
    
    // Shuffle available options using Fisher-Yates
    shuffleArray(availableOptions);
    
    // Take first 3 as wrong answers
    for (let i = 0; i < 3 && i < availableOptions.length; i++) {
        options.push(availableOptions[i]);
    }
    
    // Shuffle all options using Fisher-Yates
    return shuffleArray(options);
}

// Load Question
function loadQuestion() {
    if (currentQuestion >= 10) {
        endGame();
        return;
    }
    
    // Generate problem
    const problem = generateProblem();
    correctAnswer = problem.answer;
    
    // Update question display
    questionElement.textContent = problem.question;
    questionNumberElement.textContent = currentQuestion + 1;
    
    // Generate and display options
    const options = generateOptions(correctAnswer);
    options.forEach((option, index) => {
        answerButtons[index].textContent = option;
        answerButtons[index].className = 'answer-btn';
        answerButtons[index].disabled = false;
    });
}

// Handle Answer Click
function handleAnswer(selectedButton, selectedAnswer) {
    // Disable all buttons
    answerButtons.forEach(btn => btn.disabled = true);
    
    // Check if correct
    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
        selectedButton.classList.add('correct');
        score += 10;
    } else {
        selectedButton.classList.add('wrong');
        // Highlight correct answer
        answerButtons.forEach(btn => {
            if (parseInt(btn.textContent) === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    
    // Move to next question after short delay
    currentQuestion++;
    setTimeout(() => {
        loadQuestion();
    }, 800);
}

// End Game
function endGame() {
    // Stop timer
    clearInterval(timerInterval);
    
    // Calculate time
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    
    // Show results
    finalScoreElement.textContent = score;
    finalTimeElement.textContent = `${totalTime} 秒`;
    
    // Switch to result screen
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
}

// Event Listeners
answerButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const selectedAnswer = parseInt(btn.textContent);
        handleAnswer(btn, selectedAnswer);
    });
});

restartBtn.addEventListener('click', () => {
    initGame();
});

// Start game on load
initGame();

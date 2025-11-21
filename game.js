// Game State
let currentQuestion = 0;
let score = 0;
let startTime = null;
let timerInterval = null;
let correctAnswer = 0;

// Level constants
const LEVELS = {
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction',
    MULTIPLICATION: 'multiplication'
};
let currentLevel = null;

// DOM Elements
const levelScreen = document.getElementById('levelScreen');
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
const additionLevelBtn = document.getElementById('additionLevel');
const subtractionLevelBtn = document.getElementById('subtractionLevel');
const multiplicationLevelBtn = document.getElementById('multiplicationLevel');
const perfectScoreModal = document.getElementById('perfectScoreModal');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

// Start game with selected level
function startGame(level) {
    currentLevel = level;
    levelScreen.classList.add('hidden');
    initGame();
}

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

// Generate Random Math Problem based on level
function generateProblem() {
    if (currentLevel === LEVELS.ADDITION) {
        return generateAdditionProblem();
    } else if (currentLevel === LEVELS.SUBTRACTION) {
        return generateSubtractionProblem();
    } else if (currentLevel === LEVELS.MULTIPLICATION) {
        return generateMultiplicationProblem();
    }
}

// Generate Addition Problem (0-10, answer <= 10)
function generateAdditionProblem() {
    const answer = Math.floor(Math.random() * 11); // 0 to 10
    const num1 = Math.floor(Math.random() * (answer + 1));
    const num2 = answer - num1;
    
    return {
        question: `${num1} + ${num2}`,
        answer: answer,
        maxAnswer: 10
    };
}

// Generate Subtraction Problem (0-10, no negative answer)
function generateSubtractionProblem() {
    const num1 = Math.floor(Math.random() * 11); // 0 to 10
    const num2 = Math.floor(Math.random() * (num1 + 1));
    const answer = num1 - num2;
    
    return {
        question: `${num1} - ${num2}`,
        answer: answer,
        maxAnswer: 10
    };
}

// Generate Multiplication Problem (1-9 × 1-9)
function generateMultiplicationProblem() {
    const num1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const num2 = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const answer = num1 * num2;
    
    return {
        question: `${num1} × ${num2}`,
        answer: answer,
        maxAnswer: 81
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
function generateOptions(correctAnswer, maxAnswer) {
    const options = [correctAnswer];
    const OPTION_RANGE = 5; // Range around correct answer for wrong options
    const MAX_ATTEMPTS = 20; // Prevent infinite loop
    
    // Create pool of possible wrong answers
    const availableOptions = [];
    const minOption = Math.max(0, correctAnswer - OPTION_RANGE);
    const maxOption = Math.min(maxAnswer, correctAnswer + OPTION_RANGE);
    
    for (let i = minOption; i <= maxOption; i++) {
        if (i !== correctAnswer && i >= 0) {
            availableOptions.push(i);
        }
    }
    
    // Shuffle available options using Fisher-Yates
    shuffleArray(availableOptions);
    
    // Take first 3 as wrong answers
    for (let i = 0; i < 3 && i < availableOptions.length; i++) {
        options.push(availableOptions[i]);
    }
    
    // If we don't have enough options, add more from wider range
    let attempts = 0;
    while (options.length < 4 && attempts < MAX_ATTEMPTS) {
        const randomOption = Math.floor(Math.random() * (maxAnswer + 1));
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
        attempts++;
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
    const options = generateOptions(correctAnswer, problem.maxAnswer);
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
    // Correct answers: 400ms, Incorrect answers: 800ms
    currentQuestion++;
    const delay = isCorrect ? 400 : 800;
    setTimeout(() => {
        loadQuestion();
    }, delay);
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
    
    // Show perfect score modal if score is 100
    if (score === 100) {
        perfectScoreModal.classList.remove('hidden');
    }
}

// Event Listeners for Level Selection
additionLevelBtn.addEventListener('click', () => {
    startGame(LEVELS.ADDITION);
});

subtractionLevelBtn.addEventListener('click', () => {
    startGame(LEVELS.SUBTRACTION);
});

multiplicationLevelBtn.addEventListener('click', () => {
    startGame(LEVELS.MULTIPLICATION);
});

// Event Listeners
answerButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const selectedAnswer = parseInt(btn.textContent);
        handleAnswer(btn, selectedAnswer);
    });
});

restartBtn.addEventListener('click', () => {
    // Return to level selection screen
    resultScreen.classList.add('hidden');
    levelScreen.classList.remove('hidden');
});

// Event Listener for Perfect Score Modal
modalConfirmBtn.addEventListener('click', () => {
    perfectScoreModal.classList.add('hidden');
});

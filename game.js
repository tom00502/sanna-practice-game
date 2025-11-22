// Game State
let currentQuestion = 0;
let score = 0;
let startTime = null;
let timerInterval = null;
let correctAnswer = 0;
let currentPlayer = null;

// Level constants
const LEVELS = {
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction',
    MULTIPLICATION: 'multiplication',
    CHAIN_ADDITION_3: 'chainAddition3',
    CHAIN_ADDITION_4: 'chainAddition4',
    DIVISION: 'division'
};

const LEVEL_NAMES = {
    'addition': '簡單加法',
    'subtraction': '簡單減法',
    'multiplication': '九九乘法',
    'chainAddition3': '連加3',
    'chainAddition4': '連加4',
    'division': '九九除法'
};

let currentLevel = null;

// DOM Elements
const playerScreen = document.getElementById('playerScreen');
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
const chainAddition3LevelBtn = document.getElementById('chainAddition3Level');
const chainAddition4LevelBtn = document.getElementById('chainAddition4Level');
const divisionLevelBtn = document.getElementById('divisionLevel');
const perfectScoreModal = document.getElementById('perfectScoreModal');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const currentPlayerName = document.getElementById('currentPlayerName');
const backToPlayerBtn = document.getElementById('backToPlayerBtn');
const leaderboardModal = document.getElementById('leaderboardModal');
const leaderboardModalTitle = document.getElementById('leaderboardModalTitle');
const leaderboardModalBody = document.getElementById('leaderboardModalBody');
const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
const resultLeaderboardBody = document.getElementById('resultLeaderboardBody');

// Player buttons
const playerButtons = document.querySelectorAll('.player-btn');
const trophyButtons = document.querySelectorAll('.trophy-btn');

// LocalStorage functions
function getLeaderboard(level) {
    const key = `leaderboard_${level}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function saveLeaderboard(level, leaderboard) {
    const key = `leaderboard_${level}`;
    localStorage.setItem(key, JSON.stringify(leaderboard));
}

function addToLeaderboard(level, playerName, score, time) {
    const leaderboard = getLeaderboard(level);
    const date = new Date().toISOString();
    
    leaderboard.push({
        player: playerName,
        score: score,
        time: time,
        date: date
    });
    
    // Sort: by score (desc), then by time (asc), then by date (asc)
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.time !== b.time) return a.time - b.time;
        return new Date(a.date) - new Date(b.date);
    });
    
    // Keep only top 5
    const top5 = leaderboard.slice(0, 5);
    saveLeaderboard(level, top5);
    
    return top5;
}

function formatDate(isoDate) {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

function displayLeaderboard(leaderboard, tbody) {
    tbody.innerHTML = '';
    
    if (leaderboard.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-message">還沒有記錄</td></tr>';
        return;
    }
    
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
        if (rankClass) row.className = rankClass;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.player}</td>
            <td>${entry.score}</td>
            <td>${entry.time}秒</td>
            <td>${formatDate(entry.date)}</td>
        `;
        tbody.appendChild(row);
    });
}

function showLeaderboardModal(level) {
    const leaderboard = getLeaderboard(level);
    const levelName = LEVEL_NAMES[level];
    leaderboardModalTitle.textContent = `🏆 ${levelName} 排行榜 🏆`;
    displayLeaderboard(leaderboard, leaderboardModalBody);
    leaderboardModal.classList.remove('hidden');
}

// Select player
function selectPlayer(playerName) {
    currentPlayer = playerName;
    currentPlayerName.textContent = playerName;
    playerScreen.classList.add('hidden');
    levelScreen.classList.remove('hidden');
}

// Start game with selected level
function startGame(level) {
    if (!currentPlayer) {
        alert('請先選擇玩家！');
        return;
    }
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
    } else if (currentLevel === LEVELS.CHAIN_ADDITION_3) {
        return generateChainAddition3Problem();
    } else if (currentLevel === LEVELS.CHAIN_ADDITION_4) {
        return generateChainAddition4Problem();
    } else if (currentLevel === LEVELS.DIVISION) {
        return generateDivisionProblem();
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

// Generate Chain Addition 3 Problem (3 single-digit numbers)
function generateChainAddition3Problem() {
    const num1 = Math.floor(Math.random() * 10); // 0 to 9
    const num2 = Math.floor(Math.random() * 10); // 0 to 9
    const num3 = Math.floor(Math.random() * 10); // 0 to 9
    const answer = num1 + num2 + num3;
    
    return {
        question: `${num1} + ${num2} + ${num3}`,
        answer: answer,
        maxAnswer: 27 // Maximum possible: 9 + 9 + 9
    };
}

// Generate Chain Addition 4 Problem (4 single-digit numbers)
function generateChainAddition4Problem() {
    const num1 = Math.floor(Math.random() * 10); // 0 to 9
    const num2 = Math.floor(Math.random() * 10); // 0 to 9
    const num3 = Math.floor(Math.random() * 10); // 0 to 9
    const num4 = Math.floor(Math.random() * 10); // 0 to 9
    const answer = num1 + num2 + num3 + num4;
    
    return {
        question: `${num1} + ${num2} + ${num3} + ${num4}`,
        answer: answer,
        maxAnswer: 36 // Maximum possible: 9 + 9 + 9 + 9
    };
}

// Generate Division Problem (based on multiplication tables 1-9)
function generateDivisionProblem() {
    const divisor = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const quotient = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const dividend = divisor * quotient; // This ensures clean division
    
    return {
        question: `${dividend} ÷ ${divisor}`,
        answer: quotient,
        maxAnswer: 9 // Answer will always be 1-9
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
    
    // Save to leaderboard
    const leaderboard = addToLeaderboard(currentLevel, currentPlayer, score, totalTime);
    
    // Show results
    finalScoreElement.textContent = score;
    finalTimeElement.textContent = `${totalTime} 秒`;
    
    // Display leaderboard in result screen
    displayLeaderboard(leaderboard, resultLeaderboardBody);
    
    // Switch to result screen
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // Show perfect score modal if score is 100
    if (score === 100) {
        perfectScoreModal.classList.remove('hidden');
    }
}

// Event Listeners for Player Selection
playerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const playerName = button.getAttribute('data-player');
        selectPlayer(playerName);
    });
});

// Event Listeners for Trophy Buttons
trophyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const level = button.getAttribute('data-level');
        showLeaderboardModal(level);
    });
});

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

chainAddition3LevelBtn.addEventListener('click', () => {
    startGame(LEVELS.CHAIN_ADDITION_3);
});

chainAddition4LevelBtn.addEventListener('click', () => {
    startGame(LEVELS.CHAIN_ADDITION_4);
});

divisionLevelBtn.addEventListener('click', () => {
    startGame(LEVELS.DIVISION);
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

// Event Listener for Back to Player Button
backToPlayerBtn.addEventListener('click', () => {
    levelScreen.classList.add('hidden');
    playerScreen.classList.remove('hidden');
    currentPlayer = null;
});

// Event Listener for Close Leaderboard Modal
closeLeaderboardBtn.addEventListener('click', () => {
    leaderboardModal.classList.add('hidden');
});

// Event Listener for Perfect Score Modal
modalConfirmBtn.addEventListener('click', () => {
    perfectScoreModal.classList.add('hidden');
});

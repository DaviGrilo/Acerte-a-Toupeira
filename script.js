const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const closeMessageButton = document.getElementById('closeMessageButton');

let score = 0;
let time = 30; 
let gameInterval;
let moleInterval;
let lastHole;
let isPlaying = false;

const numHoles = 9; 

function showMessage(message) {
    messageText.textContent = message;
    messageBox.style.display = 'flex';
}

function hideMessageBox() {
    messageBox.style.display = 'none';
}

closeMessageButton.addEventListener('click', hideMessageBox);


function createHoles() {
    for (let i = 0; i < numHoles; i++) {
        const hole = document.createElement('div');
        hole.classList.add('hole');
        hole.dataset.id = i; 
        const mole = document.createElement('div');
        mole.classList.add('mole');
        mole.textContent = '🦔'; 
        hole.appendChild(mole);
        gameBoard.appendChild(hole);
    }
}

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const holes = document.querySelectorAll('.hole');
    const timeUp = randomTime(500, 1500); 
    const hole = randomHole(Array.from(holes));
    const mole = hole.querySelector('.mole');

    mole.classList.remove('hit');
    mole.classList.add('up');
    setTimeout(() => {
        mole.classList.remove('up');
        if (isPlaying) {
            peep();
        }
    }, timeUp);
}

function whack(event) {
    if (!event.isTrusted || !isPlaying) return;
    const mole = event.target;
    if (mole.classList.contains('mole') && mole.classList.contains('up')) {
        score++;
        scoreDisplay.textContent = score;
        mole.classList.remove('up');
        mole.classList.add('hit');
    }
}

function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    score = 0;
    time = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    startButton.disabled = true;
    resetButton.disabled = false;

    clearInterval(gameInterval);
    clearInterval(moleInterval);

    peep();

    gameInterval = setInterval(() => {
        time--;
        timeDisplay.textContent = time;
        if (time <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(moleInterval);
    startButton.disabled = false;
    resetButton.disabled = false;
    showMessage(`Fim de Jogo! Sua pontuação final é: ${score}`);
}

function resetGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(moleInterval);
    score = 0;
    time = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    startButton.disabled = false;
    resetButton.disabled = true;

    document.querySelectorAll('.mole').forEach(mole => mole.classList.remove('up', 'hit'));
    hideMessageBox();
}



startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
gameBoard.addEventListener('click', whack);


window.onload = function() {
    createHoles();
    resetGame();
};

const startScreen = document.getElementById('startScreen');
const startGameButton = document.getElementById('startGameButton');

startGameButton.addEventListener('click', () => {
    startScreen.classList.add('opacity-0');
    setTimeout(() => {
        startScreen.style.display = 'none';
        startGame();
    }, 700);
});


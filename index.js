// Morse Code Dictionary
const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ',': '--..--', '.': '.-.-.-', '?': '..--..', '/': '-..-.', '-': '-....-',
    '(': '-.--.', ')': '-.--.-', ' ': '/'
};

// Create Reverse Morse Code Dictionary
const reverseMorseCode = {};
for (const char in morseCode) {
    reverseMorseCode[morseCode[char]] = char;
}

// DOM Elements
const morseInput = document.getElementById('morseInput');
const morseDisplay = document.getElementById('morseDisplay');
const convertButton = document.getElementById('convertButton');
const playButton = document.getElementById('playButton');
const practiceText = document.getElementById('practiceText');
const userInput = document.getElementById('userInput');
const checkButton = document.getElementById('checkButton');
const resultMessage = document.getElementById('result');
const scoreDisplay = document.getElementById('score');
const newQuestionButton = document.getElementById('newQuestionButton');
const referenceGrid = document.getElementById('referenceGrid');
const currentYear = document.getElementById('currentYear');

// Game state
let currentMorse = '';
let currentText = '';
let score = 0;

// Audio context for Morse code sounds
let audioContext = null;

// Initialize audio context on user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Convert text to Morse code
function convertToMorse() {
    const text = morseInput.value.toUpperCase();
    let morse = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (morseCode[char]) {
            morse += morseCode[char] + ' ';
        } else if (char === ' ') {
            morse += '/ ';
        }
    }
    
    morseDisplay.textContent = morse.trim();
    playButton.disabled = morse.trim() === '';
}

// Play Morse code as audio
function playMorseCode() {
    initAudio();
    
    const morse = morseDisplay.textContent;
    const dotDuration = 100; // milliseconds
    const dashDuration = dotDuration * 3;
    const pauseBetweenSymbols = dotDuration;
    const pauseBetweenLetters = dotDuration * 3;
    const pauseBetweenWords = dotDuration * 7;
    
    let currentTime = audioContext.currentTime;
    
    // Process the Morse code
    for (let i = 0; i < morse.length; i++) {
        const symbol = morse[i];
        
        if (symbol === '.') {
            playTone(currentTime, dotDuration);
            currentTime += dotDuration / 1000 + pauseBetweenSymbols / 1000;
        } else if (symbol === '-') {
            playTone(currentTime, dashDuration);
            currentTime += dashDuration / 1000 + pauseBetweenSymbols / 1000;
        } else if (symbol === ' ') {
            currentTime += pauseBetweenLetters / 1000;
        } else if (symbol === '/') {
            currentTime += pauseBetweenWords / 1000;
        }
    }
}

// Play a tone at the specified time for the specified duration
function playTone(startTime, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 700; // Hz
    
    gainNode.gain.setValueAtTime(0.5, startTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration / 1000);
}

// Generate a new practice question
function generatePractice() {
    // Use only letters and numbers for practice
    const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomChar = characterSet[Math.floor(Math.random() * characterSet.length)];
    
    currentText = randomChar;
    currentMorse = morseCode[randomChar];
    
    practiceText.textContent = currentMorse;
    userInput.value = '';
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';
}

// Check the user's answer
function checkAnswer() {
    const userAnswer = userInput.value.toUpperCase();
    
    if (userAnswer === currentText) {
        resultMessage.textContent = 'Correct! Well done!';
        resultMessage.className = 'result-message correct';
        score++;
        scoreDisplay.textContent = score;
        
        // Generate a new question after a brief delay
        setTimeout(generatePractice, 1500);
    } else {
        resultMessage.textContent = `Incorrect. The answer is: ${currentText}`;
        resultMessage.className = 'result-message incorrect';
    }
}

// Create Morse code reference grid
function createReferenceGrid() {
    let html = '';
    
    // First add letters
    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        html += `
            <div class="reference-item">
                <div class="reference-char">${char}</div>
                <div class="reference-morse">${morseCode[char]}</div>
            </div>
        `;
    }
    
    // Then add numbers
    for (let i = 0; i <= 9; i++) {
        html += `
            <div class="reference-item">
                <div class="reference-char">${i}</div>
                <div class="reference-morse">${morseCode[i.toString()]}</div>
            </div>
        `;
    }
    
    // Add special characters
    const specialChars = [',', '.', '?', '/', '-', '(', ')', ' '];
    const specialDisplayNames = [',', '.', '?', '/', '-', '(', ')', 'space'];
    
    for (let i = 0; i < specialChars.length; i++) {
        html += `
            <div class="reference-item">
                <div class="reference-char">${specialDisplayNames[i]}</div>
                <div class="reference-morse">${morseCode[specialChars[i]]}</div>
            </div>
        `;
    }
    
    referenceGrid.innerHTML = html;
}

// Set the current year in the footer
function setCurrentYear() {
    const date = new Date();
    currentYear.textContent = date.getFullYear();
}

// Event Listeners
convertButton.addEventListener('click', convertToMorse);
morseInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        convertToMorse();
    }
});

playButton.addEventListener('click', playMorseCode);

checkButton.addEventListener('click', checkAnswer);
userInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

newQuestionButton.addEventListener('click', generatePractice);

// Initialize the app
function init() {
    createReferenceGrid();
    generatePractice();
    setCurrentYear();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);
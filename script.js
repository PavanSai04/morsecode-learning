// Morse code mappings
const morseCodeMap = {
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
const reverseMorseCodeMap = Object.fromEntries(
    Object.entries(morseCodeMap).map(([k, v]) => [v, k])
);

// DOM Elements
const textInput = document.querySelectorAll('#morseInput')[0];
const morseOutput = document.querySelectorAll('#morseDisplay')[0];
const convertBtn = document.querySelectorAll('#convertButton')[0];
const playBtn = document.getElementById('playButton');
const stopBtn = document.getElementById('stopButton');

// Morse to Text Section
const morseToTextInput = document.querySelectorAll('#morseInput')[1];
const morseToTextOutput = document.querySelectorAll('#morseDisplay')[1];
const morseToTextConvertBtn = document.querySelectorAll('#convertButton')[1];

// Practice Section
const practiceText = document.getElementById('practiceText');
const userInput = document.getElementById('userInput');
const checkButton = document.getElementById('checkButton');
const resultMessage = document.getElementById('result');
const scoreDisplay = document.getElementById('score');
const newQuestionButton = document.getElementById('newQuestionButton');

let score = 0;
let currentChar = "";

// Text to Morse conversion
convertBtn.addEventListener('click', () => {
    const text = textInput.value.toUpperCase();
    const morse = [...text].map(char => morseCodeMap[char] || '').join(' ');
    morseOutput.textContent = morse;
    if (morse.trim()) {
        playBtn.disabled = false;
        stopBtn.disabled = false;
    }
});

// Morse to Text conversion
morseToTextConvertBtn.addEventListener('click', () => {
    const morse = morseToTextInput.value.trim().split(' ');
    const text = morse.map(code => reverseMorseCodeMap[code] || '').join('');
    morseToTextOutput.textContent = text;
});

// Audio playback logic
let audioCtx;

function playMorseCode(morse) {
    if (!morse) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const dotDuration = 200; // ms
    let time = audioCtx.currentTime;

    morse.split('').forEach(symbol => {
        if (symbol === '.' || symbol === '-') {
            const duration = symbol === '.' ? dotDuration : dotDuration * 3;
            scheduleBeep(time, duration);
            time += duration / 1000 + 0.1;
        } else {
            time += 0.2;
        }
    });

    setTimeout(() => {
        if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
    }, (time - audioCtx.currentTime) * 1000 + 500);
}

function scheduleBeep(startTime, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 600;
    oscillator.start(startTime);
    oscillator.stop(startTime + duration / 1000);
}

playBtn.addEventListener('click', () => {
    const morse = morseOutput.textContent;
    playMorseCode(morse);
});

stopBtn.addEventListener('click', () => {
    if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close();
        playBtn.disabled = true;
        stopBtn.disabled = true;
    }
});

// Practice mode logic
function getRandomChar() {
    const keys = Object.keys(morseCodeMap).filter(k => k !== ' ');
    return keys[Math.floor(Math.random() * keys.length)];
}

function newQuestion() {
    currentChar = getRandomChar();
    practiceText.textContent = morseCodeMap[currentChar];
    userInput.value = '';
    resultMessage.textContent = '';
}

checkButton.addEventListener('click', () => {
    const answer = userInput.value.toUpperCase();
    if (answer === currentChar) {
        score++;
        resultMessage.textContent = "Correct!";
        resultMessage.style.color = "green";
    } else {
        resultMessage.textContent = `Wrong. It was ${currentChar}`;
        resultMessage.style.color = "red";
    }
    scoreDisplay.textContent = score;
});

newQuestionButton.addEventListener('click', newQuestion);

// Reference Table
function createReferenceGrid() {
    const referenceGrid = document.getElementById('referenceGrid');
    let html = '';

    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        html += `
            <div class="reference-item">
                <div class="reference-char">${char}</div>
                <div class="reference-morse">${morseCodeMap[char]}</div>
            </div>
        `;
    }

    for (let i = 0; i <= 9; i++) {
        html += `
            <div class="reference-item">
                <div class="reference-char">${i}</div>
                <div class="reference-morse">${morseCodeMap[i.toString()]}</div>
            </div>
        `;
    }

    const specialChars = [',', '.', '?', '/', '-', '(', ')', ' '];
    const specialDisplayNames = [',', '.', '?', '/', '-', '(', ')', 'space'];

    for (let i = 0; i < specialChars.length; i++) {
        const code = morseCodeMap[specialChars[i]];
        if (code) {
            html += `
                <div class="reference-item">
                    <div class="reference-char">${specialDisplayNames[i]}</div>
                    <div class="reference-morse">${code}</div>
                </div>
            `;
        }
    }

    referenceGrid.innerHTML = html;
}

// Footer year update
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Initialize
newQuestion();
createReferenceGrid();

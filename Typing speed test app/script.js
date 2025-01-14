class TypingTest {
    constructor() {
        // Initialize text array
        this.texts = [
            "The quick brown fox jumps over the lazy dog while the cat watches from afar with curiosity.",
            "Programming is the art of telling another human what one wants the computer to do in a precise manner.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts in the long run.",
            "Life is like riding a bicycle. To keep your balance, you must keep moving forward despite obstacles.",
            "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
            "Innovation distinguishes between a leader and a follower in today's fast-paced world.",
            "Education is not the filling of a pail, but the lighting of a fire that burns eternally.",
            "Everything you can imagine is real if you have the courage to pursue it with determination."
        ];

        // Initialize variables
        this.currentText = '';
        this.timeLeft = 60;
        this.isRunning = false;
        this.timer = null;
        this.totalChars = 0;
        this.correctChars = 0;
        this.totalWords = 0;
        this.startTime = null;
        this.mistakes = 0;

        // Get DOM elements
        this.textDisplay = document.getElementById('text-display');
        this.inputArea = document.getElementById('input-area');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.timerDisplay = document.getElementById('timer');
        this.wpmDisplay = document.getElementById('wpm');
        this.cpmDisplay = document.getElementById('cpm');
        this.accuracyDisplay = document.getElementById('accuracy');

        // Initialize the test
        this.init();
    }

    init() {
        // Add event listeners
        this.startBtn.addEventListener('click', () => this.startTest());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.inputArea.addEventListener('input', (e) => this.handleInput(e));
        this.inputArea.disabled = true;

        // Prevent paste
        this.inputArea.addEventListener('paste', (e) => e.preventDefault());
        
        // Prevent tab key
        this.inputArea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
            }
        });
    }

    startTest() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = Date.now();
        this.currentText = this.getRandomText();
        this.displayText();
        this.inputArea.disabled = false;
        this.inputArea.focus();
        this.startBtn.disabled = true;
        
        // Start timer
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }

    resetTest() {
        // Clear timer
        clearInterval(this.timer);
        
        // Reset variables
        this.isRunning = false;
        this.timeLeft = 60;
        this.totalChars = 0;
        this.correctChars = 0;
        this.totalWords = 0;
        this.mistakes = 0;
        this.currentText = '';
        
        // Reset DOM elements
        this.textDisplay.innerHTML = '';
        this.inputArea.value = '';
        this.inputArea.disabled = true;
        this.startBtn.disabled = false;
        this.updateTimer();
        this.updateStats();
    }

    getRandomText() {
        return this.texts[Math.floor(Math.random() * this.texts.length)];
    }

    displayText() {
        this.textDisplay.innerHTML = this.currentText
            .split('')
            .map(char => `<span>${char}</span>`)
            .join('');
    }

    handleInput(e) {
        if (!this.isRunning) return;

        const inputText = e.target.value;
        const textArray = this.textDisplay.querySelectorAll('span');
        
        this.totalChars = inputText.length;
        this.correctChars = 0;
        let mistakes = 0;

        // Check each character
        textArray.forEach((char, index) => {
            const inputChar = inputText[index];
            
            if (!inputChar) {
                char.classList.remove('correct', 'incorrect', 'current');
            } else if (inputChar === char.innerText) {
                char.classList.add('correct');
                char.classList.remove('incorrect', 'current');
                this.correctChars++;
            } else {
                char.classList.add('incorrect');
                char.classList.remove('correct', 'current');
                mistakes++;
                
                // Add shake animation
                if (mistakes > this.mistakes) {
                    this.textDisplay.classList.add('shake');
                    setTimeout(() => this.textDisplay.classList.remove('shake'), 100);
                }
            }
        });

        // Update current character
        if (textArray[inputText.length]) {
            textArray[inputText.length].classList.add('current');
        }

        this.mistakes = mistakes;
        this.updateStats();

        // Check if text is completed
        if (inputText.length === this.currentText.length) {
            this.currentText = this.getRandomText();
            this.displayText();
            this.inputArea.value = '';
        }
    }

    updateStats() {
        const timeElapsed = (60 - this.timeLeft) || 1;
        const minutes = timeElapsed / 60;
        
        // Calculate WPM: (correct characters / 5) / time in minutes
        const wpm = Math.round((this.correctChars / 5) / minutes);
        
        // Calculate CPM: correct characters / time in minutes
        const cpm = Math.round(this.correctChars / minutes);
        
        // Calculate accuracy
        const accuracy = Math.round((this.correctChars / Math.max(this.totalChars, 1)) * 100);
        
        // Update displays
        this.wpmDisplay.textContent = wpm;
        this.cpmDisplay.textContent = cpm;
        this.accuracyDisplay.textContent = `${accuracy}%`;
    }

    updateTimer() {
        this.timerDisplay.textContent = `${this.timeLeft}s`;
        document.getElementById('time').textContent = `${this.timeLeft}s`;
    }

    endTest() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.inputArea.disabled = true;
        this.startBtn.disabled = false;
        
        // Show final results
        alert(`
            Test Complete!
            WPM: ${this.wpmDisplay.textContent}
            CPM: ${this.cpmDisplay.textContent}
            Accuracy: ${this.accuracyDisplay.textContent}
        `);
    }
}

// Initialize the typing test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});
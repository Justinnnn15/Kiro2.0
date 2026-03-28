// Authentication
const CREDENTIALS = { username: 'admin', password: 'admin123' };

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const mainMenu = document.getElementById('mainMenu');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const menuLogoutBtn = document.getElementById('menuLogoutBtn');
const backToMenuBtn = document.getElementById('backToMenu');
const menuCards = document.querySelectorAll('.menu-card');
const dashboardTitle = document.getElementById('dashboardTitle');

// Check login state on load
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        showMainMenu();
    }
    loadAllData();
    initializeApp();
    initMenuNavigation();
});

// Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
        localStorage.setItem('isLoggedIn', 'true');
        loginError.textContent = '';
        showMainMenu();
    } else {
        loginError.textContent = 'Invalid username or password';
    }
});

// Logout
logoutBtn.addEventListener('click', logout);
menuLogoutBtn.addEventListener('click', logout);

function logout() {
    localStorage.setItem('isLoggedIn', 'false');
    loginScreen.classList.remove('hidden');
    mainMenu.classList.add('hidden');
    dashboard.classList.add('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showMainMenu() {
    loginScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    dashboard.classList.add('hidden');
}

function showDashboard(feature = 'all') {
    loginScreen.classList.add('hidden');
    mainMenu.classList.add('hidden');
    dashboard.classList.remove('hidden');
    
    const dashboardGrid = document.querySelector('.dashboard-grid');
    const columns = document.querySelectorAll('.column');
    
    // Hide all columns first
    columns.forEach(col => col.style.display = 'none');
    
    // Show columns based on feature
    if (feature === 'all') {
        dashboardTitle.textContent = '📚 Study Dashboard';
        dashboardGrid.classList.remove('centered');
        columns.forEach(col => {
            col.style.display = 'flex';
            col.querySelectorAll('.card').forEach(card => card.style.display = 'block');
        });
    } else {
        dashboardGrid.classList.add('centered');
        
        switch(feature) {
            case 'assignments':
                dashboardTitle.textContent = '📝 Assignment Tracker';
                columns[0].style.display = 'flex';
                columns[0].querySelector('.card:first-child').style.display = 'block';
                columns[0].querySelector('.card:last-child').style.display = 'none';
                break;
            case 'timer':
                dashboardTitle.textContent = '⏱️ Focus Timer';
                columns[1].style.display = 'flex';
                columns[1].querySelector('.card:first-child').style.display = 'block';
                columns[1].querySelector('.card:last-child').style.display = 'none';
                break;
            case 'gpa':
                dashboardTitle.textContent = '🎓 GPA Calculator';
                columns[0].style.display = 'flex';
                columns[0].querySelector('.card:first-child').style.display = 'none';
                columns[0].querySelector('.card:last-child').style.display = 'block';
                break;
            case 'notes':
                dashboardTitle.textContent = '📋 Quick Notes';
                columns[1].style.display = 'flex';
                columns[1].querySelector('.card:first-child').style.display = 'none';
                columns[1].querySelector('.card:last-child').style.display = 'block';
                break;
            case 'motivation':
                dashboardTitle.textContent = '🌟 Daily Motivation';
                columns[2].style.display = 'flex';
                columns[2].querySelector('.card:first-child').style.display = 'block';
                columns[2].querySelector('.card:last-child').style.display = 'none';
                break;
            case 'calculator':
                dashboardTitle.textContent = '🔢 Calculator';
                columns[2].style.display = 'flex';
                columns[2].querySelector('.card:first-child').style.display = 'none';
                columns[2].querySelector('.card:last-child').style.display = 'block';
                break;
        }
    }
}

// Menu Navigation
function initMenuNavigation() {
    menuCards.forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.dataset.feature;
            showDashboard(feature);
        });
    });
    
    backToMenuBtn.addEventListener('click', showMainMenu);
}

// Initialize App
function initializeApp() {
    initAssignments();
    initTimer();
    initGPA();
    initQuickTools();
    initCalculator();
    initNotes();
}

// Assignment Tracker
let assignments = [];

function initAssignments() {
    const addBtn = document.getElementById('addAssignment');
    const filterPriority = document.getElementById('filterPriority');
    const sortBy = document.getElementById('sortBy');

    addBtn.addEventListener('click', addAssignment);
    filterPriority.addEventListener('change', renderAssignments);
    sortBy.addEventListener('change', renderAssignments);

    renderAssignments();
}

function addAssignment() {
    const subject = document.getElementById('assignmentSubject').value;
    const description = document.getElementById('assignmentDescription').value;
    const date = document.getElementById('assignmentDate').value;
    const priority = document.getElementById('assignmentPriority').value;

    if (!subject || !date) {
        alert('Please fill in subject and date fields');
        return;
    }

    assignments.push({
        id: Date.now(),
        subject,
        description,
        date,
        priority,
        completed: false
    });

    saveAssignments();
    renderAssignments();

    document.getElementById('assignmentSubject').value = '';
    document.getElementById('assignmentDescription').value = '';
    document.getElementById('assignmentDate').value = '';
}

function renderAssignments() {
    const list = document.getElementById('assignmentList');
    const filterValue = document.getElementById('filterPriority').value;
    const sortValue = document.getElementById('sortBy').value;

    let filtered = assignments.filter(a => 
        filterValue === 'all' || a.priority === filterValue
    );

    if (sortValue === 'date') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    list.innerHTML = filtered.map(assignment => `
        <div class="assignment-item ${assignment.completed ? 'completed' : ''}">
            <div class="assignment-info">
                <div class="assignment-subject">${assignment.subject}</div>
                ${assignment.description ? `<div class="assignment-description">${assignment.description}</div>` : ''}
                <div class="assignment-date">Due: ${new Date(assignment.date).toLocaleDateString()}</div>
            </div>
            <span class="priority-badge priority-${assignment.priority}">${assignment.priority}</span>
            <div class="assignment-actions">
                <button class="btn-complete" onclick="toggleComplete(${assignment.id})">
                    ${assignment.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn-delete" onclick="deleteAssignment(${assignment.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function toggleComplete(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        assignment.completed = !assignment.completed;
        saveAssignments();
        renderAssignments();
    }
}

function deleteAssignment(id) {
    assignments = assignments.filter(a => a.id !== id);
    saveAssignments();
    renderAssignments();
}

function saveAssignments() {
    localStorage.setItem('assignments', JSON.stringify(assignments));
}

function loadAssignments() {
    const saved = localStorage.getItem('assignments');
    if (saved) {
        assignments = JSON.parse(saved);
    }
}

// Study Timer
let timerInterval;
let timeLeft = 25 * 60;
let isRunning = false;
let dailyStudyTime = 0;
let backgroundMusic = null;
let alarmSound = null;

function initTimer() {
    const presetBtns = document.querySelectorAll('.preset-btn');
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimer');
    const customTimeBtn = document.getElementById('setCustomTime');
    const musicToggle = document.getElementById('musicToggle');
    const volumeControl = document.getElementById('volumeControl');
    const volumeLabel = document.getElementById('volumeLabel');

    // Initialize audio
    initAudio();

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            timeLeft = minutes * 60;
            updateTimerDisplay();
        });
    });

    customTimeBtn.addEventListener('click', setCustomTime);
    
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    musicToggle.addEventListener('change', toggleMusic);
    volumeControl.addEventListener('input', (e) => {
        const volume = e.target.value;
        volumeLabel.textContent = volume + '%';
        if (backgroundMusic) {
            backgroundMusic.volume = volume / 100;
        }
    });

    updateTimerDisplay();
    updateDailyHours();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function initAudio() {
    // Create calming background music using Web Audio API
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const audioContext = new AudioContext();
        
        backgroundMusic = {
            context: audioContext,
            oscillators: [],
            gainNodes: [],
            masterGain: null,
            isPlaying: false,
            _volume: 0.5,
            
            play: function() {
                if (this.isPlaying) return;
                
                // Resume audio context if suspended
                if (this.context.state === 'suspended') {
                    this.context.resume();
                }
                
                // Create master gain for volume control
                this.masterGain = this.context.createGain();
                this.masterGain.gain.setValueAtTime(this._volume * 0.15, this.context.currentTime);
                this.masterGain.connect(this.context.destination);
                
                // Create multiple oscillators for a rich, calming ambient sound
                const frequencies = [
                    { freq: 174, detune: 0 },    // Root note (low)
                    { freq: 261.63, detune: 0 }, // C note (middle)
                    { freq: 329.63, detune: 2 }, // E note (harmony)
                    { freq: 392, detune: -2 }    // G note (harmony)
                ];
                
                frequencies.forEach((note, index) => {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    
                    // Use sine wave for smooth, calming tone
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(note.freq, this.context.currentTime);
                    oscillator.detune.setValueAtTime(note.detune, this.context.currentTime);
                    
                    // Set individual volumes for each note
                    const volumes = [0.3, 0.5, 0.4, 0.35];
                    gainNode.gain.setValueAtTime(volumes[index], this.context.currentTime);
                    
                    // Add subtle LFO (Low Frequency Oscillator) for gentle modulation
                    const lfo = this.context.createOscillator();
                    const lfoGain = this.context.createGain();
                    lfo.frequency.setValueAtTime(0.2 + (index * 0.1), this.context.currentTime);
                    lfoGain.gain.setValueAtTime(1.5, this.context.currentTime);
                    
                    lfo.connect(lfoGain);
                    lfoGain.connect(oscillator.frequency);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.masterGain);
                    
                    oscillator.start();
                    lfo.start();
                    
                    this.oscillators.push(oscillator);
                    this.oscillators.push(lfo);
                    this.gainNodes.push(gainNode);
                });
                
                this.isPlaying = true;
            },
            
            stop: function() {
                if (!this.isPlaying) return;
                
                this.oscillators.forEach(osc => {
                    try {
                        osc.stop();
                        osc.disconnect();
                    } catch (e) {
                        // Ignore errors if already stopped
                    }
                });
                
                this.gainNodes.forEach(gain => {
                    try {
                        gain.disconnect();
                    } catch (e) {
                        // Ignore errors
                    }
                });
                
                if (this.masterGain) {
                    try {
                        this.masterGain.disconnect();
                    } catch (e) {
                        // Ignore errors
                    }
                }
                
                this.oscillators = [];
                this.gainNodes = [];
                this.masterGain = null;
                this.isPlaying = false;
            },
            
            set volume(val) {
                this._volume = val;
                if (this.masterGain) {
                    this.masterGain.gain.setValueAtTime(val * 0.15, this.context.currentTime);
                }
            },
            
            get volume() {
                return this._volume;
            }
        };
    }
    
    // Create alarm sound using Web Audio API
    alarmSound = {
        play: function() {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const context = new AudioContext();
            
            // Create a pleasant chime notification sound
            const playTone = (freq, startTime, duration) => {
                const oscillator = context.createOscillator();
                const gainNode = context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(context.destination);
                
                oscillator.frequency.setValueAtTime(freq, startTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            };
            
            // Play a pleasant three-tone chime
            const now = context.currentTime;
            playTone(523.25, now, 0.4);        // C5
            playTone(659.25, now + 0.15, 0.4); // E5
            playTone(783.99, now + 0.3, 0.6);  // G5
        }
    };
}

function setCustomTime() {
    const customMinutes = parseInt(document.getElementById('customMinutes').value);
    
    if (!customMinutes || customMinutes < 1 || customMinutes > 180) {
        alert('Please enter a valid time between 1 and 180 minutes');
        return;
    }
    
    timeLeft = customMinutes * 60;
    updateTimerDisplay();
    document.getElementById('customMinutes').value = '';
}

function toggleMusic(e) {
    if (e.target.checked && isRunning) {
        if (backgroundMusic) {
            backgroundMusic.play();
        }
    } else {
        if (backgroundMusic) {
            backgroundMusic.stop();
        }
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        
        // Start music if toggle is on
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle.checked && backgroundMusic) {
            backgroundMusic.play();
        }
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                dailyStudyTime++;
                updateTimerDisplay();
                updateDailyHours();
                saveDailyStudyTime();
            } else {
                pauseTimer();
                timerComplete();
            }
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    
    // Stop music
    if (backgroundMusic) {
        backgroundMusic.stop();
    }
}

function resetTimer() {
    pauseTimer();
    timeLeft = 25 * 60;
    updateTimerDisplay();
}

function timerComplete() {
    // Play alarm sound
    if (alarmSound) {
        alarmSound.play();
    }
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus Timer Complete! 🎉', {
            body: 'Great job! Time to take a break.',
            icon: '⏱️',
            badge: '⏱️',
            tag: 'timer-complete',
            requireInteraction: false
        });
    }
    
    // Show alert as fallback
    setTimeout(() => {
        alert('Time\'s up! 🎉\n\nGreat job! Take a break.');
    }, 100);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateDailyHours() {
    const hours = Math.floor(dailyStudyTime / 3600);
    const minutes = Math.floor((dailyStudyTime % 3600) / 60);
    document.getElementById('dailyHours').textContent = `${hours}h ${minutes}m`;
}

function saveDailyStudyTime() {
    localStorage.setItem('dailyStudyTime', dailyStudyTime.toString());
    localStorage.setItem('studyDate', new Date().toDateString());
}

function loadDailyStudyTime() {
    const savedDate = localStorage.getItem('studyDate');
    const today = new Date().toDateString();
    
    if (savedDate === today) {
        dailyStudyTime = parseInt(localStorage.getItem('dailyStudyTime') || '0');
    } else {
        dailyStudyTime = 0;
        saveDailyStudyTime();
    }
}

// GPA Calculator
let courses = [];

function initGPA() {
    const addBtn = document.getElementById('addCourse');
    addBtn.addEventListener('click', addCourse);
    renderCourses();
    calculateGPA();
}

function addCourse() {
    const name = document.getElementById('courseName').value;
    const grade = parseFloat(document.getElementById('courseGrade').value);
    const units = parseInt(document.getElementById('courseUnits').value);

    if (!name || !units) {
        alert('Please fill in all fields');
        return;
    }

    courses.push({
        id: Date.now(),
        name,
        grade,
        units
    });

    saveCourses();
    renderCourses();
    calculateGPA();

    document.getElementById('courseName').value = '';
}

function renderCourses() {
    const list = document.getElementById('courseList');
    list.innerHTML = courses.map(course => `
        <div class="course-item">
            <div class="course-info">
                <div class="course-name">${course.name}</div>
                <div class="course-details">Grade: ${course.grade.toFixed(1)} | Units: ${course.units}</div>
            </div>
            <button class="btn-delete" onclick="deleteCourse(${course.id})">Delete</button>
        </div>
    `).join('');
}

function deleteCourse(id) {
    courses = courses.filter(c => c.id !== id);
    saveCourses();
    renderCourses();
    calculateGPA();
}

function calculateGPA() {
    if (courses.length === 0) {
        document.getElementById('currentGPA').textContent = '0.00';
        return;
    }

    let totalPoints = 0;
    let totalUnits = 0;

    courses.forEach(course => {
        totalPoints += course.grade * course.units;
        totalUnits += course.units;
    });

    const gpa = totalPoints / totalUnits;
    document.getElementById('currentGPA').textContent = gpa.toFixed(2);
}

function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

function loadCourses() {
    const saved = localStorage.getItem('courses');
    if (saved) {
        courses = JSON.parse(saved);
    }
}

// Quick Tools
function initQuickTools() {
    updateDate();
    displayQuote();
}

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    document.getElementById('dateDisplay').textContent = today;
}

function displayQuote() {
    const quotes = [
        "Success is the sum of small efforts repeated day in and day out.",
        "The expert in anything was once a beginner.",
        "Education is the passport to the future.",
        "Learning is a treasure that will follow its owner everywhere.",
        "The beautiful thing about learning is that no one can take it away from you.",
        "Study while others are sleeping; work while others are loafing.",
        "Don't watch the clock; do what it does. Keep going.",
        "The secret of getting ahead is getting started.",
        "Your limitation—it's only your imagination.",
        "Great things never come from comfort zones."
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quoteDisplay').textContent = `"${randomQuote}"`;
}

// Calculator
let calcDisplay = document.getElementById('calcDisplay');
let currentCalc = '';
let previousCalc = '';
let operation = null;

function initCalculator() {
    const calcBtns = document.querySelectorAll('.calc-btn');
    
    calcBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value;
            handleCalculator(value);
        });
    });
}

function handleCalculator(value) {
    if (value === 'C') {
        currentCalc = '';
        previousCalc = '';
        operation = null;
        calcDisplay.value = '';
        return;
    }

    if (value === '=') {
        if (operation && previousCalc && currentCalc) {
            currentCalc = calculate(previousCalc, currentCalc, operation);
            calcDisplay.value = currentCalc;
            previousCalc = '';
            operation = null;
        }
        return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
        if (currentCalc) {
            if (previousCalc && operation) {
                currentCalc = calculate(previousCalc, currentCalc, operation);
                calcDisplay.value = currentCalc;
            }
            previousCalc = currentCalc;
            currentCalc = '';
            operation = value;
        }
        return;
    }

    currentCalc += value;
    calcDisplay.value = currentCalc;
}

function calculate(a, b, op) {
    const num1 = parseFloat(a);
    const num2 = parseFloat(b);

    switch (op) {
        case '+': return (num1 + num2).toString();
        case '-': return (num1 - num2).toString();
        case '*': return (num1 * num2).toString();
        case '/': return num2 !== 0 ? (num1 / num2).toString() : 'Error';
        default: return b;
    }
}

// Quick Notes
function initNotes() {
    const saveBtn = document.getElementById('saveNotes');
    const notesArea = document.getElementById('quickNotes');

    saveBtn.addEventListener('click', () => {
        localStorage.setItem('quickNotes', notesArea.value);
        alert('Notes saved!');
    });

    loadNotes();
}

function loadNotes() {
    const saved = localStorage.getItem('quickNotes');
    if (saved) {
        document.getElementById('quickNotes').value = saved;
    }
}

// Load all data
function loadAllData() {
    loadAssignments();
    loadCourses();
    loadDailyStudyTime();
    loadNotes();
}
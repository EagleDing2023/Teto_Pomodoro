console.log("Teto Pomodoro app.js loaded");

/* =========================
   STATE MACHINE
========================= */

const STATES = {
  IDLE: "idle",
  STUDY: "study",
  BREAK: "break",
  PAUSED: "paused",
  COMPLETED: "completed"
};

let currentState = STATES.IDLE;
let timerInterval = null;

/* =========================
   SETTINGS (v0)
========================= */

let settings = {
  studyMinutes: 25,
  breakMinutes: 5,
  totalSessions: 4
};

/* =========================
   SESSION TRACKING
========================= */

let minutes = settings.studyMinutes;
let seconds = 0;
let completedSessions = 0;

/* =========================
   DOM ELEMENTS
========================= */

const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const toggleBtn = document.getElementById("toggle");
const resetBtn = document.getElementById("reset");

const sessionBoxesEl = document.getElementById("session-boxes");

// Settings
const settingsBtn = document.getElementById("settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const studyInput = document.getElementById("study-input");
const breakInput = document.getElementById("break-input");
const sessionInput = document.getElementById("session-input");
const saveSettingsBtn = document.getElementById("save-settings");

/* =========================
   DISPLAY HELPERS
========================= */

function updateDisplay() {
  minutesEl.textContent = minutes.toString().padStart(2, "0");
  secondsEl.textContent = seconds.toString().padStart(2, "0");
}

/* =========================
   AUDIO HOOKS (v0)
========================= */

function playSound(type) {
  console.log("Sound event:", type);
  // later: map type → actual audio files
}

/* =========================
   SESSION BOXES
========================= */

function renderSessionBoxes() {
  sessionBoxesEl.innerHTML = "";

  for (let i = 0; i < settings.totalSessions; i++) {
    const box = document.createElement("div");
    box.classList.add("session-box");

    if (i < completedSessions) {
      box.classList.add("filled");
    }

    sessionBoxesEl.appendChild(box);
  }
}

/* =========================
   STATE TRANSITIONS
========================= */

function startStudy() {
  currentState = STATES.STUDY;
  minutes = settings.studyMinutes;
  seconds = 0;
  startTimer();
}

function startBreak() {
  currentState = STATES.BREAK;
  minutes = settings.breakMinutes;
  seconds = 0;
  startTimer();
}

function completeStudySession() {
  completedSessions++;
  playSound("study_complete");
  renderSessionBoxes();

  if (completedSessions >= settings.totalSessions) {
    currentState = STATES.COMPLETED;
    clearInterval(timerInterval);
    timerInterval = null;
    playSound("all_sessions_complete");
    alert("All sessions complete!");
  } else {
    startBreak();
  }
}

/* =========================
   TIMER CORE
========================= */

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(timerInterval);
        timerInterval = null;

        if (currentState === STATES.STUDY) {
          completeStudySession();
        } else if (currentState === STATES.BREAK) {
          playSound("break_complete");
          startStudy();
        }

        return;
      }

      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }

    playSound("tick");
    updateDisplay();
  }, 1000);
}

/* =========================
   BUTTON HANDLERS
========================= */

toggleBtn.addEventListener("click", () => {
  playSound("button_click");

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    currentState = STATES.PAUSED;
    toggleBtn.textContent = "Start";
  } else {
    if (currentState === STATES.IDLE || currentState === STATES.PAUSED) {
      startStudy();
      toggleBtn.textContent = "Pause";
    }
  }
});

resetBtn.addEventListener("click", () => {
  playSound("button_click");

  clearInterval(timerInterval);
  timerInterval = null;

  currentState = STATES.IDLE;
  completedSessions = 0;
  minutes = settings.studyMinutes;
  seconds = 0;

  toggleBtn.textContent = "Start";
  renderSessionBoxes();
  updateDisplay();
});

/* =========================
   SETTINGS v0
========================= */

settingsBtn.addEventListener("click", () => {
  settingsPanel.hidden = !settingsPanel.hidden;
});

saveSettingsBtn.addEventListener("click", () => {
  settings.studyMinutes = Math.max(0, Number(studyInput.value) || 0);
  settings.breakMinutes = Math.max(0, Number(breakInput.value) || 0);
  settings.totalSessions = Math.max(0, Number(sessionInput.value) || 0);

  completedSessions = 0;
  currentState = STATES.IDLE;

  minutes = settings.studyMinutes;
  seconds = 0;

  renderSessionBoxes();
  updateDisplay();

  settingsPanel.hidden = true;
  playSound("button_click");
});

/* =========================
   INIT
========================= */

studyInput.value = settings.studyMinutes;
breakInput.value = settings.breakMinutes;
sessionInput.value = settings.totalSessions;

renderSessionBoxes();
updateDisplay();

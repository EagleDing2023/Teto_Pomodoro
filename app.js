console.log("Teto Pomodoro app.js loaded");

let minutes = 25; // default Pomodoro time
let seconds = 0; // default seconds
let timerInterval = null; // to hold the interval ID


const minutesEl = document.getElementById("minutes"); // get minutes display element
const secondsEl = document.getElementById("seconds");  // get seconds display element
const toggleBtn = document.getElementById("toggle");  // get start/pause toggle button
const resetBtn = document.getElementById("reset"); // get reset button

// Update the timer display
function updateDisplay() {
  minutesEl.textContent = minutes.toString().padStart(2, "0"); // pad with leading zero
  secondsEl.textContent = seconds.toString().padStart(2, "0"); // pad with leading zero
}


// Start or pause timer
toggleBtn.addEventListener("click", () => {
  if (!timerInterval) {
    // Start the timer
    timerInterval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          toggleBtn.textContent = "Start";
          alert("Pomodoro complete!");
        } else {
          minutes--;
          seconds = 59;
        }
      } else {
        seconds--;
      }
      updateDisplay();
    }, 1000);

    toggleBtn.textContent = "Pause"; // change button text
  } else {
    // Pause the timer
    clearInterval(timerInterval);
    timerInterval = null;
    toggleBtn.textContent = "Start"; // change back to Start
  }
});


// Reset timer
resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  minutes = 25;
  seconds = 0;
  updateDisplay();
  toggleBtn.textContent = "Start"; // reset button text
});

updateDisplay(); // initialize display
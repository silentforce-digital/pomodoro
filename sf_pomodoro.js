//
// TIME MANAGEMENT
// with the
// POMODORO TECHNIQUE
//
// Vrs 3.1
//
// Made with stardust by 
// silentforce digital reflections
//

const timer = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  sessions: 0,
  shortBreaks: 0,
  longBreaks: 0,
};

var work = 0;
let interval;
var startTime = 0;

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = parseInt(difference / 1000);
  const minutes = parseInt((total / 60) % 60);
  const seconds = parseInt(total % 60);

  return {
    total,
    minutes,
    seconds,
  };
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, '0');
  const seconds = `${remainingTime.seconds}`.padStart(2, '0');

  const min = document.getElementById('js-minutes');
  const sec = document.getElementById('js-seconds');
  const time = `${minutes}:${seconds}`;
  min.textContent = minutes;
  sec.textContent = seconds;

  const popup = document.getElementById("js-popup");
  popup.textContent = 'Total time elapsed: \n' + displayTimer();

  const pomodoros = document.getElementById('js-pomodoros');
  const shortBreaks = document.getElementById('js-short-breaks');
  const longBreaks = document.getElementById('js-long-breaks');
  pomodoros.textContent = timer.sessions;
  shortBreaks.textContent = timer.shortBreaks;
  longBreaks.textContent = timer.longBreaks;

  if (mainButton.dataset.action === 'stop') {
    if (timer.mode === 'pomodoro') {
      document.title = `${time} - FOCUS`;
    } else {
      document.title = `${time} - RELAX`;
    }
  }

  const progress = document.getElementById('js-progress-bar');
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  mainButton.dataset.action = 'stop';
  mainButton.classList.add('active');
  ring.classList.add('active');

  document.querySelector(`[data-rounds="${timer.mode}"]`).classList.add('active');

  interval = setInterval(function() {
    timer.remainingTime = getRemainingTime(endTime);
    total = timer.remainingTime.total;
    updateClock();
    if (total <= 0) {
      clearInterval(interval);

      if (timer.mode === 'pomodoro') timer.sessions++;
      if (timer.mode === 'shortBreak') timer.shortBreaks++;
      if (timer.mode === 'longBreak') timer.longBreaks++;

      switch (timer.mode) {
        case 'pomodoro':
          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode('longBreak');
          } else {
            switchMode('shortBreak');
          }
          break;
        default:
          switchMode('pomodoro');
      }

      document.querySelector(`[data-sound="${timer.mode}"]`).play();
      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = 'start';
  mainButton.classList.remove('active');
  ring.classList.remove('active');
  
  let elements = document.getElementsByClassName('pulse_');
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove('active');
  }
}

function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  document
    .querySelectorAll('.mode[data-mode]')
    .forEach(e => e.classList.remove('active'));
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

  document
    .querySelectorAll('.rounds[data-stats]')
    .forEach(e => e.classList.remove('active'));
  document.querySelector(`[data-stats="${mode}"]`).classList.add('active');

  document
  .querySelectorAll('.pulse_[data-rounds]')
  .forEach(e => e.classList.remove('active'));
document.querySelector(`[data-rounds="${mode}"]`).classList.add('active');

  document
    .getElementById('js-progress-bar')
    .setAttribute('max', timer.remainingTime.total);
  document.body.style.backgroundColor = `var(--${mode})`;
  document.getElementById("js-progress-bar").style.backgroundColor = `var(--${mode})`;
  document.getElementsByTagName('a')[0].style.color = `var(--${mode})`;
  ring.style.borderColor = `var(--${mode})`;

  updateClock();
}

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchMode(mode);
  stopTimer();
}

const overlay_ = document.getElementById('js-overlay_');
const modesNStats = document.getElementById('js-modes-n-stats');
const task = document.getElementById('js-task');
const clock = document.getElementById('js-clock');
const buttonSound = new Audio('button-sound.mp3');
const mainButton = document.getElementById('js-main-button');
const ring = document.getElementById('js-ring');
mainButton.addEventListener('click', () => {
  const { action } = mainButton.dataset;
  buttonSound.play();
  if (action === 'start') {
    work++;
    if (timer.sessions == 0) startTime = Date.parse(new Date());
    startTimer();
    modesNStats.classList.add('run');
    task.classList.add('run');
    if (task.textContent === '') task.textContent = 'Do or do not.\nThere is no try.';
    clock.classList.add('run');
    overlay_.classList.remove('active');
  } else {
    stopTimer();
    overlay_.classList.add('active');
  }
});

const localTime = document.getElementById('js-local-time');

function displayTimer() {
  var display = "";

  display = Date.parse(new Date()) - startTime;
  display = parseInt((display / 3600000) % 60) + " hrs " + parseInt((display / 60000) % 60) + " mins";
  
  setTimeout(displayTimer, 1000);

  return display;
}

document.addEventListener('DOMContentLoaded', () => {
  switchMode('pomodoro');
});

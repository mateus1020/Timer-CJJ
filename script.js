let timer;
let timerDelay;
let remainingSeconds = 0;
let paused = true;
let selectedSeconds = 0;

function startTimer(seconds) {
  clearInterval(timer);
  clearTimeout(timerDelay);

  selectedSeconds = seconds;
  remainingSeconds = seconds;
  paused = true;

  updateDisplay(remainingSeconds);
  updateProgress();
  highlightButton(seconds);
  setPlayButtonLabel("Iniciar");
  setTimerState("ready");
}

function pauseTimer() {
  if (selectedSeconds === 0) return;

  if (paused) {
    paused = false;
    setPlayButtonLabel("Pausar");
    setTimerState("running");
    startCountdown();
  } else {
    paused = true;
    setPlayButtonLabel("Continuar");
    setTimerState("paused");
  }
}

function startCountdown() {
  clearInterval(timer);
  clearTimeout(timerDelay);

  timerDelay = setTimeout(() => {
    timer = setInterval(() => {
      if (!paused) {
        remainingSeconds--;
        updateDisplay(remainingSeconds);
        updateProgress();

        if (remainingSeconds <= 5 && remainingSeconds > 0) {
          setTimerState("warning");
        }

        if (remainingSeconds <= 0) {
          clearInterval(timer);
          updateDisplay(0);
          updateProgress();
          setTimerState("finished");

          const alarm = document.getElementById("alarm");
          alarm.currentTime = 0;
          alarm.play();

          clearTimeout(timerDelay);
          setPlayButtonLabel("Reiniciando");

          timerDelay = setTimeout(() => {
            remainingSeconds = selectedSeconds;
            paused = true;
            updateDisplay(remainingSeconds);
            updateProgress();
            setPlayButtonLabel("Iniciar");
            setTimerState("ready");
          }, 2000);
        }
      }
    }, 1000);
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  clearTimeout(timerDelay);

  paused = true;

  if (selectedSeconds > 0) {
    remainingSeconds = selectedSeconds;
    updateDisplay(remainingSeconds);
    updateProgress();
    setPlayButtonLabel("Iniciar");
    setTimerState("ready");
  } else {
    remainingSeconds = 0;
    selectedSeconds = 0;
    document.getElementById("display").innerText = "00:00";
    updateProgress();
    setPlayButtonLabel("Iniciar");
    setTimerState("idle");
  }
}

function updateDisplay(seconds) {
  const safeSeconds = Math.max(seconds, 0);
  const min = Math.floor(safeSeconds / 60);
  const sec = safeSeconds % 60;

  document.getElementById("display").innerText =
    `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function updateProgress() {
  const progressBar = document.getElementById("progress-bar");

  if (selectedSeconds <= 0) {
    progressBar.style.width = "0%";
    return;
  }

  const elapsed = selectedSeconds - remainingSeconds;
  const progress = Math.min(Math.max((elapsed / selectedSeconds) * 100, 0), 100);
  progressBar.style.width = `${progress}%`;
}

function setPlayButtonLabel(label) {
  document.getElementById("play-pause").innerText = label;
}

function setTimerState(state) {
  document.body.dataset.timerState = state;
}

function highlightButton(seconds) {
  const buttons = document.querySelectorAll(".buttons button");

  buttons.forEach((button) => {
    button.classList.remove("active");

    if (parseInt(button.dataset.seconds, 10) === seconds) {
      button.classList.add("active");
    }
  });
}

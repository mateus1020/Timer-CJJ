let timer;
let timerDelay; 
let remainingSeconds = 0;
let paused = true;
let selectedSeconds = 0;

// Seleciona o tempo (NÃO inicia)
function startTimer(seconds) {
  clearInterval(timer);
  clearTimeout(timerDelay);

  selectedSeconds = seconds;
  remainingSeconds = seconds;
  paused = true;

  updateDisplay(remainingSeconds);
  highlightButton(seconds);

  document.querySelector(".controls button").innerText = "Play";
}

// Botão Play / Pause
function pauseTimer() {
  const pauseBtn = document.querySelector(".controls button");

  if (selectedSeconds === 0) return;

  if (paused) {
    paused = false;
    pauseBtn.innerText = "Pause";
    startCountdown();
  } else {
    paused = true;
    pauseBtn.innerText = "Play";
  }
}

// Inicia a contagem
function startCountdown() {
  clearInterval(timer);
  clearTimeout(timerDelay);

  timerDelay = setTimeout(() => {
    timer = setInterval(() => {
      if (!paused) {
        remainingSeconds--;
        updateDisplay(remainingSeconds);

        if (remainingSeconds <= 0) {
          clearInterval(timer);
          updateDisplay(0);

          const alarm = document.getElementById("alarm");
          alarm.currentTime = 0;
          alarm.play();

          clearTimeout(timerDelay);

          timerDelay = setTimeout(() => {
            remainingSeconds = selectedSeconds;
            paused = true;
            updateDisplay(remainingSeconds);
            document.querySelector(".controls button").innerText = "Play";
          }, 2000);
        }
      }
    }, 1000);
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  clearTimeout(timerDelay);

  if (selectedSeconds > 0) {
    remainingSeconds = selectedSeconds;
    paused = true;
    updateDisplay(remainingSeconds);
    document.querySelector(".controls button").innerText = "Play";
  } else {
    remainingSeconds = 0;
    document.getElementById("display").innerText = "00:00";
  }

  document.getElementById("display").style.color = "red";
}

function updateDisplay(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  const display = document.getElementById("display");

  display.innerText = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

  if (seconds > 0 && seconds <= 5) {
    display.style.color = (seconds % 2 === 0) ? "yellow" : "white";
  } else {
    display.style.color = "red";
  }
}

// Destaque do botão selecionado
function highlightButton(seconds) {
  const buttons = document.querySelectorAll(".buttons button");
  buttons.forEach(btn => {
    btn.classList.remove("active");
    if (parseInt(btn.dataset.seconds) === seconds) {
      btn.classList.add("active");
    }
  });
}

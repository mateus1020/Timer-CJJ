let timer;
let timerDelay; 
let remainingSeconds = 0;
let paused = false;
let selectedMinutes = 0; 

function startTimer(minutes) {
  clearInterval(timer);
  clearTimeout(timerDelay); 

  remainingSeconds = minutes * 60;
  selectedMinutes = minutes; 
  paused = false;
  updateDisplay(remainingSeconds);

  highlightButton(minutes); 

  // Delay de 2 segundos antes de iniciar a contagem
  timerDelay = setTimeout(() => {
    timer = setInterval(() => {
      if (!paused) {
        remainingSeconds--;
        updateDisplay(remainingSeconds);

        if (remainingSeconds <= 0) {
          clearInterval(timer);
          updateDisplay(0); // mostra 00:00
          const alarm = document.getElementById("alarm");
          alarm.currentTime = 0;
          alarm.play();

          clearTimeout(timerDelay); // ⬅️ SEGURANÇA

          // fica 2 segundos em 00:00 e depois volta para o valor escolhido
          timerDelay = setTimeout(() => {
            remainingSeconds = selectedMinutes * 60;
            updateDisplay(remainingSeconds);
          }, 2000);
        }
      }
    }, 1000);
  }, 2000);
}

function pauseTimer() {
  const pauseBtn = document.querySelector(".controls button"); 
  if (paused) {
    paused = false;
    pauseBtn.innerText = "Pause";
  } else {
    paused = true;
    pauseBtn.innerText = "Play";
  }
}

function resetTimer() {
  clearInterval(timer);
  clearTimeout(timerDelay); // ⬅️ LIMPA TIMEOUT PENDENTE

  if (selectedMinutes > 0) {
    remainingSeconds = selectedMinutes * 60; // volta para o último tempo escolhido
    paused = false; // garante que não fique pausado
    updateDisplay(remainingSeconds);

    // Delay de 2 segundos antes de reiniciar a contagem
    timerDelay = setTimeout(() => {
      timer = setInterval(() => {
        if (!paused) {
          remainingSeconds--;
          updateDisplay(remainingSeconds);

          if (remainingSeconds > 0 && remainingSeconds <= 5) {
            const alarm = document.getElementById("alarm");
            alarm.currentTime = 0; 
            alarm.play();
          }

          if (remainingSeconds <= 0) {
            clearInterval(timer);
            updateDisplay(0); // mostra 00:00
            const alarm = document.getElementById("alarm");
            alarm.currentTime = 0;
            alarm.play();

            clearTimeout(timerDelay); // ⬅️ SEGURANÇA

            // fica 2 segundos em 00:00 e depois volta para o valor escolhido
            timerDelay = setTimeout(() => {
              remainingSeconds = selectedMinutes * 60;
              updateDisplay(remainingSeconds);
            }, 2000);
          }
        }
      }, 1000);
    }, 2000); // espera 2 segundos antes de reiniciar
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

  // Últimos 5 segundos: pisca amarelo e branco
  if (seconds > 0 && seconds <= 5) {
    display.style.color = (seconds % 2 === 0) ? "yellow" : "white";
  } else {
    display.style.color = "red"; // cor padrão
  }
}

// Função para destacar o botão selecionado
function highlightButton(minutes) {
  const buttons = document.querySelectorAll(".buttons button");
  buttons.forEach(btn => {
    btn.classList.remove("active"); // remove destaque de todos
    if (parseInt(btn.dataset.minutes) === minutes) {
      btn.classList.add("active"); // adiciona destaque no botão clicado
    }
  });
}

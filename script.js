const quizData = [
  {
    question: "1️⃣ O que é desmatamento?",
    options: [
      "Corte de árvores de forma legal",
      "Destruição de florestas de forma acelerada",
      "Plantar mais árvores"
    ],
    answer: 1
  },
  {
    question: "2️⃣ Qual é uma consequência do desmatamento?",
    options: [
      "Aumento da biodiversidade",
      "Perda de habitat de animais e erosão do solo",
      "Mais oxigênio na atmosfera"
    ],
    answer: 1
  },
  {
    question: "3️⃣ O aquecimento global provoca:",
    options: [
      "Derretimento das geleiras e aumento do nível do mar",
      "Formação de novas florestas",
      "Redução da temperatura global"
    ],
    answer: 0
  },
  {
    question: "4️⃣ Qual ação ajuda a combater o aquecimento global?",
    options: [
      "Queimar mais combustíveis fósseis",
      "Usar energia renovável e reduzir consumo de energia",
      "Destruir florestas para construção"
    ],
    answer: 1
  },
  {
    question: "5️⃣ Como podemos ajudar a reduzir o desmatamento?",
    options: [
      "Consumindo produtos de madeira de forma consciente",
      "Não reciclando",
      "Ignorando políticas ambientais"
    ],
    answer: 0
  },
  {
    question: "6️⃣ O que é reflorestamento?",
    options: [
      "Plantar árvores em áreas desmatadas",
      "Cortar árvores antigas",
      "Transformar florestas em cidades"
    ],
    answer: 0
  },
  {
    question: "7️⃣ Qual gás é o principal responsável pelo aquecimento global?",
    options: [
      "Oxigênio",
      "Dióxido de carbono (CO₂)",
      "Nitrogênio"
    ],
    answer: 1
  },
  {
    question: "8️⃣ Qual ação individual ajuda a combater o aquecimento global?",
    options: [
      "Reduzir uso de transporte individual e reciclar",
      "Desperdiçar energia",
      "Usar produtos descartáveis em excesso"
    ],
    answer: 0
  }
];

let current = 0;
let lives = 3;
let timeLeft = 20;
let timer;

const startBtn = document.getElementById("startBtn");
const menuWrapper = document.querySelector(".menu-wrapper");
const quizWrapper = document.querySelector(".quiz-wrapper");

startBtn.addEventListener("click", startQuiz);

function startQuiz() {
  const playerNameInput = document.getElementById("playerName");
  const playerName = playerNameInput.value.trim() || "Jogador(a)";
  localStorage.setItem("playerName", playerName);

  menuWrapper.style.display = "none";
  quizWrapper.style.display = "flex";

  showQuestion();
  startTimer();
}

function showQuestion() {
  const q = quizData[current];
  document.getElementById("question").textContent = q.question;

  const optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optDiv.appendChild(btn);
  });

  document.getElementById("lives").textContent = lives;
  timeLeft = 20;
  document.getElementById("time-bar").style.width = "100%";
}

function checkAnswer(i) {
  const q = quizData[current];

  if (i === q.answer) {
    alert("✔️ Correto!");
  } else {
    lives--;
    document.getElementById("lives").textContent = lives;
    alert("❌ Errado!");
    if (lives <= 0) {
      alert("💔 Fim de jogo!");
      location.reload();
      return;
    }
  }

  current++;
  if (current >= quizData.length) {
    clearInterval(timer);
    showConfetti();
    alert("🎉 Parabéns! Você completou o quiz!");
    location.reload();
  } else {
    showQuestion();
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("time-bar").style.width = `${(timeLeft/20)*100}%`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      lives--;
      if (lives <= 0) {
        alert("⏰ Tempo esgotado! Fim de jogo!");
        location.reload();
      } else {
        alert("⏰ Tempo esgotado! Próxima pergunta.");
        current++;
        if (current >= quizData.length) {
          showConfetti();
          alert("🎉 Parabéns! Você completou o quiz!");
          location.reload();
        } else {
          showQuestion();
          startTimer();
        }
      }
    }
  }, 1000);
}

// Função de confetes simples
function showConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    const colors = ['#ff0a54','#ff477e','#ff7096','#ff85a1','#fbb1b9'];
    for (let i=0; i<5; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.width = '10px';
      conf.style.height = '10px';
      conf.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
      conf.style.top = Math.random()*window.innerHeight + 'px';
      conf.style.left = Math.random()*window.innerWidth + 'px';
      conf.style.borderRadius = '50%';
      conf.style.zIndex = 9999;
      document.body.appendChild(conf);
      setTimeout(()=> conf.remove(), 3000);
    }
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

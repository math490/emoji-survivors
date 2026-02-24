let singlePlayerMode = false;
let warriorItems = []; // Array para armazenar os emojis ⚔
let playerClasses = {}; // Armazena a classe de cada player
let gamePaused = false;
let singlePlayerControls = "wasd"; // Padrão: WASD

function selectMode(mode) {
  document.getElementById("mode-selection").style.display = "none";
  if (mode === "single") {
    singlePlayerMode = true;
    document.getElementById("name-selection-single").style.display = "block";
  } else {
    document.getElementById("connection-selection").style.display = "block";
  }
}

function selectConnection(connection) {
  document.getElementById("connection-selection").style.display = "none";
  if (connection === "local") {
    document.getElementById("name-selection-multi").style.display = "block";
  }
}

function startGameSingle() {
  const playerName = document.getElementById("player-name").value;
  singlePlayerControls = document.querySelector(
    'input[name="control-scheme"]:checked'
  ).value; // Obtém controle escolhido

  if (playerName.trim() === "") {
    alert("Por favor, insira um nome válido!");
    return;
  }

  document.getElementById("name-selection-single").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  document.getElementById("display-name1").textContent = playerName;

  const player1 = document.getElementById("player1");

  spawnWarriorItem("player1");

  showPauseButton();

  positionPlayerForSingle();

  movePlayers();
}

function startGameMulti() {
  const player1Name = document.getElementById("player1-name").value;
  const player2Name = document.getElementById("player2-name").value;

  if (player1Name.trim() === "" || player2Name.trim() === "") {
    alert("Por favor, insira nomes válidos para os dois jogadores!");
    return;
  }

  document.getElementById("name-selection-multi").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  document.getElementById("display-name1").textContent = player1Name;
  document.getElementById("display-name2").textContent = player2Name;
  document.getElementById("player2").style.display = "block";
  document.querySelector(".stats-container.player2").style.display = "block";

  const player1 = document.getElementById("player1");
  const player2 = document.getElementById("player2");

  const nameTag1 = createPlayerNameTag("player1", player1Name);
  const nameTag2 = createPlayerNameTag("player2", player2Name);

  spawnWarriorItem("player1");
  spawnWarriorItem("player2");

  showPauseButton();
  positionPlayersForMulti();

  movePlayers();
}

function positionPlayerForSingle() {
  const player1 = document.getElementById("player1");

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  player1.style.left = `${centerX}px`;
  player1.style.top = `${centerY}px`;
}

function positionPlayersForMulti() {
  const player1 = document.getElementById("player1");
  const player2 = document.getElementById("player2");

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  player1.style.left = `${centerX - 25}px`;
  player1.style.top = `${centerY}px`;

  player2.style.left = `${centerX + 25}px`;
  player2.style.top = `${centerY}px`;
}

function pauseGame() {
  if (!gamePaused) {
    gamePaused = true;
    document.getElementById("pause-menu").style.display = "block";
  }
}

function resumeGame() {
  if (gamePaused) {
    gamePaused = false;
    document.getElementById("pause-menu").style.display = "none";
    movePlayers();
  }
}

function restartGame() {
  hidePauseButton(); // Esconde o botão ao sair do jogo
  singlePlayerControls = "wasd"; // 🔹 Reseta o controle do player 1 para WASD
  location.reload();
}

// Criando o botão de pausa na interface
document.addEventListener("DOMContentLoaded", function () {
  const pauseButton = document.createElement("div");
  pauseButton.classList.add("pause-button");
  pauseButton.innerHTML = "⏸";
  pauseButton.onclick = pauseGame;
  pauseButton.style.display = "none"; // 🔹 Ocultar o botão desde o início
  pauseButton.style.position = "fixed";
  pauseButton.style.bottom = "10px";
  pauseButton.style.right = "10px";
  pauseButton.style.padding = "10px";
  pauseButton.style.background = "#ddd";
  pauseButton.style.border = "1px solid black";
  pauseButton.style.cursor = "pointer";

  document.body.appendChild(pauseButton);

  // Criando o menu de pausa
  const pauseMenu = document.createElement("div");
  pauseMenu.id = "pause-menu";
  pauseMenu.style.display = "none";
  pauseMenu.style.position = "fixed";
  pauseMenu.style.top = "50%";
  pauseMenu.style.left = "50%";
  pauseMenu.style.transform = "translate(-50%, -50%)";
  pauseMenu.style.background = "white";
  pauseMenu.style.padding = "20px";
  pauseMenu.style.border = "2px solid black";
  pauseMenu.style.textAlign = "center";

  pauseMenu.innerHTML = `
        <h1>Jogo Pausado</h1>
        <button onclick="resumeGame()">Continuar</button>
        <button onclick="restartGame()">Sair</button>
    `;

  document.body.appendChild(pauseMenu);
});

// 🔹 Função para exibir o botão de pause ao iniciar o jogo
function showPauseButton() {
  document.querySelector(".pause-button").style.display = "block";
}

// 🔹 Função para ocultar o botão de pause ao sair do jogo
function hidePauseButton() {
  document.querySelector(".pause-button").style.display = "none";
}

// Modificar a função de movimento para impedir ações quando o jogo estiver pausado
const keysPressed = {};

function movePlayers() {
  if (gamePaused) return; // Se estiver pausado, não faz nada

  const player1 = document.getElementById("player1");
  const player2 = document.getElementById("player2");
  const step = 6;

  if (player1 && player1.style.display !== "none") {
    if (singlePlayerMode) {
      // Se for modo single player, usa o esquema escolhido
      if (singlePlayerControls === "wasd") {
        if (keysPressed["w"])
          player1.style.top = `${player1.offsetTop - step}px`;
        if (keysPressed["s"])
          player1.style.top = `${player1.offsetTop + step}px`;
        if (keysPressed["a"])
          player1.style.left = `${player1.offsetLeft - step}px`;
        if (keysPressed["d"])
          player1.style.left = `${player1.offsetLeft + step}px`;
      } else {
        if (keysPressed["ArrowUp"])
          player1.style.top = `${player1.offsetTop - step}px`;
        if (keysPressed["ArrowDown"])
          player1.style.top = `${player1.offsetTop + step}px`;
        if (keysPressed["ArrowLeft"])
          player1.style.left = `${player1.offsetLeft - step}px`;
        if (keysPressed["ArrowRight"])
          player1.style.left = `${player1.offsetLeft + step}px`;
      }
    } else {
      if (keysPressed["w"]) player1.style.top = `${player1.offsetTop - step}px`;
      if (keysPressed["s"]) player1.style.top = `${player1.offsetTop + step}px`;
      if (keysPressed["a"])
        player1.style.left = `${player1.offsetLeft - step}px`;
      if (keysPressed["d"])
        player1.style.left = `${player1.offsetLeft + step}px`;
    }
  }

  if (player2 && player2.style.display !== "none") {
    if (keysPressed["ArrowUp"])
      player2.style.top = `${player2.offsetTop - step}px`;
    if (keysPressed["ArrowDown"])
      player2.style.top = `${player2.offsetTop + step}px`;
    if (keysPressed["ArrowLeft"])
      player2.style.left = `${player2.offsetLeft - step}px`;
    if (keysPressed["ArrowRight"])
      player2.style.left = `${player2.offsetLeft + step}px`;
  }

  // Atualiza a posição das tags de nome
  document.querySelectorAll(".name-tag").forEach((nameTag) => {
    const player = document.getElementById(
      nameTag.classList.contains("player1") ? "player1" : "player2"
    );
    updateNameTagPosition(player, nameTag);
  });

  // Verifica a coleta do emoji ⚔️
  checkWarriorPickup(player1, "player1");
  checkWarriorPickup(player2, "player2");

  requestAnimationFrame(movePlayers); // Loop contínuo para suavizar o movimento
}

// Detecta quando uma tecla é pressionada
document.addEventListener("keydown", (event) => {
  keysPressed[event.key] = true;
});

// Detecta quando uma tecla é solta
document.addEventListener("keyup", (event) => {
  delete keysPressed[event.key];
});

function createPlayerNameTag(playerId, playerName) {
  const player = document.getElementById(playerId);
  const nameTag = document.createElement("div");
  nameTag.classList.add("name-tag", playerId);
  nameTag.innerText = playerName;
  nameTag.style.position = "absolute";
  nameTag.style.fontWeight = "bold";
  nameTag.style.textAlign = "center";
  nameTag.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
  nameTag.style.padding = "2px 5px";
  nameTag.style.borderRadius = "5px";
  nameTag.style.fontSize = "14px";

  document.body.appendChild(nameTag);
  return nameTag;
}

function updateNameTagPosition(player, nameTag) {
  nameTag.style.left = `${
    player.offsetLeft + player.offsetWidth / 2 - nameTag.offsetWidth / 2
  }px`;
  nameTag.style.top = `${player.offsetTop - 25}px`;
}

function spawnWarriorItem(playerId) {
  const warriorItem = document.createElement("div");
  warriorItem.classList.add("warrior-item");
  warriorItem.innerHTML = "⚔";
  warriorItem.style.position = "absolute";
  warriorItem.style.fontSize = "25px";
  warriorItem.style.textAlign = "center";
  warriorItem.style.width = "30px";
  warriorItem.style.height = "30px";

  // Posiciona aleatoriamente na tela
  warriorItem.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  warriorItem.style.top = `${Math.random() * (window.innerHeight - 50)}px`;

  document.body.appendChild(warriorItem);
  warriorItems.push({ element: warriorItem, collected: false, owner: null });

  return warriorItem;
}

function checkWarriorPickup(player, playerId) {
  warriorItems.forEach((item) => {
    if (!item.collected) {
      const playerRect = player.getBoundingClientRect();
      const itemRect = item.element.getBoundingClientRect();

      // Verifica colisão entre jogador e item
      if (
        playerRect.left < itemRect.right &&
        playerRect.right > itemRect.left &&
        playerRect.top < itemRect.bottom &&
        playerRect.bottom > itemRect.top
      ) {
        // Pegou o emoji ⚔ e atribui a classe Guerreiro
        if (!playerClasses[playerId]) {
          item.collected = true;
          item.owner = playerId;
          playerClasses[playerId] = "Guerreiro";

          // Pega o nome atual do jogador
          const playerNameElement = document.getElementById(
            `display-name${playerId === "player1" ? "1" : "2"}`
          );
          const playerName = playerNameElement
            ? playerNameElement.textContent.split(" (")[0]
            : "Jogador";

          // Atualiza os atributos do player para Guerreiro e exibe a classe
          updatePlayerStats(
            playerId,
            {
              agilidade: 2,
              força: 5,
              resistência: "5/5",
              inteligência: 1,
              mana: 1,
            },
            playerName,
            "Guerreiro"
          );

          // Fixa o emoji ⚔ atrás do jogador
          document.body.removeChild(item.element);
          player.insertAdjacentHTML(
            "afterbegin",
            '<span class="warrior-icon">⚔</span>'
          );
        }
      }
    }
  });
}

function updatePlayerStats(playerId, stats, playerName, playerClass) {
  const statsContainer = document.querySelector(`.stats-container.${playerId}`);
  if (statsContainer) {
    statsContainer.innerHTML = `
            <h2 class="name">${playerName} (${playerClass})</h2>
            <ul class="stats">
                <li>Agilidade: ${stats.agilidade}</li>
                <li>Força: ${stats.força}</li>
                <li>Resistência: ${stats.resistência}</li>
                <li>Inteligência: ${stats.inteligência}</li>
                <li>Mana: ${stats.mana}</li>
            </ul>
        `;
  }
}

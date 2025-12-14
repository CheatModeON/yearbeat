// YearBeat Game Logic

// Game State
let gameState = {
  players: [],
  currentRound: 0,
  totalRounds: 5,
  songs: [],
  currentSong: null,
  currentPlayerIndex: 0,
  guesses: {},
  scores: {},
  phase: "setup", // setup, playing, guessing, results, final
};

// YouTube Player
let player;
let playerReady = false;

// YouTube API Callback
function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-player", {
    height: "100%",
    width: "100%",
    videoId: "",
    playerVars: {
      playsinline: 1,
      controls: 1,
      rel: 0,
      modestbranding: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  playerReady = true;
  console.log("YouTube Player Ready");
}

function onPlayerStateChange(event) {
  // Handle player state changes if needed
}

// DOM Elements
const screens = {
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen"),
  results: document.getElementById("results-screen"),
  final: document.getElementById("final-screen"),
};

// Switch between screens
function showScreen(screenName) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[screenName].classList.add("active");
}

// Player Management
function addPlayer() {
  const playersList = document.getElementById("players-list");
  const playerCount = playersList.children.length + 1;

  if (playerCount > 8) {
    alert("Maximum 8 players allowed!");
    return;
  }

  const playerDiv = document.createElement("div");
  playerDiv.className = "player-input";
  playerDiv.innerHTML = `
        <input type="text" placeholder="Player ${playerCount}" class="player-name" value="Player ${playerCount}">
        <button class="remove-player" onclick="removePlayer(this)">×</button>
    `;
  playersList.appendChild(playerDiv);

  updateRemoveButtons();
}

function removePlayer(button) {
  const playerDiv = button.parentElement;
  playerDiv.remove();
  updateRemoveButtons();
  renumberPlayers();
}

function updateRemoveButtons() {
  const buttons = document.querySelectorAll(".remove-player");
  buttons.forEach((btn) => {
    btn.disabled = buttons.length <= 1;
  });
}

function renumberPlayers() {
  const inputs = document.querySelectorAll(".player-name");
  inputs.forEach((input, index) => {
    if (input.value.startsWith("Player ")) {
      input.value = `Player ${index + 1}`;
    }
    input.placeholder = `Player ${index + 1}`;
  });
}

// Start Game
function startGame() {
  // Get player names
  const playerInputs = document.querySelectorAll(".player-name");
  gameState.players = Array.from(playerInputs).map(
    (input) => input.value.trim() || input.placeholder
  );

  // Get number of rounds
  gameState.totalRounds =
    parseInt(document.getElementById("rounds-input").value) || 5;
  gameState.totalRounds = Math.min(Math.max(gameState.totalRounds, 1), 20);

  // Initialize scores
  gameState.scores = {};
  gameState.players.forEach((player) => {
    gameState.scores[player] = 0;
  });

  // Get random songs
  gameState.songs = getRandomSongs(gameState.totalRounds);

  // Reset game state
  gameState.currentRound = 0;
  gameState.phase = "playing";

  // Start first round
  startRound();
}

function startRound() {
  gameState.currentRound++;
  gameState.currentPlayerIndex = 0;
  gameState.guesses = {};

  // Get current song
  gameState.currentSong = gameState.songs[gameState.currentRound - 1];

  // Update UI
  document.getElementById(
    "round-display"
  ).textContent = `Round ${gameState.currentRound}/${gameState.totalRounds}`;
  updateScoreboardMini();
  updateCurrentPlayerTurn();
  updateGuessesDisplay();

  // Reset year slider
  document.getElementById("year-slider").value = 1990;
  document.getElementById("year-value").textContent = "1990";

  // Load video
  if (playerReady && gameState.currentSong) {
    player.loadVideoById(gameState.currentSong.id);
  }

  showScreen("game");
}

function updateScoreboardMini() {
  const container = document.getElementById("scoreboard-mini");
  container.innerHTML = gameState.players
    .map((player, index) => {
      const isActive = index === gameState.currentPlayerIndex;
      return `<div class="score-item ${isActive ? "active" : ""}">${player}: ${
        gameState.scores[player]
      }</div>`;
    })
    .join("");
}

function updateCurrentPlayerTurn() {
  const container = document.getElementById("current-player-turn");
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  if (gameState.currentPlayerIndex < gameState.players.length) {
    container.innerHTML = `🎯 ${currentPlayer}'s turn to guess!`;
    document.getElementById("submit-guess-btn").disabled = false;
    document.getElementById("year-slider").disabled = false;
  } else {
    container.innerHTML = `✅ All players have guessed!`;
    document.getElementById("submit-guess-btn").disabled = true;
    document.getElementById("year-slider").disabled = true;
  }
}

function updateGuessesDisplay() {
  const container = document.getElementById("guesses-display");
  container.innerHTML = gameState.players
    .map((player) => {
      const guess = gameState.guesses[player];
      if (guess !== undefined) {
        return `
                <div class="guess-item locked">
                    <span class="player-name">${player}</span>
                    <span class="guess-year">????</span>
                </div>
            `;
      } else {
        return `
                <div class="guess-item">
                    <span class="player-name">${player}</span>
                    <span class="waiting">Waiting...</span>
                </div>
            `;
      }
    })
    .join("");
}

// Year Slider
document.getElementById("year-slider").addEventListener("input", function () {
  document.getElementById("year-value").textContent = this.value;
});

// Submit Guess
function submitGuess() {
  const year = parseInt(document.getElementById("year-slider").value);
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  // Record guess
  gameState.guesses[currentPlayer] = year;

  // Move to next player
  gameState.currentPlayerIndex++;

  // Update UI
  updateScoreboardMini();
  updateCurrentPlayerTurn();
  updateGuessesDisplay();

  // Check if all players have guessed
  if (gameState.currentPlayerIndex >= gameState.players.length) {
    setTimeout(() => {
      showRoundResults();
    }, 1000);
  } else {
    // Reset slider for next player
    document.getElementById("year-slider").value = 1990;
    document.getElementById("year-value").textContent = "1990";
  }
}

function showRoundResults() {
  gameState.phase = "results";

  const correctYear = gameState.currentSong.year;

  // Display correct year
  document.getElementById("correct-year-display").textContent = correctYear;

  // Display song info
  document.getElementById("song-info").innerHTML = `
        <div class="song-title">${gameState.currentSong.title}</div>
        <div class="song-artist">${gameState.currentSong.artist}</div>
    `;

  // Calculate and display results
  const resultsContainer = document.getElementById("round-results");
  const results = [];

  gameState.players.forEach((player) => {
    const guess = gameState.guesses[player];
    const diff = Math.abs(guess - correctYear);
    let points = 0;
    let pointClass = "";

    // Scoring system:
    // Exact: 10 points + 5 bonus = 15 points
    // Within 1 year: 10 points
    // Within 3 years: 7 points
    // Within 5 years: 5 points
    // Within 10 years: 3 points
    // Within 20 years: 1 point
    // More than 20 years: 0 points

    if (diff === 0) {
      points = 15;
      pointClass = "perfect";
    } else if (diff <= 1) {
      points = 10;
      pointClass = "positive";
    } else if (diff <= 3) {
      points = 7;
      pointClass = "positive";
    } else if (diff <= 5) {
      points = 5;
      pointClass = "positive";
    } else if (diff <= 10) {
      points = 3;
      pointClass = "positive";
    } else if (diff <= 20) {
      points = 1;
      pointClass = "positive";
    }

    gameState.scores[player] += points;

    results.push({
      player,
      guess,
      diff,
      points,
      pointClass,
    });
  });

  // Sort by points (highest first), then by diff (lowest first)
  results.sort((a, b) => b.points - a.points || a.diff - b.diff);

  resultsContainer.innerHTML = results
    .map(
      (r) => `
        <div class="result-item">
            <div class="player-info">
                <div class="player-name">${r.player}</div>
                <div class="guess-info">Guessed ${r.guess} (${
        r.diff === 0
          ? "PERFECT!"
          : `off by ${r.diff} year${r.diff !== 1 ? "s" : ""}`
      })</div>
            </div>
            <div class="points ${r.pointClass}">+${r.points}</div>
        </div>
    `
    )
    .join("");

  // Update button text
  const nextBtn = document.getElementById("next-round-btn");
  if (gameState.currentRound >= gameState.totalRounds) {
    nextBtn.textContent = "See Final Results 🏆";
  } else {
    nextBtn.textContent = "Next Round ➡️";
  }

  // Stop video
  if (player && player.pauseVideo) {
    player.pauseVideo();
  }

  showScreen("results");
}

function nextRound() {
  if (gameState.currentRound >= gameState.totalRounds) {
    showFinalResults();
  } else {
    startRound();
  }
}

function showFinalResults() {
  gameState.phase = "final";

  // Sort players by score
  const sortedPlayers = [...gameState.players].sort(
    (a, b) => gameState.scores[b] - gameState.scores[a]
  );

  // Display winner
  const winner = sortedPlayers[0];
  const winnerScore = gameState.scores[winner];

  // Check for ties
  const winners = sortedPlayers.filter(
    (p) => gameState.scores[p] === winnerScore
  );

  const winnerDisplay = document.getElementById("winner-display");
  if (winners.length > 1) {
    winnerDisplay.innerHTML = `
            <div class="crown">🏆</div>
            <div class="winner-name">It's a Tie!</div>
            <div class="winner-score">${winners.join(
              " & "
            )} with ${winnerScore} points</div>
        `;
  } else {
    winnerDisplay.innerHTML = `
            <div class="crown">👑</div>
            <div class="winner-name">${winner}</div>
            <div class="winner-score">${winnerScore} points</div>
        `;
  }

  // Display all scores
  const scoresContainer = document.getElementById("final-scores");
  scoresContainer.innerHTML = sortedPlayers
    .map((player, index) => {
      const rank = index + 1;
      const rankEmoji =
        rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}.`;
      return `
            <div class="final-score-item ${rank === 1 ? "first" : ""}">
                <span class="rank">${rankEmoji}</span>
                <span class="player-name">${player}</span>
                <span class="total-score">${gameState.scores[player]}</span>
            </div>
        `;
    })
    .join("");

  showScreen("final");
}

function resetGame() {
  // Reset to start screen
  gameState = {
    players: [],
    currentRound: 0,
    totalRounds: 5,
    songs: [],
    currentSong: null,
    currentPlayerIndex: 0,
    guesses: {},
    scores: {},
    phase: "setup",
  };

  // Reset UI
  document.getElementById("rounds-input").value = 5;
  document.getElementById("players-list").innerHTML = `
        <div class="player-input">
            <input type="text" placeholder="Player 1" class="player-name" value="Player 1">
            <button class="remove-player" onclick="removePlayer(this)" disabled>×</button>
        </div>
    `;

  showScreen("start");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  showScreen("start");
});

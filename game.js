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

// DEBUG: Test functions for error handling
// Call these from browser console to test:
// testInvalidVideo() - loads an invalid video ID
// testUnavailableVideo() - loads a known unavailable video
window.testInvalidVideo = function () {
  if (player && playerReady) {
    console.log("Testing with invalid video ID...");
    gameState.currentSong = {
      id: "INVALID_ID_123",
      title: "Test Invalid",
      artist: "Test",
      year: 2000,
    };
    player.loadVideoById("INVALID_ID_123");
  } else {
    console.log("Player not ready. Start a game first.");
  }
};

window.testUnavailableVideo = function () {
  if (player && playerReady) {
    console.log("Testing with potentially unavailable video...");
    gameState.currentSong = {
      id: "xxxxxxxxxxx",
      title: "Test Unavailable",
      artist: "Test",
      year: 2000,
    };
    player.loadVideoById("xxxxxxxxxxx");
  } else {
    console.log("Player not ready. Start a game first.");
  }
};
// TODO: remove the tests

// YouTube API Callback
function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-player", {
    height: "100%",
    width: "100%",
    videoId: "",
    playerVars: {
      playsinline: 1,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      disablekb: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  });
}

function onPlayerReady(event) {
  playerReady = true;
  console.log("YouTube Player Ready");
}

function onPlayerError(event) {
  console.log("YouTube Player Error:", event.data);
  // Error codes: 2 = invalid video ID, 5 = HTML5 error, 100 = not found, 101/150 = embedding not allowed
  const audioStatus = document.getElementById("audio-status");
  audioStatus.textContent = "Song unavailable, loading next...";

  // Skip to a different song
  skipUnavailableSong();
}

function skipUnavailableSong() {
  // Mark current song as unavailable
  const currentSongId = gameState.currentSong?.id;
  if (currentSongId) {
    unavailableSongs.add(currentSongId);
  }

  // Find a replacement song that hasn't been used and isn't unavailable
  const usedSongIds = new Set(gameState.songs.map((s) => s.id));
  const availableSongs = SONGS_DATABASE.filter(
    (s) => !usedSongIds.has(s.id) && !unavailableSongs.has(s.id)
  );

  if (availableSongs.length > 0) {
    // Pick a random replacement
    const replacement =
      availableSongs[Math.floor(Math.random() * availableSongs.length)];
    gameState.currentSong = replacement;
    gameState.songs[gameState.currentRound - 1] = replacement;

    // Load the new video
    if (playerReady) {
      setTimeout(() => {
        player.loadVideoById(replacement.id);
      }, 1000);
    }
  } else {
    // No more songs available, show error
    document.getElementById("audio-status").textContent =
      "No more songs available!";
  }
}

// Track unavailable songs
let unavailableSongs = new Set();

function onPlayerStateChange(event) {
  const playPauseBtn = document.getElementById("play-pause-btn");
  const musicIcon = document.getElementById("music-icon");
  const audioStatus = document.getElementById("audio-status");

  if (event.data === YT.PlayerState.PLAYING) {
    playPauseBtn.textContent = "⏸️";
    musicIcon.classList.add("playing");
    audioStatus.textContent = "Now playing...";
  } else if (event.data === YT.PlayerState.PAUSED) {
    playPauseBtn.textContent = "▶️";
    musicIcon.classList.remove("playing");
    audioStatus.textContent = "Paused";
  } else if (event.data === YT.PlayerState.ENDED) {
    playPauseBtn.textContent = "🔄";
    musicIcon.classList.remove("playing");
    audioStatus.textContent = "Song ended - replay?";
  } else if (event.data === YT.PlayerState.BUFFERING) {
    audioStatus.textContent = "Loading...";
  }
}

// Toggle play/pause
function togglePlayPause() {
  if (!player || !playerReady) return;

  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
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

  // Reset unavailable songs tracker
  unavailableSongs = new Set();

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

  // Reset audio controls
  document.getElementById("play-pause-btn").textContent = "▶️";
  document.getElementById("music-icon").classList.remove("playing");
  document.getElementById("audio-status").textContent = "Ready to play";

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

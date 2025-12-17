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
  musicSource: "youtube", // 'youtube' or 'spotify'
};

// YouTube Player
let player;
let playerReady = false;

// Spotify Player state
let spotifyPlaying = false;
let spotifyController = null;
let spotifyIFrameAPI = null;
let spotifyReady = false;

// Spotify IFrame API Callback
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  spotifyIFrameAPI = IFrameAPI;
  spotifyReady = true;
  console.log("Spotify IFrame API Ready");
};

// Change rounds with custom buttons
function changeRounds(delta) {
  const input = document.getElementById("rounds-input");
  let value = parseInt(input.value) + delta;
  value = Math.min(Math.max(value, 1), 20); // Clamp between 1-20
  input.value = value;
}

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
  const database = getCurrentSongsDatabase();
  const availableSongs = database.filter(
    (s) => !usedSongIds.has(s.id) && !unavailableSongs.has(s.id)
  );

  if (availableSongs.length > 0) {
    // Pick a random replacement
    const replacement =
      availableSongs[Math.floor(Math.random() * availableSongs.length)];
    gameState.currentSong = replacement;
    gameState.songs[gameState.currentRound - 1] = replacement;

    // Load the new video/track
    if (gameState.musicSource === "spotify") {
      setTimeout(() => {
        loadSpotifyTrack(replacement.id);
      }, 1000);
    } else if (playerReady) {
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
  const submitBtn = document.getElementById("submit-guess-btn");

  if (event.data === YT.PlayerState.PLAYING) {
    playPauseBtn.textContent = "⏸️";
    musicIcon.classList.add("playing");
    audioStatus.textContent = "Now playing...";
    // Enable guess button when song is playing
    if (gameState.currentPlayerIndex < gameState.players.length) {
      submitBtn.disabled = false;
    }
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
    // Disable guess button while loading/buffering
    submitBtn.disabled = true;
  }
}

// Toggle play/pause
function togglePlayPause() {
  if (gameState.musicSource === "spotify") {
    toggleSpotifyPlayPause();
    return;
  }

  if (!player || !playerReady) return;

  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

// Spotify play/pause toggle
function toggleSpotifyPlayPause() {
  const playPauseBtn = document.getElementById("play-pause-btn");
  const musicIcon = document.getElementById("music-icon");
  const audioStatus = document.getElementById("audio-status");
  const submitBtn = document.getElementById("submit-guess-btn");

  if (!spotifyController) {
    console.log("Spotify controller not ready");
    return;
  }

  if (spotifyPlaying) {
    spotifyController.pause();
    playPauseBtn.textContent = "▶️";
    musicIcon.classList.remove("playing");
    audioStatus.textContent = "Paused";
    spotifyPlaying = false;
  } else {
    spotifyController.resume();
    playPauseBtn.textContent = "⏸️";
    musicIcon.classList.add("playing");
    audioStatus.textContent = "Now playing...";
    spotifyPlaying = true;
    // Enable guess button
    if (gameState.currentPlayerIndex < gameState.players.length) {
      submitBtn.disabled = false;
    }
  }
}

// Load Spotify track using IFrame API
function loadSpotifyTrack(trackId) {
  const spotifyPlayer = document.getElementById("spotify-player");
  const audioStatus = document.getElementById("audio-status");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const musicIcon = document.getElementById("music-icon");
  const submitBtn = document.getElementById("submit-guess-btn");

  console.log("Loading Spotify track:", trackId);

  if (!spotifyPlayer) {
    console.error("Spotify player element not found!");
    return;
  }

  if (!spotifyIFrameAPI) {
    console.error("Spotify IFrame API not loaded yet");
    audioStatus.textContent = "Loading Spotify...";
    // Retry after a delay
    setTimeout(() => loadSpotifyTrack(trackId), 1000);
    return;
  }

  // Reset UI state
  spotifyPlaying = false;
  playPauseBtn.textContent = "▶️";
  musicIcon.classList.remove("playing");

  // If controller exists, try to reuse it with loadUri (better for mobile)
  if (spotifyController) {
    console.log("Reusing existing Spotify controller");
    audioStatus.textContent = "Tap ▶️ to play";
    try {
      spotifyController.loadUri(`spotify:track:${trackId}`);
      // Don't auto-play on mobile - user must tap play button
      // Enable the guess button since track is loaded
      return;
    } catch (e) {
      console.log("Error reusing controller, will recreate:", e);
      // Fall through to create new controller
      try {
        spotifyController.destroy();
      } catch (e2) {
        console.log("Error destroying controller:", e2);
      }
      spotifyController = null;
    }
  }

  // Creating new controller - this happens on first track with user interaction
  audioStatus.textContent = "Loading...";

  // Recreate the embed div (it gets replaced by the API)
  spotifyPlayer.innerHTML = '<div id="spotify-embed"></div>';
  const spotifyEmbed = document.getElementById("spotify-embed");

  // Create new controller
  const options = {
    uri: `spotify:track:${trackId}`,
    width: "100%",
    height: 152,
    theme: 0,
  };

  const callback = (controller) => {
    spotifyController = controller;
    console.log("Spotify controller created");

    // Add event listeners
    controller.addListener("playback_update", (e) => {
      if (e.data.isPaused) {
        playPauseBtn.textContent = "▶️";
        musicIcon.classList.remove("playing");
        if (spotifyPlaying) {
          // Was playing, now paused
          audioStatus.textContent = "Paused";
        } else {
          // Never started playing
          audioStatus.textContent = "Tap ▶️ to play";
        }
        spotifyPlaying = false;
      } else {
        playPauseBtn.textContent = "⏸️";
        musicIcon.classList.add("playing");
        audioStatus.textContent = "Now playing...";
        spotifyPlaying = true;
        // Enable guess button when playing
        if (gameState.currentPlayerIndex < gameState.players.length) {
          submitBtn.disabled = false;
        }
      }
    });

    controller.addListener("ready", () => {
      console.log("Spotify embed ready");
      audioStatus.textContent = "Tap ▶️ to play";
      // Try to auto-play (works on first track due to user interaction from clicking Start Game)
      setTimeout(() => {
        controller.play();
      }, 300);
    });
  };

  spotifyIFrameAPI.createController(spotifyEmbed, options, callback);
}

// Show/hide players based on music source
function updatePlayerVisibility() {
  const youtubePlayer = document.getElementById("youtube-player");
  const spotifyPlayer = document.getElementById("spotify-player");
  const audioControls = document.querySelector(".audio-controls");

  console.log("Updating player visibility for:", gameState.musicSource);

  if (gameState.musicSource === "spotify") {
    // Hide YouTube, show Spotify (but Spotify is positioned off-screen)
    youtubePlayer.classList.add("hidden");
    spotifyPlayer.classList.remove("hidden");
    // Show custom audio controls for Spotify too
    if (audioControls) {
      audioControls.style.display = "flex";
    }
  } else {
    // Show YouTube, hide Spotify
    youtubePlayer.classList.remove("hidden");
    spotifyPlayer.classList.add("hidden");
    if (audioControls) {
      audioControls.style.display = "flex";
    }
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
async function startGame() {
  // Store selected music source
  gameState.musicSource = currentMusicSource;
  console.log("Starting game with music source:", gameState.musicSource);

  // Ensure songs are loaded based on source
  if (gameState.musicSource === "youtube") {
    if (SONGS_DATABASE.length === 0) {
      const startBtn = document.getElementById("start-game-btn");
      startBtn.textContent = "Loading songs...";
      startBtn.disabled = true;
      await loadSongsDatabase();
      startBtn.textContent = "Start Game 🎮";
      startBtn.disabled = false;

      if (SONGS_DATABASE.length === 0) {
        alert("Failed to load songs database. Please refresh the page.");
        return;
      }
    }
  } else {
    // Spotify
    if (SPOTIFY_SONGS_DATABASE.length === 0) {
      console.log("Loading Spotify songs database...");
      await loadSpotifySongsDatabase();
    }
    console.log("Spotify songs available:", SPOTIFY_SONGS_DATABASE.length);
  }

  // Get player names - specifically from the players-list container
  const playersList = document.getElementById("players-list");
  const playerInputs = playersList.querySelectorAll(".player-name");
  if (playerInputs.length === 0) {
    console.error("No player inputs found!");
    return;
  }
  gameState.players = Array.from(playerInputs).map(
    (input) =>
      (input.value ? input.value.trim() : "") || input.placeholder || "Player"
  );

  console.log("Starting game with players:", gameState.players);

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
  document.getElementById("music-icon").textContent = "🎵";
  document.getElementById("music-icon").classList.remove("playing");
  document.getElementById("audio-status").textContent = "Ready to play";

  // Disable guess button until song starts playing
  document.getElementById("submit-guess-btn").disabled = true;

  // Update player visibility based on music source
  updatePlayerVisibility();

  // Load video/track based on music source
  if (gameState.musicSource === "spotify") {
    if (gameState.currentSong) {
      loadSpotifyTrack(gameState.currentSong.id);
    }
  } else {
    // YouTube
    if (playerReady && gameState.currentSong) {
      player.loadVideoById(gameState.currentSong.id);
    }
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
    container.innerHTML = `${currentPlayer}'s turn to guess!`;
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

  // Stop video/audio
  if (gameState.musicSource === "spotify") {
    // Pause Spotify playback (don't destroy - keep for next round on mobile)
    if (spotifyController) {
      try {
        spotifyController.pause();
      } catch (e) {
        console.log("Error pausing Spotify:", e);
      }
    }
    spotifyPlaying = false;
  } else if (player && player.pauseVideo) {
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
  gameState.players = [];
  gameState.currentRound = 0;
  gameState.totalRounds = 5;
  gameState.songs = [];
  gameState.currentSong = null;
  gameState.currentPlayerIndex = 0;
  gameState.guesses = {};
  gameState.scores = {};
  gameState.phase = "setup";
  gameState.musicSource = "youtube";

  // Reset music source to YouTube
  currentMusicSource = "youtube";
  document.querySelectorAll(".source-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  const youtubeBtn = document.querySelector('[data-source="youtube"]');
  if (youtubeBtn) {
    youtubeBtn.classList.add("active");
  }

  // Clear Spotify
  if (spotifyController) {
    try {
      spotifyController.destroy();
    } catch (e) {
      console.log("Error destroying Spotify controller:", e);
    }
    spotifyController = null;
  }
  // Recreate the embed div for next game
  const spotifyPlayer = document.getElementById("spotify-player");
  if (spotifyPlayer) {
    spotifyPlayer.innerHTML = '<div id="spotify-embed"></div>';
  }
  spotifyPlaying = false;

  // Reset UI
  document.getElementById("rounds-input").value = 5;
  const playersList = document.getElementById("players-list");
  playersList.innerHTML =
    '<div class="player-input">' +
    '<input type="text" placeholder="Player 1" class="player-name" value="Player 1">' +
    '<button class="remove-player" onclick="removePlayer(this)" disabled>×</button>' +
    "</div>";

  console.log(
    "Game reset. Players list children:",
    playersList.children.length
  );

  showScreen("start");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  showScreen("start");
});

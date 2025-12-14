// Songs database - loaded from songs.json
// Contains 22,000+ songs with YouTube video IDs and release years
// https://huggingface.co/datasets/akbargherbal/youtube-music-hits

let SONGS_DATABASE = [];

// Load songs from JSON file
async function loadSongsDatabase() {
  try {
    const response = await fetch("songs.json");
    if (!response.ok) {
      throw new Error(`Failed to load songs: ${response.status}`);
    }
    SONGS_DATABASE = await response.json();
    console.log(`Loaded ${SONGS_DATABASE.length} songs from database`);
    return true;
  } catch (error) {
    console.error("Error loading songs database:", error);
    // Fallback to a small hardcoded list if JSON fails to load
    SONGS_DATABASE = [
      {
        id: "JGwWNGJdvx8",
        title: "Shape of You",
        artist: "Ed Sheeran",
        year: 2017,
      },
      {
        id: "OPf0YbXqDm0",
        title: "Uptown Funk",
        artist: "Mark Ronson",
        year: 2014,
      },
      {
        id: "dQw4w9WgXcQ",
        title: "Never Gonna Give You Up",
        artist: "Rick Astley",
        year: 1987,
      },
      {
        id: "hTWKbfoikeg",
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        year: 1991,
      },
      {
        id: "fJ9rUzIMcZQ",
        title: "Stayin' Alive",
        artist: "Bee Gees",
        year: 1977,
      },
    ];
    return false;
  }
}

// Function to get random songs for a game (avoiding duplicates)
function getRandomSongs(count) {
  if (SONGS_DATABASE.length === 0) {
    console.warn("Songs database is empty!");
    return [];
  }

  const shuffled = [...SONGS_DATABASE].sort(() => Math.random() - 0.5);
  // Remove duplicates by video ID
  const unique = [];
  const seen = new Set();
  for (const song of shuffled) {
    if (!seen.has(song.id)) {
      seen.add(song.id);
      unique.push(song);
    }
  }
  return unique.slice(0, count);
}

// Initialize: Load songs when script loads
loadSongsDatabase();

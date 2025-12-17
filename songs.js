// Songs database - loaded from songs.json
// Contains 22,000+ songs with YouTube video IDs and release years
// and 47,000+ popular Spotify tracks with Spotify track IDs and release years
// https://huggingface.co/datasets/akbargherbal/youtube-music-hits
// https://huggingface.co/datasets/fjcloud/spotify_popular_tracks

let SONGS_DATABASE = [];
let SPOTIFY_SONGS_DATABASE = [];
let currentMusicSource = "youtube"; // 'youtube' or 'spotify'

// Default Spotify songs database (using Spotify track IDs)
const DEFAULT_SPOTIFY_SONGS = [
  {
    id: "7qiZfU4dY1lWllzX7mPBI3",
    title: "Shape of You",
    artist: "Ed Sheeran",
    year: 2017,
  },
  {
    id: "32OlwWuMpZ6b0uj2KSffGl",
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    year: 2014,
  },
  {
    id: "4cOdK2wGLETKBW3PvgPWqT",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    year: 1987,
  },
  {
    id: "5ghIJDpPoe3CfHMGu71E6T",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    year: 1991,
  },
  {
    id: "4uLU6hMCjMI75M1A2tKUQC",
    title: "Stayin' Alive",
    artist: "Bee Gees",
    year: 1977,
  },
  {
    id: "4u7EnebtmKWzUvf8uB6BJh",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    year: 1975,
  },
  {
    id: "2TpxZ7JUBn3uw46aR7qd6V",
    title: "All I Want for Christmas Is You",
    artist: "Mariah Carey",
    year: 1994,
  },
  {
    id: "3n3Ppam7vgaVa1iaRUc9Lp",
    title: "Mr. Brightside",
    artist: "The Killers",
    year: 2003,
  },
  {
    id: "1BxfuPKGuaTgP7aM0Bbdwr",
    title: "Crazy In Love",
    artist: "Beyoncé ft. JAY-Z",
    year: 2003,
  },
  {
    id: "7ouMYWpwJ422jRcDASAM3t",
    title: "Knights of Cydonia",
    artist: "Muse",
    year: 2006,
  },
  {
    id: "0DiWol3AO6WpXZgp0goxAV",
    title: "Happy",
    artist: "Pharrell Williams",
    year: 2013,
  },
  {
    id: "60nZcImufyMA1MKQY3dcCH",
    title: "Thriller",
    artist: "Michael Jackson",
    year: 1982,
  },
  { id: "3HVWdVOQ0ZA45FsZYu9Dqh", title: "Africa", artist: "Toto", year: 1982 },
  {
    id: "4Ws6P9FzGSFV6bVBwe0xJU",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    year: 1987,
  },
  {
    id: "5CQ30WqJwcep0pYcV4AMNc",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    year: 1971,
  },
  {
    id: "2zYzyRzz6pRmhPzyfMEC8s",
    title: "Hotel California",
    artist: "Eagles",
    year: 1977,
  },
  {
    id: "7LVHVU3tWfcxj5aiPFEW4Q",
    title: "Lose Yourself",
    artist: "Eminem",
    year: 2002,
  },
  {
    id: "0nJW01T7XtvILxQgC5J7Wh",
    title: "Wake Me Up",
    artist: "Avicii",
    year: 2013,
  },
  {
    id: "6habFhsOp2NvshLv26DqMb",
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    year: 2017,
  },
  {
    id: "1rqqCSm0Qe4I9rUvWncaom",
    title: "Billie Jean",
    artist: "Michael Jackson",
    year: 1982,
  },
  {
    id: "3d9DChrdc6BOeFsbrZ3Is0",
    title: "Under Pressure",
    artist: "Queen & David Bowie",
    year: 1981,
  },
  {
    id: "2Kerz7T5SfSSKPUCDBrrHE",
    title: "Take On Me",
    artist: "a-ha",
    year: 1985,
  },
  {
    id: "1vrd6UOGamcKNGnSHJQlSt",
    title: "Dancing Queen",
    artist: "ABBA",
    year: 1976,
  },
  {
    id: "0F7FA14euOIX8KcbEturGH",
    title: "Waterloo",
    artist: "ABBA",
    year: 1974,
  },
  {
    id: "7MXVkk9YMctZqd1Srtv4MB",
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    year: 2016,
  },
  {
    id: "6RUKPb4LETWmmr3iAEQktW",
    title: "Something Just Like This",
    artist: "The Chainsmokers & Coldplay",
    year: 2017,
  },
  {
    id: "0tgVpDi7KT5vDW8KSc48wP",
    title: "Attention",
    artist: "Charlie Puth",
    year: 2017,
  },
  {
    id: "1zi7xx7UVEFkmKfv06H8x0",
    title: "One Dance",
    artist: "Drake ft. WizKid & Kyla",
    year: 2016,
  },
  {
    id: "5ygDXis42ncn6kYG14lEVG",
    title: "Sugar",
    artist: "Maroon 5",
    year: 2015,
  },
  {
    id: "5IVuqXILoxVWvWEPm82Jxr",
    title: "Closer",
    artist: "The Chainsmokers ft. Halsey",
    year: 2016,
  },
  {
    id: "2VxeLyX666F8uXCJ0dZF8B",
    title: "Shallow",
    artist: "Lady Gaga & Bradley Cooper",
    year: 2018,
  },
  {
    id: "5HCyWlXZPP0y6Gqq8TgA20",
    title: "Rolling in the Deep",
    artist: "Adele",
    year: 2010,
  },
  {
    id: "4pbJqGIASGPr0ZpGpnWkDn",
    title: "We Are the Champions",
    artist: "Queen",
    year: 1977,
  },
  {
    id: "3MODES4TNtygekLl146Dxd",
    title: "Eye of the Tiger",
    artist: "Survivor",
    year: 1982,
  },
  {
    id: "1Je1IMUlBXcx1Fz0WE7oPT",
    title: "Wonderwall",
    artist: "Oasis",
    year: 1995,
  },
  {
    id: "3AJwUDP919kvQ9QcozQPxg",
    title: "Yellow",
    artist: "Coldplay",
    year: 2000,
  },
  {
    id: "7qEHsqek33rTcFNT9PFqLf",
    title: "Someone Like You",
    artist: "Adele",
    year: 2011,
  },
  {
    id: "1mea3bSkSGXuIRvnydlB5b",
    title: "Viva la Vida",
    artist: "Coldplay",
    year: 2008,
  },
  {
    id: "2tpWsVSb9UEmDRxAl1zhX1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    year: 2019,
  },
  {
    id: "0VjIjW4GlUZAMYd2vXMi3b",
    title: "Blinding Lights",
    artist: "The Weeknd",
    year: 2019,
  },
  {
    id: "3DamFFqW32WihKkTVlwTYQ",
    title: "Locked Out of Heaven",
    artist: "Bruno Mars",
    year: 2012,
  },
  {
    id: "2bAloeCBwgKJK2JJBLN6F3",
    title: "Can't Stop the Feeling!",
    artist: "Justin Timberlake",
    year: 2016,
  },
  {
    id: "6UelLqGlWMcVH1E5c4H7lY",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    year: 2019,
  },
  {
    id: "39LLxExYz6ewLAcYrzQQyP",
    title: "Levitating",
    artist: "Dua Lipa",
    year: 2020,
  },
  {
    id: "0e7ipj03S05BNilyu5bRzt",
    title: "rockstar",
    artist: "Post Malone ft. 21 Savage",
    year: 2017,
  },
  {
    id: "6f5ExP43esnvdKPddwKXJG",
    title: "Bad Guy",
    artist: "Billie Eilish",
    year: 2019,
  },
  {
    id: "2Fxmhks0bxGSBdJ92vM42m",
    title: "bad guy",
    artist: "Billie Eilish",
    year: 2019,
  },
  {
    id: "3KkXRkHbMCARz0aVfEt68P",
    title: "Sunflower",
    artist: "Post Malone & Swae Lee",
    year: 2018,
  },
  {
    id: "2xLMifQCjDGFmkHkpNLD9h",
    title: "This Is America",
    artist: "Childish Gambino",
    year: 2018,
  },
  {
    id: "5HNCy40Ni5BZJFw1TKzRsC",
    title: "Peaches",
    artist: "Justin Bieber ft. Daniel Caesar & Giveon",
    year: 2021,
  },
];

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

// Load Spotify songs database
async function loadSpotifySongsDatabase() {
  try {
    const response = await fetch("spotify_songs.json");
    if (!response.ok) {
      throw new Error(`Failed to load Spotify songs: ${response.status}`);
    }
    SPOTIFY_SONGS_DATABASE = await response.json();
    console.log(
      `Loaded ${SPOTIFY_SONGS_DATABASE.length} Spotify songs from database`
    );
    return true;
  } catch (error) {
    console.error("Error loading Spotify songs database:", error);
    // Fallback to the default list if JSON fails to load
    SPOTIFY_SONGS_DATABASE = [...DEFAULT_SPOTIFY_SONGS];
    console.log(
      `Using ${SPOTIFY_SONGS_DATABASE.length} fallback Spotify songs`
    );
    return false;
  }
}

// Function to select music source
function selectMusicSource(source) {
  currentMusicSource = source;

  // Update UI buttons
  document.querySelectorAll(".source-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-source="${source}"]`).classList.add("active");

  console.log(`Music source changed to: ${source}`);
}

// Get the current songs database based on selected source
function getCurrentSongsDatabase() {
  return currentMusicSource === "spotify"
    ? SPOTIFY_SONGS_DATABASE
    : SONGS_DATABASE;
}

// Function to get random songs for a game (avoiding duplicates)
function getRandomSongs(count) {
  const database = getCurrentSongsDatabase();

  console.log("Getting random songs from:", currentMusicSource);
  console.log("Database size:", database.length);

  if (database.length === 0) {
    console.warn("Songs database is empty!");
    return [];
  }

  const shuffled = [...database].sort(() => Math.random() - 0.5);
  // Remove duplicates by ID
  const unique = [];
  const seen = new Set();
  for (const song of shuffled) {
    if (!seen.has(song.id)) {
      seen.add(song.id);
      unique.push(song);
    }
  }
  const selected = unique.slice(0, count);
  console.log(
    "Selected songs:",
    selected.map((s) => s.title)
  );
  return selected;
}

// Initialize: Load songs when script loads
loadSongsDatabase();
loadSpotifySongsDatabase();

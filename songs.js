// Predefined songs database with YouTube video IDs and release years
// Format: { id: YouTube video ID, title: Song title, artist: Artist name, year: Release year }

const SONGS_DATABASE = [
  // 1960s
  {
    id: "mQR0bXO_yI8",
    title: "I Can't Help Myself",
    artist: "Four Tops",
    year: 1965,
  },
  {
    id: "ZXhuso4OTG4",
    title: "Respect",
    artist: "Aretha Franklin",
    year: 1967,
  },
  { id: "45cYwDMibGo", title: "Hey Jude", artist: "The Beatles", year: 1968 },
  {
    id: "oOg5VxrxNvU",
    title: "My Girl",
    artist: "The Temptations",
    year: 1964,
  },
  {
    id: "K5_EBAzIPJM",
    title: "I Got You (I Feel Good)",
    artist: "James Brown",
    year: 1965,
  },

  // 1970s
  {
    id: "oRdxUFDoQe0",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    year: 1975,
  },
  { id: "fJ9rUzIMcZQ", title: "Stayin' Alive", artist: "Bee Gees", year: 1977 },
  {
    id: "btPJPFnesV4",
    title: "Eye of the Tiger",
    artist: "Survivor",
    year: 1982,
  },
  {
    id: "1w7OgIMMRc4",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    year: 1987,
  },
  { id: "qeMFqkcPYcg", title: "Somebody to Love", artist: "Queen", year: 1976 },
  {
    id: "HgzGwKwLmgM",
    title: "Don't Stop Me Now",
    artist: "Queen",
    year: 1978,
  },
  {
    id: "rY0WxgSXdEE",
    title: "Another One Bites the Dust",
    artist: "Queen",
    year: 1980,
  },
  { id: "pAgnJDJN4VA", title: "Africa", artist: "Toto", year: 1982 },

  // 1980s
  {
    id: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    year: 1987,
  },
  {
    id: "sOnqjkJTMaA",
    title: "Thriller",
    artist: "Michael Jackson",
    year: 1982,
  },
  {
    id: "Zi_XLOBDo_Y",
    title: "Billie Jean",
    artist: "Michael Jackson",
    year: 1982,
  },
  {
    id: "oRdxUFDoQe0",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    year: 1975,
  },
  { id: "djV11Xbc914", title: "Take On Me", artist: "a-ha", year: 1985 },
  {
    id: "9jK-NcRmVcw",
    title: "The Final Countdown",
    artist: "Europe",
    year: 1986,
  },
  { id: "VdphvuyaV_I", title: "Africa", artist: "Toto", year: 1982 },
  {
    id: "4N1iwQxiHrs",
    title: "Every Breath You Take",
    artist: "The Police",
    year: 1983,
  },
  {
    id: "LatorN4P9aA",
    title: "Girls Just Want to Have Fun",
    artist: "Cyndi Lauper",
    year: 1983,
  },
  {
    id: "0WUdlaLWSVM",
    title: "Footloose",
    artist: "Kenny Loggins",
    year: 1984,
  },
  {
    id: "qYkbTyHXwbs",
    title: "Don't Stop Believin'",
    artist: "Journey",
    year: 1981,
  },
  {
    id: "PGNiXGX2nLU",
    title: "Livin' on a Prayer",
    artist: "Bon Jovi",
    year: 1986,
  },
  {
    id: "nZXRV4MezEw",
    title: "Wake Me Up Before You Go-Go",
    artist: "Wham!",
    year: 1984,
  },
  {
    id: "FuXNumBwDOM",
    title: "I Wanna Dance with Somebody",
    artist: "Whitney Houston",
    year: 1987,
  },

  // 1990s
  {
    id: "hTWKbfoikeg",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    year: 1991,
  },
  {
    id: "gJLIiF15wjQ",
    title: "I Will Always Love You",
    artist: "Whitney Houston",
    year: 1992,
  },
  {
    id: "YkADj0TPrJA",
    title: "Gangsta's Paradise",
    artist: "Coolio",
    year: 1995,
  },
  { id: "FTQbiNvZqaY", title: "Africa", artist: "Toto", year: 1982 },
  {
    id: "kJQP7kiw5Fk",
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    year: 2017,
  },
  {
    id: "dTa2Bzlbjv0",
    title: "...Baby One More Time",
    artist: "Britney Spears",
    year: 1998,
  },
  { id: "CduA0TULnow", title: "Wannabe", artist: "Spice Girls", year: 1996 },
  {
    id: "6Ejga4kJUts",
    title: "Everybody (Backstreet's Back)",
    artist: "Backstreet Boys",
    year: 1997,
  },
  {
    id: "4fndeDfaWCg",
    title: "I Want It That Way",
    artist: "Backstreet Boys",
    year: 1999,
  },
  { id: "ZyhrYis509A", title: "Bye Bye Bye", artist: "NSYNC", year: 2000 },
  { id: "tbNlMtqrYS0", title: "Macarena", artist: "Los Del Rio", year: 1995 },
  { id: "djVLKEgpU1s", title: "Barbie Girl", artist: "Aqua", year: 1997 },
  { id: "y6Sxv-sUYtM", title: "Believe", artist: "Cher", year: 1998 },
  { id: "AREppyQf5uw", title: "Crazy", artist: "Gnarls Barkley", year: 2006 },
  { id: "OPf0YbXqDm0", title: "Uptown Funk", artist: "Bruno Mars", year: 2014 },

  // 2000s
  { id: "raNGeq3_DtM", title: "Yeah!", artist: "Usher", year: 2004 },
  { id: "hLQl3WQQoQ0", title: "Someone Like You", artist: "Adele", year: 2011 },
  { id: "9bZkp7q19f0", title: "Gangnam Style", artist: "PSY", year: 2012 },
  {
    id: "RgKAFK5djSk",
    title: "See You Again",
    artist: "Wiz Khalifa ft. Charlie Puth",
    year: 2015,
  },
  { id: "lp-EO5I60KA", title: "Crazy in Love", artist: "Beyoncé", year: 2003 },
  { id: "QYh6mYIJG2Y", title: "Toxic", artist: "Britney Spears", year: 2004 },
  { id: "uelHwf8o7_U", title: "Hips Don't Lie", artist: "Shakira", year: 2006 },
  { id: "dZX6Q-Bj_xg", title: "Umbrella", artist: "Rihanna", year: 2007 },
  { id: "JRfuAukYTKg", title: "Disturbia", artist: "Rihanna", year: 2008 },
  { id: "2vjPBrBU-TM", title: "Poker Face", artist: "Lady Gaga", year: 2008 },
  { id: "qrO4YZeyl0I", title: "Bad Romance", artist: "Lady Gaga", year: 2009 },
  {
    id: "pRpeEdMmmQ0",
    title: "Shake It Off",
    artist: "Taylor Swift",
    year: 2014,
  },
  {
    id: "e-ORhEE9VVg",
    title: "Blank Space",
    artist: "Taylor Swift",
    year: 2014,
  },
  {
    id: "nfWlot6h_JM",
    title: "Shake It Off",
    artist: "Taylor Swift",
    year: 2014,
  },
  {
    id: "JGwWNGJdvx8",
    title: "Shape of You",
    artist: "Ed Sheeran",
    year: 2017,
  },
  { id: "nfs8NYg7yQM", title: "Perfect", artist: "Ed Sheeran", year: 2017 },
  { id: "2Vv-BfVoq4g", title: "Perfect", artist: "Ed Sheeran", year: 2017 },

  // 2010s
  { id: "CevxZvSJLk8", title: "Roar", artist: "Katy Perry", year: 2013 },
  { id: "0KSOMA3QBU0", title: "Dark Horse", artist: "Katy Perry", year: 2013 },
  { id: "7PCkvCPvDXk", title: "Firework", artist: "Katy Perry", year: 2010 },
  { id: "YQHsXMglC9A", title: "Hello", artist: "Adele", year: 2015 },
  { id: "fRh_vgS2dFE", title: "Sorry", artist: "Justin Bieber", year: 2015 },
  { id: "kffacxfA7G4", title: "Baby", artist: "Justin Bieber", year: 2010 },
  {
    id: "PT2_F-1esPk",
    title: "What Makes You Beautiful",
    artist: "One Direction",
    year: 2011,
  },
  {
    id: "QJO3ROT-A4E",
    title: "Call Me Maybe",
    artist: "Carly Rae Jepsen",
    year: 2012,
  },
  { id: "60ItHLz5WEA", title: "Get Lucky", artist: "Daft Punk", year: 2013 },
  { id: "IcrbM1l_BoI", title: "Wake Me Up", artist: "Avicii", year: 2013 },
  {
    id: "hT_nvWreIhg",
    title: "Counting Stars",
    artist: "OneRepublic",
    year: 2013,
  },
  { id: "QK8mJJJvaes", title: "Lean On", artist: "Major Lazer", year: 2015 },
  {
    id: "ru0K8uYEZWw",
    title: "Can't Stop the Feeling",
    artist: "Justin Timberlake",
    year: 2016,
  },
  {
    id: "papuvlVeZg8",
    title: "Closer",
    artist: "The Chainsmokers",
    year: 2016,
  },
  { id: "SlPhMPnQ58k", title: "Rockabye", artist: "Clean Bandit", year: 2016 },
  { id: "DyDfgMOUjCI", title: "Havana", artist: "Camila Cabello", year: 2017 },
  { id: "kXYiU_JCYtU", title: "Numb", artist: "Linkin Park", year: 2003 },
  { id: "eVTXPUF4Oz4", title: "In the End", artist: "Linkin Park", year: 2000 },
  {
    id: "WXBHCQYxs-0",
    title: "Happy",
    artist: "Pharrell Williams",
    year: 2013,
  },
  { id: "450p7goxZqg", title: "All of Me", artist: "John Legend", year: 2013 },
  { id: "lWA2pjMjpBs", title: "Royals", artist: "Lorde", year: 2013 },

  // 2020s
  {
    id: "EWcqIn1AKYs",
    title: "Don't Start Now",
    artist: "Dua Lipa",
    year: 2019,
  },
  { id: "TUVcZfQe-Kw", title: "Levitating", artist: "Dua Lipa", year: 2020 },
  {
    id: "oygrmJFKYZY",
    title: "Blinding Lights",
    artist: "The Weeknd",
    year: 2019,
  },
  {
    id: "FuXNumBwDOM",
    title: "Save Your Tears",
    artist: "The Weeknd",
    year: 2020,
  },
  { id: "U9BwWKXjVaI", title: "Dynamite", artist: "BTS", year: 2020 },
  {
    id: "mRD0-GxqHVo",
    title: "Savage Love",
    artist: "Jawsh 685 & Jason Derulo",
    year: 2020,
  },
  {
    id: "h9nE2spOw_o",
    title: "drivers license",
    artist: "Olivia Rodrigo",
    year: 2021,
  },
  {
    id: "gNi_6U5Pm_o",
    title: "good 4 u",
    artist: "Olivia Rodrigo",
    year: 2021,
  },
  {
    id: "RsEZmictANA",
    title: "Dance Monkey",
    artist: "Tones and I",
    year: 2019,
  },
  {
    id: "H5v3kku4y6Q",
    title: "Someone You Loved",
    artist: "Lewis Capaldi",
    year: 2018,
  },
  { id: "mNEUkqJAcH4", title: "Circles", artist: "Post Malone", year: 2019 },
  {
    id: "TyimCGEkiUc",
    title: "Montero (Call Me By Your Name)",
    artist: "Lil Nas X",
    year: 2021,
  },
  {
    id: "8EJ3zbKTWQ8",
    title: "INDUSTRY BABY",
    artist: "Lil Nas X & Jack Harlow",
    year: 2021,
  },
  { id: "weeI1G46q0o", title: "Anti-Hero", artist: "Taylor Swift", year: 2022 },
  { id: "CqnU_sJ8V-E", title: "As It Was", artist: "Harry Styles", year: 2022 },
  {
    id: "ApXoWvfEYVU",
    title: "Heat Waves",
    artist: "Glass Animals",
    year: 2020,
  },
  { id: "LDU_Txk06tM", title: "Flowers", artist: "Miley Cyrus", year: 2023 },
  { id: "N7bXF3R2PWM", title: "Vampire", artist: "Olivia Rodrigo", year: 2023 },

  // Classic Rock
  {
    id: "bx1Bh8ZvH84",
    title: "Smoke on the Water",
    artist: "Deep Purple",
    year: 1972,
  },
  {
    id: "1w7OgIMMRc4",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    year: 1987,
  },
  { id: "pAgnJDJN4VA", title: "Africa", artist: "Toto", year: 1982 },
  {
    id: "6Ejga4kJUts",
    title: "Everybody",
    artist: "Backstreet Boys",
    year: 1997,
  },
  { id: "hbe3CQamF8k", title: "Dancing Queen", artist: "ABBA", year: 1976 },
  { id: "xFrGuyw1V8s", title: "Mamma Mia", artist: "ABBA", year: 1975 },
  { id: "fJ9rUzIMcZQ", title: "Stayin' Alive", artist: "Bee Gees", year: 1977 },
  {
    id: "btPJPFnesV4",
    title: "Eye of the Tiger",
    artist: "Survivor",
    year: 1982,
  },
  {
    id: "LRahX5MrSIw",
    title: "Summer of '69",
    artist: "Bryan Adams",
    year: 1984,
  },
  { id: "0J2QdDbelmY", title: "We Will Rock You", artist: "Queen", year: 1977 },
  {
    id: "-tJYN-eG1zk",
    title: "We Are the Champions",
    artist: "Queen",
    year: 1977,
  },

  // Hip-Hop / R&B Classics
  { id: "_CL6n0FJZpk", title: "Lose Yourself", artist: "Eminem", year: 2002 },
  { id: "hAqdLzZfjY4", title: "Stan", artist: "Eminem", year: 2000 },
  { id: "rog8ou-ZepE", title: "Without Me", artist: "Eminem", year: 2002 },
  { id: "gOMhN-hfMtY", title: "Super Bass", artist: "Nicki Minaj", year: 2011 },
  { id: "0cqsayYF0Gs", title: "Work", artist: "Rihanna ft. Drake", year: 2016 },
  { id: "yzTuBuRdAyA", title: "The Box", artist: "Roddy Ricch", year: 2019 },
  {
    id: "i_kF4zLNKio",
    title: "SICKO MODE",
    artist: "Travis Scott",
    year: 2018,
  },
  { id: "tcYodQoapMg", title: "Humble", artist: "Kendrick Lamar", year: 2017 },
  { id: "tvTRZJ-4EyI", title: "God's Plan", artist: "Drake", year: 2018 },
  { id: "xpVfcZ0ZcFM", title: "Hotline Bling", artist: "Drake", year: 2015 },
];

// Function to get random songs for a game (avoiding duplicates)
function getRandomSongs(count) {
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

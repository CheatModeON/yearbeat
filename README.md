# YearBeat 🎵

A fun multiplayer web game where players listen to songs and try to guess the year they were released! Choose between YouTube or Spotify as your music source.

## How to Play

1. **Setup**: Add players/teams, choose music source (YouTube or Spotify), and set the number of rounds
2. **Listen**: A random song plays (audio only - no hints!)
3. **Guess**: Each player uses the slider to guess the release year
4. **Score**: Points are awarded based on how close you are:
   - **Perfect (exact year)**: 15 points 🎯
   - **Within 1 year**: 10 points
   - **Within 3 years**: 7 points
   - **Within 5 years**: 5 points
   - **Within 10 years**: 3 points
   - **Within 20 years**: 1 point
5. **Win**: The player with the most points after all rounds wins!

## Running the Game

### Option 1: Simple HTTP Server (Python)

```bash
cd yearbeat
python3 -m http.server 8080
```

Then open http://localhost:8080 in your browser.

### Option 2: Using Node.js

```bash
npx serve .
```

### Option 3: VS Code Live Server

If you have the Live Server extension, right-click on `index.html` and select "Open with Live Server".

### Option 4: Direct File (Limited)

You can open `index.html` directly in your browser, but some browsers may block embeds due to CORS restrictions.

## Features

- 🎮 **1-8 Players**: Perfect for parties or solo play
- 🎵 **70,000+ Songs**: Massive combined library spanning 1920s to 2020s
- 🎧 **Audio-Only Mode**: No video hints - pure listening challenge
- 🎤 **Dual Music Sources**: Choose between YouTube or Spotify
- 📱 **Responsive**: Works on desktop and mobile
- 🏆 **Score Tracking**: Competitive leaderboard
- 🎨 **Modern UI**: Beautiful dark theme with animations
- ⏭️ **Smart Skip**: Automatically skips unavailable tracks

## Song Libraries

### YouTube Library (22,840 songs)

| Decade      | Songs | %     |
| ----------- | ----- | ----- |
| 1920s-1950s | 33    | 0.1%  |
| 1960s       | 229   | 1.0%  |
| 1970s       | 433   | 1.9%  |
| 1980s       | 1,262 | 5.5%  |
| 1990s       | 2,942 | 12.9% |
| 2000s       | 4,580 | 20.1% |
| 2010s       | 9,463 | 41.4% |
| 2020s       | 3,898 | 17.1% |

### Spotify Library (47,868 songs)

| Decade | Songs  | %     |
| ------ | ------ | ----- |
| 1950s  | 151    | 0.3%  |
| 1960s  | 614    | 1.3%  |
| 1970s  | 1,238  | 2.6%  |
| 1980s  | 1,802  | 3.8%  |
| 1990s  | 4,960  | 10.4% |
| 2000s  | 13,173 | 27.5% |
| 2010s  | 11,889 | 24.8% |
| 2020s  | 14,041 | 29.3% |

## Data Sources

- YouTube songs: [akbargherbal/youtube-music-hits](https://huggingface.co/datasets/akbargherbal/youtube-music-hits)
- Spotify songs: [fjcloud/spotify_popular_tracks](https://huggingface.co/datasets/fjcloud/spotify_popular_tracks)

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks)
- YouTube IFrame API for YouTube playback
- Spotify IFrame API for Spotify playback with autoplay
- Audio-only mode (players hidden) to prevent visual hints
- Automatic handling of unavailable tracks
- PWA-ready with manifest.json

## License

MIT License - Feel free to modify and share!

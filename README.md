# YearBeat 🎵

A fun multiplayer web game where players listen to songs from YouTube and try to guess the year they were released!

## How to Play

1. **Setup**: Add players/teams and set the number of rounds
2. **Listen**: A random song plays from YouTube (audio only - no video hints!)
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

You can open `index.html` directly in your browser, but some browsers may block YouTube embeds due to CORS restrictions.

## Features

- 🎮 **1-8 Players**: Perfect for parties or solo play
- 🎵 **22,800+ Songs**: Massive library spanning 1920s to 2020s
- 🎧 **Audio-Only Mode**: No video hints - pure listening challenge
- 📱 **Responsive**: Works on desktop and mobile
- 🏆 **Score Tracking**: Competitive leaderboard
- 🎨 **Modern UI**: Beautiful dark theme with animations
- ⏭️ **Smart Skip**: Automatically skips unavailable videos

## Song Library

The game includes **22,840 songs** from various genres and decades:

| Decade      | Songs |
| ----------- | ----- |
| 1920s-1950s | 33    |
| 1960s       | 229   |
| 1970s       | 433   |
| 1980s       | 1,262 |
| 1990s       | 2,942 |
| 2000s       | 4,580 |
| 2010s       | 9,463 |
| 2020s       | 3,898 |

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks)
- YouTube IFrame API for audio playback
- Audio-only mode (video hidden) to prevent visual hints
- Automatic handling of unavailable videos
- PWA-ready with manifest.json

## License

MIT License - Feel free to modify and share!

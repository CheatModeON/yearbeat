# YearBeat 🎵

A fun multiplayer web game where players listen to songs from YouTube and try to guess the year they were released!

## How to Play

1. **Setup**: Add players/teams and set the number of rounds
2. **Listen**: A random song plays from YouTube
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
- 🎵 **100+ Songs**: From 1960s classics to 2023 hits
- 📱 **Responsive**: Works on desktop and mobile
- 🏆 **Score Tracking**: Competitive leaderboard
- 🎨 **Modern UI**: Beautiful dark theme with animations

## Song Library

The game includes songs from various genres and decades:

- 1960s-1970s: Classic rock, Motown, disco
- 1980s: Pop, rock, new wave
- 1990s: Grunge, boy bands, pop
- 2000s: R&B, hip-hop, pop
- 2010s: EDM, pop, hip-hop
- 2020s: Modern hits

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks)
- YouTube IFrame API for video playback
- LocalStorage for persistent settings (coming soon)
- PWA-ready with manifest.json

## License

MIT License - Feel free to modify and share!

# snake.exe 1.2

My first original portfolio project, developed to learn and practice the fundamentals of web development.
**Play Now:** [Play the Game](https://claramirandavie.github.io/snake.exe-1.2/)

## Features
- **Classic Mode:** Three difficulty levels (Easy, Normal, and Hard), each with different movement speeds.
- **Pause System:** An in-game menu with Resume, Restart, and Main Menu options. Gameplay is completely frozen while paused.
- **Local High Scores:** Best scores saved separately for each difficulty level.
- **Online Leaderboard:** Global Top 10 rankings for each difficulty, powered by a cloud database.
- **Snake Skins:** Four visual styles for the snake: Default (Cyan), Pink, Lime, and White.
- **Audio:** Sound effects and background music procedurally generated using the Web Audio API.
- **Settings:** Individual volume controls for master volume, sound effects, and music.
- **Statistics:** Tracks games played and completed, highest score, total food collected, longest snake length, and best results.
- **Data Persistence:** Player name, high scores, selected skin, settings, and statistics are automatically saved in the browser using LocalStorage.

## How to Play
| Key | Action |
|---|---|
| ← ↑ → ↓ | Move the snake |
| `Esc` or `P` | Pause / Resume |

### Rules
- The snake starts with three segments.
- Each food item collected awards **10 points** and increases the snake's length.
- Colliding with walls or the snake's own body ends the game.
- Directly reversing the snake's direction is not allowed.
- Moving into the position currently occupied by the tail is allowed, since the tail moves away from that position during the same game update.

## Technologies Used
- **HTML5:** Interface structure and game screens.
- **CSS3:** Visual identity, CSS variables, and animations.
- **JavaScript (ES Modules):** Game logic organized into separate modules.
- **Canvas API:** Rendering the snake and food.
- **Web Audio API:** Procedural sound effects and background music.
- **LocalStorage:** Browser-based data persistence.
- **Supabase (PostgreSQL):** Online leaderboard database, integrated through `fetch` requests.

## Project Structure
    snake-game/
    ├── index.html
    ├── README.md
    ├── supabase-setup.sql
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── main.js
    │   ├── menu.js
    │   ├── game.js
    │   ├── snake.js
    │   ├── food.js
    │   ├── audio.js
    │   ├── settings.js
    │   ├── skins.js
    │   ├── statistics.js
    │   ├── player.js
    │   ├── ranking.js
    │   ├── config.js
    │   └── storage.js
    └── assets/
        ├── images/
        └── sounds/
The project follows a modular architecture, where each file has a specific responsibility. Modules communicate through `import` and `export`, making the code easier to organize, maintain, and expand.

## Running Locally
This project uses **JavaScript ES Modules**, which do not work correctly when `index.html` is opened directly in the browser using the `file://` protocol.
To run the project locally:
1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension.
3. Open the project folder in VS Code.
4. Right-click the `index.html` file.
5. Select **Open with Live Server**.
The game will automatically open in your browser.

## Setting Up the Online Leaderboard (Optional)
The game works normally without Supabase configuration. In this case, only the online leaderboard will be unavailable.
To enable it:
1. Create an account and a project on [Supabase](https://supabase.com/).
2. Open the **SQL Editor** and execute the contents of `supabase-setup.sql`.
3. Under **Connect** or **Project Settings → API Keys**, copy your Project URL and public publishable key (`sb_publishable_...`).
4. Add both values to `js/config.js`.

### Leaderboard Security
The leaderboard uses **Row Level Security (RLS)** to control database access.
- Public users can retrieve and submit scores.
- Existing scores cannot be updated or deleted.
- The database validates submitted data, including player names between 1 and 12 characters, valid difficulty levels, and scores between 0 and 3970 in increments of 10.

## What I Learned
Throughout this project, I practiced and improved my knowledge of:
- Code organization using JavaScript modules (`import` and `export`).
- Game loops using `requestAnimationFrame`.
- Time management and game speed control.
- Implementing input queues to control movement.
- Graphics rendering using the Canvas API.
- Event handling and *event delegation*.
- Data storage and persistence with LocalStorage.
- Audio generation using the Web Audio API.
- Relational database integration with PostgreSQL.
- Communication with external services through HTTP requests.
- Basic web security practices, including XSS prevention using `textContent` and credential protection.

## Known Limitations
- **Leaderboard:** Although the database validates incoming data, the game logic runs entirely in the browser, making it possible to manipulate scores within the allowed limits. Reliable score validation would require running the game logic on a server.
- **Duplicate Names:** When multiple players use the same name, the leaderboard only keeps their highest score.
- **Device Compatibility:** The game was primarily designed for desktop computers, with keyboard-based controls.

## Future Updates
- **Zen Mode:** A mode with constant, reduced speed and no pressure.
- **Challenge Mode:** Levels featuring obstacles and specific objectives.
- Background music using audio files.
- Touch controls for mobile devices.

      

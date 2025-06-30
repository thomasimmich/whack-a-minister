# Whack-a-Minister Game

A humorous "Whack-a-Mole" style game built with React and PixiJS, where players need to hit the right politicians while avoiding hitting environmental activists.

## Features

- Interactive gameplay with a custom hammer cursor
- Animated car and characters
- Sound effects and background music
- Score tracking and timer
- Responsive design
- Multiple game states (Loading, Splash, Playing, Game Over)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the Game

To start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:5173`

## How to Play

1. Click "Start Game" to begin
2. Use your mouse to control the hammer cursor
3. Click on the ministers to score points (+10 points)
4. Avoid clicking on Greta (-30 points)
5. Collect time bonuses to extend your play time (+10 seconds)
6. Try to get the highest score before time runs out!

## Game Controls

- Left Mouse Button: Hit with hammer
- Mute Button: Toggle sound effects and music

## Game States

- Loading: Initial loading screen
- Splash: Start screen with game title and start button
- Playing: Main gameplay
- Game Over: Final score screen with replay option

## Technologies Used

- React
- TypeScript
- PixiJS
- Styled Components
- Web Audio API

## Asset Credits

All game assets (images and sounds) are located in the `src/assets` directory:
- `/images`: Contains all game graphics
- `/sounds`: Contains all game audio files

## Development

To build the game for production:
```bash
npm run build
```

## License

This project is licensed under the MIT License.

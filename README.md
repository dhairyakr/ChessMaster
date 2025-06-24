
# Chess Master 🏆

A professional-grade chess game built with React, TypeScript, and Tailwind CSS. Experience chess like never before with stunning visuals, smooth animations, and comprehensive gameplay features.

https://starlit-dodol-105e69.netlify.app/


![image](https://github.com/user-attachments/assets/97321da5-47f4-42ee-ba95-5d434868d5b1)
![image](https://github.com/user-attachments/assets/b0c312b8-9bdc-4524-b39e-1b0525858f9f)
![image](https://github.com/user-attachments/assets/7c409a85-616a-4aa6-852a-d22ad298ed20)


![image](https://github.com/user-attachments/assets/42dd1127-1d73-4496-a149-da8956c9651f)
![image](https://github.com/user-attachments/assets/b992db1c-5caf-49d2-830f-02095c6012fb)






## ✨ Features

### 🎮 Complete Chess Experience
- **Full Chess Rules Implementation** - All standard chess rules including castling, en passant, and pawn promotion
- **Legal Move Validation** - Real-time validation with visual indicators for legal moves
- **Check & Checkmate Detection** - Automatic detection with visual and audio feedback
- **Stalemate Recognition** - Proper game ending conditions

### 🎨 Beautiful Design
- **11 Premium Themes** - From Professional Slate to Cosmic Nebula
- **Smooth Animations** - Piece movements, captures, and special effects
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Modern UI** - Clean, professional interface with subtle glass-morphism effects

### ⏱️ Time Controls
- **Multiple Time Formats** - Bullet (1+0), Blitz (3+2, 5+0), Rapid (10+0, 15+10), Classical (30+0)
- **Increment Support** - Automatic time increments after each move
- **Visual Timer Warnings** - Red highlighting and animations when time is low
- **Timeout Detection** - Automatic game ending when time expires

### 🎵 Audio Experience
- **Piece-Specific Sounds** - Different sounds for each piece type
- **Move Feedback** - Audio cues for moves, captures, check, and game end
- **Castling & Special Moves** - Unique sounds for special chess moves
- **Toggle Control** - Easy on/off audio control

### 📝 Game Management
- **Move History** - Complete notation with navigation
- **Undo/Redo System** - Step through game history
- **Game Controls** - Resign, offer draw, accept/decline draws
- **Multiple Game Modes** - Choose your starting color or play random

### 🔄 Advanced Features
- **Board Flipping** - View from either player's perspective
- **Captured Pieces Display** - Visual tracking of captured pieces
- **Promotion Modal** - Choose promotion piece with elegant UI
- **Game Over Modals** - Beautiful end-game screens with celebration effects

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Full type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons
- **Web Audio API** - High-quality audio feedback


## 🎯 How to Play

1. **Start a New Game** - Click "New Game" and choose your time control and color preference
2. **Make Moves** - Click on a piece to select it, then click on a highlighted square to move
3. **Special Moves** - The game automatically handles castling, en passant, and pawn promotion
4. **Game Controls** - Use the control panel to resign, offer draws, or navigate move history
5. **Customize Experience** - Change themes, toggle audio, and flip the board as needed

## 🎨 Themes Available

- **Professional Slate** - Clean, professional look
- **Ocean Depths** - Deep blue oceanic theme
- **Emerald Forest** - Natural green tones
- **Royal Purple** - Regal purple and violet
- **Sunset Glow** - Warm orange and amber
- **Midnight Steel** - Dark, modern aesthetic
- **Rose Gold** - Elegant pink and rose tones
- **Arctic Ice** - Cool, icy blue theme
- **Cosmic Nebula** - Space-inspired purples
- **Crimson Fire** - Bold red theme
- **Mystic Teal** - Calming teal and cyan

## 📱 Responsive Design

Chess Master is fully responsive and works beautifully on:
- **Desktop** - Full-featured experience with large board
- **Tablet** - Optimized layout with touch-friendly controls
- **Mobile** - Compact design perfect for on-the-go games

## 🔊 Audio Features

- **Move Sounds** - Different audio for each piece type
- **Capture Effects** - Satisfying capture sound effects
- **Check Alerts** - Audio warning when in check
- **Game Events** - Sounds for castling, promotion, and game end
- **Volume Control** - Easy toggle in the header

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ChessBoard.tsx   # Main game board
│   ├── Square.tsx       # Individual chess squares
│   ├── Header.tsx       # Game header with timers
│   └── ...             # Other UI components
├── hooks/              # Custom React hooks
│   └── useChessGame.ts # Main game logic hook
├── utils/              # Utility functions
│   ├── chess.ts        # Chess rules and validation
│   ├── audio.ts        # Audio management
│   ├── themes.ts       # Board themes
│   └── ...            # Other utilities
├── types.ts           # TypeScript type definitions
└── index.css         # Global styles and animations
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chess piece images from Wikimedia Commons
- Icons from Lucide React
- Inspiration from chess.com and lichess.org
- Built with modern web technologies

## 🐛 Bug Reports

If you find any bugs or have feature requests, please open an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

---

**Enjoy playing Chess Master!** ♟️


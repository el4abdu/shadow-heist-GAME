# Shadow Heist 🎮

A modern multiplayer social deduction game with real-time gameplay. Players take on roles of thieves planning a heist, but some are secretly traitors working for the security force.

## 🌟 Features

- **Real-time Multiplayer**: Powered by Convex for seamless multiplayer experience
- **User Authentication**: Secure login with Clerk
- **Dynamic Game Phases**:
  - 🌙 **Night Phase**: Use special abilities secretly
  - ☀️ **Day Phase**: Discuss and vote to banish suspected traitors
  - 🔧 **Task Phase**: Complete minigames to progress the heist
- **Interactive Minigames**: Hacking, wiring, and keypad puzzles
- **Role-based Gameplay**: Each player has unique abilities and goals
- **Responsive Design**: Play on desktop or mobile
- **Chat System**: Communicate with other players

## 🎭 Roles

### Heroes 🦸‍♂️
- **Master Thief**: Knows one innocent player and can lockpick to delay sabotage
- **Hacker**: Can reveal a player's alignment once per game

### Traitors 🦹‍♀️
- **Infiltrator**: Sabotages tasks and can frame players
- **Double Agent**: Appears innocent in investigations and can fake tasks

### Neutral 🧍
- **Civilians**: Must complete tasks to help win the heist

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/shadow-heist.git
cd shadow-heist
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Convex**: Real-time backend for multiplayer functionality
- **Clerk**: Authentication and user management
- **Netlify**: For deployment and hosting

## 🎮 How to Play

1. Create an account or sign in
2. Create a room or join an existing one using a room code
3. Wait for all players to ready up (6 players recommended)
4. Learn your secret role and use your abilities wisely
5. Complete the heist by finishing tasks or identify all traitors
6. Watch out for sabotage and deception!

## 📊 Win Conditions

- **Heroes & Civilians**: Complete 3 tasks before time ends OR identify all traitors
- **Traitors**: Sabotage 3 tasks OR outnumber the remaining players

## 🔧 Development

### Convex Schema

The game uses Convex for its database and real-time functionality. The main data tables are:

- **users**: Player accounts
- **rooms**: Game rooms
- **players**: Players in a specific room
- **gameActions**: Actions performed by players during the game
- **tasks**: Tasks in a game
- **messages**: Chat messages

### Future Enhancements

- Spectator mode for eliminated players
- Additional roles and abilities
- More varied minigames
- Customizable game settings
- Voice chat

## 📱 Progressive Web App

Shadow Heist is also available as a Progressive Web App (PWA). You can install it on mobile devices for a native-like experience.

## 🌐 Deployment

The game is currently deployed on Netlify:

[play-shadow-heist.netlify.app](https://play-shadow-heist.netlify.app)

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For questions or feedback, reach out to:
- Email: youremail@example.com
- Twitter: [@yourusername](https://twitter.com/yourusername)

---

Made with ❤️ by [Your Name]

## 🌟 Online Multiplayer Setup Guide

Shadow Heist uses Convex for real-time multiplayer functionality, allowing you to play with friends online. Here's how to set up and deploy your own instance:

### 1. Setup Convex Backend

1. Create a free account at [Convex](https://www.convex.dev/)
2. Install the Convex CLI:
   ```
   npm install -g convex
   ```
3. Initialize your Convex project:
   ```
   npx convex init
   ```
4. Deploy your Convex backend:
   ```
   npx convex push
   ```
5. Copy your Convex deployment URL from the console or dashboard

### 2. Setup Authentication with Clerk

1. Create a free account at [Clerk](https://clerk.dev/)
2. Create a new application in Clerk dashboard
3. Configure your application with these settings:
   - Enable Email/Password sign-in
   - Add your deployment URL to allowed origins
4. Copy your Publishable Key from the Clerk dashboard

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Deploy to Netlify

1. Push your code to GitHub
2. Import your repository in Netlify dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add your environment variables in Netlify settings
5. Deploy!

## 🎮 How to Play Online

1. Share your game URL with friends
2. Create a room and get a room code
3. Friends join with the room code
4. When everyone is ready, start the game!
5. Each player will receive a secret role
6. Work together (or sabotage!) to win the game

## 🌐 Playing on Different Devices

- The game works on desktop, tablets, and mobile phones
- Players can join from different locations and networks
- Make sure each player creates an account for persistent gameplay
- Use the room code to join the same game session
- For best experience, use voice chat like Discord while playing

## 🔧 Common Multiplayer Issues

- **Can't join room**: Make sure the room code is entered correctly
- **Disconnections**: Refresh the page to reconnect to the game session
- **Sync issues**: If players see different game states, have everyone refresh
- **Room not found**: The game may have ended or been deleted

## 🏆 Building Your Own Shadow Heist Tournament

Want to host a tournament? Here's how:

1. Create multiple game rooms with different settings
2. Track wins across multiple games using a spreadsheet
3. Rotate player roles to ensure balance
4. Announce winners based on total points across games

# ⚔️ CodeBattle – Multiplayer Coding Game Platform

**CodeBattle** is a real-time multiplayer platform where coders compete, collaborate, and grow their skills through fun, fast-paced coding challenges. Compete in 1v1 duels, team-based battles, and large-scale tournaments — all while earning XP, coins, and badges.

---

## 🚀 Features

### 👤 User Management
- JWT-based authentication + Google OAuth
- Profile customization (avatar, bio, level, XP, rank)
- Role-based access: User / Admin
- Online status tracking
- Disconnection handling with auto-result logic

### 🎮 Matchmaking & Game Modes
- **1v1 Mode**: Solo coding duels (ranked or unranked)
- **3v3 / 5v5 Mode**: Private team battles with voice chat
- **Custom Lobbies**: Up to 10 players, flexible formats
- **1v99 Survival Mode**: Weekly long-form marathon battle

### 💻 Real-Time Code Battles
- Monaco Editor for live collaborative coding
- Multi-user edit tracking and test case validation
- Scoring system: time, accuracy, and efficiency
- Auto-handling for inactive/disconnected players

### 🗣️ Communication
- WebSocket-based real-time chat
- WebRTC-powered voice chat for teams and lobbies

### 🏅 Gamification
- XP, coins, and achievements for contributions and victories
- Leaderboards: daily, weekly, monthly, all-time
- Titles and milestone rewards

### 🛒 Black Market Shop
- Use XP/coins to buy rare cards, hints, and badges
- Razorpay for real-money purchases
- Rotating item shop with random rewards

### 🧑‍🤝‍🧑 Community Forum
- Stack Overflow-style Q&A
- Reputation system, upvotes, badges
- Link discussions directly to coding problems

### 🏆 Tournament System
- Bracket-based ranked tournaments
- Live updates and match spectating
- Admin control and leaderboard rewards

### 🛠️ Admin Dashboard
- Manage users, matches, reports, and problem sets
- Configure scoring rules, rewards, and forum moderation

### 🔒 Security & Anti-Cheat
- Docker sandboxed code execution
- Clipboard & typing speed monitoring
- Two-factor authentication (2FA)
- Redis queue and user session management

---

## 🧰 Tech Stack

| Layer      | Tech Used                                           |
|------------|------------------------------------------------------|
| Frontend   | React + Vite, Tailwind CSS, Socket.IO, Monaco Editor |
| Backend    | Node.js, Express, Docker                             |
| Auth       | JWT, Google OAuth                                    |
| Database   | MongoDB, Redis                                       |
| Hosting    | Vercel, AWS EC2                                      |
| Payments   | Razorpay                                             |

---

## 🔄 Platform Workflow

1. User logs in and joins a queue  
2. Lobby opens for voice chat and strategy discussion  
3. Real-time coding editor loads the challenge  
4. Players solve problems while scoring is tracked  
5. Results are shown, XP and coins are rewarded  
6. Players explore forums or buy items from the shop  

---

## 📷 Screenshots (Optional)
> Add screenshots or screen recordings here to demonstrate the platform

---

## 📦 Installation

> ⚠️ _Coming soon_: Full deployment and developer setup instructions will be added in the future.

---

## 🧑‍💻 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

Thanks to the open-source tools and libraries that made this platform possible:
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Socket.IO](https://socket.io/)
- [WebRTC](https://webrtc.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)
- [Razorpay](https://razorpay.com/)

---

## 📬 Contact

Have questions or suggestions? Feel free to reach out or open an issue.


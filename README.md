# 🏆 CP Tracker Pro — Multi-Platform Competitive Programming Analyzer

![Version](https://img.shields.io/badge/version-1.0-blue)
![Stack](https://img.shields.io/badge/stack-MERN-green)
![Platforms](https://img.shields.io/badge/platforms-6-orange)
![License](https://img.shields.io/badge/license-MIT-yellow)

> A full-stack AI-powered platform that unifies your competitive programming stats from **6 platforms** — Codeforces, LeetCode, GeeksForGeeks, CodeChef, HackerRank & AtCoder — with personalized AI study plans, leaderboard, and user comparison.

---

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, secure sessions
- 🏆 **6 Platforms** — CF, LC, GFG, CC, HR, AtCoder
- 📊 **Unified Dashboard** — All platforms in one clean view
- 🤖 **AI Insights** — Personalized study plans & weakness detection
- 📈 **Interactive Charts** — Rating history & solved distribution
- 🏅 **Leaderboard** — Global ranking by combined CP score
- ⚔️ **User Compare** — Head-to-head comparison
- 🔍 **Explore** — Public profile lookup (no login needed)
- 📱 **Responsive** — Works on all screen sizes

---

## 🚀 Getting Started

### 1. Install
```bash
git clone https://github.com/your-username/cp-tracker-pro.git
cd cp-tracker-pro
npm run install-all
```

### 2. Setup Environment
```bash
cd server
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cp-tracker-pro
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 3. Start MongoDB
```bash
net start MongoDB   # Windows
# mongod            # Mac/Linux
```

### 4. Run
```bash
cd ..
npm run dev
```

- Frontend → http://localhost:3000
- Backend  → http://localhost:5000

---

## 🏗️ Architecture

```
cp-tracker-pro/
├── client/src/
│   ├── components/
│   │   ├── layout/Navbar
│   │   └── dashboard/PlatformCard, DashCharts, AIInsights
│   ├── pages/
│   │   ├── Home, Login, Register
│   │   ├── Dashboard, Leaderboard
│   │   ├── Compare, Explore
│   ├── hooks/useAuth.js
│   ├── services/api.js
│   └── utils/helpers.js
│
└── server/
    ├── controllers/ authController, platformController, leaderboardController
    ├── services/    platformAPIs.js (6 platforms), analyzer.js
    ├── models/      User.js
    ├── routes/      authRoutes, platformRoutes, leaderboardRoutes
    └── middleware/  authMiddleware, errorHandler
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register |
| POST | `/api/auth/login` | ❌ | Login |
| GET  | `/api/auth/me` | ✅ | Get profile |
| GET  | `/api/platforms/dashboard` | ✅ | Full dashboard |
| POST | `/api/platforms/connect` | ✅ | Connect platform |
| POST | `/api/platforms/refresh-all` | ✅ | Refresh all |
| GET  | `/api/platforms/:platform/:handle` | ❌ | Public lookup |
| GET  | `/api/leaderboard` | ❌ | Leaderboard |
| GET  | `/api/leaderboard/compare/:u1/:u2` | ❌ | Compare |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Charts | Recharts |
| Styling | CSS Variables, Plus Jakarta Sans |
| Backend | Node.js, Express |
| Auth | JWT + bcrypt |
| Database | MongoDB + Mongoose |
| Cache | node-cache (10 min TTL) |
| Security | Helmet, CORS, Rate Limiting |

---

## 🎓 Final Year Project

Built to demonstrate: Full-stack MERN, JWT Auth, Multi-API integration, AI analysis, Real-time data, Production security.

---

⭐ Star this repo if you found it useful!

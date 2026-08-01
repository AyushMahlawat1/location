# A Small Surprise

A premium, mobile-first comforting website built with React, Vite, Tailwind CSS, Framer Motion, and Firebase. Features a welcome modal with optional location sharing, ambient music, Spotify playlist embed, breathing exercises, and real-time notifications via Cloud Functions.

## Features

- Full-screen welcome modal with equal-priority location choices
- Geolocation tracking with continuous `watchPosition()` updates
- Firebase Firestore event & location logging
- Cloud Functions notifications (Telegram + Discord)
- Glassmorphism UI with floating particles and soft gradients
- Dark/Light mode toggle
- Ambient music controls
- Spotify playlist embed
- Interactive "Take a Break" breathing exercise
- Fully responsive mobile-first design
- Ready for Vercel deployment

## Quick Start

### One-command setup

```bash
npm run setup
```

### Configure environment

```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`.

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Firebase Setup

### 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a **Web app** and copy the config values into `.env`

### 2. Enable Firestore

1. In Firebase Console → Firestore Database → Create database
2. Start in **production mode**
3. Deploy security rules:

```bash
firebase deploy --only firestore:rules
```

### 3. Deploy Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 4. Configure notifications

Set at least one notification channel using Firebase params:

**Telegram:**
```bash
firebase functions:secrets:set TELEGRAM_BOT_TOKEN
firebase functions:secrets:set TELEGRAM_CHAT_ID
```

To get these values:
1. Message [@BotFather](https://t.me/BotFather) on Telegram to create a bot
2. Get your chat ID from [@userinfobot](https://t.me/userinfobot)

**Discord (optional):**
```bash
firebase functions:secrets:set DISCORD_WEBHOOK_URL
```

Create a webhook in Discord: Server Settings → Integrations → Webhooks.

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel
```

Add environment variables in the Vercel dashboard (same as `.env`).

### Option B: Git integration

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

The included `vercel.json` handles SPA routing.

## Project Structure

```
├── src/
│   ├── components/     # UI components
│   ├── config/         # Firebase config
│   ├── hooks/          # React hooks (theme, location, audio)
│   ├── lib/            # Firestore & session utilities
│   └── types/          # TypeScript types
├── functions/          # Firebase Cloud Functions
├── firestore.rules     # Firestore security rules
├── firebase.json       # Firebase project config
└── vercel.json         # Vercel SPA config
```

## Location Flow

| User Action | Event Recorded | Location Tracking |
|---|---|---|
| Share Location (granted) | `location_shared` | Continuous via `watchPosition()` |
| Continue Without Sharing | `continued_without_sharing` | None |
| Permission Denied | `location_permission_denied` | None |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_FIREBASE_*` | Yes | Firebase web app config |
| `VITE_SPOTIFY_PLAYLIST_ID` | No | Spotify playlist ID for embed |
| `VITE_AMBIENT_AUDIO_URL` | No | URL to ambient audio file |

## License

Private — made with ❤️

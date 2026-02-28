# 📖 Dear Diary — v2

> **Your personal mental-health companion** — a modern cross-platform mobile app that lets you journal your thoughts, analyse your mood with built-in sentiment analysis, and receive tailored YouTube recommendations to help you feel better.  
> Looking for the full architecture overview (new vs old Kotlin) ? → [`ARCHITECTURE.md`](../ARCHITECTURE.md)

[![Expo](https://img.shields.io/badge/Expo-55-blueviolet?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.83-blue?logo=react)](https://reactnative.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange?logo=firebase)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org)

---

## ✨ What's new in v2

| Feature | v1 | v2 |
|---|---|---|
| UI framework | Android XML + Material v2 | React Native (Expo) + custom design system |
| Mood analysis | Python/NLTK via Chaquopy | Lightweight client-side keyword engine |
| Platform | Android only | iOS & Android (via Expo) |
| Navigation | Navigation Drawer | Bottom Tab Navigator |
| Firebase config | Hardcoded | `.env` file (never committed) |
| Auth | Email/password | Email/password + email verification |
| Data storage | Firebase Realtime DB | Firebase Firestore |
| Interests | Star-rating bars | Tap-to-select tile grid |
| Colour palette | Saturated greens/yellows | Calm lavender/indigo + soft teal |

---

## 🗺 High-Level Design (HLD)

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Native App (Expo)                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Navigation Layer                        │   │
│  │  Root Stack ──► Auth Stack ──► Login / Register           │   │
│  │                 └──► Main Tabs ──► Home                    │   │
│  │                                    Diary (list + editor)   │   │
│  │                                    Recommendations         │   │
│  │                                    Profile                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │   Custom Hooks       │  │       UI Components              │   │
│  │  • useAuth           │  │  • Button   • Input              │   │
│  │  • useDiary          │  │  • DiaryCard • MoodPicker        │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │   Sentiment Engine   │  │       Config                     │   │
│  │  (keyword-based,     │  │  • firebase.ts (reads .env)      │   │
│  │   fully offline)     │  │  • .env.example                  │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
          ┌──────────────┴───────────────┐
          │        Firebase (BaaS)        │
          │                               │
          │  ┌────────────────────────┐   │
          │  │  Firebase Auth          │   │
          │  │  • Email/password       │   │
          │  │  • Email verification   │   │
          │  │  • Password reset       │   │
          │  └────────────────────────┘   │
          │                               │
          │  ┌────────────────────────┐   │
          │  │  Cloud Firestore        │   │
          │  │  /users/{uid}           │   │
          │  │  /diaries/{uid}/entries │   │
          │  └────────────────────────┘   │
          │                               │
          │  ┌────────────────────────┐   │
          │  │  Firebase Storage       │   │
          │  │  (profile pictures)     │   │
          │  └────────────────────────┘   │
          └───────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │    YouTube (deep links)      │
          │  • Videos opened via         │
          │    Linking.openURL()         │
          └─────────────────────────────┘
```

### Data Model

```
Firestore
│
├── users/
│   └── {uid}/               ← UserProfile document
│       ├── email: string
│       ├── displayName: string
│       ├── age: string
│       ├── gender: string
│       ├── phone: string
│       ├── interests: number[]   ← ordered interest IDs
│       └── createdAt: ISO string
│
└── diaries/
    └── {uid}/
        └── entries/
            └── {date}/          ← DiaryEntry document (date = "2024-05-01")
                ├── id: string        (= date key)
                ├── text: string
                ├── mood: string      (great|good|neutral|bad|awful)
                ├── sentiment: {
                │     label: string
                │     score: number   (−1 … +1)
                │     emotion: string
                │     confidence: number
                │   }
                └── updatedAt: ISO string
```

### Screen Flow

```
App Launch
    │
    ▼
SplashScreen (2 s)
    │
    ├─ isLoggedIn ──► Main Tabs
    │
    └─ !isLoggedIn ──► Auth Stack
                           │
                     LoginScreen
                       │     └──► ForgotPassword
                       ▼
                 RegisterScreen
                       │
                       ▼ (verify email)
                 LoginScreen
                       │
                       ▼
                 Main Tabs
                   │  │  │  │
                   │  │  │  └── Profile Tab
                   │  │  │         └── InterestsScreen
                   │  │  └── Recommendations Tab
                   │  └── Diary Tab
                   │          └── DiaryEditorScreen
                   └── Home Tab
                           └── DiaryEditorScreen
```

### Sentiment Analysis Pipeline

```
User writes diary text
          │
          ▼
  analyzeSentiment(text)         [src/utils/sentiment.ts]
          │
          ├── Tokenise & lowercase
          ├── Count POSITIVE_WORDS hits  (+score)
          ├── Count NEGATIVE_WORDS hits  (−score)
          ├── Identify dominant EMOTION_MAP word
          └── Normalise score to [−1, +1]
                    │
                    ▼
         SentimentResult {
           label: "positive" | "neutral" | "negative"
           score: number
           emotion: string   (e.g. "😊 Happy")
           confidence: number
         }
                    │
                    ▼
         getMoodFromSentiment()
                    │
                    ▼
         Mood: "great" | "good" | "neutral" | "bad" | "awful"
                    │
               ┌────┴──────────────────────────────────────┐
               │  Shown in DiaryEditorScreen analysis card  │
               │  Stored in Firestore with the entry        │
               │  Used to filter diary list                  │
               │  Used to select recommendation videos      │
               └────────────────────────────────────────────┘
```

### Recommendation Engine

```
User's last 7 diary entries
          │
          ▼
 Compute dominant mood
 (frequency-weighted across 7 entries)
          │
          ▼
 CURATED_VIDEOS[dominantMood]  → mood-based videos
          │
 profile.interests (ordered)  → interest-based videos
          │
          ▼
 Merged + deduplicated list
          │
          ▼
 Shown as tappable cards  ──► Linking.openURL(YouTube)
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- A [Firebase](https://firebase.google.com/) project (free Spark plan is enough)
- An Android/iOS emulator **or** the [Expo Go](https://expo.dev/go) app on your phone

### 1. Clone & install

```bash
git clone https://github.com/priyansh17/dear-diary.git
cd dear-diary/v2
npm install
```

### 2. Configure Firebase

Copy the example environment file and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder values with those from your Firebase Console → Project Settings → Your apps (Web SDK config):

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

Also enable in Firebase Console:
- **Authentication** → Sign-in method → Email/Password ✓
- **Firestore Database** → Create in production mode
- **Storage** (optional, for future profile photos)

### 3. Run the app

```bash
npm start           # opens Expo Dev Tools
npm run android     # Android emulator
npm run ios         # iOS simulator (macOS only)
```

---

## 📁 Project Structure

```
v2/
├── .env.example          ← copy to .env and fill your Firebase details
├── app.json              ← Expo configuration
├── App.tsx               ← Root component + navigation container
├── src/
│   ├── config/
│   │   └── firebase.ts   ← Firebase initialisation (reads .env)
│   ├── theme/
│   │   ├── colors.ts     ← Design tokens — primary/secondary/mood colours
│   │   └── typography.ts ← Text style presets
│   ├── components/
│   │   ├── Button.tsx    ← Primary/outline/ghost button variants
│   │   ├── Input.tsx     ← Labelled text field with validation
│   │   ├── DiaryCard.tsx ← Entry preview card with mood badge
│   │   └── MoodPicker.tsx← Row of mood selection chips
│   ├── hooks/
│   │   ├── useAuth.ts    ← Firebase Auth state + login/register/logout
│   │   └── useDiary.ts   ← Firestore CRUD for diary entries
│   ├── navigation/
│   │   ├── AuthNavigator.tsx  ← Stack: Login, Register, ForgotPassword
│   │   └── MainNavigator.tsx  ← Bottom tabs + nested stacks
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── HomeScreen.tsx          ← Greeting, mood trend, quick actions
│   │   ├── DiaryScreen.tsx         ← Filterable list of all entries
│   │   ├── DiaryEditorScreen.tsx   ← Write/edit an entry + live analysis
│   │   ├── RecommendationsScreen.tsx ← Videos matched to mood + interests
│   │   ├── InterestsScreen.tsx     ← Tap-to-select interest tiles
│   │   └── ProfileScreen.tsx       ← Stats, profile info, sign-out
│   └── utils/
│       ├── sentiment.ts  ← Client-side sentiment & mood utilities
│       └── helpers.ts    ← Date formatting, truncation helpers
└── package.json
```

---

## 🔐 Security Notes

- The `.env` file is in `.gitignore` and **must never be committed**.
- Firebase API keys in Expo/React Native apps are intentionally client-side (bundled in the JS). Protect your Firebase project with strict **Firestore Security Rules** and **Auth domain restrictions**.
- Example security rules for Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /diaries/{uid}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

## 🛠 Development

```bash
# TypeScript type check
npx tsc --noEmit

# Lint
npx expo lint
```

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss what you'd like to change.

---

## 📝 License

[MIT](../LICENSE) © Priyansh & Co-Developers

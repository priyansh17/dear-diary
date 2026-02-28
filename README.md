# 📖 Dear Diary / BrainRelief — Your Mental Health Supervisor

> **v2 is now available!** → See the [`v2/`](./v2/) directory for the complete redesign.

https://play.google.com/store/apps/details?id=com.priyansh.brainrelief&hl=en_US&gl=US

Co-Developers:
- Arya (arya1382000@gmail.com)
- Ashutosh Behera (ashubehera78@gmail.com)
- Tamali Kundu (tamali2807@gmail.com)

The App aims at helping people to fight from depression and communicate with them at a 1-1 basis alongside giving them suggestions based on their choices which will be taken from the user in various formats such as MCQ for a one time basis and Diary entries of user on a daily basis.
The app aims to help mainly people who are introvert and don't share their emotions easily with others who are depressed.
We aim to uplift their emotions and make the world a better place for them.

**v1 Tech Stack (deprecated):**
- Android Studio (Kotlin + Java)
- Machine Learning (Python) — NLTK-CORPUS, TextBlob, Sentiment Analyser, Recommender, BS4
- Chaquopy — SDK used to integrate Python in Android Studio

Major thanks to Malcolm Smith who created Chaquopy without which the project couldn't have been a success.

---

## 🆕 v2 — Complete Redesign

The [`v2/`](./v2/) subdirectory contains a ground-up rewrite of Dear Diary as a modern cross-platform React Native (Expo) app.

### What's new in v2

| Feature | v1 | v2 |
|---|---|---|
| Platform | Android only | iOS & Android (Expo) |
| UI | Android XML + Material v2 | Custom design system (calm lavender palette) |
| Mood analysis | Python/NLTK via Chaquopy | Client-side keyword engine (offline) |
| Navigation | Navigation Drawer | Bottom Tab Navigator |
| Firebase config | Hardcoded | `.env` file (never committed) |
| Database | Firebase Realtime DB | Cloud Firestore |
| Interests UX | Star-rating bars | Tap-to-select tile grid |

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
          └───────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │    YouTube (deep links)      │
          │  Videos opened via           │
          │  Linking.openURL()           │
          └─────────────────────────────┘
```

### Data Model

```
Firestore
│
├── users/
│   └── {uid}/               ← UserProfile document
│       ├── email
│       ├── displayName
│       ├── age, gender, phone
│       └── interests: number[]
│
└── diaries/
    └── {uid}/
        └── entries/
            └── {YYYY-MM-DD}/     ← DiaryEntry document
                ├── text
                ├── mood           (great|good|neutral|bad|awful)
                └── sentiment { label, score, emotion, confidence }
```

### Screen Flow

```
App Launch → SplashScreen
                │
                ├─ logged in ──► Main Tabs
                │                  Home ←─────────────────────┐
                │                  Diary → DiaryEditor         │
                │                  Recommendations             │
                └─ not logged ──►  Profile → Interests         │
                                 Auth Stack                     │
                                   Login ────────────────────►─┘
                                   Register
                                   ForgotPassword
```

### Sentiment Pipeline

```
Diary text input
       │
       ▼
analyzeSentiment(text)
       │
       ├── tokenise + lowercase
       ├── match POSITIVE_WORDS / NEGATIVE_WORDS
       ├── compute score ∈ [−1, +1]
       └── identify dominant emotion
                │
                ▼
       SentimentResult { label, score, emotion, confidence }
                │
       getMoodFromSentiment() → Mood (great/good/neutral/bad/awful)
                │
       ┌────────┴─────────────────────────────────────┐
       │ Shown live in DiaryEditor analysis card       │
       │ Stored in Firestore alongside the entry       │
       │ Drives video recommendations                  │
       └──────────────────────────────────────────────┘
```

→ Full v2 documentation: **[`v2/README.md`](./v2/README.md)**

---

_v1 (deprecated Android app) source code is preserved in the `app/` directory for reference._



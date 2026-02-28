# 🏗️ Dear Diary — Architecture Guide

> **TL;DR** — We moved from an **Android-only Kotlin + Java** app (v1) to a **cross-platform React Native / TypeScript / Expo** app (v2).  
> The entire source for v2 lives in the [`v2/`](./v2/) directory.

---

## Contents

1. [Why we changed](#1-why-we-changed)
2. [Tech-stack comparison](#2-tech-stack-comparison)
3. [v1 architecture (Kotlin — deprecated)](#3-v1-architecture-kotlin--deprecated)
4. [v2 architecture (React Native / TypeScript)](#4-v2-architecture-react-native--typescript)
   - [Layer diagram](#41-layer-diagram)
   - [Directory layout](#42-directory-layout)
   - [Navigation tree](#43-navigation-tree)
   - [Data model](#44-data-model-firestore)
   - [Sentiment pipeline](#45-sentiment-pipeline)
   - [Recommendation engine](#46-recommendation-engine)
5. [Component catalogue](#5-component-catalogue)
6. [Key architectural decisions](#6-key-architectural-decisions)
7. [Firestore security rules](#7-firestore-security-rules)

---

## 1. Why we changed

| Pain-point in v1 | Impact |
|---|---|
| Android-only (Kotlin + NDK build flavours) | Could not ship on iOS |
| Chaquopy SDK bridged Python/NLTK into the APK | Build took > 10 min; APK was 80 MB+; SDK is no longer actively maintained |
| Firebase credentials hard-coded in source | Security risk; couldn't rotate keys without a code change |
| Firebase Realtime DB schema was flat and unstructured | Queries were expensive; no pagination |
| Navigation Drawer with five Activities/Fragments | Deep back-stack bugs; each screen was its own Activity |
| UI built with Android XML layouts & Material v2 | Hard to theme consistently; no reusable component library |

---

## 2. Tech-stack comparison

| Concern | v1 (Kotlin — deprecated) | v2 (active) |
|---|---|---|
| **Language** | Kotlin + Java | TypeScript |
| **Framework** | Android SDK (compileSdk 29) | React Native 0.83 via **Expo ~55** |
| **Platforms** | Android only | **iOS + Android** (one codebase) |
| **UI components** | Android XML + Material Components v2 | Custom design system (`theme/colors.ts`, `theme/typography.ts`) |
| **Navigation** | Navigation Drawer → Activities/Fragments | **React Navigation** — Root Stack + Auth Stack + Bottom Tabs |
| **Sentiment analysis** | Python 3.8 / NLTK / TextBlob via **Chaquopy** (native bridge) | Pure TypeScript keyword engine — runs **fully offline, no bridge** |
| **Firebase SDK** | `firebase-database:19.6.0` (Kotlin KTX) | `firebase ^12` (JS Web SDK v9 modular) |
| **Database** | Firebase Realtime Database | **Cloud Firestore** (per-user collections, paginated queries) |
| **Auth** | Email + password | Email + password + **email verification** + password reset |
| **Config / secrets** | Hard-coded in source files | `EXPO_PUBLIC_*` vars in `.env` (gitignored); `.env.example` committed |
| **State management** | ViewModel / SharedPreferences | React **custom hooks** (`useAuth`, `useDiary`) |
| **Build system** | Gradle 4.0.1 + Chaquo plugin | Expo EAS / Metro bundler |
| **Type safety** | Kotlin type system | TypeScript 5.9 (`strict: true`) |

---

## 3. v1 architecture (Kotlin — deprecated)

Source code is preserved in [`app/`](./app/) for reference.

```
Android App (Kotlin + Java)
│
├── Activities
│   ├── SplashScreenActivity   ← auto-login check
│   ├── LoginActivity          ← Firebase Auth
│   ├── RegisterActivity       ← Firebase Auth + Storage upload
│   ├── MainActivity           ← Navigation Drawer host
│   │     ├── HomeFragment     ← 3 action cards + YouTube WebView list
│   │     ├── UserFragment     ← profile viewer
│   │     └── RecommendationFragment ← Chaquopy Python call → YouTube list
│   ├── DiaryEntryActivity     ← CalendarView date picker
│   ├── EditDiaryActivity      ← multi-line EditText + Realtime DB save
│   ├── UserInterests          ← 9 RatingBars (star rating)
│   ├── InstantFeedbackActivity← Chaquopy Python call → TextViews
│   └── ForgotPassword
│
├── Fragments (hosted in MainActivity)
│
├── Class/
│   ├── UserProfile.java
│   ├── DiaryNotes.java
│   ├── YoutubeVideos.java
│   ├── youtubeAdapter.java
│   └── Ratings.java
│
└── python/                    ← runs inside APK via Chaquopy
    ├── Main.py                ← NLTK + TextBlob sentiment
    └── storage.py             ← collaborative-filter recommender

External: Firebase Realtime DB  (flat tree keyed by uid)
          Firebase Auth
          Firebase Storage
          YouTube Android Player API (jar)
```

### v1 data shape (Realtime DB)

```
/{uid}/
    userName:   "Jane"
    userEmail:  "jane@example.com"
    userNumber: "9876543210"
    userAge:    "25"
    userGender: "Female"
    2024-05-01: "Today was a tough day..."   ← diary entry (raw string)
    2024-05-02: "Feeling much better!"
```

---

## 4. v2 architecture (React Native / TypeScript)

All source lives in [`v2/`](./v2/).

### 4.1 Layer diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                        Expo / React Native app                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      Navigation Layer                         │   │
│  │                                                               │   │
│  │  RootStack                                                    │   │
│  │   ├── SplashScreen                                           │   │
│  │   ├── AuthNavigator (Stack)                                  │   │
│  │   │    ├── LoginScreen                                       │   │
│  │   │    ├── RegisterScreen                                    │   │
│  │   │    └── ForgotPasswordScreen                              │   │
│  │   └── MainNavigator (Bottom Tabs)                            │   │
│  │        ├── Home Tab  → HomeScreen → DiaryEditorScreen        │   │
│  │        ├── Diary Tab → DiaryScreen → DiaryEditorScreen       │   │
│  │        ├── Recommendations Tab → RecommendationsScreen       │   │
│  │        └── Profile Tab → ProfileScreen → InterestsScreen     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────┐   ┌────────────────────────────────┐     │
│  │   React Custom Hooks  │   │     UI Component Library        │     │
│  │                        │   │                                  │     │
│  │  useAuth               │   │  <Button>   variant system       │     │
│  │   ├── login()          │   │  <Input>    with validation      │     │
│  │   ├── register()       │   │  <DiaryCard> mood badge          │     │
│  │   ├── logout()         │   │  <MoodPicker> chip row           │     │
│  │   └── resetPassword()  │   │                                  │     │
│  │                        │   │  theme/colors.ts   (tokens)      │     │
│  │  useDiary              │   │  theme/typography.ts             │     │
│  │   ├── saveEntry()      │   └────────────────────────────────┘     │
│  │   ├── getEntry()       │                                           │
│  │   └── fetchRecent()    │   ┌────────────────────────────────┐     │
│  └──────────────────────┘   │   Sentiment Engine (offline)     │     │
│                               │                                  │     │
│  ┌──────────────────────┐   │  analyzeSentiment(text)          │     │
│  │  config/firebase.ts   │   │   → SentimentResult              │     │
│  │  (reads .env vars)    │   │  getMoodFromSentiment()          │     │
│  └──────────────────────┘   │   → Mood enum                    │     │
│                               └────────────────────────────────┘     │
└──────────────────────────────────────┬─────────────────────────────┘
                                        │ HTTPS / Firestore SDK
              ┌─────────────────────────┴──────────────────────┐
              │                 Firebase (BaaS)                  │
              │                                                   │
              │  Firebase Auth   Cloud Firestore   Storage        │
              └───────────────────────────────────────────────────┘
                                        │
              ┌─────────────────────────┴──────────────────────┐
              │  YouTube (Linking.openURL — no SDK dependency)   │
              └──────────────────────────────────────────────────┘
```

### 4.2 Directory layout

```
v2/
├── .env.example              ← template; copy → .env, fill Firebase keys
├── app.json                  ← Expo app config (name, icons, splash)
├── App.tsx                   ← entry point — NavigationContainer + StatusBar
├── src/
│   ├── config/
│   │   └── firebase.ts       ← singleton init; exports auth, db, storage
│   │
│   ├── theme/
│   │   ├── colors.ts         ← design tokens (primary #6C63FF, moods, etc.)
│   │   └── typography.ts     ← h1–h4, body1/2, caption, button, label
│   │
│   ├── components/           ← pure, reusable UI (no business logic)
│   │   ├── Button.tsx        ← primary | secondary | outline | ghost
│   │   ├── Input.tsx         ← label + error + secure-text toggle
│   │   ├── DiaryCard.tsx     ← entry preview card + mood badge
│   │   └── MoodPicker.tsx    ← horizontal chip row (great→awful)
│   │
│   ├── hooks/                ← business logic consumed by screens
│   │   ├── useAuth.ts        ← Firebase Auth state machine
│   │   └── useDiary.ts       ← Firestore CRUD + local state
│   │
│   ├── navigation/
│   │   ├── AuthNavigator.tsx ← unauthenticated stack
│   │   └── MainNavigator.tsx ← authenticated bottom tabs + nested stacks
│   │
│   ├── screens/
│   │   ├── SplashScreen.tsx          ← animated logo; routes to Auth or Main
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── HomeScreen.tsx            ← greeting, mood trend, quick actions
│   │   ├── DiaryScreen.tsx           ← paginated list, filter by mood
│   │   ├── DiaryEditorScreen.tsx     ← editor + live sentiment analysis card
│   │   ├── RecommendationsScreen.tsx ← YouTube cards by mood + interests
│   │   ├── InterestsScreen.tsx       ← tile grid, saves to Firestore
│   │   └── ProfileScreen.tsx         ← stats (entries, streak, top mood)
│   │
│   └── utils/
│       ├── sentiment.ts  ← analyzeSentiment(), getMoodFromSentiment(), MOOD_META
│       └── helpers.ts    ← formatDiaryDate(), todayKey(), truncate()
└── package.json
```

### 4.3 Navigation tree

```
App.tsx  (NavigationContainer)
│
└── RootStack  (createNativeStackNavigator, no header)
     │
     ├── Splash        → SplashScreen
     │
     ├── Auth          → AuthNavigator
     │    ├── Login    → LoginScreen
     │    ├── Register → RegisterScreen
     │    └── ForgotPassword → ForgotPasswordScreen
     │
     └── Main          → MainNavigator (Bottom Tabs)
          ├── Home Tab
          │    └── HomeStack (NativeStack)
          │         ├── HomeMain     → HomeScreen
          │         ├── DiaryEditor  → DiaryEditorScreen
          │         └── Interests    → InterestsScreen
          │
          ├── Diary Tab
          │    └── DiaryStack (NativeStack)
          │         ├── DiaryList    → DiaryScreen
          │         └── DiaryEditor  → DiaryEditorScreen
          │
          ├── Recommendations Tab  → RecommendationsScreen
          │
          └── Profile Tab
               └── ProfileStack (NativeStack)
                    ├── ProfileMain  → ProfileScreen
                    └── Interests    → InterestsScreen
```

### 4.4 Data model (Firestore)

```
Firestore
│
├── users/
│   └── {uid}                   ← UserProfile document
│       ├── uid:          string
│       ├── email:        string
│       ├── displayName:  string
│       ├── age:          string
│       ├── gender:       string
│       ├── phone:        string
│       ├── photoURL:     string
│       ├── interests:    number[]   ← ordered interest IDs (1-9)
│       └── createdAt:    ISO string
│
└── diaries/
    └── {uid}/
        └── entries/
            └── {YYYY-MM-DD}        ← DiaryEntry document (one per day)
                ├── id:         string   (= date key)
                ├── text:       string
                ├── mood:       "great" | "good" | "neutral" | "bad" | "awful"
                ├── sentiment:
                │     ├── label:      "positive" | "neutral" | "negative"
                │     ├── score:      number   (−1.0 … +1.0)
                │     ├── emotion:    string   (e.g. "😊 Happy")
                │     └── confidence: number   (0–100)
                └── updatedAt:  ISO string
```

Interest IDs:

| ID | Label |
|---|---|
| 1 | Biography |
| 2 | Dance |
| 3 | Mind Puzzles |
| 4 | Music |
| 5 | Songs |
| 6 | Stand Up Comedy |
| 7 | Short Stories |
| 8 | Story Books |
| 9 | VLogs |

### 4.5 Sentiment pipeline

```
DiaryEditorScreen
      │
      │  text (> 20 chars)
      ▼
analyzeSentiment(text)                          src/utils/sentiment.ts
      │
      ├─ tokenise & lowercase
      ├─ scan for POSITIVE_WORDS  → pos count
      ├─ scan for NEGATIVE_WORDS  → neg count
      ├─ scan for EMOTION_MAP key → dominantEmotion
      ├─ score = (pos − neg) / (total × WORD_WEIGHT_FACTOR)
      │          clamped to [−1, +1]
      └─ confidence = min(100, hitRatio × 100 + BASE_CONFIDENCE_BOOST)
               │
               ▼
      SentimentResult { label, score, emotion, confidence }
               │
               ▼
getMoodFromSentiment(result)
      │
      ├─ score ≥ 0.5   → "great"
      ├─ score ≥ 0.1   → "good"
      ├─ score ≥ −0.1  → "neutral"
      ├─ score ≥ −0.5  → "bad"
      └─ score < −0.5  → "awful"
               │
        ┌──────┴──────────────────────────────────────────────────┐
        │ Live analysis card in DiaryEditorScreen                  │
        │ Stored in Firestore → DiaryEntry.mood                   │
        │ Drives mood-filter chips in DiaryScreen                  │
        │ Drives CURATED_VIDEOS selection in RecommendationsScreen │
        └──────────────────────────────────────────────────────────┘
```

**Why we dropped Python/NLTK:**  
Chaquopy bundled the entire CPython runtime + NLTK corpus into the APK, adding ~60 MB and a multi-minute build. The keyword engine in TypeScript achieves comparable accuracy for the emotional vocabulary that matters for a diary app, runs instantly on-device, and works completely offline.

### 4.6 Recommendation engine

```
RecommendationsScreen mounts
        │
        ▼
fetchRecentEntries(RECENT_ENTRIES_LIMIT = 10)
        │
        ▼
entries.slice(0, MOOD_ANALYSIS_WINDOW = 7)
        │
        ▼
frequency-count moods  →  dominantMood
        │
        ├── CURATED_VIDEOS[dominantMood]          (mood-matched)
        └── profile.interests.slice(0, 3)
                 │  map interest ID → INTEREST_VIDEOS[label]
                 ▼
            deduplicated merged list
                 │
                 ▼
        Tappable VideoCard  →  Linking.openURL("https://youtube.com/watch?v=…")
```

No YouTube API key or SDK is required in the base build; videos open in the system browser / YouTube app via deep link.

---

## 5. Component catalogue

| Component | File | Props summary |
|---|---|---|
| `<Button>` | `components/Button.tsx` | `title`, `onPress`, `variant` (primary\|secondary\|outline\|ghost), `loading`, `disabled`, `fullWidth` |
| `<Input>` | `components/Input.tsx` | `label`, `error`, `secureToggle`, all standard `TextInputProps` |
| `<DiaryCard>` | `components/DiaryCard.tsx` | `entry: DiaryEntry`, `onPress` |
| `<MoodPicker>` | `components/MoodPicker.tsx` | `selected: Mood \| null`, `onSelect: (mood) => void` |

Design tokens:

```ts
// theme/colors.ts
Colors.primary       = '#6C63FF'   // indigo/lavender — main brand colour
Colors.secondary     = '#00CEC9'   // soft teal
Colors.accent        = '#FDCB6E'   // warm amber
Colors.background    = '#F8F7FF'   // off-white
Colors.moodGreat     = '#00B894'
Colors.moodGood      = '#FDCB6E'
Colors.moodNeutral   = '#74B9FF'
Colors.moodBad       = '#FD79A8'
Colors.moodAwful     = '#FF7675'
```

---

## 6. Key architectural decisions

### A. React Native + Expo instead of Kotlin
Expo gives us one TypeScript codebase that targets both iOS and Android via Metro bundler, with zero native build configuration for the common case. We get hot reload, OTA updates (EAS Update), and access to the full React ecosystem.

### B. Custom hooks for business logic
`useAuth` and `useDiary` encapsulate all Firebase calls and local React state. Screens contain only UI — they call a hook and render. This makes screens easy to read and the hooks easy to unit-test in isolation.

### C. Firestore instead of Realtime Database
Firestore supports structured sub-collections (`diaries/{uid}/entries`), server-side ordering/pagination (`query → orderBy → limit`), and offline persistence. The Realtime DB in v1 stored diary entries as raw strings directly under the user node, making it impossible to query or paginate efficiently.

### D. Client-side sentiment instead of Python/NLTK
See §4.5. No native bridge, no build complexity, works offline. The tradeoff is reduced linguistic depth, but for a diary app the curated word-lists cover the emotionally important vocabulary.

### E. `.env` for Firebase config
All `EXPO_PUBLIC_*` environment variables are injected at Expo build time. The `.env` file is gitignored; `.env.example` documents what keys are needed. Rotating credentials no longer requires a code change.

### F. One screen per date (diary entries)
A diary entry is keyed by `YYYY-MM-DD`. Writing the same day overwrites the entry (`setDoc` with merge). This keeps the Firestore document count low and makes fetching a specific day's entry a single `getDoc`.

---

## 7. Firestore security rules

Paste these into Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read and write their own profile
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Users can only read and write their own diary entries
    match /diaries/{uid}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

_For setup instructions see [`v2/README.md`](./v2/README.md).  
v1 source (Kotlin) is preserved in [`app/`](./app/) for reference._

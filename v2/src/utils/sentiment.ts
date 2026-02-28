// ─── Lightweight client-side sentiment analysis ────────────────────────────
// This replaces the Python/NLTK backend from v1 with a keyword-based
// approach that works fully offline on the device.

export type SentimentResult = {
  label: 'positive' | 'neutral' | 'negative';
  score: number;          // −1 (very negative) … +1 (very positive)
  emotion: string;        // dominant detected emotion word
  confidence: number;     // 0–100 percentage
};

const POSITIVE_WORDS = new Set([
  'happy', 'great', 'good', 'love', 'joy', 'excited', 'wonderful', 'amazing',
  'fantastic', 'grateful', 'blessed', 'peaceful', 'calm', 'hopeful', 'cheerful',
  'elated', 'motivated', 'inspired', 'proud', 'content', 'thrilled', 'pleased',
  'delighted', 'optimistic', 'energetic', 'enthusiastic', 'confident', 'alive',
  'positive', 'smile', 'laugh', 'enjoy', 'fun', 'celebrate', 'achieve', 'succeed',
]);

const NEGATIVE_WORDS = new Set([
  'sad', 'depressed', 'anxious', 'angry', 'upset', 'lonely', 'tired', 'stressed',
  'worried', 'afraid', 'hopeless', 'disappointed', 'frustrated', 'miserable',
  'terrible', 'awful', 'horrible', 'hate', 'cry', 'tears', 'pain', 'hurt',
  'numb', 'empty', 'worthless', 'lost', 'confused', 'scared', 'nervous',
  'overwhelmed', 'exhausted', 'broken', 'failure', 'shame', 'guilt', 'regret',
]);

const EMOTION_MAP: Record<string, string> = {
  happy: '😊 Happy', sad: '😢 Sad', angry: '😠 Angry', excited: '🤩 Excited',
  anxious: '😰 Anxious', depressed: '😞 Depressed', grateful: '🙏 Grateful',
  lonely: '😔 Lonely', hopeful: '🌟 Hopeful', scared: '😨 Scared',
  calm: '😌 Calm', tired: '😴 Tired', confused: '😕 Confused',
  love: '❤️ Loving', frustrated: '😤 Frustrated', proud: '🥲 Proud',
};

// Baseline confidence given to a neutral result when no sentiment words are found
const DEFAULT_NEUTRAL_CONFIDENCE = 50;

// Fraction of total words considered "significant" for score normalisation.
// Empirically tuned: most casual diary sentences have ~30 % emotionally laden words.
const WORD_WEIGHT_FACTOR = 0.3;

// Minimum confidence added on top of the word-hit ratio, so that even short
// entries with a single strong keyword register > 0 %.
const BASE_CONFIDENCE_BOOST = 40;

export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.trim().length === 0) {
    return { label: 'neutral', score: 0, emotion: '😶 Neutral', confidence: DEFAULT_NEUTRAL_CONFIDENCE };
  }

  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  let pos = 0, neg = 0;
  let dominantEmotion = '😶 Neutral';

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) pos++;
    if (NEGATIVE_WORDS.has(word)) neg++;
    if (EMOTION_MAP[word]) dominantEmotion = EMOTION_MAP[word];
  }

  const total = words.length;
  const rawScore = (pos - neg) / Math.max(total * WORD_WEIGHT_FACTOR, 1);
  const score = Math.max(-1, Math.min(1, rawScore));
  const confidence = Math.min(100, Math.round(((pos + neg) / Math.max(total, 1)) * 100 + BASE_CONFIDENCE_BOOST));

  let label: SentimentResult['label'];
  if (score > 0.1) label = 'positive';
  else if (score < -0.1) label = 'negative';
  else label = 'neutral';

  if (dominantEmotion === '😶 Neutral') {
    if (label === 'positive') dominantEmotion = '😊 Happy';
    else if (label === 'negative') dominantEmotion = '😢 Sad';
  }

  return { label, score, emotion: dominantEmotion, confidence };
}

export function getMoodFromSentiment(sentiment: SentimentResult): Mood {
  if (sentiment.score >= 0.5) return 'great';
  if (sentiment.score >= 0.1) return 'good';
  if (sentiment.score >= -0.1) return 'neutral';
  if (sentiment.score >= -0.5) return 'bad';
  return 'awful';
}

export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'awful';

export const MOOD_META: Record<Mood, { emoji: string; label: string; color: string }> = {
  great:   { emoji: '🤩', label: 'Great',   color: '#00B894' },
  good:    { emoji: '😊', label: 'Good',    color: '#FDCB6E' },
  neutral: { emoji: '😐', label: 'Neutral', color: '#74B9FF' },
  bad:     { emoji: '😞', label: 'Bad',     color: '#FD79A8' },
  awful:   { emoji: '😢', label: 'Awful',   color: '#FF7675' },
};

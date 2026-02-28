import { useState, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { SentimentResult, analyzeSentiment, getMoodFromSentiment } from '../utils/sentiment';

export type DiaryEntry = {
  id: string;           // date key  e.g. "2024-05-01"
  text: string;
  mood: string;
  sentiment: SentimentResult;
  updatedAt: string;
};

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const uid = () => {
    const u = auth.currentUser;
    if (!u) throw new Error('Not authenticated');
    return u.uid;
  };

  const saveEntry = useCallback(async (dateKey: string, text: string) => {
    const sentiment = analyzeSentiment(text);
    const entry: DiaryEntry = {
      id: dateKey,
      text,
      mood: getMoodFromSentiment(sentiment),   // "great"|"good"|"neutral"|"bad"|"awful"
      sentiment,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'diaries', uid(), 'entries', dateKey), entry);
    return entry;
  }, []);

  const getEntry = useCallback(async (dateKey: string): Promise<DiaryEntry | null> => {
    const snap = await getDoc(doc(db, 'diaries', uid(), 'entries', dateKey));
    return snap.exists() ? (snap.data() as DiaryEntry) : null;
  }, []);

  const fetchRecentEntries = useCallback(async (count = 30) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'diaries', uid(), 'entries'),
        orderBy('id', 'desc'),
        limit(count),
      );
      const snap = await getDocs(q);
      const list: DiaryEntry[] = [];
      snap.forEach((d) => list.push(d.data() as DiaryEntry));
      setEntries(list);
    } finally {
      setLoading(false);
    }
  }, []);

  return { entries, loading, saveEntry, getEntry, fetchRecentEntries };
}

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, ActivityIndicator, ScrollView,
} from 'react-native';
import { Colors, Typography } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useDiary } from '../hooks/useDiary';
import { MOOD_META, Mood } from '../utils/sentiment';

// ─── Static curated video map (by mood/interest) ─────────────────────────────
// In production these would come from YouTube Data API v3 using
// EXPO_PUBLIC_YOUTUBE_API_KEY.  For now we bundle a curated list.
const CURATED_VIDEOS: Record<string, { id: string; title: string; channel: string; thumbnail: string }[]> = {
  great: [
    { id: 'Q10cs2QJgeo', title: 'Feel Good Vibes Mix', channel: 'Relax Music', thumbnail: 'https://img.youtube.com/vi/Q10cs2QJgeo/mqdefault.jpg' },
    { id: 'h3uJKEDsyCM', title: 'Happy Mood Playlist', channel: 'Chill Zone', thumbnail: 'https://img.youtube.com/vi/h3uJKEDsyCM/mqdefault.jpg' },
  ],
  good: [
    { id: 'fBVJoIbNjdQ', title: 'Positive Thinking', channel: 'Mind Power', thumbnail: 'https://img.youtube.com/vi/fBVJoIbNjdQ/mqdefault.jpg' },
    { id: 'fDMu9BXMR-U', title: 'Uplifting Music', channel: 'Calm Sounds', thumbnail: 'https://img.youtube.com/vi/fDMu9BXMR-U/mqdefault.jpg' },
  ],
  neutral: [
    { id: '6JnmIQxRZwI', title: 'Study with Me', channel: 'Focus Flow', thumbnail: 'https://img.youtube.com/vi/6JnmIQxRZwI/mqdefault.jpg' },
    { id: '403FGqa-Uv8', title: 'Ambient Sounds', channel: 'Nature Healing', thumbnail: 'https://img.youtube.com/vi/403FGqa-Uv8/mqdefault.jpg' },
  ],
  bad: [
    { id: 'zUDXj8REpAI', title: 'Guided Meditation', channel: 'Mindfulness', thumbnail: 'https://img.youtube.com/vi/zUDXj8REpAI/mqdefault.jpg' },
    { id: 'QEpCG6suios', title: 'Comfort Music', channel: 'Healing Sounds', thumbnail: 'https://img.youtube.com/vi/QEpCG6suios/mqdefault.jpg' },
    { id: 'LclR9uqrGN4', title: 'Calming Piano', channel: 'Relax Daily', thumbnail: 'https://img.youtube.com/vi/LclR9uqrGN4/mqdefault.jpg' },
  ],
  awful: [
    { id: 'aEYXiZ1qx90', title: 'Deep Breathing Exercise', channel: 'Wellness Hub', thumbnail: 'https://img.youtube.com/vi/aEYXiZ1qx90/mqdefault.jpg' },
    { id: 'inpok4MKVLM', title: '5-Minute Mindfulness', channel: 'Mindful Minutes', thumbnail: 'https://img.youtube.com/vi/inpok4MKVLM/mqdefault.jpg' },
    { id: 'O-6f5wQXSu8', title: 'Anxiety Relief Music', channel: 'Sound Healing', thumbnail: 'https://img.youtube.com/vi/O-6f5wQXSu8/mqdefault.jpg' },
  ],
};

const INTEREST_VIDEOS: Record<string, { id: string; title: string; channel: string; thumbnail: string }[]> = {
  Dance: [{ id: 'BTsMJ3a70OE', title: 'Dance Workout', channel: 'FitDance', thumbnail: 'https://img.youtube.com/vi/BTsMJ3a70OE/mqdefault.jpg' }],
  Music: [{ id: 'kffacxfA7G4', title: 'Peaceful Piano', channel: 'Soothing Relaxation', thumbnail: 'https://img.youtube.com/vi/kffacxfA7G4/mqdefault.jpg' }],
  'Stand Up': [{ id: 'k1BneeJTDcU', title: 'Best Stand Up Comedy', channel: 'Comedy Club', thumbnail: 'https://img.youtube.com/vi/k1BneeJTDcU/mqdefault.jpg' }],
  'Mind Puzzles': [{ id: '5MqLzfPW02Y', title: 'Brain Teasers', channel: 'Riddle Me This', thumbnail: 'https://img.youtube.com/vi/5MqLzfPW02Y/mqdefault.jpg' }],
};

const RECENT_ENTRIES_LIMIT = 10;   // how many entries to fetch for recommendation
const MOOD_ANALYSIS_WINDOW = 7;    // look at last N entries to compute dominant mood

const INTEREST_LABELS: Record<number, string> = {
  1: 'Biography', 2: 'Dance', 3: 'Mind Puzzles', 4: 'Music',
  5: 'Songs', 6: 'Stand Up', 7: 'Short Stories', 8: 'Story Books', 9: 'VLog',
};

export function RecommendationsScreen() {
  const { profile } = useAuth();
  const { entries, fetchRecentEntries } = useDiary();
  const [videos, setVideos] = useState<typeof CURATED_VIDEOS['neutral']>([]);
  const [dominantMood, setDominantMood] = useState<Mood>('neutral');

  useEffect(() => { fetchRecentEntries(RECENT_ENTRIES_LIMIT); }, [fetchRecentEntries]);

  useEffect(() => {
    // Derive dominant mood from last MOOD_ANALYSIS_WINDOW entries
    const moods = entries.slice(0, MOOD_ANALYSIS_WINDOW).map((e) => e.mood as Mood);
    const freq: Record<string, number> = {};
    for (const m of moods) freq[m] = (freq[m] ?? 0) + 1;
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] as Mood ?? 'neutral';
    setDominantMood(top);

    // Build video list
    const moodVideos = CURATED_VIDEOS[top] ?? CURATED_VIDEOS.neutral;
    const interestVideos = (profile?.interests ?? []).slice(0, 3).flatMap((id) => {
      const label = INTEREST_LABELS[id];
      return label ? (INTEREST_VIDEOS[label] ?? []) : [];
    });
    const combined = [...moodVideos, ...interestVideos];
    // Deduplicate
    const seen = new Set<string>();
    setVideos(combined.filter((v) => { if (seen.has(v.id)) return false; seen.add(v.id); return true; }));
  }, [entries, profile]);

  const mood = MOOD_META[dominantMood];

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.scroll}>
      {/* Mood summary */}
      <View style={[styles.moodBanner, { backgroundColor: mood.color + '22' }]}>
        <Text style={styles.moodBannerEmoji}>{mood.emoji}</Text>
        <View>
          <Text style={[styles.moodBannerTitle, { color: mood.color }]}>
            Recent mood: {mood.label}
          </Text>
          <Text style={styles.moodBannerSub}>Curated content just for you</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recommended for You</Text>

      {videos.length === 0 && (
        <View style={styles.empty}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={styles.emptyText}>Loading recommendations…</Text>
        </View>
      )}

      {videos.map((v) => (
        <TouchableOpacity
          key={v.id}
          style={styles.videoCard}
          onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${v.id}`)}
          activeOpacity={0.85}
        >
          <View style={styles.thumb}>
            <Text style={styles.thumbEmoji}>▶</Text>
          </View>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle} numberOfLines={2}>{v.title}</Text>
            <Text style={styles.videoChannel}>{v.channel}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.tip}>
        💡 Update your interests in the Profile tab to get better recommendations.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  moodBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, marginBottom: 24 },
  moodBannerEmoji: { fontSize: 40 },
  moodBannerTitle: { ...Typography.h4 },
  moodBannerSub: { ...Typography.body2, color: Colors.textSecondary },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 12 },
  videoCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 14, padding: 12, marginBottom: 12, gap: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  thumb: { width: 80, height: 56, borderRadius: 10, backgroundColor: Colors.primaryLight + '44', alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 28, color: Colors.primary },
  videoInfo: { flex: 1, justifyContent: 'center' },
  videoTitle: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '600' },
  videoChannel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 4 },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { ...Typography.body2, color: Colors.textSecondary, marginTop: 8 },
  tip: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center', marginTop: 24, lineHeight: 18 },
});

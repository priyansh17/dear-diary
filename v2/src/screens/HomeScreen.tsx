import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Colors, Typography } from '../theme';
import { DiaryCard } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useDiary } from '../hooks/useDiary';
import { todayKey } from '../utils/helpers';
import { MOOD_META, Mood } from '../utils/sentiment';

type Props = { navigation: any };

const QUICK_WRITE_PROMPTS = [
  'What made you smile today?',
  'What are you grateful for right now?',
  'Describe your biggest challenge this week.',
  'How is your energy level today?',
  'What would you like to let go of today?',
];

export function HomeScreen({ navigation }: Props) {
  const { profile } = useAuth();
  const { entries, loading, fetchRecentEntries } = useDiary();
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const prompt = QUICK_WRITE_PROMPTS[new Date().getDay() % QUICK_WRITE_PROMPTS.length];

  useEffect(() => {
    fetchRecentEntries(10);
  }, [fetchRecentEntries]);

  useEffect(() => {
    const today = entries.find((e) => e.id === todayKey());
    setTodayEntry(today ?? null);
  }, [entries]);

  const mood = todayEntry
    ? (MOOD_META[todayEntry.mood as Mood] ?? MOOD_META.neutral)
    : null;

  return (
    <ScrollView
      style={styles.bg}
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchRecentEntries(10)} />}
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetEmoji}>
          {mood ? mood.emoji : '👋'}
        </Text>
        <Text style={styles.greetText}>
          Hello, {profile?.displayName?.split(' ')[0] ?? 'there'}!
        </Text>
        <Text style={styles.greetSub}>
          {mood
            ? `You felt ${mood.label.toLowerCase()} today`
            : 'How are you feeling today?'}
        </Text>
      </View>

      {/* Today's CTA */}
      <TouchableOpacity
        style={[styles.ctaCard, { backgroundColor: Colors.primary }]}
        onPress={() => navigation.navigate('DiaryEditor', { dateKey: todayKey() })}
        activeOpacity={0.88}
      >
        <View style={styles.ctaContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>
              {todayEntry ? "Update today's entry ✏️" : "Write today's entry 📝"}
            </Text>
            <Text style={styles.ctaHint}>{prompt}</Text>
          </View>
          <Text style={styles.ctaArrow}>→</Text>
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickRow}>
        <QuickAction
          emoji="📅"
          label="Past Entries"
          color={Colors.accentLight}
          textColor={Colors.textPrimary}
          onPress={() => navigation.navigate('Diary')}
        />
        <QuickAction
          emoji="💡"
          label="Recommendations"
          color={Colors.primaryLight + '33'}
          textColor={Colors.primaryDark}
          onPress={() => navigation.navigate('Recommendations')}
        />
        <QuickAction
          emoji="⭐"
          label="My Interests"
          color={Colors.secondaryLight + '44'}
          textColor={Colors.textPrimary}
          onPress={() => navigation.navigate('Interests')}
        />
      </View>

      {/* Mood Trend (last 7 entries) */}
      {entries.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Mood</Text>
          <View style={styles.moodRow}>
            {entries.slice(0, 7).reverse().map((e) => {
              const m = MOOD_META[e.mood as Mood] ?? MOOD_META.neutral;
              return (
                <TouchableOpacity
                  key={e.id}
                  style={[styles.moodDot, { backgroundColor: m.color + '33', borderColor: m.color }]}
                  onPress={() => navigation.navigate('DiaryEditor', { dateKey: e.id })}
                >
                  <Text style={styles.moodDotEmoji}>{m.emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* Recent entries */}
      {entries.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {entries.slice(0, 5).map((e) => (
            <DiaryCard
              key={e.id}
              entry={e}
              onPress={() => navigation.navigate('DiaryEditor', { dateKey: e.id })}
            />
          ))}
          <TouchableOpacity style={styles.viewAll} onPress={() => navigation.navigate('Diary')}>
            <Text style={styles.viewAllText}>View all entries →</Text>
          </TouchableOpacity>
        </>
      )}

      {entries.length === 0 && !loading && (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyText}>Your journey begins with the first entry.</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('DiaryEditor', { dateKey: todayKey() })}
          >
            <Text style={styles.emptyBtnText}>Write your first entry</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function QuickAction({
  emoji, label, color, textColor, onPress,
}: { emoji: string; label: string; color: string; textColor: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.qa, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.qaEmoji}>{emoji}</Text>
      <Text style={[styles.qaLabel, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  greeting: { alignItems: 'center', marginBottom: 24 },
  greetEmoji: { fontSize: 56 },
  greetText: { ...Typography.h3, color: Colors.textPrimary, marginTop: 8 },
  greetSub: { ...Typography.body2, color: Colors.textSecondary, marginTop: 4 },
  ctaCard: { borderRadius: 20, padding: 20, marginBottom: 24 },
  ctaContent: { flexDirection: 'row', alignItems: 'center' },
  ctaTitle: { ...Typography.h4, color: Colors.textOnPrimary },
  ctaHint: { ...Typography.body2, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  ctaArrow: { fontSize: 24, color: Colors.textOnPrimary, marginLeft: 8 },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 12 },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  qa: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center' },
  qaEmoji: { fontSize: 28, marginBottom: 4 },
  qaLabel: { ...Typography.caption, fontWeight: '600', textAlign: 'center' },
  moodRow: { flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  moodDot: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  moodDotEmoji: { fontSize: 20 },
  viewAll: { alignItems: 'center', marginTop: 8, marginBottom: 16 },
  viewAllText: { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyText: { ...Typography.body1, color: Colors.textSecondary, textAlign: 'center' },
  emptyBtn: { marginTop: 20, backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  emptyBtnText: { ...Typography.button, color: Colors.textOnPrimary },
});

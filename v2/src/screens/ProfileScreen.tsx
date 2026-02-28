import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Colors, Typography } from '../theme';
import { Button } from '../components';
import { useAuth } from '../hooks/useAuth';
import { MOOD_META, Mood } from '../utils/sentiment';
import { useDiary } from '../hooks/useDiary';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { navigation: any };

const INTEREST_LABELS: Record<number, string> = {
  1: 'Biographies', 2: 'Dance', 3: 'Mind Puzzles', 4: 'Music',
  5: 'Songs', 6: 'Stand Up Comedy', 7: 'Short Stories', 8: 'Story Books', 9: 'VLogs',
};

// Display streak caps at this many days (we don't yet calculate consecutive days)
const MAX_STREAK_DISPLAY_DAYS = 7;

export function ProfileScreen({ navigation }: Props) {
  const { profile, logout } = useAuth();
  const { entries } = useDiary();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          setSigningOut(true);
          await logout();
          navigation.replace('Auth');
        },
      },
    ]);
  };

  // Compute stats
  const totalEntries = entries.length;
  const moodCounts = entries.reduce((acc, e) => {
    acc[e.mood as Mood] = (acc[e.mood as Mood] ?? 0) + 1;
    return acc;
  }, {} as Record<Mood, number>);
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.scroll}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>
            {profile?.gender === 'Female' ? '👩' : profile?.gender === 'Male' ? '👨' : '🧑'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.displayName ?? '—'}</Text>
        <Text style={styles.email}>{profile?.email ?? '—'}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatBox label="Entries" value={String(totalEntries)} emoji="📝" />
        <StatBox
          label="Top Mood"
          value={topMood ? MOOD_META[topMood[0] as Mood]?.emoji : '—'}
          emoji="📊"
        />
        <StatBox
          label="Streak"
          value={`${Math.min(totalEntries, MAX_STREAK_DISPLAY_DAYS)}d`}
          emoji="🔥"
        />
      </View>

      {/* Profile Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About You</Text>
        <InfoRow label="Age" value={profile?.age ?? '—'} />
        <InfoRow label="Gender" value={profile?.gender ?? '—'} />
        <InfoRow label="Phone" value={profile?.phone || 'Not set'} />
      </View>

      {/* Interests */}
      {profile?.interests && profile.interests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Interests</Text>
          <View style={styles.interestRow}>
            {profile.interests.slice(0, 5).map((id) => (
              <View key={id} style={styles.interestChip}>
                <Text style={styles.interestText}>{INTEREST_LABELS[id] ?? id}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Interests')}>
            <Text style={styles.editLink}>Edit Interests →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <Button
          title="Edit Interests"
          onPress={() => navigation.navigate('Interests')}
          variant="outline"
          style={{ marginBottom: 12 }}
        />
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="ghost"
          loading={signingOut}
          textStyle={{ color: Colors.danger }}
        />
      </View>

      <Text style={styles.version}>Dear Diary v2.0  ·  Built with ❤️</Text>
    </ScrollView>
  );
}

function StatBox({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <View style={sbStyles.box}>
      <Text style={sbStyles.emoji}>{emoji}</Text>
      <Text style={sbStyles.value}>{value}</Text>
      <Text style={sbStyles.label}>{label}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={irStyles.row}>
      <Text style={irStyles.label}>{label}</Text>
      <Text style={irStyles.value}>{value}</Text>
    </View>
  );
}

const sbStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 14, padding: 12, marginHorizontal: 4, elevation: 1 },
  emoji: { fontSize: 24, marginBottom: 4 },
  value: { ...Typography.h4, color: Colors.textPrimary },
  label: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
});

const irStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { ...Typography.body2, color: Colors.textSecondary },
  value: { ...Typography.body2, color: Colors.textPrimary, fontWeight: '500' },
});

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.primaryLight + '44', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 52 },
  name: { ...Typography.h3, color: Colors.textPrimary },
  email: { ...Typography.body2, color: Colors.textSecondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', marginBottom: 24 },
  section: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, elevation: 1 },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 12 },
  interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  interestChip: { backgroundColor: Colors.primaryLight + '22', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  interestText: { ...Typography.caption, color: Colors.primaryDark, fontWeight: '600' },
  editLink: { ...Typography.body2, color: Colors.primary, fontWeight: '600', marginTop: 4 },
  version: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'center', marginTop: 16 },
});

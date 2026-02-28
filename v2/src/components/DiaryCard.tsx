import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../theme';
import { DiaryEntry } from '../hooks/useDiary';
import { formatDiaryDate, truncate } from '../utils/helpers';
import { MOOD_META } from '../utils/sentiment';

type Props = {
  entry: DiaryEntry;
  onPress?: () => void;
};

export function DiaryCard({ entry, onPress }: Props) {
  const mood = MOOD_META[entry.mood as keyof typeof MOOD_META] ?? MOOD_META.neutral;

  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: mood.color }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDiaryDate(entry.id)}</Text>
        <View style={[styles.moodBadge, { backgroundColor: mood.color + '22' }]}>
          <Text style={[styles.moodText, { color: mood.color }]}>
            {mood.emoji} {mood.label}
          </Text>
        </View>
      </View>
      <Text style={styles.preview}>{truncate(entry.text, 120)}</Text>
      {entry.sentiment.emotion !== '😶 Neutral' && (
        <Text style={styles.emotion}>{entry.sentiment.emotion}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  date: { ...Typography.label, color: Colors.textSecondary },
  moodBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  moodText: { ...Typography.caption, fontWeight: '600' },
  preview: { ...Typography.body2, color: Colors.textPrimary, lineHeight: 20 },
  emotion: { ...Typography.caption, color: Colors.textSecondary, marginTop: 6 },
});

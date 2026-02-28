import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mood, MOOD_META } from '../utils/sentiment';
import { Colors, Typography } from '../theme';

type Props = {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
};

const MOODS: Mood[] = ['great', 'good', 'neutral', 'bad', 'awful'];

export function MoodPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {MOODS.map((m) => {
        const meta = MOOD_META[m];
        const isSelected = selected === m;
        return (
          <TouchableOpacity
            key={m}
            style={[styles.chip, isSelected && { backgroundColor: meta.color, borderColor: meta.color }]}
            onPress={() => onSelect(m)}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>{meta.emoji}</Text>
            <Text style={[styles.label, isSelected && { color: '#fff' }]}>{meta.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  chip: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minWidth: 60,
  },
  emoji: { fontSize: 22 },
  label: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
});

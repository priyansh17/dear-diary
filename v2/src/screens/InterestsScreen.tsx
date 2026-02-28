import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { Colors, Typography } from '../theme';
import { Button } from '../components';
import { db, auth } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';

type Props = { navigation: any };

type Interest = { id: number; label: string; emoji: string };

const INTERESTS: Interest[] = [
  { id: 2, label: 'Dance', emoji: '💃' },
  { id: 4, label: 'Music', emoji: '🎵' },
  { id: 5, label: 'Songs', emoji: '🎤' },
  { id: 6, label: 'Stand Up Comedy', emoji: '🎭' },
  { id: 7, label: 'Short Stories', emoji: '📖' },
  { id: 8, label: 'Story Books', emoji: '📚' },
  { id: 1, label: 'Biographies', emoji: '👤' },
  { id: 9, label: 'VLogs', emoji: '🎬' },
  { id: 3, label: 'Mind Puzzles', emoji: '🧩' },
];

export function InterestsScreen({ navigation }: Props) {
  const { profile, refreshProfile } = useAuth();
  const [selected, setSelected] = useState<Set<number>>(
    new Set(profile?.interests ?? INTERESTS.map((i) => i.id)),
  );
  const [saving, setSaving] = useState(false);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (selected.size === 0) { Alert.alert('Pick at least one interest'); return; }
    setSaving(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Not authenticated');
      // Order: selected items, sorted by their natural order in INTERESTS array
      const ordered = INTERESTS.filter((i) => selected.has(i.id)).map((i) => i.id);
      await updateDoc(doc(db, 'users', uid), { interests: ordered });
      await refreshProfile();
      Alert.alert('Saved!', 'Your interests have been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.scroll}>
      <Text style={styles.heading}>What do you enjoy? 🌟</Text>
      <Text style={styles.sub}>Select topics you like and we'll tailor recommendations to your taste.</Text>

      <View style={styles.grid}>
        {INTERESTS.map((item) => {
          const isSelected = selected.has(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.tile, isSelected && styles.tileSelected]}
              onPress={() => toggle(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.tileEmoji}>{item.emoji}</Text>
              <Text style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}>
                {item.label}
              </Text>
              {isSelected && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <Button title={`Save Interests (${selected.size})`} onPress={handleSave} loading={saving} style={{ marginTop: 8 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 8 },
  sub: { ...Typography.body2, color: Colors.textSecondary, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  tile: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  tileSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
  tileEmoji: { fontSize: 32, marginBottom: 8 },
  tileLabel: { ...Typography.body2, color: Colors.textSecondary, textAlign: 'center' },
  tileLabelSelected: { color: Colors.primary, fontWeight: '600' },
  check: { position: 'absolute', top: 10, right: 10, color: Colors.primary, fontSize: 16, fontWeight: '700' },
});

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Typography } from '../theme';
import { Button, MoodPicker } from '../components';
import { useDiary } from '../hooks/useDiary';
import { analyzeSentiment, getMoodFromSentiment, Mood, MOOD_META, SentimentResult } from '../utils/sentiment';
import { formatDiaryDate } from '../utils/helpers';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route: any;
};

// Minimum characters before live sentiment analysis kicks in
const MIN_TEXT_LENGTH_FOR_ANALYSIS = 20;

export function DiaryEditorScreen({ navigation, route }: Props) {
  const { dateKey } = route.params;
  const { saveEntry, getEntry } = useDiary();

  const [text, setText] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [analysis, setAnalysis] = useState<SentimentResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    getEntry(dateKey).then((e) => {
      if (e) {
        setText(e.text);
        setMood(e.mood as Mood);
        setAnalysis(e.sentiment);
      }
    });
  }, [dateKey, getEntry]);

  useEffect(() => {
    setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
    if (text.trim().length > MIN_TEXT_LENGTH_FOR_ANALYSIS) {
      const s = analyzeSentiment(text);
      setAnalysis(s);
      setMood(getMoodFromSentiment(s));
    }
  }, [text]);

  const handleSave = async () => {
    if (!text.trim()) { Alert.alert("Can't save an empty entry"); return; }
    setSaving(true);
    try {
      await saveEntry(dateKey, text.trim());
      Alert.alert('Saved! 🎉', 'Your diary entry has been saved.', [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const moodMeta = mood ? MOOD_META[mood] : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.bg} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Date header */}
        <View style={styles.dateRow}>
          <Text style={styles.date}>{formatDiaryDate(dateKey)}</Text>
          {moodMeta && (
            <View style={[styles.moodBadge, { backgroundColor: moodMeta.color + '22' }]}>
              <Text style={[styles.moodText, { color: moodMeta.color }]}>
                {moodMeta.emoji} {moodMeta.label}
              </Text>
            </View>
          )}
        </View>

        {/* Mood picker */}
        <Text style={styles.sectionLabel}>How are you feeling?</Text>
        <MoodPicker selected={mood} onSelect={setMood} />

        {/* Text area */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Write your thoughts…</Text>
        <View style={styles.textAreaWrapper}>
          <TextInput
            style={styles.textArea}
            value={text}
            onChangeText={setText}
            multiline
            placeholder="Pour your heart out here. This is your safe space."
            placeholderTextColor={Colors.textDisabled}
            textAlignVertical="top"
          />
          <Text style={styles.wordCount}>{wordCount} {wordCount === 1 ? 'word' : 'words'}</Text>
        </View>

        {/* Sentiment analysis card */}
        {analysis && text.trim().length > MIN_TEXT_LENGTH_FOR_ANALYSIS && (
          <View style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>📊 Sentiment Analysis</Text>
            <View style={styles.analysisRow}>
              <Stat label="Emotion" value={analysis.emotion} />
              <Stat label="Type" value={analysis.label} color={analysis.label === 'positive' ? Colors.success : analysis.label === 'negative' ? Colors.danger : Colors.textSecondary} />
              <Stat label="Confidence" value={`${analysis.confidence}%`} />
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <Button title="Save Entry" onPress={handleSave} loading={saving} />
          <Button title="Cancel" onPress={() => navigation.goBack()} variant="ghost" style={{ marginTop: 8 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={statStyles.box}>
      <Text style={statStyles.label}>{label}</Text>
      <Text style={[statStyles.value, color ? { color } : undefined]}>{value}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  box: { alignItems: 'center', flex: 1 },
  label: { ...Typography.caption, color: Colors.textSecondary },
  value: { ...Typography.label, color: Colors.textPrimary, fontWeight: '600', marginTop: 2 },
});

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  date: { ...Typography.h3, color: Colors.textPrimary },
  moodBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  moodText: { ...Typography.label, fontWeight: '600' },
  sectionLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 10 },
  textAreaWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 16,
    minHeight: 200,
    marginBottom: 16,
  },
  textArea: { ...Typography.body1, color: Colors.textPrimary, flex: 1, minHeight: 160 },
  wordCount: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'right', marginTop: 8 },
  analysisCard: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  analysisTitle: { ...Typography.label, color: Colors.textSecondary, marginBottom: 12 },
  analysisRow: { flexDirection: 'row' },
  actions: { marginTop: 8 },
});

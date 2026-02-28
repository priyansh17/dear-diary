import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Colors, Typography } from '../theme';
import { DiaryCard } from '../components';
import { useDiary } from '../hooks/useDiary';
import { todayKey } from '../utils/helpers';
import { MOOD_META, Mood } from '../utils/sentiment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { navigation: any };

const MOODS = ['all', 'great', 'good', 'neutral', 'bad', 'awful'] as const;
const DIARY_LIST_PAGE_SIZE = 50;   // max entries loaded at once in the list view

export function DiaryScreen({ navigation }: Props) {
  const { entries, loading, fetchRecentEntries } = useDiary();
  const [filter, setFilter] = useState<typeof MOODS[number]>('all');

  const refresh = useCallback(() => fetchRecentEntries(DIARY_LIST_PAGE_SIZE), [fetchRecentEntries]);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.mood === filter);

  return (
    <View style={styles.container}>
      {/* Filter chips */}
      <FlatList
        horizontal
        data={MOODS}
        keyExtractor={(i) => i}
        contentContainerStyle={styles.filterRow}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const meta = item !== 'all' ? MOOD_META[item as Mood] : null;
          const active = filter === item;
          return (
            <TouchableOpacity
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {meta ? `${meta.emoji} ${meta.label}` : 'All'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        renderItem={({ item }) => (
          <DiaryCard
            entry={item}
            onPress={() => navigation.navigate('DiaryEditor', { dateKey: item.id })}
          />
        )}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => navigation.navigate('DiaryEditor', { dateKey: todayKey() })}
          >
            <Text style={styles.newBtnText}>+ New Entry (Today)</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No entries yet</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  filterRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '18' },
  chipText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.primary, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  newBtn: { backgroundColor: Colors.primary, borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 16 },
  newBtnText: { ...Typography.button, color: Colors.textOnPrimary },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { ...Typography.body1, color: Colors.textSecondary, marginTop: 12 },
});

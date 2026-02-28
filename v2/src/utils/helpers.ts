import { format, isToday, isYesterday } from 'date-fns';

export function formatDiaryDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isToday(d)) return 'Today';
    if (isYesterday(d)) return 'Yesterday';
    return format(d, 'MMMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function truncate(text: string, maxLen = 100): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
  button: { fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  label: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
};

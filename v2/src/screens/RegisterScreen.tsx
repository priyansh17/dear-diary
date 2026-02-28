import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography } from '../theme';
import { Button, Input } from '../components';
import { useAuth } from '../hooks/useAuth';

type Props = {
  navigation: any;
};

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', age: '', password: '', confirm: '', gender: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Enter your full name';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (form.phone && form.phone.length !== 10) e.phone = 'Must be 10 digits';
    if (!form.age || isNaN(Number(form.age))) e.age = 'Enter a valid age';
    if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    if (!form.gender) e.gender = 'Select a gender';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.email.trim(), form.password, {
        displayName: form.name.trim(),
        phone: form.phone.trim(),
        age: form.age.trim(),
        gender: form.gender,
      });
      Alert.alert(
        'Verify your email',
        'We sent a verification link to your email. Please verify and then sign in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
      );
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.emoji}>✍️</Text>
          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.sub}>Join Dear Diary and start your wellness journey</Text>
        </View>

        <View style={styles.card}>
          <Input label="Full Name" placeholder="Jane Doe" value={form.name} onChangeText={set('name')} error={errors.name} />
          <Input label="Email" placeholder="jane@example.com" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <Input label="Phone (optional)" placeholder="10-digit number" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" error={errors.phone} />
          <Input label="Age" placeholder="25" value={form.age} onChangeText={set('age')} keyboardType="number-pad" error={errors.age} />
          <Input label="Password" placeholder="••••••••" value={form.password} onChangeText={set('password')} secureTextEntry secureToggle error={errors.password} />
          <Input label="Confirm Password" placeholder="••••••••" value={form.confirm} onChangeText={set('confirm')} secureTextEntry secureToggle error={errors.confirm} />

          {/* Gender selector */}
          <Text style={styles.genderLabel}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDERS.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.genderChip, form.gender === g && styles.genderSelected]}
                onPress={() => set('gender')(g)}
              >
                <Text style={[styles.genderText, form.gender === g && styles.genderTextSelected]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

          <View style={{ marginTop: 8 }}>
            <Button title="Create Account" onPress={handleRegister} loading={loading} />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', marginVertical: 24 },
  emoji: { fontSize: 56, marginBottom: 12 },
  heading: { ...Typography.h2, color: Colors.textPrimary },
  sub: { ...Typography.body2, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: Colors.surface, borderRadius: 24, padding: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16 },
  genderLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 8 },
  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  genderChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border },
  genderSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '18' },
  genderText: { ...Typography.body2, color: Colors.textSecondary },
  genderTextSelected: { color: Colors.primary, fontWeight: '600' },
  errorText: { ...Typography.caption, color: Colors.danger, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 40 },
  footerText: { ...Typography.body2, color: Colors.textSecondary },
  link: { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
});

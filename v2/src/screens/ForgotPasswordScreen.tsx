import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity,
} from 'react-native';
import { Colors, Typography } from '../theme';
import { Button, Input } from '../components';
import { useAuth } from '../hooks/useAuth';

type Props = { navigation: any };

export function ForgotPasswordScreen({ navigation }: Props) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) { Alert.alert('Enter your email'); return; }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      Alert.alert('Email sent', 'Check your inbox for a password-reset link.', [
        { text: 'Back to Login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.emoji}>🔑</Text>
          <Text style={styles.heading}>Reset Password</Text>
          <Text style={styles.sub}>Enter your email and we'll send a reset link</Text>
        </View>
        <View style={styles.card}>
          <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Button title="Send Reset Link" onPress={handleReset} loading={loading} />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  heading: { ...Typography.h2, color: Colors.textPrimary },
  sub: { ...Typography.body2, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: Colors.surface, borderRadius: 24, padding: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16 },
  footer: { alignItems: 'center', marginTop: 24 },
  link: { ...Typography.body2, color: Colors.primary },
});

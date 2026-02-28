import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography } from '../theme';
import { auth } from '../config/firebase';

type Props = {
  navigation: any;
};

export function SplashScreen({ navigation }: Props) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      const user = auth.currentUser;
      if (user && user.emailVerified) {
        navigation.replace('Main');
      } else {
        navigation.replace('Auth');
      }
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }], alignItems: 'center' }}>
        <Text style={styles.emoji}>📖</Text>
        <Text style={styles.title}>Dear Diary</Text>
        <Text style={styles.subtitle}>Your personal mental-health companion</Text>
        <Text style={styles.version}>v2.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 80, marginBottom: 16 },
  title: { ...Typography.h1, color: Colors.textOnPrimary, textAlign: 'center' },
  subtitle: { ...Typography.body1, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 8 },
  version: { ...Typography.caption, color: 'rgba(255,255,255,0.5)', marginTop: 24 },
});

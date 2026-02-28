import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Colors, Typography } from '../theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  secureToggle?: boolean;
};

export function Input({ label, error, containerStyle, secureToggle, secureTextEntry, ...rest }: Props) {
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          style={styles.input}
          placeholderTextColor={Colors.textDisabled}
        />
        {secureToggle && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} style={styles.eye}>
            <Text style={styles.eyeText}>{hidden ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { ...Typography.label, color: Colors.textSecondary, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 50,
    ...Typography.body1,
    color: Colors.textPrimary,
  },
  inputError: { borderColor: Colors.danger },
  eye: { paddingLeft: 8 },
  eyeText: { fontSize: 18 },
  errorText: { ...Typography.caption, color: Colors.danger, marginTop: 4 },
});

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextField } from '../atoms/TextField';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { ErrorBanner } from '../molecules/ErrorBanner';
import { AuthResult } from '../../hooks/useAuth';
import { colors, spacing } from '../../theme';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string) => Promise<AuthResult>;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const result = await onRegister(name, email, password);
    setLoading(false);
    if (!result.ok) setError(result.error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Stored only on this device — no server</Text>

      <ErrorBanner message={error} />

      <TextField label="Name" value={name} onChangeText={setName} placeholder="Jane Doe" accessibilityLabel="Name" />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        accessibilityLabel="Email"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        secureTextEntry
        accessibilityLabel="Password"
      />

      <PrimaryButton
        label="Create Account"
        onPress={handleSubmit}
        loading={loading}
        disabled={!name || !email || !password}
      />

      <Pressable onPress={onSwitchToLogin} style={styles.switchLink}>
        <Text style={styles.switchText}>
          Already have an account? <Text style={styles.switchAccent}>Log in</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.subtleText,
    marginBottom: spacing.xl,
  },
  switchLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  switchText: {
    color: colors.subtleText,
    fontSize: 14,
  },
  switchAccent: {
    color: colors.accent,
    fontWeight: '700',
  },
});

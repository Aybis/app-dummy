import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextField } from '../atoms/TextField';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { ErrorBanner } from '../molecules/ErrorBanner';
import { AuthResult } from '../../hooks/useAuth';
import { colors, spacing } from '../../theme';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<AuthResult>;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const result = await onLogin(email, password);
    setLoading(false);
    if (!result.ok) setError(result.error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to your local account</Text>

      <ErrorBanner message={error} />

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
        placeholder="••••••••"
        secureTextEntry
        accessibilityLabel="Password"
      />

      <PrimaryButton label="Log In" onPress={handleSubmit} loading={loading} disabled={!email || !password} />

      <Pressable onPress={onSwitchToRegister} style={styles.switchLink}>
        <Text style={styles.switchText}>
          Don't have an account? <Text style={styles.switchAccent}>Register</Text>
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

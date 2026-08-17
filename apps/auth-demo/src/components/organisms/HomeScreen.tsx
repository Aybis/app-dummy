import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { PublicUser } from '../../types';
import { colors, spacing } from '../../theme';

interface HomeScreenProps {
  user: PublicUser;
  onLogout: () => void;
}

export function HomeScreen({ user, onLogout }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLabel}>{user.name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Account created</Text>
        <Text style={styles.cardValue}>{new Date(user.createdAt).toLocaleDateString()}</Text>
      </View>

      <PrimaryButton label="Log Out" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    paddingTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarLabel: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.accentText,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.subtleText,
    marginBottom: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.subtleText,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
});

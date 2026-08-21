import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ApiSettings } from '../../types';
import { colors, spacing } from '../../theme';

interface SettingsModalProps {
  visible: boolean;
  settings: ApiSettings;
  onSave: (settings: ApiSettings) => void;
  onClose: () => void;
}

export function SettingsModal({ visible, settings, onSave, onClose }: SettingsModalProps) {
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);

  const handleSave = () => {
    onSave({ baseUrl: baseUrl.trim(), apiKey: apiKey.trim(), model: model.trim() });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>API Settings</Text>
        <Text style={styles.subtitle}>
          Your key is stored only on this device (Keychain/Keystore) and never leaves it except to call the API you configure below.
        </Text>

        <Text style={styles.label}>Base URL (OpenAI-compatible)</Text>
        <TextInput
          style={styles.input}
          value={baseUrl}
          onChangeText={setBaseUrl}
          placeholder="https://api.openai.com/v1"
          placeholderTextColor={colors.subtleText}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="API base URL"
        />

        <Text style={styles.label}>API Key</Text>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="sk-..."
          placeholderTextColor={colors.subtleText}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          accessibilityLabel="API key"
        />

        <Text style={styles.label}>Model</Text>
        <TextInput
          style={styles.input}
          value={model}
          onChangeText={setModel}
          placeholder="gpt-4o-mini"
          placeholderTextColor={colors.subtleText}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Model name"
        />

        <Pressable onPress={handleSave} style={styles.saveButton} accessibilityRole="button" accessibilityLabel="Save settings">
          <Text style={styles.saveLabel}>Save</Text>
        </Pressable>
        <Pressable onPress={onClose} style={styles.cancelButton} accessibilityRole="button" accessibilityLabel="Cancel">
          <Text style={styles.cancelLabel}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    color: colors.subtleText,
    marginBottom: spacing.xl,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtleText,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  saveLabel: {
    color: colors.accentText,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cancelLabel: {
    color: colors.subtleText,
    fontSize: 15,
  },
});

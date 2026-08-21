import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../../theme';

interface ChatInputProps {
  onSend: (text: string) => void;
  isSending: boolean;
  disabled: boolean;
}

export function ChatInput({ onSend, isSending, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || isSending || disabled) return;
    onSend(text);
    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={disabled ? 'Add an API key in Settings first' : 'Message the assistant...'}
        placeholderTextColor={colors.subtleText}
        multiline
        editable={!disabled}
        accessibilityLabel="Message input"
      />
      <Pressable
        onPress={handleSend}
        disabled={!text.trim() || isSending || disabled}
        style={({ pressed }) => [
          styles.sendButton,
          (!text.trim() || isSending || disabled) && styles.sendDisabled,
          pressed && styles.sendPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Send message"
      >
        {isSending ? <ActivityIndicator color={colors.accentText} size="small" /> : <Text style={styles.sendLabel}>↑</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPressed: {
    opacity: 0.85,
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendLabel: {
    color: colors.accentText,
    fontSize: 20,
    fontWeight: '700',
  },
});

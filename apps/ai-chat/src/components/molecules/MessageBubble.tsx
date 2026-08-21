import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../../types';
import { colors, spacing } from '../../theme';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
          message.isError && styles.bubbleError,
        ]}
      >
        <Text style={[styles.text, message.isError && styles.errorText]}>{message.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: colors.bubbleUser,
  },
  bubbleAssistant: {
    backgroundColor: colors.bubbleAssistant,
    borderWidth: 1,
    borderColor: colors.bubbleAssistantBorder,
  },
  bubbleError: {
    backgroundColor: 'rgba(224, 85, 75, 0.08)',
    borderColor: colors.danger,
  },
  text: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
  },
  errorText: {
    color: colors.danger,
  },
});

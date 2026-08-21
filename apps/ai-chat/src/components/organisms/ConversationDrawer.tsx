import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Conversation } from '../../types';
import { colors, spacing } from '../../theme';

interface ConversationDrawerProps {
  visible: boolean;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function ConversationDrawer({
  visible,
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClose,
}: ConversationDrawerProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.drawer}>
        <Pressable
          onPress={() => {
            onNew();
            onClose();
          }}
          style={styles.newChatButton}
          accessibilityRole="button"
          accessibilityLabel="Start new chat"
        >
          <Text style={styles.newChatLabel}>+ New chat</Text>
        </Pressable>

        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelect(item.id);
                onClose();
              }}
              style={[styles.item, item.id === activeId && styles.itemActive]}
              accessibilityRole="button"
              accessibilityLabel={`Open conversation: ${item.title}`}
            >
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Pressable
                onPress={() => onDelete(item.id)}
                style={styles.deleteButton}
                accessibilityRole="button"
                accessibilityLabel="Delete conversation"
              >
                <Text style={styles.deleteLabel}>×</Text>
              </Pressable>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No conversations yet</Text>}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '78%',
    backgroundColor: colors.sidebarBg,
    paddingTop: 60,
    paddingHorizontal: spacing.md,
  },
  newChatButton: {
    borderWidth: 1,
    borderColor: colors.sidebarSubtle,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  newChatLabel: {
    color: colors.sidebarText,
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    paddingBottom: spacing.xl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    marginBottom: 2,
  },
  itemActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  itemTitle: {
    color: colors.sidebarText,
    fontSize: 14,
    flex: 1,
  },
  deleteButton: {
    paddingHorizontal: spacing.sm,
  },
  deleteLabel: {
    color: colors.sidebarSubtle,
    fontSize: 18,
  },
  emptyText: {
    color: colors.sidebarSubtle,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

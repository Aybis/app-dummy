import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ChatScreen } from './src/components/organisms/ChatScreen';
import { SettingsModal } from './src/components/organisms/SettingsModal';
import { ConversationDrawer } from './src/components/organisms/ConversationDrawer';
import { useSettings } from './src/hooks/useSettings';
import { useConversations } from './src/hooks/useConversations';
import { colors, spacing } from './src/theme';

export default function App() {
  const { settings, isLoaded: settingsLoaded, hasApiKey, updateSettings } = useSettings();
  const {
    conversations,
    activeConversation,
    activeId,
    isLoaded: conversationsLoaded,
    isSending,
    setActiveId,
    createConversation,
    deleteConversation,
    sendMessage,
  } = useConversations(settings);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const isLoaded = settingsLoaded && conversationsLoaded;

  if (!isLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loading}>
          <ActivityIndicator color={colors.accent} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

        <View style={styles.header}>
          <Pressable onPress={() => setDrawerVisible(true)} accessibilityRole="button" accessibilityLabel="Open conversations">
            <Text style={styles.headerIcon}>☰</Text>
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {activeConversation?.title ?? 'AI Chat'}
          </Text>
          <Pressable onPress={() => setSettingsVisible(true)} accessibilityRole="button" accessibilityLabel="Open settings">
            <Text style={styles.headerIcon}>⚙</Text>
          </Pressable>
        </View>

        {!hasApiKey ? (
          <View style={styles.noKeyBanner}>
            <Text style={styles.noKeyText}>
              No API key configured. Tap ⚙ to add your own OpenAI-compatible key.
            </Text>
          </View>
        ) : null}

        <ChatScreen
          messages={activeConversation?.messages ?? []}
          onSend={sendMessage}
          isSending={isSending}
          inputDisabled={!hasApiKey}
        />

        <SettingsModal
          visible={settingsVisible}
          settings={settings}
          onSave={updateSettings}
          onClose={() => setSettingsVisible(false)}
        />

        <ConversationDrawer
          visible={drawerVisible}
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNew={createConversation}
          onDelete={deleteConversation}
          onClose={() => setDrawerVisible(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  headerIcon: {
    fontSize: 20,
    color: colors.text,
    width: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  noKeyBanner: {
    backgroundColor: 'rgba(224, 85, 75, 0.08)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  noKeyText: {
    color: colors.danger,
    fontSize: 12,
    textAlign: 'center',
  },
});

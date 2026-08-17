import React from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GameBoard } from './src/components/organisms/GameBoard';
import { ScoreBoard } from './src/components/molecules/ScoreBoard';
import { ModeToggle } from './src/components/molecules/ModeToggle';
import { useGame } from './src/hooks/useGame';
import { colors, spacing } from './src/theme';

function statusText(result: ReturnType<typeof useGame>['result'], mode: string): string {
  if (result.status === 'win') {
    if (mode === 'vs-ai') {
      return result.winner === 'X' ? 'You win! 🎉' : 'CPU wins';
    }
    return `Player ${result.winner} wins!`;
  }
  if (result.status === 'draw') return "It's a draw";
  return '';
}

export default function App() {
  const { board, currentPlayer, result, mode, score, playCell, resetBoard, setGameMode } = useGame();

  const turnLabel =
    result.status === 'in_progress'
      ? mode === 'vs-ai'
        ? currentPlayer === 'X' ? 'Your turn' : 'CPU thinking...'
        : `Player ${currentPlayer}'s turn`
      : statusText(result, mode);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />

        <View style={styles.header}>
          <Text style={styles.title}>Tic Tac Toe</Text>
        </View>

        <ModeToggle mode={mode} onChange={setGameMode} />
        <ScoreBoard score={score} mode={mode} />

        <Text style={styles.turnLabel}>{turnLabel}</Text>

        <GameBoard board={board} result={result} onCellPress={playCell} />

        <Pressable
          onPress={resetBoard}
          style={({ pressed }) => [styles.resetButton, pressed && styles.resetPressed]}
          accessibilityRole="button"
          accessibilityLabel="New game"
        >
          <Text style={styles.resetLabel}>New Game</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  turnLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.subtleText,
    marginBottom: spacing.sm,
    minHeight: 22,
  },
  resetButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  resetPressed: {
    opacity: 0.85,
  },
  resetLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accentText,
  },
});

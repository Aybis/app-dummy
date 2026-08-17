import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DisplayPanel } from './src/components/molecules/DisplayPanel';
import { Keypad } from './src/components/organisms/Keypad';
import { useCalculator } from './src/hooks/useCalculator';
import { colors } from './src/theme';

export default function App() {
  const calculator = useCalculator();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <DisplayPanel
          expression={calculator.expression}
          preview={calculator.preview}
          isError={calculator.isError}
          angleMode={calculator.angleMode}
          memoryActive={calculator.memory !== null}
        />
        <Keypad {...calculator} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-end',
  },
});

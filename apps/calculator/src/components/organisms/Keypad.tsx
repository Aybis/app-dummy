import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CalcButton, CalcButtonVariant } from '../atoms/CalcButton';
import { CalculatorActions, CalculatorState } from '../../hooks/useCalculator';

interface KeyDef {
  label: string;
  variant: CalcButtonVariant;
  onPress: () => void;
  fontSize?: number;
  active?: boolean;
  accessibilityLabel?: string;
}

type KeypadProps = CalculatorState & CalculatorActions;

/** The full button grid: basic row set is always shown, scientific rows toggle in/out. */
export function Keypad(props: KeypadProps) {
  const {
    input,
    clear,
    backspace,
    equals,
    toggleAngleMode,
    toggleScientific,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
    toggleSign,
    angleMode,
    memory,
    showScientific,
    expression,
  } = props;

  // Decide whether the next "( )" press should open or close a paren by
  // comparing how many of each are already present in the expression.
  const openCount = (expression.match(/\(/g) || []).length;
  const closeCount = (expression.match(/\)/g) || []).length;
  const nextParen = openCount > closeCount ? ')' : '(';

  const scientificRows: KeyDef[][] = [
    [
      { label: showScientific ? 'Basic' : 'Sci', variant: 'toggle', onPress: toggleScientific, fontSize: 16 },
      { label: angleMode.toUpperCase(), variant: 'toggle', onPress: toggleAngleMode, fontSize: 16 },
      { label: 'MC', variant: 'function', onPress: memoryClear, fontSize: 16 },
      { label: 'MR', variant: 'function', onPress: memoryRecall, fontSize: 16, active: memory !== null },
      { label: 'M+', variant: 'function', onPress: memoryAdd, fontSize: 16 },
      { label: 'M-', variant: 'function', onPress: memorySubtract, fontSize: 16 },
    ],
    [
      { label: 'sin', variant: 'function', onPress: () => input('sin(') },
      { label: 'cos', variant: 'function', onPress: () => input('cos(') },
      { label: 'tan', variant: 'function', onPress: () => input('tan(') },
      { label: 'π', variant: 'function', onPress: () => input('pi') },
      { label: 'e', variant: 'function', onPress: () => input('e') },
      { label: 'x!', variant: 'function', onPress: () => input('!') },
    ],
    [
      { label: 'asin', variant: 'function', onPress: () => input('asin('), fontSize: 15 },
      { label: 'acos', variant: 'function', onPress: () => input('acos('), fontSize: 15 },
      { label: 'atan', variant: 'function', onPress: () => input('atan('), fontSize: 15 },
      { label: 'ln', variant: 'function', onPress: () => input('ln(') },
      { label: 'log', variant: 'function', onPress: () => input('log(') },
      { label: '√', variant: 'function', onPress: () => input('sqrt(') },
    ],
  ];

  const basicRows: KeyDef[][] = [
    [
      { label: 'C', variant: 'function', onPress: clear, accessibilityLabel: 'Clear' },
      { label: '( )', variant: 'function', onPress: () => input(nextParen) },
      { label: '%', variant: 'function', onPress: () => input('%') },
      { label: '÷', variant: 'operator', onPress: () => input('/') },
    ],
    [
      { label: '7', variant: 'number', onPress: () => input('7') },
      { label: '8', variant: 'number', onPress: () => input('8') },
      { label: '9', variant: 'number', onPress: () => input('9') },
      { label: '×', variant: 'operator', onPress: () => input('*') },
    ],
    [
      { label: '4', variant: 'number', onPress: () => input('4') },
      { label: '5', variant: 'number', onPress: () => input('5') },
      { label: '6', variant: 'number', onPress: () => input('6') },
      { label: '−', variant: 'operator', onPress: () => input('-') },
    ],
    [
      { label: '1', variant: 'number', onPress: () => input('1') },
      { label: '2', variant: 'number', onPress: () => input('2') },
      { label: '3', variant: 'number', onPress: () => input('3') },
      { label: '+', variant: 'operator', onPress: () => input('+') },
    ],
    [
      { label: '±', variant: 'number', onPress: toggleSign },
      { label: '0', variant: 'number', onPress: () => input('0') },
      { label: '.', variant: 'number', onPress: () => input('.') },
      { label: '=', variant: 'accent', onPress: equals, accessibilityLabel: 'Equals' },
    ],
  ];

  // xʸ and ⌫ live in the basic grid's operator column area when scientific mode adds a row,
  // but to keep the 4-column basic layout intact we append a slim utility row instead.
  const utilityRow: KeyDef[] = [
    { label: 'xʸ', variant: 'function', onPress: () => input('^'), fontSize: 18 },
    { label: '⌫', variant: 'function', onPress: backspace, accessibilityLabel: 'Backspace', fontSize: 20 },
  ];

  return (
    <View style={styles.container}>
      {showScientific && (
        <View style={styles.scientificBlock}>
          {scientificRows.map((row, i) => (
            <View key={`sci-${i}`} style={styles.row}>
              {row.map((key) => (
                <CalcButton
                  key={key.label + i}
                  label={key.label}
                  variant={key.variant}
                  onPress={key.onPress}
                  fontSize={key.fontSize}
                  active={key.active}
                  accessibilityLabel={key.accessibilityLabel}
                />
              ))}
            </View>
          ))}
        </View>
      )}

      {!showScientific && (
        <View style={styles.row}>
          <CalcButton label="Sci" variant="toggle" onPress={toggleScientific} fontSize={16} flex={1} />
          <CalcButton label="xʸ" variant="function" onPress={() => input('^')} fontSize={18} flex={1} />
          <CalcButton label="⌫" variant="function" onPress={backspace} accessibilityLabel="Backspace" fontSize={20} flex={2} />
        </View>
      )}

      {basicRows.map((row, i) => (
        <View key={`basic-${i}`} style={styles.row}>
          {row.map((key) => (
            <CalcButton
              key={key.label + i}
              label={key.label}
              variant={key.variant}
              onPress={key.onPress}
              accessibilityLabel={key.accessibilityLabel}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  scientificBlock: {
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
  },
});

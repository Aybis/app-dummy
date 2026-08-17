import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Board, GameResult } from '../../logic/gameLogic';
import { Cell } from '../atoms/Cell';

interface GameBoardProps {
  board: Board;
  result: GameResult;
  onCellPress: (index: number) => void;
}

export function GameBoard({ board, result, onCellPress }: GameBoardProps) {
  const winningLine = result.status === 'win' ? result.line : [];
  const isFinished = result.status !== 'in_progress';

  const rows = [0, 1, 2];

  return (
    <View style={styles.board}>
      {rows.map((rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {[0, 1, 2].map((colIndex) => {
            const index = rowIndex * 3 + colIndex;
            return (
              <Cell
                key={index}
                value={board[index]}
                onPress={() => onCellPress(index)}
                isWinningCell={winningLine.includes(index)}
                disabled={isFinished}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
  },
});

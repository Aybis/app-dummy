import { useCallback, useEffect, useRef, useState } from 'react';
import { Board, checkResult, createEmptyBoard, GameResult, getBestMove, otherPlayer, Player } from '../logic/gameLogic';
import { EMPTY_SCORE, loadScore, saveScore, ScoreRecord } from '../storage/scoreStorage';

export type GameMode = 'two-player' | 'vs-ai';

export function useGame() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [mode, setMode] = useState<GameMode>('vs-ai');
  const [score, setScore] = useState<ScoreRecord>(EMPTY_SCORE);
  const [isScoreLoaded, setIsScoreLoaded] = useState(false);
  const humanPlayer: Player = 'X';
  const aiPlayer: Player = 'O';

  useEffect(() => {
    loadScore().then((loaded) => {
      setScore(loaded);
      setIsScoreLoaded(true);
    });
  }, []);

  const result = checkResult(board);
  const resultRef = useRef<GameResult>(result);
  resultRef.current = result;

  // Record score exactly once per finished game.
  const recordedRef = useRef(false);
  useEffect(() => {
    if (result.status === 'in_progress' || recordedRef.current) return;
    recordedRef.current = true;

    setScore((prev) => {
      const next =
        result.status === 'draw'
          ? { ...prev, draws: prev.draws + 1 }
          : result.winner === 'X'
            ? { ...prev, xWins: prev.xWins + 1 }
            : { ...prev, oWins: prev.oWins + 1 };
      saveScore(next);
      return next;
    });
  }, [result]);

  // AI move effect: whenever it's the AI's turn in vs-ai mode, play automatically.
  useEffect(() => {
    if (mode !== 'vs-ai') return;
    if (currentPlayer !== aiPlayer) return;
    if (checkResult(board).status !== 'in_progress') return;

    const timeout = setTimeout(() => {
      const move = getBestMove(board, aiPlayer);
      if (move === -1) return;
      setBoard((prev) => {
        const next = [...prev];
        next[move] = aiPlayer;
        return next;
      });
      setCurrentPlayer(humanPlayer);
    }, 350); // small delay so the AI move doesn't feel instant/jarring

    return () => clearTimeout(timeout);
  }, [board, currentPlayer, mode]);

  const playCell = useCallback(
    (index: number) => {
      if (checkResult(board).status !== 'in_progress') return;
      if (board[index] !== null) return;
      if (mode === 'vs-ai' && currentPlayer !== humanPlayer) return;

      setBoard((prev) => {
        const next = [...prev];
        next[index] = currentPlayer;
        return next;
      });
      setCurrentPlayer((prev) => otherPlayer(prev));
    },
    [board, currentPlayer, mode]
  );

  const resetBoard = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    recordedRef.current = false;
  }, []);

  const resetScore = useCallback(() => {
    setScore(EMPTY_SCORE);
    saveScore(EMPTY_SCORE);
  }, []);

  const setGameMode = useCallback((next: GameMode) => {
    setMode(next);
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    recordedRef.current = false;
  }, []);

  return {
    board,
    currentPlayer,
    result,
    mode,
    score,
    isScoreLoaded,
    playCell,
    resetBoard,
    resetScore,
    setGameMode,
  };
}

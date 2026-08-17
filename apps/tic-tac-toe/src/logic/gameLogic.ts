export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[]; // length 9, row-major (0..8)

export type GameResult =
  | { status: 'in_progress' }
  | { status: 'win'; winner: Player; line: number[] }
  | { status: 'draw' };

const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],           // diagonals
];

export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

export function checkResult(board: Board): GameResult {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { status: 'win', winner: board[a] as Player, line };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { status: 'draw' };
  }
  return { status: 'in_progress' };
}

export function otherPlayer(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}

/**
 * Minimax with alpha-beta pruning — plays perfectly (never loses).
 * Board size is fixed at 9 cells so this is cheap even unpruned,
 * but pruning keeps it snappy regardless.
 */
export function getBestMove(board: Board, aiPlayer: Player): number {
  const opponent = otherPlayer(aiPlayer);

  function minimax(state: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
    const result = checkResult(state);
    if (result.status === 'win') {
      return result.winner === aiPlayer ? 10 - depth : depth - 10;
    }
    if (result.status === 'draw') return 0;

    const availableMoves = state.reduce<number[]>((acc, cell, idx) => {
      if (cell === null) acc.push(idx);
      return acc;
    }, []);

    if (isMaximizing) {
      let best = -Infinity;
      for (const move of availableMoves) {
        state[move] = aiPlayer;
        best = Math.max(best, minimax(state, depth + 1, false, alpha, beta));
        state[move] = null;
        alpha = Math.max(alpha, best);
        if (alpha >= beta) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const move of availableMoves) {
        state[move] = opponent;
        best = Math.min(best, minimax(state, depth + 1, true, alpha, beta));
        state[move] = null;
        beta = Math.min(beta, best);
        if (alpha >= beta) break;
      }
      return best;
    }
  }

  let bestScore = -Infinity;
  let bestMove = -1;
  const workingBoard = [...board];

  for (let i = 0; i < 9; i++) {
    if (workingBoard[i] !== null) continue;
    workingBoard[i] = aiPlayer;
    const score = minimax(workingBoard, 0, false, -Infinity, Infinity);
    workingBoard[i] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}

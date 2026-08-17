/** Standalone smoke test: `npx tsx src/logic/gameLogic.test.ts` */
import { checkResult, createEmptyBoard, getBestMove, Board } from './gameLogic';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL: ${message}`);
  }
}

// Row win
{
  const board: Board = ['X', 'X', 'X', null, 'O', 'O', null, null, null];
  const result = checkResult(board);
  assert(result.status === 'win' && result.winner === 'X', 'row win detected');
}

// Column win
{
  const board: Board = ['O', 'X', null, 'O', 'X', null, 'O', null, null];
  const result = checkResult(board);
  assert(result.status === 'win' && result.winner === 'O', 'column win detected');
}

// Diagonal win
{
  const board: Board = ['X', 'O', 'O', null, 'X', null, null, null, 'X'];
  const result = checkResult(board);
  assert(result.status === 'win' && result.winner === 'X', 'diagonal win detected');
}

// Draw
{
  const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
  const result = checkResult(board);
  assert(result.status === 'draw', 'draw detected');
}

// In progress
{
  const board = createEmptyBoard();
  const result = checkResult(board);
  assert(result.status === 'in_progress', 'empty board is in progress');
}

// AI never loses: play AI ('O') vs AI ('X') from empty board — should always draw
{
  let board = createEmptyBoard();
  let current: 'X' | 'O' = 'X';
  while (checkResult(board).status === 'in_progress') {
    const move = getBestMove(board, current);
    board[move] = current;
    current = current === 'X' ? 'O' : 'X';
  }
  const result = checkResult(board);
  assert(result.status === 'draw', `perfect play from both sides should draw, got ${result.status}`);
}

// AI takes the winning move when available
{
  const board: Board = ['X', 'X', null, 'O', 'O', null, null, null, null];
  const move = getBestMove(board, 'X');
  assert(move === 2, `AI should take winning move at index 2, got ${move}`);
}

// AI blocks opponent's winning move
{
  const board: Board = ['O', 'O', null, 'X', null, null, null, null, null];
  const move = getBestMove(board, 'X');
  assert(move === 2, `AI should block at index 2, got ${move}`);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScoreRecord {
  xWins: number;
  oWins: number;
  draws: number;
}

const STORAGE_KEY = '@app-dummy/tic-tac-toe/score/v1';

export const EMPTY_SCORE: ScoreRecord = { xWins: 0, oWins: 0, draws: 0 };

export async function loadScore(): Promise<ScoreRecord> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SCORE;
    const parsed = JSON.parse(raw);
    return {
      xWins: parsed.xWins ?? 0,
      oWins: parsed.oWins ?? 0,
      draws: parsed.draws ?? 0,
    };
  } catch {
    return EMPTY_SCORE;
  }
}

export async function saveScore(score: ScoreRecord): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(score));
}

import { useCallback, useMemo, useState } from 'react';
import { AngleMode, evaluate, EvaluatorError } from '../logic/evaluator';
import { formatResult } from '../logic/format';

const MAX_EXPRESSION_LENGTH = 100;

export interface CalculatorState {
  expression: string;
  preview: string;
  isError: boolean;
  angleMode: AngleMode;
  memory: number | null;
  showScientific: boolean;
}

export interface CalculatorActions {
  input: (token: string) => void;
  clear: () => void;
  backspace: () => void;
  equals: () => void;
  toggleAngleMode: () => void;
  toggleScientific: () => void;
  memoryAdd: () => void;
  memorySubtract: () => void;
  memoryRecall: () => void;
  memoryClear: () => void;
  toggleSign: () => void;
}

const OPERATORS = new Set(['+', '-', '*', '/', '^']);

function safePreview(expression: string, angleMode: AngleMode): string {
  if (!expression) return '';
  try {
    const value = evaluate(expression, angleMode);
    return formatResult(value);
  } catch {
    return '';
  }
}

export function useCalculator(): CalculatorState & CalculatorActions {
  const [expression, setExpression] = useState('');
  const [isError, setIsError] = useState(false);
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [memory, setMemory] = useState<number | null>(null);
  const [showScientific, setShowScientific] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const preview = useMemo(() => safePreview(expression, angleMode), [expression, angleMode]);

  const input = useCallback((token: string) => {
    setExpression((prev) => {
      if (isError) {
        return OPERATORS.has(token) ? '' : token;
      }

      let base = prev;

      // Starting fresh input right after "=" replaces the expression,
      // unless the user continues with an operator (chains off the result).
      if (justEvaluated) {
        setJustEvaluated(false);
        if (!OPERATORS.has(token) && token !== '%' && token !== '!') {
          base = '';
        }
      }

      if (base.length >= MAX_EXPRESSION_LENGTH) return base;

      const lastChar = base[base.length - 1];

      // Prevent two consecutive binary operators (but allow unary minus after another operator/paren).
      if (OPERATORS.has(token) && token !== '-' && OPERATORS.has(lastChar)) {
        return base.slice(0, -1) + token;
      }
      if (OPERATORS.has(lastChar) && OPERATORS.has(token) && lastChar !== '-') {
        return base.slice(0, -1) + token;
      }

      return base + token;
    });
    setIsError(false);
  }, [isError, justEvaluated]);

  const clear = useCallback(() => {
    setExpression('');
    setIsError(false);
    setJustEvaluated(false);
  }, []);

  const backspace = useCallback(() => {
    if (isError) {
      setExpression('');
      setIsError(false);
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  }, [isError]);

  const equals = useCallback(() => {
    if (!expression) return;
    try {
      const value = evaluate(expression, angleMode);
      setExpression(formatResult(value));
      setIsError(false);
      setJustEvaluated(true);
    } catch (err) {
      setIsError(true);
      setExpression(err instanceof EvaluatorError ? err.message : 'Error');
    }
  }, [expression, angleMode]);

  const toggleAngleMode = useCallback(() => {
    setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'));
  }, []);

  const toggleScientific = useCallback(() => {
    setShowScientific((prev) => !prev);
  }, []);

  const currentNumericValue = useCallback((): number => {
    try {
      return evaluate(expression || '0', angleMode);
    } catch {
      return 0;
    }
  }, [expression, angleMode]);

  const memoryAdd = useCallback(() => {
    const value = currentNumericValue();
    setMemory((prev) => (prev ?? 0) + value);
  }, [currentNumericValue]);

  const memorySubtract = useCallback(() => {
    const value = currentNumericValue();
    setMemory((prev) => (prev ?? 0) - value);
  }, [currentNumericValue]);

  const memoryRecall = useCallback(() => {
    if (memory === null) return;
    setExpression((prev) => (justEvaluated || isError ? formatResult(memory) : prev + formatResult(memory)));
    setJustEvaluated(false);
    setIsError(false);
  }, [memory, justEvaluated, isError]);

  const memoryClear = useCallback(() => {
    setMemory(null);
  }, []);

  const toggleSign = useCallback(() => {
    setExpression((prev) => {
      if (!prev || isError) return prev;
      // Wrap the whole expression in a leading negation toggle for simplicity.
      if (prev.startsWith('-(') && prev.endsWith(')')) {
        return prev.slice(2, -1);
      }
      return `-(${prev})`;
    });
  }, [isError]);

  return {
    expression,
    preview,
    isError,
    angleMode,
    memory,
    showScientific,
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
  };
}

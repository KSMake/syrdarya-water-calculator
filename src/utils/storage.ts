import type { CalculationHistory } from '../types/calculation';

const HISTORY_KEY = 'river_calculation_history';
const MAX_HISTORY_ITEMS = 10;

export function saveCalculation(calculation: Omit<CalculationHistory, 'id' | 'timestamp'>) {
  const history = getHistory();
  const newItem: CalculationHistory = {
    ...calculation,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}

export function getHistory(): CalculationHistory[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

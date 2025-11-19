export interface CalculationHistory {
  id: string;
  fromPost: string;
  toPost: string;
  flowRate: number;
  distance: number;
  avgTime: string;
  timestamp: number;
}

export interface ComparisonRoute {
  id: string;
  fromPost: string;
  toPost: string;
  distance: number;
  avgTime: string;
  minTime: string;
  maxTime: string;
}

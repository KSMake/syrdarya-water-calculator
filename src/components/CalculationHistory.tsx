import { History, X, Clock, ArrowRight } from 'lucide-react';
import type { CalculationHistory } from '../types/calculation';

interface CalculationHistoryProps {
  history: CalculationHistory[];
  onSelect: (item: CalculationHistory) => void;
  onClear: () => void;
}

export function CalculationHistoryPanel({ history, onSelect, onClear }: CalculationHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">История расчётов</h3>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-slate-500 hover:text-red-600 transition-colors"
        >
          Очистить
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-slate-900 truncate">{item.fromPost}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-slate-900 truncate">{item.toPost}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                  <span>{item.distance} км</span>
                  <span>•</span>
                  <span>{item.flowRate} м³/с</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{item.avgTime}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                {new Date(item.timestamp).toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

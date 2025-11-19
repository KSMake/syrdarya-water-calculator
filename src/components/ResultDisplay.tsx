import { Clock, Waves, AlertCircle, Route } from 'lucide-react';
import type { FlowCalculationResult } from '../types/river';

interface ResultDisplayProps {
  result: FlowCalculationResult;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Waves className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">Результаты расчета</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Route className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Расстояние</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{result.distance_km} км</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Среднее время</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{result.avg_time_formatted}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Диапазон времени добегания</h4>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-slate-500 mb-1">Минимум</p>
            <p className="text-lg font-semibold text-green-600">{result.min_time_formatted}</p>
          </div>
          <div className="flex-1 text-center">
            <div className="h-1 bg-gradient-to-r from-green-400 via-blue-400 to-orange-400 rounded-full"></div>
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs text-slate-500 mb-1">Максимум</p>
            <p className="text-lg font-semibold text-orange-600">{result.max_time_formatted}</p>
          </div>
        </div>
      </div>

      {result.hasResetPoint && result.resetPointName && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 mb-1">Важно! Reset Point</p>
              <p className="text-sm text-amber-800 mb-2">
                На маршруте расположен гидроузел <strong>{result.resetPointName}</strong> (reset point).
              </p>
              <p className="text-sm text-amber-800">
                Это означает, что фактическое время добегания воды от начального объекта до конечного <strong>не является простой суммой</strong>, а зависит от:
              </p>
              <ul className="text-sm text-amber-800 mt-2 ml-4 list-disc space-y-1">
                <li>Момента контролируемого выпуска воды через {result.resetPointName}</li>
                <li>Режима работы гидроузла</li>
                <li>Объема попуска через гидроузел</li>
              </ul>
              <p className="text-sm text-amber-800 mt-2">
                <strong>Отображаемое время</strong> рассчитано только для участка <strong>после</strong> {result.resetPointName}.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-slate-500">
        <p>* Расчёт выполнен при условии свободного русла и стабильного попуска 300 м³/с</p>
      </div>
    </div>
  );
}

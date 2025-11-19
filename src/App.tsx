import { useEffect, useState } from 'react';
import { Droplets, ArrowRight, Loader2, Download } from 'lucide-react';
import { supabase } from './lib/supabase';
import { PostSelector } from './components/PostSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { CalculationHistoryPanel } from './components/CalculationHistory';
import { AdvancedCalculations } from './components/AdvancedCalculations';
import { PostInformation } from './components/PostInformation';
import { calculateFlowTime } from './utils/flowCalculations';
import { saveCalculation, getHistory, clearHistory } from './utils/storage';
import { exportToPDF, exportToCSV } from './utils/exportUtils';
import type { RiverPost, FlowCalculationResult } from './types/river';
import type { CalculationHistory } from './types/calculation';

function App() {
  const [posts, setPosts] = useState<RiverPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromPost, setFromPost] = useState<RiverPost | null>(null);
  const [toPost, setToPost] = useState<RiverPost | null>(null);
  const [flowRate, setFlowRate] = useState<number>(300);
  const [result, setResult] = useState<FlowCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculationHistory[]>([]);

  useEffect(() => {
    fetchPosts();
    setHistory(getHistory());
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('river_posts')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fromPost && toPost) {
      const calculatedResult = calculateFlowTime(fromPost, toPost, posts, flowRate);
      if (calculatedResult) {
        setResult(calculatedResult);
        setError(null);

        // Save to history
        saveCalculation({
          fromPost: fromPost.post_name,
          toPost: toPost.post_name,
          flowRate,
          distance: calculatedResult.distance_km,
          avgTime: calculatedResult.avg_time_formatted,
        });
        setHistory(getHistory());
      } else {
        setError('Объект "От" должен быть выше по течению, чем объект "До"');
        setResult(null);
      }
    } else {
      setResult(null);
      setError(null);
    }
  }, [fromPost, toPost, posts, flowRate]);

  const handleHistorySelect = (item: CalculationHistory) => {
    const from = posts.find(p => p.post_name === item.fromPost);
    const to = posts.find(p => p.post_name === item.toPost);
    if (from && to) {
      setFromPost(from);
      setToPost(to);
      setFlowRate(item.flowRate);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleExportPDF = () => {
    if (result && fromPost && toPost) {
      exportToPDF(fromPost.post_name, toPost.post_name, flowRate, result);
    }
  };

  const handleExportCSV = () => {
    if (result && fromPost && toPost) {
      exportToCSV(fromPost.post_name, toPost.post_name, flowRate, result);
    }
  };

  const availableToPosts = fromPost
    ? posts.filter(p => p.order_index > fromPost.order_index)
    : posts;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Droplets className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Калькулятор добегания воды
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Расчёт времени добегания воды по реке Нарын–Сырдарья
          </p>
          <p className="text-slate-500 text-sm mt-1">
            От Токтогульского водохранилища до Кокбулака
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Расход воды (попуск), м³/с
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={flowRate}
                onChange={(e) => setFlowRate(Number(e.target.value))}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="100"
                  max="2500"
                  step="50"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-600 font-medium">м³/с</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Базовое значение: 300 м³/с. Увеличение расхода сокращает время добегания.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
            <PostSelector
              label="От (начальный объект)"
              posts={posts}
              selectedPost={fromPost}
              onSelect={setFromPost}
            />

            <div className="flex justify-center pb-3">
              <div className="bg-blue-100 rounded-full p-3">
                <ArrowRight className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <PostSelector
              label="До (конечный объект)"
              posts={availableToPosts}
              selectedPost={toPost}
              onSelect={setToPost}
              disabled={!fromPost}
            />
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {result && !error && (
          <>
            <ResultDisplay result={result} />

            {fromPost && toPost && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleExportPDF}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Печать / PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Экспорт CSV
                </button>
              </div>
            )}
          </>
        )}

        <CalculationHistoryPanel
          history={history}
          onSelect={handleHistorySelect}
          onClear={handleClearHistory}
        />

        <div className="grid grid-cols-1 gap-4">
          <AdvancedCalculations posts={posts} flowRate={flowRate} />
          <PostInformation posts={posts} />
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">О расчётах</h3>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              <strong>Источник данных:</strong>
            </p>
            <p className="text-sm text-blue-800">
              Исходные данные предоставлены БВО "Сырдарья" при стабильном попуске 300 м³/с в условиях свободного русла.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-slate-600 mb-2"><strong>Условия расчёта:</strong></p>
              <ul className="text-slate-700 space-y-1 ml-4 list-disc">
                <li>Свободное русло</li>
                <li>Текущий попуск: {flowRate} м³/с</li>
                <li>Базовый попуск: 300 м³/с</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-600 mb-2"><strong>Особенности:</strong></p>
              <ul className="text-slate-700 space-y-1 ml-4 list-disc">
                <li>Бахри Точик (reset point)</li>
                <li>Ограничения по Qmax = 2500 м³/с</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg mb-6">
            <p className="text-sm font-medium text-amber-900 mb-2">
              <strong>О Reset Point (Бахри Точик):</strong>
            </p>
            <p className="text-sm text-amber-800 mb-2">
              Гидроузел Бахри Точик является точкой сброса времени (reset point). Это означает:
            </p>
            <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
              <li>Вода не течёт напрямую через этот узел</li>
              <li>Время добегания "обнуляется" на данном объекте</li>
              <li>Выпуск воды происходит в контролируемом режиме по графику</li>
              <li>При расчёте от Токтогула до Кокбулака учитывается только участок после Бахри Точик</li>
            </ul>
            <p className="text-sm text-amber-800 mt-2">
              <strong>Важно:</strong> Время от начального объекта до конечного НЕ является суммой времён участков, если на маршруте есть reset point.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-sm font-medium text-slate-900 mb-3">
              <strong>Методика расчёта при изменении расхода:</strong>
            </p>
            <p className="text-sm text-slate-700 mb-2">
              Время добегания рассчитывается по гидравлической формуле с коэффициентом K = √(300/Q), где Q - текущий расход.
            </p>
            <ul className="text-sm text-slate-700 space-y-1 ml-4 list-disc mb-3">
              <li>При Q = 300 м³/с: K = 1.00 (базовое время)</li>
              <li>При Q = 600 м³/с: K = 0.71 (время уменьшается на ~29%)</li>
              <li>При Q = 1200 м³/с: K = 0.50 (время уменьшается на ~50%)</li>
              <li>При Q = 150 м³/с: K = 1.41 (время увеличивается на ~41%)</li>
            </ul>
            <p className="text-xs text-slate-600">
              <strong>Точность:</strong> ±10-15% в зависимости от морфологии русла, уровня воды в водохранилищах и режима работы гидроузлов.
              Расчёт является ориентировочным и должен корректироваться по фактическим наблюдениям.
            </p>
          </div>
        </div>

        <footer className="mt-8 text-center text-slate-500 text-sm space-y-2">
          <p className="font-medium">Калькулятор добегания воды по реке Нарын–Сырдарья</p>
          <p>Данные: БВО "Сырдарья" при стабильном попуске 300 м³/с</p>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-400 italic">
              Это пилотная версия приложения. Возможны неточности в расчётах.<br />
              Система находится в процессе тестирования и доработки.<br />
              Используйте результаты как ориентировочные и корректируйте по фактическим наблюдениям.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

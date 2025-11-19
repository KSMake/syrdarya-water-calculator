import { useState } from 'react';
import { Calculator, Calendar, Clock, ArrowLeft } from 'lucide-react';
import type { RiverPost } from '../types/river';
import { calculateFlowTime } from '../utils/flowCalculations';

interface AdvancedCalculationsProps {
  posts: RiverPost[];
  flowRate: number;
}

export function AdvancedCalculations({ posts, flowRate }: AdvancedCalculationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'arrival' | 'reverse'>('arrival');

  // Arrival time calculator
  const [fromPostArrival, setFromPostArrival] = useState<string>('');
  const [toPostArrival, setToPostArrival] = useState<string>('');
  const [releaseDate, setReleaseDate] = useState<string>('');
  const [releaseTime, setReleaseTime] = useState<string>('');
  const [arrivalResult, setArrivalResult] = useState<{min: string, avg: string, max: string} | null>(null);

  // Reverse calculator
  const [fromPostReverse, setFromPostReverse] = useState<string>('');
  const [toPostReverse, setToPostReverse] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>('');
  const [targetTime, setTargetTime] = useState<string>('');
  const [reverseResult, setReverseResult] = useState<{min: string, avg: string, max: string} | null>(null);

  const calculateArrivalTime = () => {
    if (!fromPostArrival || !toPostArrival || !releaseDate || !releaseTime) return;

    const from = posts.find(p => p.id === fromPostArrival);
    const to = posts.find(p => p.id === toPostArrival);
    if (!from || !to) return;

    const result = calculateFlowTime(from, to, posts, flowRate);
    if (!result) return;

    const releaseDateTime = new Date(`${releaseDate}T${releaseTime}`);

    const minArrival = new Date(releaseDateTime.getTime() + result.min_time_hours * 60 * 60 * 1000);
    const avgArrival = new Date(releaseDateTime.getTime() + result.avg_time_hours * 60 * 60 * 1000);
    const maxArrival = new Date(releaseDateTime.getTime() + result.max_time_hours * 60 * 60 * 1000);

    setArrivalResult({
      min: minArrival.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      avg: avgArrival.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      max: maxArrival.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    });
  };

  const calculateReverseTime = () => {
    if (!fromPostReverse || !toPostReverse || !targetDate || !targetTime) return;

    const from = posts.find(p => p.id === fromPostReverse);
    const to = posts.find(p => p.id === toPostReverse);
    if (!from || !to) return;

    const result = calculateFlowTime(from, to, posts, flowRate);
    if (!result) return;

    const targetDateTime = new Date(`${targetDate}T${targetTime}`);

    const minRelease = new Date(targetDateTime.getTime() - result.max_time_hours * 60 * 60 * 1000);
    const avgRelease = new Date(targetDateTime.getTime() - result.avg_time_hours * 60 * 60 * 1000);
    const maxRelease = new Date(targetDateTime.getTime() - result.min_time_hours * 60 * 60 * 1000);

    setReverseResult({
      min: minRelease.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      avg: avgRelease.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      max: maxRelease.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    });
  };

  const availableToPostsArrival = fromPostArrival
    ? posts.filter(p => p.order_index > (posts.find(post => post.id === fromPostArrival)?.order_index || 0))
    : posts;

  const availableToPostsReverse = fromPostReverse
    ? posts.filter(p => p.order_index > (posts.find(post => post.id === fromPostReverse)?.order_index || 0))
    : posts;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow flex items-center justify-center gap-2 text-slate-700 hover:text-blue-600"
      >
        <Calculator className="w-5 h-5" />
        <span className="font-medium">Расширенные расчёты</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Расширенные расчёты</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('arrival')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            mode === 'arrival'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Время прибытия</span>
          </div>
        </button>
        <button
          onClick={() => setMode('reverse')}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            mode === 'reverse'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Обратный расчёт</span>
          </div>
        </button>
      </div>

      {mode === 'arrival' ? (
        <div>
          <p className="text-sm text-slate-600 mb-4">
            Рассчитайте время прибытия воды, указав время выпуска
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">От</label>
                <select
                  value={fromPostArrival}
                  onChange={(e) => {
                    setFromPostArrival(e.target.value);
                    setArrivalResult(null);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите объект</option>
                  {posts.map(post => (
                    <option key={post.id} value={post.id}>{post.post_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">До</label>
                <select
                  value={toPostArrival}
                  onChange={(e) => {
                    setToPostArrival(e.target.value);
                    setArrivalResult(null);
                  }}
                  disabled={!fromPostArrival}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                >
                  <option value="">Выберите объект</option>
                  {availableToPostsArrival.map(post => (
                    <option key={post.id} value={post.id}>{post.post_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Дата выпуска</label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => {
                    setReleaseDate(e.target.value);
                    setArrivalResult(null);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Время выпуска</label>
                <input
                  type="time"
                  value={releaseTime}
                  onChange={(e) => {
                    setReleaseTime(e.target.value);
                    setArrivalResult(null);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={calculateArrivalTime}
              disabled={!fromPostArrival || !toPostArrival || !releaseDate || !releaseTime}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Рассчитать время прибытия
            </button>

            {arrivalResult && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-3">Прогнозируемое время прибытия:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Минимум:</span>
                    <span className="font-medium text-green-600">{arrivalResult.min}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Среднее:</span>
                    <span className="font-semibold text-blue-600">{arrivalResult.avg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Максимум:</span>
                    <span className="font-medium text-orange-600">{arrivalResult.max}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-slate-600 mb-4">
            Рассчитайте когда нужно выпустить воду, чтобы она прибыла в нужное время
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">От</label>
                <select
                  value={fromPostReverse}
                  onChange={(e) => {
                    setFromPostReverse(e.target.value);
                    setReverseResult(null);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите объект</option>
                  {posts.map(post => (
                    <option key={post.id} value={post.id}>{post.post_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">До</label>
                <select
                  value={toPostReverse}
                  onChange={(e) => {
                    setToPostReverse(e.target.value);
                    setReverseResult(null);
                  }}
                  disabled={!fromPostReverse}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                >
                  <option value="">Выберите объект</option>
                  {availableToPostsReverse.map(post => (
                    <option key={post.id} value={post.id}>{post.post_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Целевая дата</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => {
                    setTargetDate(e.target.value);
                    setReverseResult(null);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Целевое время</label>
                <input
                  type="time"
                  value={targetTime}
                  onChange={(e) => {
                    setTargetTime(e.target.value);
                    setReverseResult(null);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={calculateReverseTime}
              disabled={!fromPostReverse || !toPostReverse || !targetDate || !targetTime}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Рассчитать время выпуска
            </button>

            {reverseResult && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-3">Рекомендуемое время выпуска:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Раннее (для макс. времени):</span>
                    <span className="font-medium text-green-600">{reverseResult.min}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Оптимальное (среднее):</span>
                    <span className="font-semibold text-blue-600">{reverseResult.avg}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Позднее (для мин. времени):</span>
                    <span className="font-medium text-orange-600">{reverseResult.max}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

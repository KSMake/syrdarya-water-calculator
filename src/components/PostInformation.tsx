import { useState } from 'react';
import { Info, MapPin, Waves, Activity, AlertTriangle, X } from 'lucide-react';
import type { RiverPost } from '../types/river';

interface PostInformationProps {
  posts: RiverPost[];
}

export function PostInformation({ posts }: PostInformationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<RiverPost | null>(null);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow flex items-center justify-center gap-2 text-slate-700 hover:text-blue-600"
      >
        <Info className="w-5 h-5" />
        <span className="font-medium">Справочник объектов</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Справочник объектов</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
            className={`text-left p-4 border rounded-lg transition-all ${
              selectedPost?.id === post.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-slate-900">{post.post_name}</h4>
              {post.is_reset_point && (
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              )}
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{post.post_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="w-3 h-3" />
                <span>{post.accumulated_distance_km} км от начала</span>
              </div>
            </div>

            {selectedPost?.id === post.id && (
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-700 mb-1">Расстояние от предыдущего объекта</p>
                  <p className="text-sm text-slate-900">{post.segment_distance_km} км</p>
                </div>

                {post.segment_min_time_hours !== null && post.segment_max_time_hours !== null && (
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1">Время от предыдущего (при 300 м³/с)</p>
                    <p className="text-sm text-slate-900">
                      {post.segment_min_time_hours.toFixed(1)} - {post.segment_max_time_hours.toFixed(1)} ч
                    </p>
                  </div>
                )}

                {post.max_flow_rate && (
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1">
                      <Activity className="w-3 h-3 inline mr-1" />
                      Максимальный пропускной расход
                    </p>
                    <p className="text-sm text-slate-900">{post.max_flow_rate} м³/с</p>
                  </div>
                )}

                {post.is_reset_point && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-xs text-amber-800">
                      <strong>Reset Point:</strong> Время добегания "обнуляется" на данном объекте
                    </p>
                  </div>
                )}

                {post.notes && (
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1">Примечания</p>
                    <p className="text-xs text-slate-600">{post.notes}</p>
                  </div>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="text-sm font-medium text-slate-900 mb-2">Обозначения</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>Тип объекта (водохранилище, ГЭС, створ)</span>
          </div>
          <div className="flex items-center gap-2">
            <Waves className="w-3 h-3" />
            <span>Накопленное расстояние от Токтогула</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            <span>Максимальный пропускной расход</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>Reset Point (точка сброса времени)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

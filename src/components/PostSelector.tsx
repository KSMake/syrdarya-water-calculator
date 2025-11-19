import { ChevronDown } from 'lucide-react';
import type { RiverPost } from '../types/river';

interface PostSelectorProps {
  label: string;
  posts: RiverPost[];
  selectedPost: RiverPost | null;
  onSelect: (post: RiverPost) => void;
  disabled?: boolean;
}

export function PostSelector({ label, posts, selectedPost, onSelect, disabled }: PostSelectorProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={selectedPost?.id || ''}
          onChange={(e) => {
            const post = posts.find(p => p.id === e.target.value);
            if (post) onSelect(post);
          }}
          disabled={disabled}
          className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-4 py-3 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
        >
          <option value="">Выберите объект</option>
          {posts.map(post => (
            <option key={post.id} value={post.id}>
              {post.post_name} ({post.post_type})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>
      {selectedPost && (
        <div className="mt-2 text-xs text-slate-600">
          <p>Расстояние от начала: {selectedPost.accumulated_distance_km} км</p>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PlaySquare, Play, X, Search } from 'lucide-react';
import { fetchVideos } from '../services/api';
import { CardSkeleton } from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import { getYouTubeEmbed } from '../utils/helpers';

const MOCK_VIDEOS = [
  { id: 1, title: 'Perfect Push-Up Form – Full Tutorial', category: 'Upper Body', duration: '8:24', thumbnail: 'https://img.youtube.com/vi/IODxDxX7oi4/hqdefault.jpg', videoId: 'IODxDxX7oi4', difficulty: 'Beginner', muscle: 'Chest, Shoulders, Triceps' },
  { id: 2, title: 'Deadlift Masterclass for Beginners', category: 'Lower Body', duration: '12:15', thumbnail: 'https://img.youtube.com/vi/op9kVnSso6Q/hqdefault.jpg', videoId: 'op9kVnSso6Q', difficulty: 'Intermediate', muscle: 'Hamstrings, Glutes, Lower Back' },
  { id: 3, title: 'Full Body HIIT – No Equipment', category: 'HIIT', duration: '25:00', thumbnail: 'https://img.youtube.com/vi/ml6cT4AZdqI/hqdefault.jpg', videoId: 'ml6cT4AZdqI', difficulty: 'Intermediate', muscle: 'Full Body' },
  { id: 4, title: 'How to Do a Proper Squat', category: 'Lower Body', duration: '6:50', thumbnail: 'https://img.youtube.com/vi/aclHkVaku9U/hqdefault.jpg', videoId: 'aclHkVaku9U', difficulty: 'Beginner', muscle: 'Quads, Glutes, Hamstrings' },
  { id: 5, title: 'Pull-Up Progression – From Zero to Ten', category: 'Upper Body', duration: '10:35', thumbnail: 'https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg', videoId: 'eGo4IYlbE5g', difficulty: 'Intermediate', muscle: 'Back, Biceps' },
  { id: 6, title: '30-Min Morning Yoga Flow', category: 'Yoga', duration: '30:00', thumbnail: 'https://img.youtube.com/vi/v7AYKMP6rOE/hqdefault.jpg', videoId: 'v7AYKMP6rOE', difficulty: 'Beginner', muscle: 'Full Body Flexibility' },
  { id: 7, title: 'Bench Press – Technique & Common Mistakes', category: 'Upper Body', duration: '9:45', thumbnail: 'https://img.youtube.com/vi/rT7DgCr-3pg/hqdefault.jpg', videoId: 'rT7DgCr-3pg', difficulty: 'Intermediate', muscle: 'Chest, Triceps, Shoulders' },
  { id: 8, title: 'Core & Abs – 15-Min Workout', category: 'Core', duration: '15:00', thumbnail: 'https://img.youtube.com/vi/DHD1-2P94DI/hqdefault.jpg', videoId: 'DHD1-2P94DI', difficulty: 'Beginner', muscle: 'Core, Abs' },
  { id: 9, title: 'Running Form Correction for Speed', category: 'Cardio', duration: '7:20', thumbnail: 'https://img.youtube.com/vi/wCVSv7UxB2E/hqdefault.jpg', videoId: 'wCVSv7UxB2E', difficulty: 'All Levels', muscle: 'Full Body' },
];

const CATEGORIES = ['All', 'Upper Body', 'Lower Body', 'Core', 'HIIT', 'Yoga', 'Cardio'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const DIFF_COLORS = {
  Beginner:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Advanced:     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'All Levels': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

function VideoCard({ video, onPlay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
        {/* Play button */}
        <button
          onClick={() => onPlay(video)}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-white/90 dark:bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <Play className="w-5 h-5 text-green-600 fill-green-600 ml-0.5" />
          </motion.div>
        </button>
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded-md font-medium">
          {video.duration}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
            {video.title}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
            {video.category}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIFF_COLORS[video.difficulty] || DIFF_COLORS['All Levels']}`}>
            {video.difficulty}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">🎯 {video.muscle}</p>
      </div>
    </motion.div>
  );
}

function VideoModal({ video, onClose }) {
  if (!video) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-gray-950 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-900">
          <div>
            <h3 className="text-base font-bold text-white">{video.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{video.category} · {video.difficulty} · {video.duration}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {/* Video */}
        <div className="aspect-video bg-black">
          <iframe
            width="100%"
            height="100%"
            src={getYouTubeEmbed(video.videoId) + '?autoplay=1&rel=0'}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DemosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchVideos(search);
      setVideos(res.data || MOCK_VIDEOS);
    } catch {
      setVideos(MOCK_VIDEOS);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { setVideos(MOCK_VIDEOS); setLoading(false); }, []);

  const filtered = videos.filter((v) => {
    const matchCat  = category === 'All'   || v.category   === category;
    const matchDiff = difficulty === 'All' || v.difficulty === difficulty;
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) ||
                        v.muscle.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchDiff && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exercise Demos</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Learn proper form and technique with expert video guides.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-7">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search exercises…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all dark:text-gray-100"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 dark:text-gray-100"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 dark:text-gray-100"
          >
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        {loading ? 'Loading…' : `${filtered.length} video${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorDisplay message={error} onRetry={loadVideos} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
          <PlaySquare className="w-10 h-10" />
          <p>No videos match your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} onPlay={setActiveVideo} />
          ))}
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}

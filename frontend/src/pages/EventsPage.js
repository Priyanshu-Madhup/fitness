import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Users, ExternalLink, Search } from 'lucide-react';
import { fetchEvents } from '../services/api';
import { CardSkeleton } from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import { formatDate } from '../utils/helpers';

const MOCK_EVENTS = [
  { id: 1, title: '5K Community Run', date: '2026-04-05', time: '7:00 AM', location: 'Central Park, NY', category: 'Running', attendees: 320, description: 'Join hundreds of runners for a fun community 5K run through Central Park. All fitness levels welcome!', image: '' },
  { id: 2, title: 'CrossFit Open Qualifier', date: '2026-04-12', time: '9:00 AM', location: 'Iron Forge Gym, NY', category: 'CrossFit', attendees: 150, description: 'Test your fitness in this regional CrossFit Open qualifier event. Cash prizes for top finishers.', image: '' },
  { id: 3, title: 'Yoga in the Park', date: '2026-04-19', time: '8:30 AM', location: 'Riverside Park, NY', category: 'Yoga', attendees: 80, description: 'A free outdoor yoga session suitable for all levels. Bring your mat and enjoy a morning of mindful movement.', image: '' },
  { id: 4, title: 'Nutrition Workshop', date: '2026-04-26', time: '2:00 PM', location: 'FitZone Pro Gym', category: 'Education', attendees: 60, description: 'Learn from certified nutritionists how to fuel your body for optimal performance and recovery.', image: '' },
  { id: 5, title: 'Powerlifting Meet', date: '2026-05-03', time: '10:00 AM', location: 'Barbell Club, Brooklyn', category: 'Strength', attendees: 90, description: 'Amateur and experienced lifters compete across three weight categories. Spectators welcome!', image: '' },
  { id: 6, title: 'Half Marathon Training Camp', date: '2026-05-10', time: '6:00 AM', location: 'Hudson River Trail', category: 'Running', attendees: 200, description: '3-day intensive training camp to help you prepare for your first or next half marathon.', image: '' },
];

const CATEGORIES = ['All', 'Running', 'CrossFit', 'Yoga', 'Education', 'Strength'];

const CATEGORY_COLORS = {
  Running:   'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  CrossFit:  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  Yoga:      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Education: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  Strength:  'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

// Gradient backgrounds for event cards when no image
const GRADIENTS = [
  'from-green-400 to-emerald-600',
  'from-blue-400 to-indigo-600',
  'from-purple-400 to-pink-600',
  'from-yellow-400 to-orange-500',
  'from-red-400 to-pink-500',
  'from-teal-400 to-cyan-600',
];

function EventCard({ event, index }) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
    >
      {/* Image / Gradient header */}
      <div className={`h-32 bg-gradient-to-br ${gradient} relative flex items-end p-4`}>
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[event.category] || 'bg-gray-100 text-gray-600'}`}>
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-green-500" />
            <span>{formatDate(event.date)} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-green-500" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-green-500" />
            <span>{event.attendees} attending</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold text-sm rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
          Register <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchEvents();
      setEvents(res.data || MOCK_EVENTS);
    } catch {
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const filtered = events.filter((e) => {
    const matchCat = category === 'All' || e.category === category;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Fitness Events</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Discover local and virtual fitness events near you.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-7"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all dark:text-gray-100"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-green-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        {loading ? 'Loading events…' : `${filtered.length} event${filtered.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorDisplay message={error} onRetry={loadEvents} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
          <CalendarDays className="w-10 h-10" />
          <p>No events match your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

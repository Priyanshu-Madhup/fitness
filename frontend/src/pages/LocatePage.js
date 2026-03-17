import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star, Phone, Clock, Search } from 'lucide-react';
import { fetchGyms } from '../services/api';
import { Spinner, CardSkeleton } from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import { useToast } from '../context/ToastContext';

// Mock data shown when API is unavailable
const MOCK_GYMS = [
  { id: 1, name: 'FitZone Pro Gym', address: '123 Main St, Downtown', distance: '0.8 km', rating: 4.8, reviews: 342, phone: '+1 555-0101', hours: 'Open 24/7', type: 'gym', lat: 40.712, lng: -74.006 },
  { id: 2, name: 'Central Park Fitness Area', address: 'Central Park, North Loop', distance: '1.2 km', rating: 4.6, reviews: 220, hours: '6AM–10PM', type: 'park', lat: 40.785, lng: -73.968 },
  { id: 3, name: 'Iron Forge Gym', address: '456 Elm Ave, Midtown', distance: '1.5 km', rating: 4.7, reviews: 198, phone: '+1 555-0202', hours: 'Mon–Sun 5AM–11PM', type: 'gym', lat: 40.754, lng: -73.984 },
  { id: 4, name: 'Riverside Park Trail', address: 'Riverside Dr & 72nd St', distance: '2.1 km', rating: 4.5, reviews: 156, hours: 'Always Open', type: 'park', lat: 40.777, lng: -73.989 },
  { id: 5, name: 'PureFlow Yoga & Fitness', address: '789 Oak Blvd, Upper East', distance: '2.8 km', rating: 4.9, reviews: 412, phone: '+1 555-0303', hours: 'Mon–Sat 6AM–9PM', type: 'gym', lat: 40.773, lng: -73.958 },
];

function GymCard({ gym, active, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        active
          ? 'border-green-400 bg-green-50 dark:bg-green-900/20 shadow-md'
          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-green-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              gym.type === 'gym'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {gym.type === 'gym' ? '🏋️ Gym' : '🌳 Park'}
            </span>
            <span className="text-xs text-gray-400">{gym.distance}</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
            {gym.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{gym.rating}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{gym.address}</span>
        </div>
        {gym.hours && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{gym.hours}</span>
          </div>
        )}
        {gym.phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{gym.phone}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Simple SVG-based map placeholder with gym pins
function MapPlaceholder({ gyms, activeGym }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden flex items-center justify-center">
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Map style roads */}
      <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" viewBox="0 0 600 400">
        <line x1="0" y1="200" x2="600" y2="200" stroke="#22c55e" strokeWidth="3" />
        <line x1="300" y1="0" x2="300" y2="400" stroke="#22c55e" strokeWidth="3" />
        <line x1="0" y1="100" x2="600" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="0" y1="300" x2="600" y2="300" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="150" y1="0" x2="150" y2="400" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="450" y1="0" x2="450" y2="400" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="300" cy="200" r="30" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2" />
      </svg>

      {/* Pins */}
      {gyms.map((gym, i) => {
        // Scatter pins across the placeholder
        const positions = [
          { x: '45%', y: '40%' },
          { x: '60%', y: '55%' },
          { x: '35%', y: '60%' },
          { x: '55%', y: '30%' },
          { x: '70%', y: '45%' },
        ];
        const pos = positions[i % positions.length];
        const isActive = activeGym?.id === gym.id;
        return (
          <div
            key={gym.id}
            style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -100%)' }}
            className="absolute"
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex flex-col items-center cursor-pointer`}
            >
              <div className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-md mb-1 ${
                isActive ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}>
                {gym.name.split(' ')[0]}
              </div>
              <MapPin className={`w-6 h-6 drop-shadow-md ${isActive ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`} />
            </motion.div>
          </div>
        );
      })}

      {/* Your location */}
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg"
        />
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-400/20 rounded-full border border-blue-300/40 animate-ping" />
      </div>

      <p className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/70 dark:bg-gray-900/70 px-2 py-1 rounded-lg">
        Map placeholder · Connect TomTom/Google Maps API
      </p>
    </div>
  );
}

export default function LocatePage() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeGym, setActiveGym] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const { addToast } = useToast();

  const loadGyms = async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchGyms(lat, lng);
      setGyms(res.data || MOCK_GYMS);
    } catch {
      // Fall back to mock data gracefully
      setGyms(MOCK_GYMS);
    } finally {
      setLoading(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        loadGyms(coords.latitude, coords.longitude);
        setLocationLoading(false);
        addToast('Location detected!', 'success');
      },
      () => {
        setLocationLoading(false);
        loadGyms(40.712, -74.006); // fallback
        addToast('Could not get precise location – showing nearby results', 'warning');
      }
    );
  };

  // Load on mount with mock data
  useEffect(() => { setGyms(MOCK_GYMS); }, []);

  const filtered = gyms.filter((g) => {
    const matchType = filter === 'all' || g.type === filter;
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
                        g.address.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Locate Gyms & Parks</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Find fitness facilities near you.
          </p>
        </div>
        <button
          onClick={handleLocate}
          disabled={locationLoading}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          {locationLoading ? <Spinner size="sm" /> : <Navigation className="w-4 h-4" />}
          Use My Location
        </button>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6 h-[70vh]">
        {/* Sidebar list */}
        <div className="lg:col-span-2 flex flex-col gap-3 overflow-hidden">
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition-all dark:text-gray-100"
            >
              <option value="all">All</option>
              <option value="gym">Gyms</option>
              <option value="park">Parks</option>
            </select>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            ) : error ? (
              <ErrorDisplay message={error} onRetry={() => loadGyms(40.712, -74.006)} />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400">
                <MapPin className="w-8 h-8" />
                <p className="text-sm">No results found</p>
              </div>
            ) : (
              filtered.map((gym) => (
                <GymCard
                  key={gym.id}
                  gym={gym}
                  active={activeGym?.id === gym.id}
                  onClick={() => setActiveGym(gym)}
                />
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <MapPlaceholder gyms={filtered} activeGym={activeGym} />
        </div>
      </div>

      {/* Active gym detail */}
      {activeGym && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-5 bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{activeGym.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{activeGym.address}</p>
          </div>
          <div className="flex gap-3">
            {activeGym.phone && (
              <a
                href={`tel:${activeGym.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
            )}
            <a
              href={`https://maps.google.com/?q=${activeGym.lat},${activeGym.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-4"
            >
              <Navigation className="w-4 h-4" /> Directions
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}

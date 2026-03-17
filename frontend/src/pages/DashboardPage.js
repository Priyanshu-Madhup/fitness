import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Flame, Target, Dumbbell, CalendarCheck, Zap, MessageSquare,
  MapPin, PlaySquare, TrendingUp, Clock,
} from 'lucide-react';
import { StatCard } from '../components/Card';
import Button from '../components/Button';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden:   { opacity: 0, y: 16 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const QUICK_ACTIONS = [
  { to: '/generate',  label: 'Generate Plan',  icon: Zap,          color: 'green' },
  { to: '/chat',      label: 'Ask AI',          icon: MessageSquare, color: 'blue' },
  { to: '/locate',    label: 'Find Gym',        icon: MapPin,        color: 'purple' },
  { to: '/demos',     label: 'Watch Demos',     icon: PlaySquare,    color: 'orange' },
];

const QUICK_ACTION_COLORS = {
  green:  'bg-green-50 text-green-700 border-green-100 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50',
  blue:   'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50',
  purple: 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50',
  orange: 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50',
};

// Mock recent activity
const ACTIVITY = [
  { label: 'Completed Upper Body Workout',  time: '2 hours ago',  icon: Dumbbell },
  { label: '30-min run – 4 km',             time: 'Yesterday',    icon: TrendingUp },
  { label: 'AI Chat – Nutrition tips',      time: '2 days ago',   icon: MessageSquare },
  { label: 'Generated new 4-week plan',     time: '3 days ago',   icon: Zap },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Good morning 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's your fitness overview for today.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={Flame}
            label="Current Streak"
            value="12 days"
            trend={{ up: true, label: '+3 from last week' }}
            color="orange"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={Target}
            label="Calories Burned"
            value="2,340 kcal"
            trend={{ up: true, label: '+8% this week' }}
            color="green"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={Dumbbell}
            label="Workouts Done"
            value="28"
            trend={{ up: true, label: '+5 this month' }}
            color="blue"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={CalendarCheck}
            label="Plan Progress"
            value="65%"
            trend={{ up: true, label: 'On track' }}
            color="purple"
          />
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Current Plan</h2>
              <Link to="/generate">
                <Button variant="ghost" size="sm">View full plan →</Button>
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { day: 'Mon', focus: 'Upper Body Strength',   done: true },
                { day: 'Tue', focus: 'Cardio + Core',          done: true },
                { day: 'Wed', focus: 'Rest & Recovery',        done: false },
                { day: 'Thu', focus: 'Lower Body Power',       done: false },
                { day: 'Fri', focus: 'Full Body HIIT',         done: false },
              ].map(({ day, focus, done }) => (
                <div
                  key={day}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                    done
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <span className={`text-sm font-semibold w-8 ${done ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                    {day}
                  </span>
                  <span className={`text-sm flex-1 ${done ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    {focus}
                  </span>
                  {done && (
                    <span className="text-xs font-medium px-2 py-0.5 bg-green-500 text-white rounded-full">
                      Done
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-5">Recent Activity</h2>
            <div className="space-y-4">
              {ACTIVITY.map(({ label, time, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{label}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ to, label, icon: Icon, color }) => (
                <Link key={to} to={to}>
                  <div
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-colors cursor-pointer ${QUICK_ACTION_COLORS[color]}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Today's Tip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 opacity-80" />
              <span className="text-sm font-semibold opacity-80">Today's Tip</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Aim for 150–300 minutes of moderate aerobic activity per week. Consistency beats
              intensity for long-term results.
            </p>
            <Link to="/chat">
              <button className="mt-4 text-xs font-semibold underline underline-offset-2 opacity-80 hover:opacity-100">
                Ask AI for more tips →
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

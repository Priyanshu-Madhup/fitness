import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Zap, MessageSquare, MapPin,
  CalendarDays, PlaySquare, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const LINKS = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/generate',   label: 'Generate',   icon: Zap },
  { to: '/chat',       label: 'AI Chat',    icon: MessageSquare },
  { to: '/locate',     label: 'Locate',     icon: MapPin },
  { to: '/events',     label: 'Events',     icon: CalendarDays },
  { to: '/demos',      label: 'Demos',      icon: PlaySquare },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 py-6 flex-shrink-0 overflow-hidden"
    >
      {/* Collapse button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute top-6 right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle sidebar"
      >
        {collapsed
          ? <ChevronRight className="w-4 h-4 text-gray-400" />
          : <ChevronLeft className="w-4 h-4 text-gray-400" />}
      </button>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 mt-8 flex-1">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
              ${isActive(to)
                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
              }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3">
        <Link
          to="/settings"
          title={collapsed ? 'Settings' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800/60 dark:hover:text-gray-200 transition-colors"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Settings</span>}
        </Link>
      </div>
    </motion.aside>
  );
}

import { motion } from 'framer-motion';

/**
 * Card – base container component.
 * Props: className, children, animate (bool), onClick
 */
export default function Card({ children, className = '', animate = true, onClick }) {
  const base =
    'bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-200';

  if (!animate) {
    return (
      <div className={`${base} ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      className={`${base} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/**
 * StatCard – quick metric display.
 */
export function StatCard({ icon: Icon, label, value, trend, color = 'green', className = '' }) {
  const colorMap = {
    green:  'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
    blue:   'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
    red:    'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend.up ? 'text-green-500' : 'text-red-400'}`}>
              {trend.up ? '↑' : '↓'} {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}

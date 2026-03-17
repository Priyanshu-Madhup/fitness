import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorDisplay({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center gap-4 p-8 text-center ${className}`}
    >
      <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-red-500" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
        {message && <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>}
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" leftIcon={RefreshCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </motion.div>
  );
}

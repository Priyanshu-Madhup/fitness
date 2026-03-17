import { motion } from 'framer-motion';

/**
 * Button variants: primary | secondary | ghost | danger
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    primary:
      'bg-green-500 text-white shadow-md hover:bg-green-600 focus-visible:ring-green-400 dark:bg-green-600 dark:hover:bg-green-500',
    secondary:
      'bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700',
    ghost:
      'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
    danger:
      'bg-red-500 text-white shadow-md hover:bg-red-600 focus-visible:ring-red-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileTap={!isDisabled ? { scale: 0.96 } : undefined}
      className={`${base} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4 flex-shrink-0" />
      )}
      {children}
      {!loading && RightIcon && <RightIcon className="w-4 h-4 flex-shrink-0" />}
    </motion.button>
  );
}

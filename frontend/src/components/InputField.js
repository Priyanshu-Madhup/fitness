import { forwardRef } from 'react';

/**
 * Input – base text input with label and error state.
 */
export const Input = forwardRef(function Input(
  { label, error, hint, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 text-sm
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent
          transition-all duration-200
          dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
          ${error
            ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
            : 'border-gray-200 focus:ring-green-400 dark:border-gray-700'
          }
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
});

/**
 * Select – base select with label.
 */
export function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 text-sm
          focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200
          dark:bg-gray-800 dark:text-gray-100
          ${error
            ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
            : 'border-gray-200 focus:ring-green-400 dark:border-gray-700'
          }
          ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Textarea
 */
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        rows={4}
        className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 text-sm resize-none
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent
          transition-all duration-200
          dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
          ${error
            ? 'border-red-400 focus:ring-red-400 dark:border-red-500'
            : 'border-gray-200 focus:ring-green-400 dark:border-gray-700'
          }
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

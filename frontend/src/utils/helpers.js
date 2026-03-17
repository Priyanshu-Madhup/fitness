/**
 * Format a JS Date object to a readable string.
 */
export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));

/**
 * Capitalise the first letter of a string.
 */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Truncate a string to `max` characters.
 */
export const truncate = (str = '', max = 80) =>
  str.length > max ? str.slice(0, max) + '…' : str;

/**
 * Clamp a number between min and max.
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * Sleep for `ms` milliseconds.
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a unique ID string.
 */
export const uid = () => Math.random().toString(36).slice(2, 9);

/**
 * Get YouTube embed URL from a regular URL or video ID.
 */
export const getYouTubeEmbed = (urlOrId) => {
  const match = urlOrId.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  const id = match ? match[1] : urlOrId;
  return `https://www.youtube.com/embed/${id}`;
};

/**
 * Format a number with K/M suffixes.
 */
export const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return String(num);
};

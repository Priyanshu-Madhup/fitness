import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { DotsLoader } from './Loader';

/**
 * Individual chat message bubble.
 */
export function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm
          ${isUser
            ? 'bg-green-500 text-white'
            : 'bg-gray-800 dark:bg-gray-700 text-white'
          }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isUser
            ? 'bg-green-500 text-white rounded-br-sm'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-sm'
          }`}
      >
        {message.content}
        <span
          className={`block text-[10px] mt-1 opacity-60 ${isUser ? 'text-right' : ''}`}
        >
          {message.time || ''}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Typing indicator shown while AI is responding.
 */
export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
        <Bot className="w-4 h-4" />
      </div>
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-sm shadow-sm">
        <DotsLoader />
      </div>
    </div>
  );
}

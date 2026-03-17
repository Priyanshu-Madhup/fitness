import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Trash2, Copy, Check } from 'lucide-react';
import { ChatBubble, TypingIndicator } from '../components/ChatBubble';
import { sendChatMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { uid } from '../utils/helpers';

const SUGGESTED_PROMPTS = [
  'What should I eat before a workout?',
  'Create a 5-day workout split for muscle gain',
  'How do I reduce belly fat effectively?',
  'What are the best stretches for lower back pain?',
  'How much protein do I need per day?',
];

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: uid(),
      role: 'assistant',
      content: "Hi! I'm your FitAI assistant 💪 Ask me anything about fitness, nutrition, workouts, recovery, and more. How can I help you today?",
      time: formatTime(new Date()),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const userMsg = { id: uid(), role: 'user', content: msg, time: formatTime(new Date()) };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setTyping(true);

    try {
      const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }));
      const res = await sendChatMessage(apiMessages);
      const reply = res.data?.reply || res.data?.message || res.data?.content || 'Sorry, I could not process that.';
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'assistant', content: reply, time: formatTime(new Date()) },
      ]);
    } catch (err) {
      addToast(err.message || 'Failed to get response', 'error');
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check your internet or try again later.",
          time: formatTime(new Date()),
        },
      ]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: uid(),
        role: 'assistant',
        content: "Chat cleared! How can I help you today?",
        time: formatTime(new Date()),
      },
    ]);
  };

  const copyMessage = (id, content) => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-800 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">FitAI Chat</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">AI Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className="group relative">
            <ChatBubble message={msg} />
            {/* Copy button on hover */}
            <button
              onClick={() => copyMessage(msg.id, msg.content)}
              className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 ${
                msg.role === 'user' ? 'left-0' : 'right-0'
              }`}
              title="Copy"
            >
              {copiedId === msg.id
                ? <Check className="w-3 h-3 text-green-500" />
                : <Copy className="w-3 h-3" />}
            </button>
          </div>
        ))}
        {typing && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="flex-shrink-0 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 transition-colors whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-3 flex gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-sm"
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about fitness…"
          className="flex-1 resize-none bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none px-3 py-2 max-h-32 leading-relaxed"
          style={{ minHeight: '40px' }}
          disabled={typing}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || typing}
          className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-end"
        >
          <Send className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}

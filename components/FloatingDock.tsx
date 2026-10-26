'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingDock() {
  const [hovered, setHovered] = useState<'zalo' | 'tele' | null>(null);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 items-end">
      {/* Zalo Button */}
      <div className="relative flex items-center justify-end">
        <AnimatePresence>
          {hovered === 'zalo' && (
            <motion.span
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="absolute right-14 bg-[#1e293b] text-[#f1f5f9] text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 shadow-xl shadow-black/40 whitespace-nowrap"
            >
              Chat Zalo 0963.973.205
            </motion.span>
          )}
        </AnimatePresence>
        <motion.a
          href="https://zalo.me/0963973205"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered('zalo')}
          onMouseLeave={() => setHovered(null)}
          aria-label="Chat Zalo"
          whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="w-13 h-13 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-emerald-500/30 border border-emerald-400/40 cursor-pointer"
        >
          Z
        </motion.a>
      </div>

      {/* Telegram Button */}
      <div className="relative flex items-center justify-end">
        <AnimatePresence>
          {hovered === 'tele' && (
            <motion.span
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="absolute right-14 bg-[#1e293b] text-[#f1f5f9] text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 shadow-xl shadow-black/40 whitespace-nowrap"
            >
              Telegram @Danggvuu_bot (Cấp 30s)
            </motion.span>
          )}
        </AnimatePresence>
        <motion.a
          href="https://t.me/Danggvuu_bot"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered('tele')}
          onMouseLeave={() => setHovered(null)}
          aria-label="Telegram Bot"
          whileHover={{ scale: 1.15, rotate: [0, 5, -5, 0] }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="w-13 h-13 rounded-2xl bg-[#2AABEE] flex items-center justify-center text-white shadow-xl shadow-[#2AABEE]/30 border border-[#2AABEE]/40 cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </motion.a>
      </div>
    </div>
  );
}

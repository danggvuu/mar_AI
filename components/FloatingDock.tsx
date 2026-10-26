'use client';

import { useState } from 'react';

export default function FloatingDock() {
  const [hoveredZalo, setHoveredZalo] = useState(false);
  const [hoveredTelegram, setHoveredTelegram] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Zalo */}
      <div className="relative flex items-center justify-end">
        {hoveredZalo && (
          <span className="absolute right-14 bg-[#1e293b] text-[#f1f5f9] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#334155] shadow-lg whitespace-nowrap">
            Chat Zalo
          </span>
        )}
        <a
          href="https://zalo.me/0963973205"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredZalo(true)}
          onMouseLeave={() => setHoveredZalo(false)}
          aria-label="Chat Zalo"
          style={{
            transform: hoveredZalo ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 0.2s ease',
          }}
          className="w-12 h-12 rounded-full bg-[#00b2ff] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#00b2ff]/30 hover:shadow-[#00b2ff]/50"
        >
          Z
        </a>
      </div>

      {/* Telegram */}
      <div className="relative flex items-center justify-end">
        {hoveredTelegram && (
          <span className="absolute right-14 bg-[#1e293b] text-[#f1f5f9] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#334155] shadow-lg whitespace-nowrap">
            Telegram
          </span>
        )}
        <a
          href="https://t.me/Danggvuu_bot"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredTelegram(true)}
          onMouseLeave={() => setHoveredTelegram(false)}
          aria-label="Telegram"
          style={{
            transform: hoveredTelegram ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 0.2s ease',
          }}
          className="w-12 h-12 rounded-full bg-[#2AABEE] flex items-center justify-center text-white shadow-lg shadow-[#2AABEE]/30 hover:shadow-[#2AABEE]/50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

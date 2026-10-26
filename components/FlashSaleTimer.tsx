'use client';

import { useState, useEffect } from 'react';

interface FlashSaleTimerProps {
  initialHours?: number;
}

export default function FlashSaleTimer({ initialHours = 8 }: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: initialHours,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // End time based on initial hours
    const targetTime = Date.now() + initialHours * 3600 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [initialHours]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-orange-400 font-semibold flex items-center gap-1">
        <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
        Kết thúc sau
      </span>
      <div className="flex items-center gap-1 font-mono text-sm font-bold">
        <span className="bg-[#0f172a] text-[#ee8722] px-2 py-0.5 rounded border border-[#334155]">
          {pad(timeLeft.hours)}
        </span>
        <span className="text-orange-400">:</span>
        <span className="bg-[#0f172a] text-[#ee8722] px-2 py-0.5 rounded border border-[#334155]">
          {pad(timeLeft.minutes)}
        </span>
        <span className="text-orange-400">:</span>
        <span className="bg-[#0f172a] text-[#ee8722] px-2 py-0.5 rounded border border-[#334155]">
          {pad(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'motion/react';

export default function AnimateBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Ambient glowing gradient orb 1 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#ee8722]/30 to-amber-500/20 blur-[130px]"
      />

      {/* Ambient glowing gradient orb 2 */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-[30%] -right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-blue-600/20 to-purple-600/15 blur-[120px]"
      />
    </div>
  );
}

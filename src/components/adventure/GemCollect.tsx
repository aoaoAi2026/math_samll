import { useEffect, useRef } from 'react';

interface GemCollectProps {
  count: number;
  onDone?: () => void;
}

/**
 * 宝石收集动画 —— 答对通关时撒宝石
 */
export default function GemCollect({ count, onDone }: GemCollectProps) {
  const gems = useRef<{ id: number; x: number; rot: number; delay: number; size: number; color: string }[]>([]);

  useEffect(() => {
    const colors = ['#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6', '#22c55e', '#ef4444', '#f97316'];
    gems.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 200,
      rot: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.6,
      size: 16 + Math.random() * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const timer = setTimeout(() => onDone?.(), 2500);
    return () => clearTimeout(timer);
  }, [count, onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {gems.current.map((gem) => (
        <div
          key={gem.id}
          className="absolute top-1/2 left-1/2"
          style={{
            animation: `gemDrop 1.5s ease-out ${gem.delay}s forwards`,
            fontSize: `${gem.size}px`,
            transform: 'translate(-50%, -50%)',
            '--x': `${gem.x}px`,
            '--rot': `${gem.rot}deg`,
          } as React.CSSProperties}
        >
          💎
        </div>
      ))}
      <style>{`
        @keyframes gemDrop {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5) rotate(0deg); }
          30% { opacity: 1; transform: translate(calc(-50% + var(--x)), calc(-50% + -80px)) scale(1.2) rotate(calc(var(--rot) * 0.3)); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--x)), calc(-50% + 300px)) scale(0.2) rotate(var(--rot)); }
        }
      `}</style>
    </div>
  );
}

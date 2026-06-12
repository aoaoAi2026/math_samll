import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  speedX: number;
  speedY: number;
  drift: number;
  life: number;
  shape: 'circle' | 'star' | 'square';
}

const COLORS = [
  '#fbbf24', '#f97316', '#ef4444', '#ec4899',
  '#a855f7', '#3b82f6', '#22c55e', '#14b8a6',
];
const SHAPES: Particle['shape'][] = ['circle', 'star', 'square'];

interface Props {
  onDone: () => void;
  count?: number;
  duration?: number;
}

export default function ConfettiEffect({ onDone, count = 40, duration = 2200 }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const side = Math.random() > 0.5 ? 'left' : 'right';
      const xBase = side === 'left' ? 30 : 70;
      newParticles.push({
        id: i,
        x: xBase + (Math.random() - 0.5) * 20,
        y: 30 + Math.random() * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 10,
        rotation: Math.random() * 360,
        speedX: (side === 'left' ? 1 : -1) * (4 + Math.random() * 8),
        speedY: -(2 + Math.random() * 6),
        drift: (Math.random() - 0.5) * 2,
        life: 0.6 + Math.random() * 0.4,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      });
    }
    setParticles(newParticles);

    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [count, duration, onDone]);

  const renderShape = (shape: Particle['shape'], size: number) => {
    if (shape === 'star') return '⭐';
    if (shape === 'square') {
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: 3,
            transform: 'rotate(45deg)',
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-[confettiFall_linear_forwards]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            // @ts-ignore - CSS custom properties for animation
            '--tx': `${p.speedX * 15}%`,
            '--ty': `${80 + Math.random() * 20}vh`,
            '--rot': `${p.rotation + (p.speedX > 0 ? 720 : -720)}deg`,
            '--drift': `${p.drift * 30}%`,
            animationDuration: `${p.life * 1.8}s`,
            animationDelay: `${Math.random() * 0.3}s`,
          } as React.CSSProperties}
        >
          {p.shape === 'star' ? (
            <span className="text-lg leading-none block">{renderShape(p.shape, p.size)}</span>
          ) : p.shape === 'square' ? (
            <div
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: 3,
                transform: 'rotate(45deg)',
              }}
            />
          ) : (
            <div
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: '50%',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

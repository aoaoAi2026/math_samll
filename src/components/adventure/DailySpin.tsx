/**
 * 每日幸运转盘 —— 每天一次，让小朋友有理由打开App
 */
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { SPIN_PRIZES } from '@/data/adventure/items';
import { useAdventureStore } from '@/store/adventureStore';
import type { SpinPrize } from '@/data/adventure/items';

interface DailySpinProps {
  onClose: () => void;
}

// 色带
const SEGMENT_COLORS = [
  '#f59e0b', '#3b82f6', '#22c55e', '#ec4899',
  '#8b5cf6', '#ef4444', '#06b6d4', '#f97316',
];

export default function DailySpin({ onClose }: DailySpinProps) {
  const { spinWheel, hasSpunToday } = useAdventureStore();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<SpinPrize | null>(null);
  const [rotation, setRotation] = useState(0);

  const alreadySpun = hasSpunToday();

  const spin = () => {
    if (spinning || alreadySpun) return;
    setSpinning(true);
    setResult(null);

    // 旋转5-8圈 + 随机偏移
    const extraRotation = 5 * 360 + Math.random() * 360;
    setRotation(prev => prev + extraRotation);

    setTimeout(() => {
      const prize = spinWheel();
      setResult(prize);
      setSpinning(false);
    }, 2500);
  };

  // 指针指向位置对应奖品（实际由store随机决定，这里只是视觉效果）
  const segments = SPIN_PRIZES;
  const segAngle = 360 / segments.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 60 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-gradient-to-b from-slate-800 to-indigo-950 rounded-3xl p-6 max-w-sm w-full border border-white/20 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white">每日幸运转盘</h2>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs text-white/50">
            {alreadySpun ? '今天已经转过啦，明天再来！' : '每天可以转一次，试试手气！'}
          </p>
        </div>

        {/* 转盘 */}
        <div className="relative mx-auto mb-6" style={{ width: 260, height: 260 }}>
          {/* 指针 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-amber-400 drop-shadow-lg" />
          </div>
          {/* SVG转盘 */}
          <svg viewBox="0 0 260 260" className="w-full h-full -rotate-90">
            <motion.g
              animate={{ rotate: rotation }}
              transition={{ duration: spinning ? 2.5 : 0, ease: 'easeOut' }}
              style={{ transformOrigin: '130px 130px' }}
            >
              {segments.map((seg, i) => {
                const startAngle = i * segAngle;
                const endAngle = (i + 1) * segAngle;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                const r = 125;
                const cx = 130, cy = 130;
                const x1 = cx + r * Math.cos(startRad);
                const y1 = cy + r * Math.sin(startRad);
                const x2 = cx + r * Math.cos(endRad);
                const y2 = cy + r * Math.sin(endRad);
                const largeArc = segAngle > 180 ? 1 : 0;
                const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;

                const midAngle = startAngle + segAngle / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textR = r * 0.65;
                const tx = cx + textR * Math.cos(midRad);
                const ty = cy + textR * Math.sin(midRad);

                return (
                  <g key={i}>
                    <path d={d} fill={SEGMENT_COLORS[i]} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                    <text
                      x={tx} y={ty}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="18"
                      transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                      className="pointer-events-none select-none drop-shadow"
                    >
                      {seg.emoji}
                    </text>
                  </g>
                );
              })}
            </motion.g>
            {/* 中心 */}
            <circle cx={130} cy={130} r={22} fill="#1e293b" stroke="white" strokeWidth={3} />
            <text x={130} y={130} textAnchor="middle" dominantBaseline="central" fontSize="16" className="font-black fill-white select-none">
              🎰
            </text>
          </svg>
        </div>

        {/* 转盘按钮 / 结果 */}
        {result ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="text-center bg-amber-500/20 rounded-2xl p-4 border border-amber-400/30"
          >
            <div className="text-4xl mb-2">{result.emoji}</div>
            <div className="text-xl font-black text-amber-300">
              {result.itemId ? `获得 ${result.label}！` : `获得 ${result.label}！`}
            </div>
            <div className="text-xs text-amber-400/70 mt-1">
              {result.itemId ? '已放入背包，关卡中可以使用哦～' : '宝石已自动存入'}
            </div>
            <button
              onClick={onClose}
              className="mt-3 px-6 py-2 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-400 transition-colors"
            >
              知道了！
            </button>
          </motion.div>
        ) : (
          <motion.button
            whileHover={!spinning && !alreadySpun ? { scale: 1.05 } : {}}
            whileTap={!spinning && !alreadySpun ? { scale: 0.95 } : {}}
            onClick={spin}
            disabled={spinning || alreadySpun}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all ${
              alreadySpun
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : spinning
                  ? 'bg-amber-600 text-amber-200 cursor-wait'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400'
            }`}
          >
            {alreadySpun ? '✅ 今天已转' : spinning ? '🌀 转动中...' : '🎰 免费转动！'}
          </motion.button>
        )}

        {/* 物品说明 */}
        <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
          {segments.slice(0, 4).map((s, i) => (
            <span key={i} className="text-[10px] bg-white/10 rounded-full px-2 py-0.5 text-white/60">
              {s.emoji} {s.label}
            </span>
          ))}
        </div>

        {/* 关闭 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}

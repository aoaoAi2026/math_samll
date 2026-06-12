/**
 * 宝箱结算动画 —— 把枯燥的统计面板变成惊喜开箱
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Gem, Sparkles } from 'lucide-react';

interface TreasureChestProps {
  stars: number;           // 1-3
  gems: number;
  items?: string[];        // 额外获得的物品emoji
  isFirstClear: boolean;
  onOpen: () => void;
}

const CHEST_TIERS = [
  { min: 0, label: '木箱', emoji: '📦', color: '#a68a64' },
  { min: 1, label: '铜箱', emoji: '🧰', color: '#cd7f32' },
  { min: 2, label: '银箱', emoji: '🧳', color: '#c0c0c0' },
  { min: 3, label: '金箱', emoji: '🎁', color: '#ffd700' },
];

export default function TreasureChest({ stars, gems, items, isFirstClear, onOpen }: TreasureChestProps) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed');
  const tier = CHEST_TIERS[Math.min(stars, 3)];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('opening'), 600);
    const t2 = setTimeout(() => setPhase('open'), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="text-center"
      style={{ maxWidth: 360 }}
    >
      {/* 宝箱动画 */}
      <div className="relative flex justify-center mb-4">
        <motion.div
          animate={phase === 'opening' ? { y: [-10, 0, -20, 0, -10] } : {}}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* 箱子 */}
          <div className="text-8xl relative">
            <motion.span
              animate={phase === 'opening' ? { rotate: [-5, 5, -5, 0] } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              {tier.emoji}
            </motion.span>
            {/* 开箱光芒 */}
            {phase === 'opening' && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <Sparkles className="w-16 h-16 text-yellow-300" style={{ filter: 'blur(4px)' }} />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* 打开内容 */}
      <AnimatePresence>
        {phase === 'open' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <h3 className="text-xl font-black text-white">
              {stars === 3 ? '🎉 ' : stars >= 2 ? '✨ ' : '📦 '}
              {tier.label}开启！
            </h3>

            {/* 星星行 */ }
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map(s => (
                <motion.div
                  key={s}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: s * 0.15, type: 'spring' }}
                >
                  <Star
                    className={`w-10 h-10 ${s <= stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg' : 'text-gray-600'}`}
                  />
                </motion.div>
              ))}
            </div>

            {/* 宝石 */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 bg-white/10 rounded-2xl py-3 px-6"
            >
              <Gem className="w-5 h-5 text-cyan-400" />
              <span className="text-2xl font-black text-cyan-300">+{gems}</span>
              <span className="text-sm text-white/50">宝石</span>
            </motion.div>

            {/* 额外物品 */}
            {items && items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-purple-500/20 rounded-2xl py-2 px-4 border border-purple-400/30"
              >
                <span className="text-xs text-purple-300 font-bold">额外惊喜</span>
                <div className="flex justify-center gap-2 mt-1">
                  {items.map((emoji, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="text-2xl"
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 首次通关标记 */}
            {isFirstClear && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-amber-300 font-bold"
              >
                🏅 首次通关！
              </motion.div>
            )}

            {/* 确认按钮 */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpen}
              className="mt-2 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-xl hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              收下奖励！
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Boss图鉴 —— 收集所有击败的Boss，激发收集欲
 */
import { motion } from 'framer-motion';
import { Swords, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { getBossEntries } from '@/data/adventure/items';
import { useAdventureStore } from '@/store/adventureStore';
import type { BossEntry } from '@/data/adventure/items';

interface BossGalleryProps {
  onClose: () => void;
}

export default function BossGallery({ onClose }: BossGalleryProps) {
  const { progress } = useAdventureStore();
  const bosses = getBossEntries();
  const defeatedCount = bosses.filter(b => progress.completedStages.includes(b.stageId)).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 60 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto border border-white/20 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black text-white flex items-center gap-2 justify-center">
              <Swords className="w-5 h-5 text-red-400" />
              Boss图鉴
            </h2>
            <p className="text-xs text-white/50">
              已击败 {defeatedCount}/{bosses.length}
            </p>
          </div>
          <div className="w-5" />
        </div>

        {/* Boss卡片网格 */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {bosses.map((boss, idx) => {
            const defeated = progress.completedStages.includes(boss.stageId);
            return (
              <motion.div
                key={boss.worldId}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`
                  relative rounded-2xl p-3 text-center border-2 transition-all
                  ${defeated
                    ? 'bg-white/10 border-green-500/50 shadow-lg shadow-green-500/10'
                    : 'bg-white/5 border-white/10 opacity-50'
                  }
                `}
              >
                {/* Boss头像 */}
                <div className="text-4xl mb-1.5 relative">
                  <motion.span
                    animate={defeated ? { y: [0, -3, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                  >
                    {boss.bossEmoji}
                  </motion.span>
                  {defeated && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 fill-green-400" />
                    </motion.div>
                  )}
                </div>

                {/* Boss名字 */}
                <div className={`text-xs font-bold ${defeated ? 'text-white' : 'text-white/40'}`}>
                  {defeated ? boss.bossName : '???'}
                </div>

                {/* 所属世界 */}
                <div className="text-[10px] text-white/40 mt-0.5">
                  {boss.worldEmoji} {defeated ? boss.worldName : '???'}
                </div>

                {/* 未击败遮罩 */}
                {!defeated && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20">
                    <Lock className="w-6 h-6 text-white/30" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 底部激励语 */}
        <div className="mt-5 text-center">
          {defeatedCount === 0 ? (
            <p className="text-white/40 text-sm">打败Boss来收集它们吧！</p>
          ) : defeatedCount >= bosses.length ? (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-amber-300 text-base font-bold"
            >
              🏆 全Boss制霸！你是真正的冒险王！
            </motion.p>
          ) : (
            <p className="text-white/50 text-sm">
              还有 {bosses.length - defeatedCount} 个Boss等你挑战！
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

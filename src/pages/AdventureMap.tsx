import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Compass, Gem, Trophy, Swords, Sparkles,
  MapPin, Home
} from 'lucide-react';
import { ADVENTURE_WORLDS, ADVENTURE_BADGES } from '@/data/adventure/adventureData';
import { useAdventureStore } from '@/store/adventureStore';
import { useGameStore } from '@/store/gameStore';
import WorldCard from '@/components/adventure/WorldCard';
import DailySpin from '@/components/adventure/DailySpin';
import BossGallery from '@/components/adventure/BossGallery';

export default function AdventureMap() {
  const { progress, isWorldUnlocked } = useAdventureStore();
  const { userProgress } = useGameStore();
  const [showSpin, setShowSpin] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const { gems, badges, completedStages } = progress;

  const totalStages = useMemo(() => ADVENTURE_WORLDS.reduce((s, w) => s + w.stages.length, 0), []);
  const totalBossesDefeated = useMemo(() => {
    return ADVENTURE_WORLDS.reduce((count, w) => {
      return count + w.stages.filter(s => s.type === 'boss' && completedStages.includes(s.id)).length;
    }, 0);
  }, [completedStages]);

  const activeWorldIndex = useMemo(() => {
    for (let i = ADVENTURE_WORLDS.length - 1; i >= 0; i--) {
      if (isWorldUnlocked(ADVENTURE_WORLDS[i].id)) return i;
    }
    return 0;
  }, [isWorldUnlocked]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950">
      {/* 每日转盘 */}
      <AnimatePresence>
        {showSpin && <DailySpin onClose={() => setShowSpin(false)} />}
      </AnimatePresence>

      {/* Boss图鉴 */}
      <AnimatePresence>
        {showGallery && <BossGallery onClose={() => setShowGallery(false)} />}
      </AnimatePresence>

      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <Home className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg font-extrabold text-white">数学大冒险</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* 统计面板 */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                <Gem className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-300 font-bold">{gems}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 font-bold">{badges.length}/{ADVENTURE_BADGES.length}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
                <MapPin className="w-3 h-3 text-green-400" />
                <span className="text-green-300 font-bold">{completedStages.length}/{totalStages}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* 欢迎横幅 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 p-6 shadow-2xl"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="text-8xl opacity-20 animate-bounce inline-block">🗺️</span>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-yellow-200" />
              <span className="text-xs font-bold text-yellow-200 uppercase tracking-wider">冒险日志</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              {userProgress.userName} 的探险之旅
            </h2>
            <div className="flex flex-wrap gap-3 text-sm text-white/80">
              <span>🗺️ 探索 {activeWorldIndex + 1}/15 个世界</span>
              <span>⭐ {completedStages.length} 关已通</span>
              <span>⚔️ {totalBossesDefeated}/15 Boss击败</span>
            </div>
            {/* 总进度条 */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2.5 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalStages > 0 ? (completedStages.length / totalStages) * 100 : 0}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs font-bold text-white">{totalStages > 0 ? Math.round((completedStages.length / totalStages) * 100) : 0}%</span>
            </div>

            {/* 🆕 快捷操作按钮 */}
            <div className="flex gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSpin(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
              >
                🎰 每日转盘
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGallery(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
              >
                <Swords className="w-3 h-3" />
                Boss图鉴
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 徽章墙 */}
        {badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
          >
            <h3 className="text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              获得的徽章
            </h3>
            <div className="flex flex-wrap gap-2">
              {badges.map(badgeId => {
                const badge = ADVENTURE_BADGES.find(b => b.id === badgeId);
                if (!badge) return null;
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1 }}
                    className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2 border border-white/10"
                    title={badge.description}
                  >
                    <span className="text-xl">{badge.emoji}</span>
                    <span className="text-xs font-bold text-white/90">{badge.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 世界卡片列表 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white/70">探索世界</h3>
            <span className="text-xs text-white/50 ml-auto">
              {completedStages.length}/{totalStages} 关卡
            </span>
          </div>

          <AnimatePresence>
            {ADVENTURE_WORLDS.map((world, idx) => {
              const unlocked = isWorldUnlocked(world.id);
              return (
                <WorldCard
                  key={world.id}
                  world={world}
                  isUnlocked={unlocked}
                  index={idx}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* 激励语 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-8"
        >
          {completedStages.length === 0 ? (
            <p className="text-white/50 text-sm">
              🌟 选择第一个世界，开始你的数学冒险之旅吧！
            </p>
          ) : completedStages.length >= totalStages ? (
            <p className="text-amber-300 text-lg font-bold">
              🎉 恭喜！你已经征服了所有冒险世界！你是真正的数学冒险王！
            </p>
          ) : (
            <p className="text-white/40 text-sm">
              继续前进，还有 {totalStages - completedStages.length} 关等你挑战！
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Lock, Star, Gem, ChevronRight } from 'lucide-react';
import type { AdventureWorld } from '@/data/adventure/types';
import StageNode from './StageNode';
import { useAdventureStore } from '@/store/adventureStore';
import { useNavigate } from 'react-router-dom';

interface WorldCardProps {
  world: AdventureWorld;
  isUnlocked: boolean;
  index: number;
}

export default function WorldCard({ world, isUnlocked, index }: WorldCardProps) {
  const navigate = useNavigate();
  const { isStageCompleted, isStageUnlocked, getStageStars, getWorldProgress } = useAdventureStore();

  const progress = getWorldProgress(world.id);

  // 找到当前应玩的关卡（第一个未完成且解锁的）
  const currentStage = world.stages.find(
    s => !isStageCompleted(s.id) && isStageUnlocked(s.id)
  );

  const handleStageClick = (stageId: string) => {
    navigate(`/adventure/stage/${stageId}`);
  };

  const handleWorldPlay = () => {
    if (currentStage) {
      navigate(`/adventure/stage/${currentStage.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`
        relative rounded-3xl p-5 border-2 shadow-xl
        ${isUnlocked
          ? 'bg-white/95 border-gray-200'
          : 'bg-gray-100/80 border-gray-300 opacity-70'
        }
      `}
    >
      {/* 世界头部 */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
          style={{ background: `linear-gradient(135deg, ${world.lightColor}, ${world.themeColor}40)` }}
        >
          {world.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold text-gray-800 truncate">
              {world.name}
            </h3>
            {!isUnlocked && <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{world.subtitle}</p>
          {/* 进度条 */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: world.themeColor }}
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap">
              {progress.completed}/{progress.total}
            </span>
          </div>
        </div>
      </div>

      {/* 世界描述 */}
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">{world.description}</p>

      {/* 关卡节点 */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {world.stages.map((stage, sIdx) => {
          const completed = isStageCompleted(stage.id);
          const unlocked = isStageUnlocked(stage.id);
          const stars = getStageStars(stage.id);
          const isCurrent = currentStage?.id === stage.id;

          return (
            <div key={stage.id} className="flex items-center">
              <StageNode
                stage={stage}
                isCompleted={completed}
                isUnlocked={unlocked}
                stars={stars}
                isCurrent={isCurrent}
                onClick={() => handleStageClick(stage.id)}
              />
              {/* 关卡间距指示线 */}
              {sIdx < world.stages.length - 1 && (
                <div className={`
                  w-4 h-0.5 mx-0.5 rounded
                  ${isStageCompleted(world.stages[sIdx].id) ? 'bg-green-300' : 'bg-gray-300'}
                `} />
              )}
            </div>
          );
        })}
      </div>

      {/* 行动按钮 */}
      {isUnlocked && currentStage && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWorldPlay}
          className="w-full py-2.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${world.themeColor}, ${world.lightColor})` }}
        >
          {progress.completed === 0 ? '🚀 开始冒险' : '▶ 继续冒险'}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}

      {isUnlocked && !currentStage && progress.percent === 100 && (
        <div className="w-full py-2.5 rounded-xl font-bold text-center text-sm bg-green-100 text-green-700 border border-green-300">
          🎉 本世界已通关！
        </div>
      )}

      {!isUnlocked && (
        <div className="w-full py-2.5 rounded-xl font-bold text-center text-sm bg-gray-200 text-gray-500">
          🔒 完成前一个世界解锁
        </div>
      )}
    </motion.div>
  );
}

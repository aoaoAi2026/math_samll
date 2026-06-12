import { motion } from 'framer-motion';
import { Lock, Star, Crown, Gem } from 'lucide-react';
import type { AdventureStage } from '@/data/adventure/types';

interface StageNodeProps {
  stage: AdventureStage;
  isCompleted: boolean;
  isUnlocked: boolean;
  stars: number;
  isCurrent: boolean;
  onClick: () => void;
}

export default function StageNode({
  stage,
  isCompleted,
  isUnlocked,
  stars,
  isCurrent,
  onClick,
}: StageNodeProps) {
  const isBoss = stage.type === 'boss';

  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.08 } : {}}
      whileTap={isUnlocked ? { scale: 0.95 } : {}}
      className={`
        relative cursor-pointer select-none
        ${!isUnlocked ? 'cursor-not-allowed' : ''}
      `}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* 连接线指示 */}
      {isCurrent && isUnlocked && !isCompleted && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full whitespace-nowrap z-10 animate-bounce">
          当前
        </div>
      )}

      <div
        className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          border-2 transition-all duration-300
          ${isCompleted
            ? 'bg-green-100 border-green-400 shadow-lg shadow-green-200'
            : isUnlocked
              ? 'bg-white/90 border-amber-300 shadow-md hover:shadow-lg hover:border-amber-400'
              : 'bg-gray-200 border-gray-300 opacity-60'
          }
          ${isBoss && isUnlocked ? 'w-20 h-20 rounded-3xl border-amber-500' : ''}
        `}
      >
        {isCompleted ? (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-2xl">⭐</span>
            <span className="text-[10px] font-bold text-green-700">{stars}/3</span>
          </div>
        ) : !isUnlocked ? (
          <Lock className="w-5 h-5 text-gray-400" />
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            {isBoss ? (
              <>
                <span className="text-3xl">{stage.enemyEmoji || '👾'}</span>
              </>
            ) : (
              <>
                <span className="text-xl">{stage.stageNumber}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 关卡名称 */}
      <div className="text-center mt-1.5">
        <div className={`
          text-xs font-medium leading-tight
          ${isCompleted ? 'text-green-700' : isUnlocked ? 'text-gray-700' : 'text-gray-400'}
        `}>
          {stage.name}
        </div>
        {isBoss && (
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <Crown className="w-2.5 h-2.5 text-amber-500" />
            <span className="text-[10px] text-amber-600 font-bold">Boss</span>
          </div>
        )}
        {/* 宝石奖励预览 */}
        {!isCompleted && isUnlocked && (
          <div className="flex items-center justify-center gap-0.5 mt-0.5 text-[10px] text-cyan-600">
            <Gem className="w-2.5 h-2.5" />
            +{stage.rewardGems}
          </div>
        )}
      </div>
    </motion.div>
  );
}

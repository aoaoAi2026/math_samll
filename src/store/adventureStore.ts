/**
 * 冒险模式状态管理
 * 
 * 冒险进度独立存储在 localStorage，但与全局 gameStore 联动：
 * - 通关关卡会给 gameStore 增加星星（影响段位）
 * - 触发每日任务更新
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdventureProgress, StageResult } from '@/data/adventure/types';
import { ADVENTURE_BADGES, ADVENTURE_WORLDS, getWorldById, getStageById } from '@/data/adventure/adventureData';
import { SPIN_PRIZES, getItemById } from '@/data/adventure/items';
import type { SpinPrize } from '@/data/adventure/items';
import { useGameStore } from '@/store/gameStore';

const ADVENTURE_KEY = 'math-adventure-v1';
const ADVENTURE_DATA_VERSION = 1;

function getDefaultProgress(): AdventureProgress {
  return {
    completedStages: [],
    stageStars: {},
    gems: 0,
    badges: [],
    totalChallengesCompleted: 0,
    inventory: {},
    lastSpinDate: '',
  };
}

// 深合并冒险进度
function deepMergeAdventure(target: AdventureProgress, source: Partial<AdventureProgress>): AdventureProgress {
  if (!source) return target;
  return {
    completedStages: Array.isArray(source.completedStages) ? source.completedStages : target.completedStages,
    stageStars: source.stageStars && typeof source.stageStars === 'object' ? { ...target.stageStars, ...source.stageStars } : target.stageStars,
    gems: typeof source.gems === 'number' ? source.gems : target.gems,
    badges: Array.isArray(source.badges) ? source.badges : target.badges,
    totalChallengesCompleted: typeof source.totalChallengesCompleted === 'number' ? source.totalChallengesCompleted : target.totalChallengesCompleted,
    inventory: source.inventory && typeof source.inventory === 'object' ? { ...target.inventory, ...source.inventory } : target.inventory,
    lastSpinDate: typeof source.lastSpinDate === 'string' ? source.lastSpinDate : target.lastSpinDate,
  };
}

interface AdventureStore {
  progress: AdventureProgress;
  
  /** 检查关卡是否已完成 */
  isStageCompleted: (stageId: string) => boolean;
  /** 获取关卡星星 */
  getStageStars: (stageId: string) => number;
  /** 检查关卡是否解锁 */
  isStageUnlocked: (stageId: string) => boolean;
  /** 检查世界是否解锁 */
  isWorldUnlocked: (worldId: string) => boolean;
  /** 获取世界完成进度 */
  getWorldProgress: (worldId: string) => { completed: number; total: number; percent: number };

  /** 完成一个关卡 */
  completeStage: (result: StageResult) => void;

  /** 重置冒险进度 */
  resetAdventure: () => void;

  // 🆕 道具系统
  /** 获取某个道具的数量 */
  getItemCount: (itemId: string) => number;
  /** 使用一个道具（减少1），返回是否成功 */
  useItem: (itemId: string) => boolean;
  /** 添加道具 */
  addItem: (itemId: string, amount: number) => void;

  // 🆕 每日转盘
  /** 今天是否已经转过 */
  hasSpunToday: () => boolean;
  /** 转动转盘，返回奖品 */
  spinWheel: () => SpinPrize | null;
}

function computeWorldProgress(completedStages: string[], worldId: string): { completed: number; total: number; percent: number } {
  const world = getWorldById(worldId);
  if (!world) return { completed: 0, total: 0, percent: 0 };
  const total = world.stages.length;
  const completed = world.stages.filter(s => completedStages.includes(s.id)).length;
  return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

export const useAdventureStore = create(
  persist(
    (set, get) => ({
      progress: getDefaultProgress(),

      isStageCompleted: (stageId) => {
        return get().progress.completedStages.includes(stageId);
      },

      getStageStars: (stageId) => {
        return get().progress.stageStars[stageId] || 0;
      },

      isStageUnlocked: (stageId) => {
        const { completedStages } = get().progress;
        const stage = getStageById(stageId);
        if (!stage) return false;

        // 世界第一关始终解锁
        const world = getWorldById(stage.worldId);
        if (!world) return false;

        const worldIdx = world.stages.findIndex(s => s.id === stageId);
        
        // 每个世界的第1关：需要前一个世界全部完成
        if (stage.stageNumber === 1) {
          // 第一个世界的第一关始终解锁
          if (stage.worldId === 'world_1') return true;
          // 其他世界：需要前一个世界全部完成
          const prevWorldIdx = parseInt(stage.worldId.split('_')[1]) - 2; // 0-based index of previous world
          if (prevWorldIdx >= 0 && prevWorldIdx < ADVENTURE_WORLDS.length) {
            const prevWorld = ADVENTURE_WORLDS[prevWorldIdx];
            return prevWorld.stages.every(s => completedStages.includes(s.id));
          }
          return true;
        }

        // 同一世界的后续关卡：前一关必须完成
        const prevStage = world.stages[worldIdx - 1];
        return prevStage ? completedStages.includes(prevStage.id) : true;
      },

      isWorldUnlocked: (worldId) => {
        const { completedStages } = get().progress;
        // 第一个世界始终解锁
        if (worldId === 'world_1') return true;
        
        // 需要前一个世界全部完成
        const currentIdx = ADVENTURE_WORLDS.findIndex(w => w.id === worldId);
        if (currentIdx <= 0) return true;
        
        const prevWorld = ADVENTURE_WORLDS[currentIdx - 1];
        return prevWorld.stages.every(s => completedStages.includes(s.id));
      },

      getWorldProgress: (worldId) => {
        return computeWorldProgress(get().progress.completedStages, worldId);
      },

      completeStage: (result: StageResult) => {
        const state = get();
        const { completedStages, stageStars, gems, badges } = state.progress;

        // 更新完成列表
        const newCompleted = completedStages.includes(result.stageId)
          ? completedStages
          : [...completedStages, result.stageId];

        // 更新星星（保留最高分）
        const newStageStars = { ...stageStars };
        newStageStars[result.stageId] = Math.max(
          stageStars[result.stageId] || 0,
          result.stars
        );

        // 更新宝石
        const newGems = gems + result.gemsEarned;

        // 检查徽章
        const newBadges = [...badges];

        // 首次通关
        if (!badges.includes('badge_first_stage') && newCompleted.length >= 1) {
          newBadges.push('badge_first_stage');
        }
        // 10关
        if (!badges.includes('badge_10_stages') && newCompleted.length >= 10) {
          newBadges.push('badge_10_stages');
        }
        // 25关
        if (!badges.includes('badge_25_stages') && newCompleted.length >= 25) {
          newBadges.push('badge_25_stages');
        }
        // 50关
        if (!badges.includes('badge_50_stages') && newCompleted.length >= 50) {
          newBadges.push('badge_50_stages');
        }
        // 全部75关
        const totalStages = 75; // 15 worlds × 5 stages
        if (!badges.includes('badge_all_stages') && newCompleted.length >= totalStages) {
          newBadges.push('badge_all_stages');
        }
        // 完美通关
        if (!badges.includes('badge_perfect') && result.correct === result.total) {
          newBadges.push('badge_perfect');
        }
        // 100宝石
        if (!badges.includes('badge_100_gems') && newGems >= 100) {
          newBadges.push('badge_100_gems');
        }
        // 500宝石
        if (!badges.includes('badge_500_gems') && newGems >= 500) {
          newBadges.push('badge_500_gems');
        }
        // 1000宝石
        if (!badges.includes('badge_1000_gems') && newGems >= 1000) {
          newBadges.push('badge_1000_gems');
        }
        // Boss击杀
        const stage = getStageById(result.stageId);
        if (stage?.type === 'boss') {
          const bossStagesCompleted = newCompleted.filter(id => {
            const s = getStageById(id);
            return s?.type === 'boss';
          }).length;
          if (!badges.includes('badge_boss_5') && bossStagesCompleted >= 5) {
            newBadges.push('badge_boss_5');
          }
          if (!badges.includes('badge_boss_10') && bossStagesCompleted >= 10) {
            newBadges.push('badge_boss_10');
          }
          if (!badges.includes('badge_boss_all') && bossStagesCompleted >= 15) {
            newBadges.push('badge_boss_all');
          }
        }
        // 闪电答题
        if (!badges.includes('badge_speed') && result.timeSpent < 60 && result.correct === result.total) {
          newBadges.push('badge_speed');
        }

        // 关卡通关卡特定徽章
        if (stage?.badgeId && !badges.includes(stage.badgeId)) {
          newBadges.push(stage.badgeId);
        }

        const newProgress: AdventureProgress = {
          ...state.progress,
          completedStages: newCompleted,
          stageStars: newStageStars,
          gems: newGems,
          badges: newBadges,
          lastPlayedStage: result.stageId,
          totalChallengesCompleted: state.progress.totalChallengesCompleted + 1,
        };

        set({ progress: newProgress });

        // 联动全局 store：增加星星
        if (result.stars > 0 && !completedStages.includes(result.stageId)) {
          const gameStore = useGameStore.getState();
          // 用虚拟 questionId 增加星星，星星数 = 关卡星数
          for (let i = 0; i < result.stars; i++) {
            // 使用冒险专用虚拟 ID
            gameStore.recordAnswer(true);
          }
          // 手动更新 totalStars（因为 recordAnswer 不更新 totalStars）
          const currentProgress = gameStore.userProgress;
          const newTotalStars = currentProgress.totalStars + result.stars;
          const oldRank = currentProgress.rank;
          const RANK_LIST = [
            { threshold: 1000, label: '🌟 奥数之神' },
            { threshold: 700, label: '👑 传奇大师' },
            { threshold: 500, label: '🏆 奥数大师' },
            { threshold: 350, label: '🧠 数学天才' },
            { threshold: 200, label: '🎖️ 超级学霸' },
            { threshold: 120, label: '📚 学霸达人' },
            { threshold: 70, label: '⭐ 优秀学员' },
            { threshold: 35, label: '🌱 进步之星' },
            { threshold: 15, label: '🐣 初出茅庐' },
            { threshold: 0, label: '🌰 数学小种子' },
          ];
          const newRank = RANK_LIST.find(r => newTotalStars >= r.threshold)?.label || '🌰 数学小种子';
          const rankChanged = oldRank !== newRank ? newRank : null;
          
          useGameStore.setState({
            userProgress: {
              ...currentProgress,
              totalStars: newTotalStars,
              rank: newRank,
            },
            rankJustChanged: rankChanged,
          });
        }
      },

      resetAdventure: () => {
        set({ progress: getDefaultProgress() });
      },

      // ── 道具系统 ──
      getItemCount: (itemId) => {
        return get().progress.inventory[itemId] || 0;
      },

      useItem: (itemId) => {
        const inventory = { ...get().progress.inventory };
        const count = inventory[itemId] || 0;
        if (count <= 0) return false;
        inventory[itemId] = count - 1;
        set({ progress: { ...get().progress, inventory } });
        return true;
      },

      addItem: (itemId, amount) => {
        const inventory = { ...get().progress.inventory };
        inventory[itemId] = (inventory[itemId] || 0) + amount;
        set({ progress: { ...get().progress, inventory } });
      },

      // ── 每日转盘 ──
      hasSpunToday: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().progress.lastSpinDate === today;
      },

      spinWheel: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        if (state.progress.lastSpinDate === today) return null;

        // 随机选奖品（稀有度加权）
        const totalWeight = SPIN_PRIZES.reduce((sum, p) => {
          const w = p.rarity === 'epic' ? 1 : p.rarity === 'rare' ? 3 : 5;
          return sum + w;
        }, 0);
        let roll = Math.random() * totalWeight;
        let prize: SpinPrize = SPIN_PRIZES[0];
        for (const p of SPIN_PRIZES) {
          const w = p.rarity === 'epic' ? 1 : p.rarity === 'rare' ? 3 : 5;
          roll -= w;
          if (roll <= 0) { prize = p; break; }
        }

        // 发放奖品
        if (prize.gems) {
          set({ progress: { ...state.progress, gems: state.progress.gems + prize.gems, lastSpinDate: today } });
        } else if (prize.itemId) {
          const inventory = { ...state.progress.inventory };
          inventory[prize.itemId] = (inventory[prize.itemId] || 0) + 1;
          set({ progress: { ...state.progress, inventory, lastSpinDate: today } });
        }

        return prize;
      },
    }),
    {
      name: ADVENTURE_KEY,
      version: ADVENTURE_DATA_VERSION,
      // 只持久化 progress，不持久化函数
      partialize: (state: AdventureStore) => ({ progress: state.progress }),
      // 深合并嵌套 progress
      merge: (persistedState: any, currentState: AdventureStore): AdventureStore => {
        if (!persistedState || typeof persistedState !== 'object') return currentState;
        const persisted = persistedState as { progress?: Partial<AdventureProgress> };
        return {
          ...currentState,
          progress: persisted.progress
            ? deepMergeAdventure(currentState.progress, persisted.progress)
            : currentState.progress,
        };
      },
      migrate: (persistedState: any, version: number) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { progress: getDefaultProgress() };
        }
        const p = persistedState as { progress?: any };
        // 确保 progress 字段完整
        const defaultP = getDefaultProgress();
        const progress = { ...defaultP, ...(p.progress || {}) };
        if (!Array.isArray(progress.completedStages)) progress.completedStages = [];
        if (!progress.stageStars || typeof progress.stageStars !== 'object') progress.stageStars = {};
        if (typeof progress.gems !== 'number') progress.gems = 0;
        if (!Array.isArray(progress.badges)) progress.badges = [];
        if (typeof progress.totalChallengesCompleted !== 'number') progress.totalChallengesCompleted = 0;
        if (!progress.inventory || typeof progress.inventory !== 'object') progress.inventory = {};
        if (typeof progress.lastSpinDate !== 'string') progress.lastSpinDate = '';
        return { progress };
      },
    }
  )
);

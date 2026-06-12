// ====== 冒险模式类型定义 ======

/** 冒险世界 */
export interface AdventureWorld {
  id: string;           // world_1, world_2 ...
  name: string;         // 世界名称
  emoji: string;        // 世界图标
  subtitle: string;     // 副标题（游戏化描述）
  description: string;  // 简短介绍
  themeColor: string;   // 主题色（用于背景渐变等）
  bgGradient: string;   // CSS 渐变字符串
  lightColor: string;   // 亮色变体
  stages: AdventureStage[];
}

/** 冒险关卡 */
export interface AdventureStage {
  id: string;           // world_1_stage_1 ...
  worldId: string;      // 所属世界
  name: string;         // 关卡名称
  description: string;  // 关卡描述
  stageNumber: number;  // 关内序号 1-5
  type: 'normal' | 'boss' | 'bonus';
  questionIds: string[]; // 5 道题目 ID（从现有题库映射）
  rewardGems: number;    // 通关宝石奖励
  badgeId?: string;      // 特殊徽章 ID
  enemyName?: string;    // Boss 名称
  enemyEmoji?: string;   // Boss 图标
  tip?: string;          // 小提示
}

/** 冒险进度 */
export interface AdventureProgress {
  completedStages: string[];        // 已通关关卡 ID 列表
  stageStars: Record<string, number>; // 每个关卡获得的星星 (0-3)
  gems: number;                    // 总宝石数
  badges: string[];                // 已获得徽章 ID 列表
  lastPlayedStage?: string;        // 最后游玩的关卡
  totalChallengesCompleted: number;
  // 🆕 道具背包
  inventory: Record<string, number>; // itemId → 数量
  // 🆕 每日转盘
  lastSpinDate: string;            // ISO日期字符串，空字符串=从未转
}

/** 单次关卡结果 */
export interface StageResult {
  stageId: string;
  correct: number;
  total: number;
  stars: number;     // 0-3
  gemsEarned: number;
  timeSpent: number; // 秒
}

/** 徽章定义 */
export interface AdventureBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: string; // 获得条件描述
}

/** 冒险世界元数据（纯展示，不含关卡） */
export interface WorldMeta {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  themeColor: string;
  bgGradient: string;
  lightColor: string;
}

/**
 * 冒险物品/道具系统
 * 
 * 孩子在关卡中可以主动使用道具，
 * 获得掌控感——这是游戏和考试的本质区别。
 */

export interface AdventureItem {
  id: string;
  name: string;
  emoji: string;
  description: string;     // 简短说明
  effect: string;           // 效果描述
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  usableInStage: boolean;   // 是否可在关卡中使用
}

/** 物品定义 */
export const ITEMS: AdventureItem[] = [
  {
    id: 'item_shield',
    name: '守护盾',
    emoji: '🛡️',
    description: '保护你不受伤',
    effect: '抵挡一次答错，不扣生命值',
    rarity: 'rare',
    usableInStage: true,
  },
  {
    id: 'item_star',
    name: '智慧星',
    emoji: '💡',
    description: '点亮思维火花',
    effect: '显示当前题目的详细提示',
    rarity: 'common',
    usableInStage: true,
  },
  {
    id: 'item_crystal',
    name: '预知水晶',
    emoji: '🔮',
    description: '洞穿迷雾',
    effect: '排除两个错误选项（仅选择题可用）',
    rarity: 'rare',
    usableInStage: true,
  },
  {
    id: 'item_dice',
    name: '幸运骰子',
    emoji: '🎲',
    description: '赌一把运气',
    effect: '50%概率获得双倍宝石奖励',
    rarity: 'epic',
    usableInStage: false,
  },
  {
    id: 'item_freeze',
    name: '时光沙漏',
    emoji: '⏳',
    description: '让时间停一停',
    effect: '冻结计时30秒',
    rarity: 'rare',
    usableInStage: false,
  },
  {
    id: 'item_retry',
    name: '重生羽毛',
    emoji: '🪶',
    description: '凤凰的礼物',
    effect: '答错后可以重答同一题，不扣命',
    rarity: 'epic',
    usableInStage: true,
  },
  {
    id: 'item_key',
    name: '万能钥匙',
    emoji: '🔑',
    description: '开启隐藏关卡',
    effect: '解锁一个已经通关世界的隐藏奖励关卡',
    rarity: 'legendary',
    usableInStage: false,
  },
  {
    id: 'item_potion',
    name: '经验药水',
    emoji: '🧪',
    description: '加倍的收获',
    effect: '下一次通关获得双倍宝石',
    rarity: 'epic',
    usableInStage: false,
  },
];

/** 兼容旧代码的映射类型 */
export type ItemId = typeof ITEMS[number]['id'];

export function getItemById(id: string): AdventureItem | undefined {
  return ITEMS.find(i => i.id === id);
}

// ====== 每日转盘奖品池 ======

export interface SpinPrize {
  itemId?: string;      // 物品ID
  gems?: number;        // 宝石数量
  label: string;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const SPIN_PRIZES: SpinPrize[] = [
  { gems: 5,  label: 'x5 宝石',    emoji: '💎', rarity: 'common' },
  { gems: 10, label: 'x10 宝石',   emoji: '💎', rarity: 'common' },
  { gems: 15, label: 'x15 宝石',   emoji: '💎', rarity: 'common' },
  { itemId: 'item_star',    label: '智慧星',     emoji: '💡', rarity: 'common' },
  { gems: 20, label: 'x20 宝石',   emoji: '💎', rarity: 'rare' },
  { itemId: 'item_shield',  label: '守护盾',     emoji: '🛡️', rarity: 'rare' },
  { itemId: 'item_crystal', label: '预知水晶',   emoji: '🔮', rarity: 'rare' },
  { itemId: 'item_dice',    label: '幸运骰子',   emoji: '🎲', rarity: 'epic' },
];

// ====== 欢呼语库（远多于之前的6条，每次都不重样） ======

export const CHEER_CORRECT = [
  '太棒了！🎉', '完美！✨', '答对了！🌟', '你真聪明！💡',
  '继续加油！🔥', '牛！👑', '天才！🧠', '一击必中！🎯',
  '厉害厉害！😎', '数学小超人！🦸', '悟性满分！💯', '妙极了！👏',
  '厉害！⚡', '这都会！🤩', '无敌了！💪', '帅呆了！😆',
  '开挂了！🚀', '逻辑满分！🎓', '太秀了！🌟', '稳如泰山！⛰️',
  '手到擒来！✋', '这波操作满分！💯', '神级答题！🔮', '冲冲冲！🏃',
  '必杀技！⚔️', '无人能挡！🛡️', '学霸本霸！📚', '超神了！👾',
];

export const CHEER_WRONG = [
  '再想想！🤔', '差一点！💪', '没关系！📚', '下次一定对！😤',
  '仔细看看！🔍', '离成功只差一步！🎯', '深呼吸，再看一遍！🌿',
  '失败是成功之母！🐣', '动动小脑瓜！🧠', '换个思路试试！🔄',
  '别急，慢慢来！🐢', '我知道你能行！💖', '这次不算什么！🌤️',
  '小失误而已！😉', '宝贵的经验！💎', '画图试试看？✏️',
];

export const COMBO_MSGS: Record<number, string> = {
  2: '双连击！🔥',
  3: '三连击！⚡',
  4: '四连击！💥',
  5: '完美风暴！🌪️',
};

// 连击特殊音效/视觉标记
export function getComboEffect(combo: number): { emoji: string; color: string; scale: number } | null {
  if (combo >= 7) return { emoji: '👑', color: '#fbbf24', scale: 1.8 };
  if (combo >= 5) return { emoji: '🌪️', color: '#a78bfa', scale: 1.5 };
  if (combo >= 4) return { emoji: '💥', color: '#f87171', scale: 1.3 };
  if (combo >= 3) return { emoji: '⚡', color: '#facc15', scale: 1.2 };
  if (combo >= 2) return { emoji: '🔥', color: '#fb923c', scale: 1.1 };
  return null;
}

// ====== Boss图鉴数据 ======

export interface BossEntry {
  worldId: string;
  worldName: string;
  worldEmoji: string;
  bossName: string;
  bossEmoji: string;
  stageId: string;
}

import { ADVENTURE_WORLDS } from '@/data/adventure/adventureData';

export function getBossEntries(): BossEntry[] {
  return ADVENTURE_WORLDS.map((w) => {
    const bossStage = w.stages.find((s) => s.type === 'boss');
    return {
      worldId: w.id,
      worldName: w.name,
      worldEmoji: w.emoji,
      bossName: bossStage?.enemyName || '未知Boss',
      bossEmoji: bossStage?.enemyEmoji || '👾',
      stageId: bossStage?.id || '',
    };
  });
}

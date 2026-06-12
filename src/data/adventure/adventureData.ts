/**
 * 冒险世界数据 —— 完全隐藏年级概念
 * 
 * 15个主题冒险世界，难度自然递增，
 * 不知不觉间学完小学数学全部基础内容。
 * 题目从现有题库中按难度分级选取。
 */

import type { AdventureWorld, AdventureStage, AdventureBadge } from './types';
import { allQuestions } from '@/data/questions';
import type { Question } from '@/data/questions/types';

// ====== 按难度档位选取题目的工具函数 ======

function questionScore(q: Question): number {
  return q.grade * 1.5 + q.difficulty * 2;
}

function getTier(score: number): number {
  if (score < 4) return 0;    // G1难度1
  if (score <= 6) return 1;   // G1-2难度1-2
  if (score <= 9) return 2;   // G2-3难度2-3
  if (score <= 12) return 3;  // G3-5难度2-3
  return 4;                    // G5-6难度3-4
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function selectQuestions(tierMin: number, tierMax: number, seed: string, count: number): string[] {
  const candidates = allQuestions
    .map(q => ({ id: q.id, score: questionScore(q), tier: getTier(questionScore(q)) }))
    .filter(q => q.tier >= tierMin && q.tier <= tierMax)
    .sort((a, b) => a.score - b.score);

  if (candidates.length === 0) {
    const fallback = allQuestions
      .map(q => ({ id: q.id, score: questionScore(q) }))
      .sort((a, b) => a.score - b.score);
    const selected: string[] = [];
    const seedNum = hashStr(seed);
    for (let i = 0; i < count && i < fallback.length; i++) {
      selected.push(fallback[(seedNum + i * 7 + i * i * 3) % fallback.length].id);
    }
    return selected;
  }

  const selected: string[] = [];
  const seedNum = hashStr(seed);
  const step = Math.max(1, Math.floor(candidates.length / count));
  
  for (let i = 0; i < count; i++) {
    const idx = (seedNum + i * step) % candidates.length;
    selected.push(candidates[idx].id);
  }

  return selected;
}

// ====== 15个冒险世界 ======

const WORLDS_META = [
  // ── 1 ──
  {
    id: 'world_1',
    name: '数字草原',
    emoji: '🌿',
    subtitle: '和小兔子一起数数',
    description: '在青青草原上，帮助小动物们数苹果、比较大小，认识数字的魔法！',
    themeColor: '#22c55e',
    bgGradient: 'from-green-300 via-emerald-200 to-lime-200',
    lightColor: '#86efac',
    tierMin: 0, tierMax: 0,
  },
  // ── 2 ──
  {
    id: 'world_2',
    name: '计算溪谷',
    emoji: '💧',
    subtitle: '跟着小鱼学计算',
    description: '清澈的溪谷里，和小鱼一起练习加减法，搭建通往对岸的石桥！',
    themeColor: '#3b82f6',
    bgGradient: 'from-blue-300 via-sky-200 to-cyan-200',
    lightColor: '#93c5fd',
    tierMin: 0, tierMax: 1,
  },
  // ── 3 ── 🆕 时间之城
  {
    id: 'world_3',
    name: '时间之城',
    emoji: '⏰',
    subtitle: '帮小闹钟找回指针',
    description: '嘀嗒嘀嗒！时间之城的时间乱了套，帮小闹钟认识钟表、学会看时间！',
    themeColor: '#10b981',
    bgGradient: 'from-emerald-300 via-teal-200 to-green-200',
    lightColor: '#6ee7b7',
    tierMin: 0, tierMax: 1,
  },
  // ── 4 ── 🆕 测量山谷
  {
    id: 'world_4',
    name: '测量山谷',
    emoji: '📏',
    subtitle: '和矮人学丈量世界',
    description: '矮人们在山谷中建造房屋，需要你帮忙测量长度、称重量、算容积！',
    themeColor: '#84cc16',
    bgGradient: 'from-lime-300 via-green-200 to-yellow-200',
    lightColor: '#bef264',
    tierMin: 1, tierMax: 2,
  },
  // ── 5 ── 原 world_3
  {
    id: 'world_5',
    name: '图形森林',
    emoji: '🔷',
    subtitle: '和猫头鹰探秘形状',
    description: '神秘的图形森林里，圆形、三角形、正方形都藏着秘密等你发现！',
    themeColor: '#8b5cf6',
    bgGradient: 'from-violet-300 via-purple-200 to-fuchsia-200',
    lightColor: '#c4b5fd',
    tierMin: 1, tierMax: 2,
  },
  // ── 6 ── 原 world_4
  {
    id: 'world_6',
    name: '规律迷宫',
    emoji: '🧩',
    subtitle: '和聪明狐狸解谜',
    description: '弯弯绕绕的迷宫里，只有找出规律才能找到出口。准备好了吗？',
    themeColor: '#f59e0b',
    bgGradient: 'from-amber-300 via-yellow-200 to-orange-200',
    lightColor: '#fcd34d',
    tierMin: 1, tierMax: 2,
  },
  // ── 7 ── 原 world_5
  {
    id: 'world_7',
    name: '乘除山峰',
    emoji: '⛰️',
    subtitle: '和雄鹰一起攀登',
    description: '高耸的山峰需要乘法和除法的力量才能登顶。雄鹰在顶峰等你！',
    themeColor: '#ef4444',
    bgGradient: 'from-red-300 via-rose-200 to-orange-200',
    lightColor: '#fca5a5',
    tierMin: 2, tierMax: 3,
  },
  // ── 8 ── 原 world_6
  {
    id: 'world_8',
    name: '智慧城堡',
    emoji: '🏰',
    subtitle: '挑战城堡守卫的谜题',
    description: '古老的智慧城堡里住着会出谜题的石像守卫，用逻辑推理打败它们！',
    themeColor: '#6366f1',
    bgGradient: 'from-indigo-300 via-blue-200 to-violet-200',
    lightColor: '#a5b4fc',
    tierMin: 2, tierMax: 3,
  },
  // ── 9 ── 原 world_7
  {
    id: 'world_9',
    name: '几何王国',
    emoji: '📐',
    subtitle: '建造宏伟的数学宫殿',
    description: '在几何王国里，周长、面积和角度是你建造宫殿的魔法工具！',
    themeColor: '#14b8a6',
    bgGradient: 'from-teal-300 via-cyan-200 to-emerald-200',
    lightColor: '#5eead4',
    tierMin: 2, tierMax: 3,
  },
  // ── 10 ── 🆕 商业广场
  {
    id: 'world_10',
    name: '商业广场',
    emoji: '💰',
    subtitle: '当一回小小大掌柜',
    description: '热闹的商业广场里，买卖东西算价钱，当一回精明的小掌柜！',
    themeColor: '#eab308',
    bgGradient: 'from-yellow-300 via-amber-200 to-orange-200',
    lightColor: '#fde047',
    tierMin: 2, tierMax: 3,
  },
  // ── 11 ── 原 world_8
  {
    id: 'world_11',
    name: '应用之海',
    emoji: '🌊',
    subtitle: '和海豚一起航海解题',
    description: '广阔的应用之海上，每一道应用题都是一次惊险的航海冒险！',
    themeColor: '#06b6d4',
    bgGradient: 'from-cyan-300 via-sky-200 to-blue-200',
    lightColor: '#67e8f9',
    tierMin: 3, tierMax: 3,
  },
  // ── 12 ── 🆕 方程天平
  {
    id: 'world_12',
    name: '方程天平',
    emoji: '⚖️',
    subtitle: '用天平找到未知数',
    description: '在天平世界，左右必须平衡！用方程的力量找出隐藏的未知数吧！',
    themeColor: '#64748b',
    bgGradient: 'from-slate-300 via-gray-200 to-zinc-200',
    lightColor: '#cbd5e1',
    tierMin: 3, tierMax: 4,
  },
  // ── 13 ── 原 world_9
  {
    id: 'world_13',
    name: '分数星云',
    emoji: '🌌',
    subtitle: '乘坐火箭探索星空',
    description: '璀璨的星云中，分数、小数、百分数和负数像星星一样闪烁。收集星光，掌握数字新世界！',
    themeColor: '#ec4899',
    bgGradient: 'from-pink-300 via-rose-200 to-fuchsia-200',
    lightColor: '#f9a8d4',
    tierMin: 3, tierMax: 4,
  },
  // ── 14 ── 🆕 数据之塔
  {
    id: 'world_14',
    name: '数据之塔',
    emoji: '📊',
    subtitle: '探索数字的秘密',
    description: '数据之塔里藏着海量信息！学会分类、统计、算平均，你就是数据大师！',
    themeColor: '#06b6d4',
    bgGradient: 'from-cyan-300 via-blue-200 to-indigo-200',
    lightColor: '#22d3ee',
    tierMin: 2, tierMax: 3,
  },
  // ── 15 ── 原 world_10
  {
    id: 'world_15',
    name: '终极试炼',
    emoji: '👑',
    subtitle: '成为数学冒险王',
    description: '最终的试炼之地！所有学到的知识将在这里汇聚，证明你是真正的数学冒险王！',
    themeColor: '#f97316',
    bgGradient: 'from-orange-300 via-amber-200 to-yellow-200',
    lightColor: '#fdba74',
    tierMin: 3, tierMax: 4,
  },
];

// ====== 关卡定义（按世界） ======
const STAGE_NAMES: Record<string, { name: string; desc: string; type: AdventureStage['type']; tip?: string; enemyName?: string; enemyEmoji?: string }[]> = {
  // ── 1. 数字草原 ──
  world_1: [
    { name: '数数入门', desc: '帮小兔数胡萝卜！', type: 'normal', tip: '用手指点着数，就不会漏掉啦！' },
    { name: '比大小', desc: '谁的果子更多？', type: 'normal', tip: '大的数吃小的数，开口朝大数～' },
    { name: '数字排队', desc: '帮数字宝宝排好队', type: 'normal', tip: '从小到大就是数字慢慢变大！' },
    { name: '单双数大作战', desc: '奇数偶数分清楚', type: 'normal', tip: '双数是2、4、6、8、10…好朋友！' },
    { name: '草原守护者', desc: '打败石头怪！', type: 'boss', enemyName: '石头怪', enemyEmoji: '🪨', tip: '前面学的都用上，你能行！' },
  ],
  // ── 2. 计算溪谷 ──
  world_2: [
    { name: '加法魔法', desc: '把果子加在一起', type: 'normal', tip: '加法就是东西越来越多！' },
    { name: '减法秘诀', desc: '吃掉了一些果子', type: 'normal', tip: '减法就是东西被拿走啦～' },
    { name: '加加减减', desc: '加减混合大挑战', type: 'normal', tip: '先算加法再算减法，一步一步来' },
    { name: '凑十法', desc: '凑成10好朋友', type: 'normal', tip: '1和9、2和8、3和7…都是好朋友！' },
    { name: '溪谷水怪', desc: '击败水怪通关！', type: 'boss', enemyName: '溪谷水怪', enemyEmoji: '🐙', tip: '冷静下来，一题一题解决！' },
  ],
  // ── 3. 时间之城 🆕 ──
  world_3: [
    { name: '认识钟表', desc: '时针分针会说话', type: 'normal', tip: '短的是时针，长的是分针，转一圈是60分钟' },
    { name: '时间计算', desc: '过了多久了？', type: 'normal', tip: '结束时间－开始时间＝经过时间' },
    { name: '时分秒换算', desc: '1小时=60分钟', type: 'normal', tip: '时→分×60，分→秒×60，反过来÷60' },
    { name: '日历与日期', desc: '今天是几月几号？', type: 'normal', tip: '大月31天，小月30天，2月最特别' },
    { name: '时钟巨像', desc: '打败时钟巨像！', type: 'boss', enemyName: '时钟巨像', enemyEmoji: '🕰️', tip: '时间问题难不倒你，细心计算！' },
  ],
  // ── 4. 测量山谷 🆕 ──
  world_4: [
    { name: '长度探秘', desc: '米和厘米的世界', type: 'normal', tip: '1米=100厘米，大拇指宽约1厘米' },
    { name: '重量称量', desc: '千克和克谁更重', type: 'normal', tip: '1千克=1000克，一个苹果约200克' },
    { name: '容积初识', desc: '升和毫升装水', type: 'normal', tip: '1升=1000毫升，一瓶水约500毫升' },
    { name: '单位大练兵', desc: '各种单位一起练', type: 'normal', tip: '单位换算要用乘法或除法，看清是变大还是变小' },
    { name: '山谷巨人', desc: '打败石巨人！', type: 'boss', enemyName: '石巨人', enemyEmoji: '🗿', tip: '测量单位你都掌握了吗？上吧！' },
  ],
  // ── 5. 图形森林 ──
  world_5: [
    { name: '认识图形', desc: '找找身边的形状', type: 'normal', tip: '圆形没有角，三角形有三个角～' },
    { name: '图形拼接', desc: '把图形拼起来', type: 'normal', tip: '两个三角形可以拼成一个平行四边形！' },
    { name: '图形计数', desc: '数数有多少个', type: 'normal', tip: '小心别数漏了藏在里面的小图形' },
    { name: '立体图形', desc: '认识方块和球', type: 'normal', tip: '正方体每个面都是正方形！圆柱像罐头～' },
    { name: '森林巨人', desc: '打败巨人树精！', type: 'boss', enemyName: '巨人树精', enemyEmoji: '🌳', tip: '图形世界的一切都在你脑中！' },
  ],
  // ── 6. 规律迷宫 ──
  world_6: [
    { name: '找规律入门', desc: '下一个是什么？', type: 'normal', tip: '看看前面的几个，有什么相同的模式？' },
    { name: '图形规律', desc: '图案的秘密', type: 'normal', tip: '颜色、形状、方向都可能是有规律的' },
    { name: '数字规律', desc: '数字的舞蹈', type: 'normal', tip: '看看相邻两个数字之间差了多少' },
    { name: '数列填空', desc: '补全数字队伍', type: 'normal', tip: '1, 3, 5, ?, 9 … 每次加了2！' },
    { name: '迷宫之主', desc: '打败迷宫守护者！', type: 'boss', enemyName: '迷宫守护者', enemyEmoji: '🗿', tip: '规律就在眼前，细心观察！' },
  ],
  // ── 7. 乘除山峰 ──
  world_7: [
    { name: '乘法口诀山脚', desc: '人人都要会乘法', type: 'normal', tip: '2×3 就是 2+2+2，加了3次' },
    { name: '除法入门', desc: '把东西平均分', type: 'normal', tip: '12个苹果分给3个人，每人几个？' },
    { name: '乘除混合', desc: '乘法和除法一起用', type: 'normal', tip: '先算乘除，再算加减' },
    { name: '巧算乘除', desc: '找找简便方法', type: 'normal', tip: '25×4=100，记住了超方便！' },
    { name: '山巅巨龙', desc: '打败山顶巨龙！', type: 'boss', enemyName: '山顶巨龙', enemyEmoji: '🐉', tip: '乘法口诀背熟了吗？全力以赴！' },
  ],
  // ── 8. 智慧城堡 ──
  world_8: [
    { name: '逻辑判断', desc: '谁说的是真话？', type: 'normal', tip: '假设一个人说的是真的，看看其他人是否矛盾' },
    { name: '植树与排队', desc: '种树和排队有学问', type: 'normal', tip: '两端都种：棵数=间隔+1；一端不种：棵数=间隔' },
    { name: '鸡兔同笼', desc: '数头又数脚', type: 'normal', tip: '先假设全是鸡，看看差了几只脚' },
    { name: '数字推理', desc: '破解数字密码', type: 'normal', tip: '注意每个数位上的数字规律' },
    { name: '城堡守卫长', desc: '击败守卫长！', type: 'boss', enemyName: '石像守卫长', enemyEmoji: '🗽', tip: '所有逻辑技巧综合运用！' },
  ],
  // ── 9. 几何王国 ──
  world_9: [
    { name: '周长探险', desc: '边走边量周长', type: 'normal', tip: '周长就是图形跑一圈的长度' },
    { name: '面积魔法', desc: '算算地面有多大', type: 'normal', tip: '长方形面积 = 长 × 宽' },
    { name: '图形分割', desc: '把大图形切开', type: 'normal', tip: '切成几个简单图形，分别算再相加' },
    { name: '体积与角度', desc: '三维空间探索', type: 'normal', tip: '长×宽×高=体积，角的单位是度' },
    { name: '王国巨像', desc: '击败几何巨像！', type: 'boss', enemyName: '几何巨像', enemyEmoji: '🗼', tip: '周长面积体积角度，全在你的掌握中！' },
  ],
  // ── 10. 商业广场 🆕 ──
  world_10: [
    { name: '认识钱币', desc: '元角分交朋友', type: 'normal', tip: '1元=10角，1角=10分，买东西先看价格' },
    { name: '购物达人', desc: '买卖中的数学', type: 'normal', tip: '找回的钱=付出的钱－东西的价格' },
    { name: '利润密码', desc: '赚了还是亏了？', type: 'normal', tip: '利润=售价－成本，正数就赚了' },
    { name: '精打细算', desc: '分段计费和优惠', type: 'normal', tip: '不同段价格不一样，一段一段算清楚' },
    { name: '铁算盘老板', desc: '挑战铁算盘！', type: 'boss', enemyName: '铁算盘老板', enemyEmoji: '🧮', tip: '算钱可不能马虎，一毛钱都不能差！' },
  ],
  // ── 11. 应用之海 ──
  world_11: [
    { name: '和差问题', desc: '知道和，知道差', type: 'normal', tip: '（和+差）÷2 = 大数' },
    { name: '倍数问题', desc: '谁是谁的几倍？', type: 'normal', tip: '画线段图，一目了然！' },
    { name: '行程问题', desc: '谁先到终点？', type: 'normal', tip: '路程 = 速度 × 时间' },
    { name: '盈亏与容斥', desc: '多了少了怎么办', type: 'normal', tip: '（盈+亏）÷两次分配差=人数；A+B-AB=总' },
    { name: '海怪克拉肯', desc: '击败深海巨怪！', type: 'boss', enemyName: '海怪克拉肯', enemyEmoji: '🐋', tip: '应用题就是在讲故事，先读懂故事！' },
  ],
  // ── 12. 方程天平 🆕 ──
  world_12: [
    { name: '等式的秘密', desc: '天平两边一样重', type: 'normal', tip: '等式两边同时加减乘除同一个数，等式仍然成立' },
    { name: '解方程入门', desc: '揭开未知数的面纱', type: 'normal', tip: '一步一步反着算，就能找到x是多少' },
    { name: '列方程解题', desc: '用字母代替数字', type: 'normal', tip: '把不知道的数用x表示，再按题意列等式' },
    { name: '比例大冒险', desc: '比和比例很好用', type: 'normal', tip: '两个比相等就是比例，交叉相乘相等' },
    { name: '天平守护者', desc: '击败天平守护者！', type: 'boss', enemyName: '天平守护者', enemyEmoji: '🎚️', tip: '方程是数学的魔法棒，善用它！' },
  ],
  // ── 13. 分数星云 ──
  world_13: [
    { name: '认识分数', desc: '分披萨学分数', type: 'normal', tip: '1/2 就是把一个东西分成两份取一份' },
    { name: '分数加减', desc: '分数一起算', type: 'normal', tip: '分母一样才能直接加减分子' },
    { name: '小数世界', desc: '小数点的大作用', type: 'normal', tip: '0.5 就是 5/10，小数和分数是一家' },
    { name: '百分数与负数', desc: '百分之几和零下温度', type: 'normal', tip: '50%就是一半，-5°C是零下5度' },
    { name: '星云之主', desc: '打败星云领主！', type: 'boss', enemyName: '星云领主', enemyEmoji: '🌠', tip: '分数小数百分数负数，数字世界全在你手里！' },
  ],
  // ── 14. 数据之塔 🆕 ──
  world_14: [
    { name: '分类与整理', desc: '把东西分分类', type: 'normal', tip: '按颜色、按大小、按种类…分类的方法有很多' },
    { name: '统计图表', desc: '柱状图和折线图', type: 'normal', tip: '柱状图比高低，折线图看趋势变化' },
    { name: '平均数', desc: '大家一起平均分', type: 'normal', tip: '平均数=总数÷个数，不一定是正好谁的数' },
    { name: '可能性', desc: '一定？可能？不可能？', type: 'normal', tip: '一定=100%，不可能=0%，可能介于之间' },
    { name: '数据魔像', desc: '打败数据魔像！', type: 'boss', enemyName: '数据魔像', enemyEmoji: '📈', tip: '图表会说话，读懂数据背后的故事！' },
  ],
  // ── 15. 终极试炼 ──
  world_15: [
    { name: '综合大考验', desc: '什么都来一点', type: 'normal', tip: '冷静思考，每道题都不一样的解法' },
    { name: '数论探秘', desc: '数字的秘密', type: 'normal', tip: '质数、合数、因数、倍数…都是好朋友' },
    { name: '组合与策略', desc: '排列组合和博弈', type: 'normal', tip: '先考虑所有可能，再找出最有利的选择' },
    { name: '决战集训', desc: '难题大冲刺', type: 'normal', tip: '把最难的题目集中起来，一鼓作气拿下！' },
    { name: '最终Boss', desc: '终极决战！', type: 'boss', enemyName: '混沌魔王', enemyEmoji: '😈', tip: '你学的所有知识都在这里了，冲啊！' },
  ],
};

// ====== 生成完整冒险世界数据 ======

function buildAdventureWorlds(): AdventureWorld[] {
  return WORLDS_META.map((meta) => {
    const stageDefs = STAGE_NAMES[meta.id] || [];
    
    const stages: AdventureStage[] = stageDefs.map((def, stageIdx) => {
      const seed = `adventure_${meta.id}_stage_${stageIdx}`;
      const tMin = def.type === 'boss' ? Math.min(meta.tierMax, meta.tierMin + 1) : meta.tierMin;
      const tMax = def.type === 'boss' ? Math.min(meta.tierMax + 1, 4) : meta.tierMax;
      const questionIds = selectQuestions(tMin, tMax, seed, 5);

      return {
        id: `${meta.id}_stage_${stageIdx + 1}`,
        worldId: meta.id,
        name: def.name,
        description: def.desc,
        stageNumber: stageIdx + 1,
        type: def.type,
        questionIds,
        rewardGems: def.type === 'boss' ? 30 : def.type === 'bonus' ? 20 : 10,
        badgeId: def.type === 'boss' ? `badge_boss_${meta.id}` : undefined,
        enemyName: def.enemyName,
        enemyEmoji: def.enemyEmoji,
        tip: def.tip,
      };
    });

    return {
      id: meta.id,
      name: meta.name,
      emoji: meta.emoji,
      subtitle: meta.subtitle,
      description: meta.description,
      themeColor: meta.themeColor,
      bgGradient: meta.bgGradient,
      lightColor: meta.lightColor,
      stages,
    };
  });
}

export const ADVENTURE_WORLDS: AdventureWorld[] = buildAdventureWorlds();

// ====== 徽章系统 ======

export const ADVENTURE_BADGES: AdventureBadge[] = [
  { id: 'badge_first_stage', name: '初次冒险', emoji: '🌟', description: '通过第一个关卡', condition: '完成任意一个关卡' },
  { id: 'badge_10_stages', name: '冒险达人', emoji: '⭐', description: '通过10个关卡', condition: '累计完成10个关卡' },
  { id: 'badge_25_stages', name: '冒险专家', emoji: '🏅', description: '通过25个关卡', condition: '累计完成25个关卡' },
  { id: 'badge_50_stages', name: '冒险大师', emoji: '🎖️', description: '通过50个关卡', condition: '累计完成50个关卡' },
  { id: 'badge_all_stages', name: '冒险之王', emoji: '👑', description: '全部75关通关！', condition: '完成所有75个关卡' },
  { id: 'badge_perfect', name: '完美通关', emoji: '💎', description: '一个关卡全部答对', condition: '任一关卡5题全对' },
  { id: 'badge_100_gems', name: '宝石猎人', emoji: '💠', description: '收集100颗宝石', condition: '累计获得100颗宝石' },
  { id: 'badge_500_gems', name: '宝石大亨', emoji: '🔮', description: '收集500颗宝石', condition: '累计获得500颗宝石' },
  { id: 'badge_1000_gems', name: '宝石传说', emoji: '💍', description: '收集1000颗宝石', condition: '累计获得1000颗宝石' },
  { id: 'badge_boss_5', name: 'Boss杀手', emoji: '⚔️', description: '击败5个Boss', condition: '打败5个世界Boss' },
  { id: 'badge_boss_10', name: 'Boss猎人', emoji: '🗡️', description: '击败10个Boss', condition: '打败10个世界Boss' },
  { id: 'badge_boss_all', name: 'Boss终结者', emoji: '🏆', description: '击败所有15个Boss！', condition: '打败全部15个世界Boss' },
  { id: 'badge_speed', name: '闪电答题', emoji: '⚡', description: '快速通关一关', condition: '任一关卡用时少于60秒' },
];

// ====== 便捷查询 ======

export function getWorldById(id: string): AdventureWorld | undefined {
  return ADVENTURE_WORLDS.find(w => w.id === id);
}

export function getStageById(stageId: string): AdventureStage | undefined {
  for (const world of ADVENTURE_WORLDS) {
    const stage = world.stages.find(s => s.id === stageId);
    if (stage) return stage;
  }
  return undefined;
}

export function getWorldByStageId(stageId: string): AdventureWorld | undefined {
  for (const world of ADVENTURE_WORLDS) {
    if (world.stages.some(s => s.id === stageId)) return world;
  }
  return undefined;
}

export function getTotalStages(): number {
  return ADVENTURE_WORLDS.reduce((sum, w) => sum + w.stages.length, 0);
}

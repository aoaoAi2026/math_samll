// 完整的知识点分类系统 - 基于历年奥数竞赛真题整理
export interface KnowledgeChapter {
  id: number;
  name: string;
  topics: KnowledgeTopic[];
}

export interface KnowledgeTopic {
  id: number;
  name: string;
  difficulty: number; // 1-4
  description: string;
}

// 一年级知识点（20+类型）
export const grade1Topics: KnowledgeChapter[] = [
  {
    id: 1,
    name: '数与计算',
    topics: [
      { id: 101, name: '20以内加减法', difficulty: 1, description: '凑十法、破十法应用' },
      { id: 102, name: '100以内数的认知', difficulty: 1, description: '数的顺序、比较、数位概念' },
      { id: 103, name: '简单巧算', difficulty: 2, description: '凑整思想、基准数法' },
      { id: 104, name: '数的分与合', difficulty: 1, description: '把一个数拆分成两个数' },
    ]
  },
  {
    id: 2,
    name: '图形认知',
    topics: [
      { id: 201, name: '基础图形识别', difficulty: 1, description: '圆、正方形、三角形、长方形' },
      { id: 202, name: '图形计数', difficulty: 2, description: '数图形个数、分类计数' },
      { id: 203, name: '图形拼组', difficulty: 2, description: '用基本图形拼成复杂图形' },
      { id: 204, name: '立体图形', difficulty: 2, description: '正方体、长方体、圆柱、球' },
      { id: 205, name: '图形找规律', difficulty: 3, description: '发现图形的变化规律' },
    ]
  },
  {
    id: 3,
    name: '逻辑推理',
    topics: [
      { id: 301, name: '比大小', difficulty: 1, description: '比多少、比长短、比高矮' },
      { id: 302, name: '简单分类', difficulty: 1, description: '按特征分类' },
      { id: 303, name: '排队问题', difficulty: 2, description: '前后人数、位置关系' },
      { id: 304, name: '简单推理', difficulty: 2, description: '根据条件推理' },
      { id: 305, name: '火柴棍游戏', difficulty: 3, description: '移动火柴棍改变图形或等式' },
    ]
  },
  {
    id: 4,
    name: '应用题入门',
    topics: [
      { id: 401, name: '简单应用题', difficulty: 1, description: '一步计算的应用题' },
      { id: 402, name: '多余条件应用题', difficulty: 2, description: '识别并排除干扰信息' },
      { id: 403, name: '年龄问题初步', difficulty: 2, description: '年龄差不变' },
      { id: 404, name: '排队应用题', difficulty: 2, description: '结合排队的实际问题' },
    ]
  },
  {
    id: 5,
    name: '规律探索',
    topics: [
      { id: 501, name: '数字排列规律', difficulty: 1, description: '找数列规律' },
      { id: 502, name: '图形排列规律', difficulty: 2, description: '图形周期排列' },
      { id: 503, name: '简单周期问题', difficulty: 2, description: '周期现象与余数' },
    ]
  },
  {
    id: 6,
    name: '时间与钟表',
    topics: [
      { id: 601, name: '认识整时半时', difficulty: 1, description: '整点和半点' },
      { id: 602, name: '经过时间', difficulty: 2, description: '计算时间间隔' },
      { id: 603, name: '钟表问题', difficulty: 3, description: '时针分针角度问题' },
    ]
  },
  {
    id: 7,
    name: '位置与方向',
    topics: [
      { id: 701, name: '认识位置', difficulty: 1, description: '上下左右前后' },
      { id: 702, name: '简单路线', difficulty: 2, description: '数格子走路线' },
    ]
  },
  {
    id: 8,
    name: '统计与概率',
    topics: [
      { id: 801, name: '简单统计', difficulty: 1, description: '分类计数、象形统计' },
      { id: 802, name: '可能性大小', difficulty: 2, description: '哪个更容易发生' },
    ]
  },
  {
    id: 9,
    name: '益智趣题',
    topics: [
      { id: 901, name: '趣味数学', difficulty: 2, description: '数学游戏与趣题' },
      { id: 902, name: '一笔画', difficulty: 3, description: '能否一笔画出图形' },
      { id: 903, name: '找不同', difficulty: 2, description: '发现不同或找规律' },
    ]
  },
  {
    id: 10,
    name: '综合应用',
    topics: [
      { id: 1001, name: '综合训练', difficulty: 3, description: '多知识点综合题目' },
      { id: 1002, name: '竞赛真题', difficulty: 4, description: '历年竞赛精选题' },
    ]
  },
  {
    id: 11,
    name: '单数与双数',
    topics: [
      { id: 1101, name: '单双数识别', difficulty: 1, description: '认识单数和双数' },
      { id: 1102, name: '单双数加减规律', difficulty: 2, description: '单双数相加的奇偶性' },
      { id: 1103, name: '单双数应用', difficulty: 3, description: '单双数在生活中的应用' },
    ]
  },
  {
    id: 12,
    name: '数阵图入门',
    topics: [
      { id: 1201, name: '简单数阵', difficulty: 2, description: '三角形、正方形填数' },
      { id: 1202, name: '三阶幻方', difficulty: 3, description: '三阶幻方的性质与填法' },
    ]
  },
  {
    id: 13,
    name: '巧移火柴棒',
    topics: [
      { id: 1301, name: '移动火柴变等式', difficulty: 2, description: '移动火柴棒使等式成立' },
      { id: 1302, name: '火柴棒图形变换', difficulty: 3, description: '移动火柴棒改变图形' },
    ]
  },
  {
    id: 14,
    name: '排队问题进阶',
    topics: [
      { id: 1401, name: '复杂排队', difficulty: 2, description: '多人排队位置关系' },
      { id: 1402, name: '方阵排队', difficulty: 3, description: '方阵中的位置计算' },
    ]
  },
  {
    id: 15,
    name: '综合提高',
    topics: [
      { id: 1501, name: '多知识点综合', difficulty: 3, description: '多个知识点综合运用' },
      { id: 1502, name: '竞赛模拟', difficulty: 4, description: '模拟竞赛题训练' },
    ]
  },
];

// 二年级知识点（25+类型）
export const grade2Topics: KnowledgeChapter[] = [
  {
    id: 1,
    name: '计算进阶',
    topics: [
      { id: 101, name: '表内乘法', difficulty: 1, description: '乘法口诀表' },
      { id: 102, name: '表内除法', difficulty: 1, description: '平均分' },
      { id: 103, name: '乘除法应用', difficulty: 2, description: '乘除法实际问题' },
      { id: 104, name: '巧算与速算', difficulty: 2, description: '乘法分配律、凑整' },
      { id: 105, name: '混合运算', difficulty: 2, description: '乘除加减混合' },
    ]
  },
  {
    id: 2,
    name: '图形与几何',
    topics: [
      { id: 201, name: '图形计数进阶', difficulty: 2, description: '复杂图形计数' },
      { id: 202, name: '图形找规律', difficulty: 2, description: '旋转、翻转、平移规律' },
      { id: 203, name: '正方形展开图', difficulty: 3, description: '正方体的11种展开图' },
      { id: 204, name: '数图形综合', difficulty: 3, description: '多种图形综合计数' },
    ]
  },
  {
    id: 3,
    name: '数列与规律',
    topics: [
      { id: 301, name: '等差数列', difficulty: 2, description: '简单等差数列找规律' },
      { id: 302, name: '数表规律', difficulty: 3, description: '数表中的规律探索' },
      { id: 303, name: '图形数列综合', difficulty: 3, description: '图形与数列结合' },
    ]
  },
  {
    id: 4,
    name: '枚举与排列',
    topics: [
      { id: 401, name: '简单枚举', difficulty: 2, description: '有序枚举不重复不遗漏' },
      { id: 402, name: '排队问题', difficulty: 2, description: '排列组合初步' },
      { id: 403, name: '搭配问题', difficulty: 2, description: '穿衣搭配、路线选择' },
      { id: 404, name: '简单排列', difficulty: 3, description: '几个数字排几位数' },
    ]
  },
  {
    id: 5,
    name: '应用题提升',
    topics: [
      { id: 501, name: '和倍问题初步', difficulty: 2, description: '已知和与倍关系' },
      { id: 502, name: '差倍问题初步', difficulty: 2, description: '已知差与倍关系' },
      { id: 503, name: '和差问题初步', difficulty: 2, description: '已知和与差' },
      { id: 504, name: '年龄问题', difficulty: 2, description: '年龄差不变原理' },
      { id: 505, name: '鸡兔同笼初步', difficulty: 3, description: '列表法解鸡兔同笼' },
    ]
  },
  {
    id: 6,
    name: '周期问题',
    topics: [
      { id: 601, name: '简单周期', difficulty: 2, description: '周期现象与余数' },
      { id: 602, name: '日期周期', difficulty: 2, description: '星期几的计算' },
      { id: 603, name: '周期应用', difficulty: 3, description: '综合周期问题' },
    ]
  },
  {
    id: 7,
    name: '逻辑推理',
    topics: [
      { id: 701, name: '简单推理', difficulty: 2, description: '条件分析与推理' },
      { id: 702, name: '真话假话', difficulty: 3, description: '逻辑判断问题' },
      { id: 703, name: '等量代换', difficulty: 3, description: '简单的等量代换' },
    ]
  },
  {
    id: 8,
    name: '时间问题',
    topics: [
      { id: 801, name: '时间计算', difficulty: 2, description: '经过时间、开始结束时间' },
      { id: 802, name: '钟表角度', difficulty: 3, description: '时针分针夹角' },
    ]
  },
  {
    id: 9,
    name: '植树问题',
    topics: [
      { id: 901, name: '植树问题基础', difficulty: 2, description: '三种情况：两端种、一端种、两端不种' },
      { id: 902, name: '植树问题应用', difficulty: 3, description: '实际问题转化' },
    ]
  },
  {
    id: 10,
    name: '益智游戏',
    topics: [
      { id: 1001, name: '火柴棍游戏', difficulty: 2, description: '移动火柴棍变图形或算式' },
      { id: 1002, name: '一笔画进阶', difficulty: 3, description: '判断能否一笔画' },
      { id: 1003, name: '数字谜', difficulty: 3, description: '填数字使等式成立' },
      { id: 1004, name: '趣味数学', difficulty: 3, description: '数学游戏趣题' },
    ]
  },
  {
    id: 11,
    name: '综合与竞赛',
    topics: [
      { id: 1101, name: '综合训练', difficulty: 3, description: '多知识点综合' },
      { id: 1102, name: '竞赛真题', difficulty: 4, description: '历年竞赛精选' },
    ]
  },
  {
    id: 12,
    name: '数阵图与幻方',
    topics: [
      { id: 1201, name: '三阶幻方', difficulty: 2, description: '三阶幻方填法与性质' },
      { id: 1202, name: '数阵图推理', difficulty: 3, description: '三角形、辐射型数阵' },
    ]
  },
  {
    id: 13,
    name: '一笔画问题',
    topics: [
      { id: 1301, name: '一笔画判断', difficulty: 2, description: '奇点偶点与一笔画' },
      { id: 1302, name: '一笔画应用', difficulty: 3, description: '最少笔画数与实际应用' },
    ]
  },
  {
    id: 14,
    name: '巧算与速算',
    topics: [
      { id: 1401, name: '凑整法', difficulty: 2, description: '凑整与基准数法' },
      { id: 1402, name: '乘法巧算', difficulty: 3, description: '乘法分配律与凑整' },
    ]
  },
  {
    id: 15,
    name: '综合提高',
    topics: [
      { id: 1501, name: '多知识点综合', difficulty: 3, description: '多个知识点综合运用' },
      { id: 1502, name: '竞赛模拟', difficulty: 4, description: '模拟竞赛题训练' },
    ]
  },
];

// 三年级知识点（30+类型）
export const grade3Topics: KnowledgeChapter[] = [
  {
    id: 1,
    name: '计算提高',
    topics: [
      { id: 101, name: '加减巧算', difficulty: 1, description: '凑整、带着符号搬家' },
      { id: 102, name: '乘除巧算', difficulty: 2, description: '乘法分配律、提取公因数' },
      { id: 103, name: '等差数列求和', difficulty: 2, description: '高斯求和公式' },
      { id: 104, name: '定义新运算', difficulty: 3, description: '规定一种新的运算符号' },
    ]
  },
  {
    id: 2,
    name: '数论入门',
    topics: [
      { id: 201, name: '整除特征', difficulty: 2, description: '能被2、3、5、9、11整除的数' },
      { id: 202, name: '质数合数', difficulty: 2, description: '质数与合数的认识' },
      { id: 203, name: '因数倍数', difficulty: 2, description: '最大公约数、最小公倍数' },
      { id: 204, name: '余数问题', difficulty: 3, description: '带余除法、余数定理' },
    ]
  },
  {
    id: 3,
    name: '图形与几何',
    topics: [
      { id: 301, name: '巧求周长', difficulty: 2, description: '平移法求周长' },
      { id: 302, name: '长方形正方形面积', difficulty: 2, description: '面积公式应用' },
      { id: 303, name: '复杂图形面积', difficulty: 3, description: '割补法、等积变换' },
      { id: 304, name: '格点与面积', difficulty: 3, description: '皮克定理初步' },
    ]
  },
  {
    id: 4,
    name: '和差倍问题',
    topics: [
      { id: 401, name: '和差问题', difficulty: 1, description: '大数=(和+差)÷2，小数=(和-差)÷2' },
      { id: 402, name: '和倍问题', difficulty: 2, description: '画线段图找倍关系' },
      { id: 403, name: '差倍问题', difficulty: 2, description: '画线段图找差倍关系' },
      { id: 404, name: '多个量的和差倍', difficulty: 3, description: '三个量及以上的和差倍' },
    ]
  },
  {
    id: 5,
    name: '经典应用题',
    topics: [
      { id: 501, name: '鸡兔同笼', difficulty: 3, description: '假设法解鸡兔同笼' },
      { id: 502, name: '盈亏问题', difficulty: 3, description: '盈盈、盈亏、亏亏问题' },
      { id: 503, name: '归一问题', difficulty: 2, description: '先求单一量' },
      { id: 504, name: '平均数问题', difficulty: 2, description: '总数量÷总份数' },
      { id: 505, name: '还原问题', difficulty: 3, description: '逆推法解还原问题' },
      { id: 506, name: '年龄问题', difficulty: 3, description: '年龄问题的综合应用' },
    ]
  },
  {
    id: 6,
    name: '行程问题',
    topics: [
      { id: 601, name: '相遇问题', difficulty: 3, description: '速度和×相遇时间=路程和' },
      { id: 602, name: '追及问题', difficulty: 3, description: '速度差×追及时间=路程差' },
      { id: 603, name: '火车过桥', difficulty: 3, description: '车长+桥长=路程' },
    ]
  },
  {
    id: 7,
    name: '植树问题',
    topics: [
      { id: 701, name: '植树问题综合', difficulty: 2, description: '三种情况的应用' },
      { id: 702, name: '植树问题变式', difficulty: 3, description: '敲钟、锯木头等问题' },
    ]
  },
  {
    id: 8,
    name: '周期与规律',
    topics: [
      { id: 801, name: '周期问题', difficulty: 2, description: '周期现象的应用' },
      { id: 802, name: '数表规律', difficulty: 3, description: '数表中的数找出规律' },
      { id: 803, name: '幻方与数阵', difficulty: 3, description: '简单幻方的填法' },
    ]
  },
  {
    id: 9,
    name: '数字谜',
    topics: [
      { id: 901, name: '竖式数字谜', difficulty: 2, description: '加减乘除竖式中的空格' },
      { id: 902, name: '横式数字谜', difficulty: 3, description: '填算符或数字使等式成立' },
      { id: 903, name: '巧填算符', difficulty: 3, description: '在数字间填运算符号' },
    ]
  },
  {
    id: 10,
    name: '逻辑与推理',
    topics: [
      { id: 1001, name: '逻辑推理', difficulty: 3, description: '条件分析与推理' },
      { id: 1002, name: '体育比赛', difficulty: 3, description: '比赛积分问题' },
    ]
  },
  {
    id: 11,
    name: '组合趣题',
    topics: [
      { id: 1101, name: '一笔画问题', difficulty: 3, description: '欧拉回路初步' },
      { id: 1102, name: '最短路线', difficulty: 3, description: '标数法求最短路线' },
      { id: 1103, name: '统筹规划', difficulty: 3, description: '合理安排时间或顺序' },
    ]
  },
  {
    id: 12,
    name: '综合与竞赛',
    topics: [
      { id: 1201, name: '综合训练', difficulty: 3, description: '多知识点综合' },
      { id: 1202, name: '竞赛真题', difficulty: 4, description: '历年竞赛精选' },
    ]
  },
  {
    id: 13,
    name: '等差数列',
    topics: [
      { id: 1301, name: '等差数列基础', difficulty: 2, description: '公差、项数、求和公式' },
      { id: 1302, name: '等差数列应用', difficulty: 3, description: '高斯求和与实际应用' },
    ]
  },
  {
    id: 14,
    name: '植树问题进阶',
    topics: [
      { id: 1401, name: '植树变式', difficulty: 2, description: '锯木头、爬楼梯、敲钟问题' },
      { id: 1402, name: '植树综合', difficulty: 3, description: '多种植树问题综合' },
    ]
  },
  {
    id: 15,
    name: '综合提高',
    topics: [
      { id: 1501, name: '多知识点综合', difficulty: 3, description: '多个知识点综合运用' },
      { id: 1502, name: '竞赛模拟', difficulty: 4, description: '模拟竞赛题训练' },
    ]
  },
];

// 四年级知识点（35+类型）
export const grade4Topics: KnowledgeChapter[] = [
  {
    id: 1,
    name: '计算进阶',
    topics: [
      { id: 101, name: '大数运算', difficulty: 1, description: '亿以内数的运算' },
      { id: 102, name: '简便计算综合', difficulty: 2, description: '各种巧算技巧综合' },
      { id: 103, name: '等差数列', difficulty: 2, description: '等差数列公式应用' },
      { id: 104, name: '定义新运算', difficulty: 3, description: '复杂的新运算定义' },
      { id: 105, name: '数列求和', difficulty: 3, description: '复杂数列求和' },
    ]
  },
  {
    id: 2,
    name: '数论进阶',
    topics: [
      { id: 201, name: '整除进阶', difficulty: 2, description: '复杂整除特征判断' },
      { id: 202, name: '质数合数进阶', difficulty: 2, description: '质数的性质与应用' },
      { id: 203, name: '分解质因数', difficulty: 2, description: '短除法分解质因数' },
      { id: 204, name: '最大公约数', difficulty: 2, description: '辗转相除法' },
      { id: 205, name: '最小公倍数', difficulty: 2, description: '两数与积的关系' },
      { id: 206, name: '完全平方数', difficulty: 3, description: '完全平方数的特征' },
    ]
  },
  {
    id: 3,
    name: '几何提高',
    topics: [
      { id: 301, name: '多边形内角和', difficulty: 2, description: '多边形内角和公式' },
      { id: 302, name: '面积计算进阶', difficulty: 2, description: '组合图形面积' },
      { id: 303, name: '等积变形', difficulty: 3, description: '等底等高、等积变换' },
      { id: 304, name: '一半模型', difficulty: 3, description: '几何中的一半关系' },
      { id: 305, name: '蝴蝶模型', difficulty: 3, description: '梯形中的蝴蝶模型' },
      { id: 306, name: '圆与扇形', difficulty: 3, description: '圆的周长和面积' },
    ]
  },
  {
    id: 4,
    name: '行程问题',
    topics: [
      { id: 401, name: '相遇问题进阶', difficulty: 2, description: '不同时出发相遇' },
      { id: 402, name: '追及问题进阶', difficulty: 2, description: '复杂追及问题' },
      { id: 403, name: '火车过桥问题', difficulty: 3, description: '火车与桥、隧道问题' },
      { id: 404, name: '流水行船', difficulty: 3, description: '顺水逆水速度问题' },
      { id: 405, name: '环形跑道', difficulty: 3, description: '同向反向相遇追及' },
      { id: 406, name: '多次相遇', difficulty: 4, description: '复杂多次相遇问题' },
    ]
  },
  {
    id: 5,
    name: '应用题综合',
    topics: [
      { id: 501, name: '和差倍问题综合', difficulty: 2, description: '复杂和差倍' },
      { id: 502, name: '鸡兔同笼进阶', difficulty: 3, description: '复杂鸡兔同笼' },
      { id: 503, name: '盈亏问题进阶', difficulty: 3, description: '复杂盈亏问题' },
      { id: 504, name: '工程问题', difficulty: 3, description: '合作完成工作问题' },
      { id: 505, name: '浓度问题', difficulty: 3, description: '配溶液问题' },
      { id: 506, name: '经济问题', difficulty: 3, description: '利润、成本、定价' },
    ]
  },
  {
    id: 6,
    name: '植树问题',
    topics: [
      { id: 601, name: '植树问题综合', difficulty: 2, description: '各种植树问题' },
      { id: 602, name: '植树问题变式', difficulty: 3, description: '敲钟、挂气球等问题' },
    ]
  },
  {
    id: 7,
    name: '统计与容斥',
    topics: [
      { id: 701, name: '平均数进阶', difficulty: 2, description: '加权平均数' },
      { id: 702, name: '容斥原理', difficulty: 3, description: '两量、三量容斥' },
      { id: 703, name: '抽屉原理', difficulty: 4, description: '鸽巢原理应用' },
    ]
  },
  {
    id: 8,
    name: '数字谜与算式',
    topics: [
      { id: 801, name: '竖式数字谜进阶', difficulty: 3, description: '复杂竖式谜题' },
      { id: 802, name: '横式数字谜', difficulty: 3, description: '填运算符号' },
      { id: 803, name: '数阵图', difficulty: 3, description: '幻方、辐射阵' },
      { id: 804, name: '进制问题', difficulty: 3, description: '二进制、五进制等' },
    ]
  },
  {
    id: 9,
    name: '逻辑推理',
    topics: [
      { id: 901, name: '逻辑推理进阶', difficulty: 3, description: '复杂逻辑问题' },
      { id: 902, name: '体育比赛', difficulty: 3, description: '比赛胜负分析' },
      { id: 903, name: '真话假话进阶', difficulty: 4, description: '复杂真话假话问题' },
    ]
  },
  {
    id: 10,
    name: '组合数学',
    topics: [
      { id: 1001, name: '加法原理', difficulty: 2, description: '分类计数' },
      { id: 1002, name: '乘法原理', difficulty: 2, description: '分步计数' },
      { id: 1003, name: '排列组合', difficulty: 3, description: '排列与组合' },
      { id: 1004, name: '最短路线', difficulty: 3, description: '格点路线问题' },
      { id: 1005, name: '递推与归纳', difficulty: 4, description: '找规律递推' },
    ]
  },
  {
    id: 11,
    name: '益智趣题',
    topics: [
      { id: 1101, name: '统筹优化', difficulty: 3, description: '时间优化问题' },
      { id: 1102, name: '策略问题', difficulty: 4, description: '必胜策略问题' },
      { id: 1103, name: '最值问题', difficulty: 4, description: '最大最小问题' },
    ]
  },
  {
    id: 12,
    name: '综合与竞赛',
    topics: [
      { id: 1201, name: '综合训练', difficulty: 3, description: '多知识点综合' },
      { id: 1202, name: '竞赛真题', difficulty: 4, description: '历年竞赛精选' },
    ]
  },
  {
    id: 13,
    name: '博弈与策略',
    topics: [
      { id: 1301, name: '取物游戏', difficulty: 3, description: '取石子、抢数等游戏策略' },
      { id: 1302, name: '必胜策略', difficulty: 4, description: '分析必胜必败局面' },
    ]
  },
  {
    id: 14,
    name: '行程问题进阶',
    topics: [
      { id: 1401, name: '火车过桥', difficulty: 3, description: '车长与桥长问题' },
      { id: 1402, name: '环形跑道', difficulty: 3, description: '环形相遇追及' },
    ]
  },
  {
    id: 15,
    name: '综合提高',
    topics: [
      { id: 1501, name: '多知识点综合', difficulty: 3, description: '多个知识点综合运用' },
      { id: 1502, name: '竞赛模拟', difficulty: 4, description: '模拟竞赛题训练' },
    ]
  },
];

// 五年级知识点（40+类型）
export const grade5Topics: KnowledgeChapter[] = [
  {
    id: 1,
    name: '数与运算',
    topics: [
      { id: 101, name: '小数运算', difficulty: 1, description: '小数四则运算' },
      { id: 102, name: '分数运算', difficulty: 2, description: '分数四则运算' },
      { id: 103, name: '循环小数', difficulty: 2, description: '循环小数与分数互化' },
      { id: 104, name: '繁分数', difficulty: 3, description: '繁分数的化简' },
      { id: 105, name: '裂项相消', difficulty: 3, description: '分数裂项求和' },
    ]
  },
  {
    id: 2,
    name: '数论进阶',
    topics: [
      { id: 201, name: '数论综合', difficulty: 3, description: '整除、余数、质数综合' },
      { id: 202, name: '完全数与亲和数', difficulty: 3, description: '完全数概念' },
      { id: 203, name: '同余问题', difficulty: 4, description: '同余方程' },
      { id: 204, name: '不定方程', difficulty: 4, description: '整数不定方程' },
    ]
  },
  {
    id: 3,
    name: '方程与应用',
    topics: [
      { id: 301, name: '简易方程', difficulty: 1, description: '一元一次方程' },
      { id: 302, name: '列方程解应用题', difficulty: 2, description: '用方程解应用题' },
      { id: 303, name: '二元一次方程组', difficulty: 3, description: '两元方程组' },
      { id: 304, name: '方程综合', difficulty: 3, description: '复杂方程问题' },
    ]
  },
  {
    id: 4,
    name: '几何进阶',
    topics: [
      { id: 401, name: '多边形面积', difficulty: 2, description: '复杂图形面积' },
      { id: 402, name: '共边定理', difficulty: 3, description: '鸟头定理' },
      { id: 403, name: '相似三角形', difficulty: 3, description: '相似形初步' },
      { id: 404, name: '燕尾定理', difficulty: 4, description: '燕尾模型' },
      { id: 405, name: '圆与扇形进阶', difficulty: 3, description: '阴影部分面积' },
      { id: 406, name: '立体几何', difficulty: 3, description: '长方体正方体体积' },
      { id: 407, name: '水中浸物', difficulty: 3, description: '物体浸入水中问题' },
    ]
  },
  {
    id: 5,
    name: '行程问题',
    topics: [
      { id: 501, name: '行程综合', difficulty: 3, description: '各种行程问题综合' },
      { id: 502, name: '钟表问题', difficulty: 3, description: '时钟角度问题' },
      { id: 503, name: '接送问题', difficulty: 4, description: '人车相遇问题' },
      { id: 504, name: '变速行程', difficulty: 4, description: '速度变化的行程' },
    ]
  },
  {
    id: 6,
    name: '应用题进阶',
    topics: [
      { id: 601, name: '工程问题进阶', difficulty: 3, description: '复杂工程问题' },
      { id: 602, name: '浓度问题进阶', difficulty: 3, description: '配溶液问题' },
      { id: 603, name: '经济问题进阶', difficulty: 3, description: '复杂经济问题' },
      { id: 604, name: '比例应用题', difficulty: 3, description: '正比例反比例' },
      { id: 605, name: '牛吃草问题', difficulty: 4, description: '牛顿牛吃草问题' },
    ]
  },
  {
    id: 7,
    name: '统计与概率',
    topics: [
      { id: 701, name: '统计量', difficulty: 2, description: '平均数、中位数、众数' },
      { id: 702, name: '概率初步', difficulty: 2, description: '简单概率计算' },
      { id: 703, name: '排列组合进阶', difficulty: 3, description: '复杂排列组合' },
      { id: 704, name: '概率综合', difficulty: 3, description: '概率应用题' },
    ]
  },
  {
    id: 8,
    name: '容斥与抽屉',
    topics: [
      { id: 801, name: '容斥原理进阶', difficulty: 3, description: '多量容斥' },
      { id: 802, name: '抽屉原理进阶', difficulty: 4, description: '复杂抽屉问题' },
    ]
  },
  {
    id: 9,
    name: '数字谜',
    topics: [
      { id: 901, name: '竖式数字谜', difficulty: 3, description: '复杂竖式谜' },
      { id: 902, name: '数阵图进阶', difficulty: 3, description: '复杂数阵' },
      { id: 903, name: '进制转换', difficulty: 3, description: '不同进制互化' },
    ]
  },
  {
    id: 10,
    name: '逻辑推理',
    topics: [
      { id: 1001, name: '逻辑推理综合', difficulty: 3, description: '复杂逻辑问题' },
      { id: 1002, name: '博弈问题', difficulty: 4, description: '必胜策略' },
    ]
  },
  {
    id: 11,
    name: '最值问题',
    topics: [
      { id: 1101, name: '极端原理', difficulty: 3, description: '最大最小问题' },
      { id: 1102, name: '构造论证', difficulty: 4, description: '构造与证明' },
    ]
  },
  {
    id: 12,
    name: '综合与竞赛',
    topics: [
      { id: 1201, name: '综合训练', difficulty: 3, description: '多知识点综合' },
      { id: 1202, name: '竞赛真题', difficulty: 4, description: '历年竞赛精选' },
    ]
  },
  {
    id: 13,
    name: '钟表问题',
    topics: [
      { id: 1301, name: '时针分针重合', difficulty: 3, description: '时针分针追及问题' },
      { id: 1302, name: '快慢钟问题', difficulty: 4, description: '钟表误差问题' },
    ]
  },
  {
    id: 14,
    name: '流水行船',
    topics: [
      { id: 1401, name: '顺水逆水', difficulty: 3, description: '顺水逆水速度计算' },
      { id: 1402, name: '流水行船应用', difficulty: 4, description: '丢物漂流、两船相遇' },
    ]
  },
  {
    id: 15,
    name: '综合提高',
    topics: [
      { id: 1501, name: '多知识点综合', difficulty: 3, description: '多个知识点综合运用' },
      { id: 1502, name: '竞赛模拟', difficulty: 4, description: '模拟竞赛题训练' },
    ]
  },
];

// 六年级知识点（40+类型）
export const grade6Topics: KnowledgeChapter[] = [
  {
    id: 1,
    name: '计算综合',
    topics: [
      { id: 101, name: '分数小数混合运算', difficulty: 2, description: '混合运算技巧' },
      { id: 102, name: '繁分数化简', difficulty: 2, description: '复杂繁分数' },
      { id: 103, name: '分数裂项', difficulty: 3, description: '分数裂项求和' },
      { id: 104, name: '换元法', difficulty: 3, description: '整体代换' },
      { id: 105, name: '比较大小', difficulty: 3, description: '分数小数比较' },
    ]
  },
  {
    id: 2,
    name: '数论综合',
    topics: [
      { id: 201, name: '整除综合', difficulty: 3, description: '复杂整除问题' },
      { id: 202, name: '质数合数综合', difficulty: 3, description: '质数问题' },
      { id: 203, name: '同余问题', difficulty: 4, description: '同余应用' },
      { id: 204, name: '不定方程综合', difficulty: 4, description: '复杂不定方程' },
      { id: 205, name: '进位制', difficulty: 3, description: '进制问题' },
    ]
  },
  {
    id: 3,
    name: '方程与比例',
    topics: [
      { id: 301, name: '一元方程', difficulty: 2, description: '复杂一元方程' },
      { id: 302, name: '二元方程组', difficulty: 3, description: '二元方程组' },
      { id: 303, name: '比例', difficulty: 2, description: '比例性质与应用' },
      { id: 304, name: '比例方程', difficulty: 3, description: '含比例的方程' },
    ]
  },
  {
    id: 4,
    name: '几何综合',
    topics: [
      { id: 401, name: '平面几何模型', difficulty: 3, description: '各种几何模型' },
      { id: 402, name: '圆与扇形综合', difficulty: 3, description: '复杂阴影面积' },
      { id: 403, name: '立体几何综合', difficulty: 3, description: '表面积与体积' },
      { id: 404, name: '几何变换', difficulty: 4, description: '旋转、分割' },
      { id: 405, name: '几何计数', difficulty: 4, description: '复杂图形计数' },
    ]
  },
  {
    id: 5,
    name: '行程问题',
    topics: [
      { id: 501, name: '行程综合', difficulty: 3, description: '复杂行程问题' },
      { id: 502, name: '比例行程', difficulty: 4, description: '利用比例解行程' },
      { id: 503, name: '环形行程综合', difficulty: 4, description: '复杂环形问题' },
    ]
  },
  {
    id: 6,
    name: '应用题综合',
    topics: [
      { id: 601, name: '工程问题综合', difficulty: 3, description: '复杂工程问题' },
      { id: 602, name: '浓度问题综合', difficulty: 3, description: '复杂浓度问题' },
      { id: 603, name: '经济问题综合', difficulty: 3, description: '复杂经济问题' },
      { id: 604, name: '分段计费', difficulty: 3, description: '阶梯收费问题' },
      { id: 605, name: '方案选择', difficulty: 4, description: '最优方案' },
    ]
  },
  {
    id: 7,
    name: '统计与概率',
    topics: [
      { id: 701, name: '统计综合', difficulty: 2, description: '各种统计量' },
      { id: 702, name: '概率综合', difficulty: 3, description: '复杂概率问题' },
      { id: 703, name: '排列组合综合', difficulty: 3, description: '综合排列组合' },
    ]
  },
  {
    id: 8,
    name: '数论与计数',
    topics: [
      { id: 801, name: '容斥原理', difficulty: 3, description: '复杂容斥' },
      { id: 802, name: '抽屉原理', difficulty: 4, description: '抽屉原理应用' },
      { id: 803, name: '加乘原理综合', difficulty: 3, description: '计数综合' },
      { id: 804, name: '递推计数', difficulty: 4, description: '找规律递推' },
    ]
  },
  {
    id: 9,
    name: '逻辑与策略',
    topics: [
      { id: 901, name: '逻辑推理', difficulty: 3, description: '复杂逻辑推理' },
      { id: 902, name: '博弈策略', difficulty: 4, description: '必胜策略' },
      { id: 903, name: '操作问题', difficulty: 4, description: '游戏操作策略' },
    ]
  },
  {
    id: 10,
    name: '最值问题',
    topics: [
      { id: 1001, name: '极端原理', difficulty: 4, description: '最大最小' },
      { id: 1002, name: '构造论证', difficulty: 4, description: '构造与证明' },
      { id: 1003, name: '不等式', difficulty: 4, description: '简单不等式' },
    ]
  },
  {
    id: 11,
    name: '小升初综合',
    topics: [
      { id: 1101, name: '综合复习', difficulty: 3, description: '知识点综合' },
      { id: 1102, name: '模拟测试', difficulty: 4, description: '综合测试题' },
      { id: 1103, name: '竞赛真题', difficulty: 4, description: '历年竞赛真题' },
    ]
  },
  {
    id: 12,
    name: '浓度与经济综合',
    topics: [
      { id: 1201, name: '浓度计算', difficulty: 3, description: '配溶液与浓度变化' },
      { id: 1202, name: '利润与折扣', difficulty: 3, description: '利润率、折扣综合' },
    ]
  },
  {
    id: 13,
    name: '分段计费与方案选择',
    topics: [
      { id: 1301, name: '阶梯收费', difficulty: 3, description: '水电、出租车分段计费' },
      { id: 1302, name: '最优方案', difficulty: 4, description: '比较选择最优方案' },
    ]
  },
  {
    id: 14,
    name: '计数与排列组合',
    topics: [
      { id: 1401, name: '加乘原理', difficulty: 3, description: '分类与分步计数' },
      { id: 1402, name: '排列组合进阶', difficulty: 4, description: '含限制条件的排列组合' },
    ]
  },
  {
    id: 15,
    name: '小升初模拟',
    topics: [
      { id: 1501, name: '真题模拟', difficulty: 3, description: '小升初真题模拟训练' },
      { id: 1502, name: '压轴题训练', difficulty: 4, description: '小升初压轴难题' },
    ]
  },
];

// 导出所有年级知识点
export const allTopics = {
  1: grade1Topics,
  2: grade2Topics,
  3: grade3Topics,
  4: grade4Topics,
  5: grade5Topics,
  6: grade6Topics,
};

// 获取所有题型的总数量
export const getTotalTopicCount = (grade: number): number => {
  const topics = allTopics[grade];
  return topics.reduce((sum, chapter) => sum + chapter.topics.length, 0);
};

// 获取所有年级所有题型的总数量
export const getAllTopicCount = (): number => {
  return [1, 2, 3, 4, 5, 6].reduce((sum, grade) => sum + getTotalTopicCount(grade), 0);
};

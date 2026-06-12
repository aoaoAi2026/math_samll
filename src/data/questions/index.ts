import type { Question, KnowledgePoint, Platform } from './types';
import grade1Questions from './grade1';
import grade2Questions from './grade2';
import grade3Questions from './grade3';
import grade4Questions from './grade4';
import grade5Questions from './grade5';
import grade6Questions from './grade6';

export const allQuestions: Question[] = [
  ...grade1Questions,
  ...grade2Questions,
  ...grade3Questions,
  ...grade4Questions,
  ...grade5Questions,
  ...grade6Questions,
];

export const getQuestionsByGrade = (grade: number): Question[] => {
  return allQuestions.filter((q) => q.grade === grade);
};

export const getQuestionsByChapter = (grade: number, chapter: number): Question[] => {
  return allQuestions.filter((q) => q.grade === grade && q.chapter === chapter);
};

export const getQuestionsByTopic = (grade: number, topicId: number): Question[] => {
  return allQuestions.filter((q) => q.grade === grade && q.topicId === topicId);
};

export const getQuestionsByDifficulty = (grade: number, difficulty: number): Question[] => {
  return allQuestions.filter((q) => q.grade === grade && q.difficulty === difficulty);
};

export const getQuestionById = (id: string): Question | undefined => {
  return allQuestions.find((q) => q.id === id);
};

export const generateExamQuestions = (grade: number, count: number): Question[] => {
  const gradeQuestions = getQuestionsByGrade(grade);
  const shuffled = [...gradeQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const knowledgePoints: KnowledgePoint[] = [
  {
    id: 1,
    name: '一年级',
    grade: 1,
    chapters: [
      { id: 1, name: '数数与比较', questionCount: 10 },
      { id: 2, name: '加减法入门', questionCount: 10 },
      { id: 3, name: '简单图形', questionCount: 10 },
      { id: 4, name: '找规律', questionCount: 10 },
      { id: 5, name: '排队问题', questionCount: 10 },
      { id: 6, name: '简单应用题', questionCount: 10 },
      { id: 7, name: '数字谜题', questionCount: 10 },
      { id: 8, name: '时间与日期', questionCount: 10 },
      { id: 9, name: '简单推理', questionCount: 10 },
      { id: 10, name: '综合练习', questionCount: 10 },
      { id: 11, name: '单数与双数', questionCount: 10 },
      { id: 12, name: '数阵图入门', questionCount: 10 },
      { id: 13, name: '巧移火柴棒', questionCount: 10 },
      { id: 14, name: '排队问题进阶', questionCount: 10 },
      { id: 15, name: '综合提高', questionCount: 10 },
    ],
  },
  {
    id: 2,
    name: '二年级',
    grade: 2,
    chapters: [
      { id: 1, name: '乘法口诀', questionCount: 10 },
      { id: 2, name: '除法入门', questionCount: 10 },
      { id: 3, name: '图形认知', questionCount: 10 },
      { id: 4, name: '数列规律', questionCount: 10 },
      { id: 5, name: '年龄问题', questionCount: 10 },
      { id: 6, name: '鸡兔同笼', questionCount: 10 },
      { id: 7, name: '数字谜', questionCount: 10 },
      { id: 8, name: '间隔问题', questionCount: 10 },
      { id: 9, name: '逻辑推理', questionCount: 10 },
      { id: 10, name: '综合练习', questionCount: 10 },
      { id: 11, name: '数阵图与幻方', questionCount: 10 },
      { id: 12, name: '一笔画问题', questionCount: 10 },
      { id: 13, name: '巧算与速算', questionCount: 10 },
      { id: 14, name: '年龄问题进阶', questionCount: 10 },
      { id: 15, name: '综合提高', questionCount: 10 },
    ],
  },
  {
    id: 3,
    name: '三年级',
    grade: 3,
    chapters: [
      { id: 1, name: '加减法巧算', questionCount: 10 },
      { id: 2, name: '乘除法巧算', questionCount: 10 },
      { id: 3, name: '周长与面积', questionCount: 10 },
      { id: 4, name: '平均数', questionCount: 10 },
      { id: 5, name: '和差问题', questionCount: 10 },
      { id: 6, name: '和倍问题', questionCount: 10 },
      { id: 7, name: '差倍问题', questionCount: 10 },
      { id: 8, name: '归一问题', questionCount: 10 },
      { id: 9, name: '还原问题', questionCount: 10 },
      { id: 10, name: '综合练习', questionCount: 10 },
      { id: 11, name: '等差数列', questionCount: 10 },
      { id: 12, name: '植树问题进阶', questionCount: 10 },
      { id: 13, name: '容斥原理', questionCount: 10 },
      { id: 14, name: '逻辑推理进阶', questionCount: 10 },
      { id: 15, name: '综合提高', questionCount: 10 },
    ],
  },
  {
    id: 4,
    name: '四年级',
    grade: 4,
    chapters: [
      { id: 1, name: '大数运算', questionCount: 10 },
      { id: 2, name: '巧算技巧', questionCount: 10 },
      { id: 3, name: '图形面积', questionCount: 10 },
      { id: 4, name: '相遇问题', questionCount: 10 },
      { id: 5, name: '追及问题', questionCount: 10 },
      { id: 6, name: '流水问题', questionCount: 10 },
      { id: 7, name: '植树问题', questionCount: 10 },
      { id: 8, name: '盈亏问题', questionCount: 10 },
      { id: 9, name: '逻辑推理', questionCount: 10 },
      { id: 10, name: '综合练习', questionCount: 10 },
      { id: 11, name: '鸡兔同笼进阶', questionCount: 10 },
      { id: 12, name: '行程问题综合', questionCount: 10 },
      { id: 13, name: '容斥与抽屉原理', questionCount: 10 },
      { id: 14, name: '博弈与策略', questionCount: 10 },
      { id: 15, name: '综合提高', questionCount: 10 },
    ],
  },
  {
    id: 5,
    name: '五年级',
    grade: 5,
    chapters: [
      { id: 1, name: '小数运算', questionCount: 10 },
      { id: 2, name: '分数运算', questionCount: 10 },
      { id: 3, name: '立体图形', questionCount: 10 },
      { id: 4, name: '行程问题', questionCount: 10 },
      { id: 5, name: '牛吃草问题', questionCount: 10 },
      { id: 6, name: '列方程解应用题', questionCount: 10 },
      { id: 7, name: '数字推理', questionCount: 10 },
      { id: 8, name: '抽屉原理', questionCount: 10 },
      { id: 9, name: '容斥原理', questionCount: 10 },
      { id: 10, name: '综合练习', questionCount: 10 },
      { id: 11, name: '钟表问题', questionCount: 10 },
      { id: 12, name: '流水行船问题', questionCount: 10 },
      { id: 13, name: '不定方程', questionCount: 10 },
      { id: 14, name: '浓度问题进阶', questionCount: 10 },
      { id: 15, name: '综合提高', questionCount: 10 },
    ],
  },
  {
    id: 6,
    name: '六年级',
    grade: 6,
    chapters: [
      { id: 1, name: '分数应用题', questionCount: 10 },
      { id: 2, name: '百分数', questionCount: 10 },
      { id: 3, name: '比例问题', questionCount: 10 },
      { id: 4, name: '工程问题', questionCount: 10 },
      { id: 5, name: '浓度问题', questionCount: 10 },
      { id: 6, name: '利润问题', questionCount: 10 },
      { id: 7, name: '几何综合', questionCount: 10 },
      { id: 8, name: '数论初步', questionCount: 10 },
      { id: 9, name: '综合推理', questionCount: 10 },
      { id: 10, name: '小升初综合', questionCount: 10 },
      { id: 11, name: '浓度与经济综合', questionCount: 10 },
      { id: 12, name: '分段计费与方案选择', questionCount: 10 },
      { id: 13, name: '数论综合', questionCount: 10 },
      { id: 14, name: '计数与排列组合', questionCount: 10 },
      { id: 15, name: '小升初模拟', questionCount: 10 },
    ],
  },
];

export const platforms: Platform[] = [
  {
    name: '学而思',
    url: 'https://www.xueersi.com',
    description: '知名教育机构，提供优质奥数课程',
    icon: 'GraduationCap',
  },
  {
    name: '猿辅导',
    url: 'https://www.yuanfudao.com',
    description: '在线教育平台，丰富的奥数资源',
    icon: 'BookOpen',
  },
  {
    name: '作业帮',
    url: 'https://www.zuoyebang.com',
    description: '题库丰富，拍照搜题方便',
    icon: 'Search',
  },
  {
    name: '网易有道',
    url: 'https://www.youdao.com',
    description: '智能学习助手，奥数学习好帮手',
    icon: 'Lightbulb',
  },
  {
    name: '腾讯课堂',
    url: 'https://ke.qq.com',
    description: '腾讯旗下在线教育平台',
    icon: 'Video',
  },
  {
    name: '新东方',
    url: 'https://www.neworiental.org',
    description: '老牌教育机构，师资力量雄厚',
    icon: 'School',
  },
];

export const difficultyLabels = ['简单', '中等', '困难', '极难'];

export const getDifficultyLabel = (level: number): string => {
  return difficultyLabels[level - 1] || '未知';
};

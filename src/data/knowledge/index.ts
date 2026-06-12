import { 
  grade1Topics, grade2Topics, grade3Topics, 
  grade4Topics, grade5Topics, grade6Topics 
} from './knowledgePoints';

interface KnowledgeChapter {
  id: number;
  name: string;
  topics: KnowledgeTopic[];
}

interface KnowledgeTopic {
  id: number;
  name: string;
  difficulty: number;
  description: string;
  teaching?: TopicTeaching;
}

export interface TopicTeaching {
  concept: string;      // 概念讲解
  method: string;       // 解题方法
  example: string;      // 例题
  steps: string[];      // 分步解析
  memory: string;       // 记忆口诀
}

// 年级知识点映射
const knowledgePoints: Record<number, KnowledgeChapter[]> = {
  1: grade1Topics,
  2: grade2Topics,
  3: grade3Topics,
  4: grade4Topics,
  5: grade5Topics,
  6: grade6Topics,
};

// 获取年级所有知识点
export const getKnowledgeByGrade = (grade: number): KnowledgeChapter[] => {
  return knowledgePoints[grade] || [];
};

// 获取年级所有题型总数
export const getTopicCountByGrade = (grade: number): number => {
  const chapters = knowledgePoints[grade];
  if (!chapters) return 0;
  return chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
};

// 获取题型信息
export const getTopicById = (grade: number, topicId: number): KnowledgeTopic | null => {
  const chapters = knowledgePoints[grade];
  if (!chapters) return null;
  
  for (const chapter of chapters) {
    const topic = chapter.topics.find(t => t.id === topicId);
    if (topic) return topic;
  }
  return null;
};

// 获取知识点分类名称
export const getChapterName = (grade: number, topicId: number): string => {
  const chapters = knowledgePoints[grade];
  if (!chapters) return '';
  
  for (const chapter of chapters) {
    const topic = chapter.topics.find(t => t.id === topicId);
    if (topic) return chapter.name;
  }
  return '';
};

// 难度标签
export const difficultyLabels: Record<number, string> = {
  1: '⭐简单',
  2: '⭐⭐中等',
  3: '⭐⭐⭐困难',
  4: '⭐⭐⭐⭐极难'
};

export const getDifficultyLabel = (difficulty: number): string => {
  return difficultyLabels[difficulty] || '未知难度';
};

// 导出知识点统计
export const getKnowledgeStats = () => {
  const stats = {
    totalTopics: 0,
    byGrade: {} as Record<number, number>,
    byChapter: {} as Record<string, number>
  };
  
  for (let grade = 1; grade <= 6; grade++) {
    const chapters = knowledgePoints[grade];
    if (chapters) {
      stats.byGrade[grade] = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
      stats.totalTopics += stats.byGrade[grade];
      
      chapters.forEach(chapter => {
        stats.byChapter[chapter.name] = (stats.byChapter[chapter.name] || 0) + chapter.topics.length;
      });
    }
  }
  
  return stats;
};

// 历年竞赛列表
export const competitions = [
  { id: 'hope', name: '希望杯', years: [2020, 2021, 2022, 2023, 2024] },
  { id: 'ymo', name: 'YMO', years: [2020, 2021, 2022, 2023, 2024] },
  { id: 'spring', name: '迎春杯', years: [2020, 2021, 2022, 2023, 2024] },
  { id: 'huabeisai', name: '华杯赛', years: [2020, 2021, 2022, 2023, 2024] },
  { id: 'imc', name: 'IMC', years: [2020, 2021, 2022, 2023, 2024] },
];

// 知识点与竞赛对应
export const getCompetitionQuestions = (competitionId: string, grade: number, year: number) => {
  // 返回历年真题的题目ID
  return [];
};

// 题目类型定义
export interface Teaching {
  concept?: string;    // 概念讲解
  point: string;       // 知识点讲解
  method: string;      // 解题思路
  steps: string[];     // 分步解析
  memory: string;      // 记忆口诀
  example: string;     // 举一反三
}

export interface Question {
  id: string;          // 唯一标识：g年级t知识点q题号
  grade: number;        // 年级 1-6
  chapter: number;     // 章节/知识点ID
  topicId?: number;     // 知识点ID（可选）
  topicName?: string;   // 知识点名称（可选）
  difficulty: number;   // 难度 1-4
  type: 'choice' | 'blank' | 'answer';  // 题目类型
  question: string;     // 题目文本
  image?: string;      // 图片URL（可选）
  options?: string[];  // 选择题选项
  answer: string;      // 正确答案
  teaching: Teaching;   // 教学解析
  star: number;        // 星星数 1-4
}

export interface UserProgress {
  userName: string;
  currentGrade: number;
  progress: {
    [grade: number]: {
      chapters: {
        [chapter: number]: {
          stars: number;
          passed: boolean;
        };
      };
      topics: {
        [topicId: number]: {
          completed: number;
          stars: number;
        };
      };
      questions: {
        [questionId: string]: {
          passed: boolean;
          wrongCount: number;
        };
      };
    };
  };
  examHistory: ExamRecord[];
  totalStars: number;
  rank: string;
  wrongQuestions: WrongQuestionRecord[];
}

// 错题库记录：错题必须连对3次以上才能从错题库中剔除
export interface WrongQuestionRecord {
  questionId: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  type: 'choice' | 'blank' | 'answer';
  grade: number;
  chapter: number;
  difficulty: number;
  topicId?: number;
  topicName?: string;
  source: 'practice' | 'exam'; // 错题来源
  addedAt: string;              // 加入错题库时间
  consecutiveCorrect: number;   // 连续答对次数
  totalAttempts: number;        // 总练习次数
  // 完整教学解析（便于错题回顾时查看）
  teaching?: {
    point: string;
    method: string;
    steps: string[];
    memory: string;
    example: string;
  };
}

export interface ExamRecord {
  date: string;
  grade: number;
  score: number;
  totalQuestions: number;
  wrongQuestions: string[];
}

export interface Platform {
  name: string;
  url: string;
  description: string;
  icon: string;
}

export interface KnowledgePoint {
  id: number;
  name: string;
  grade: number;
  chapters: {
    id: number;
    name: string;
    questionCount: number;
  }[];
}

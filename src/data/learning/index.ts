// 学习中心 - 教学数据
// 每个知识点包含：概念讲解、核心方法、例题示范、记忆口诀

export interface LessonContent {
  concept: string;       // 概念讲解
  method: string;        // 核心方法
  formula: string;       // 公式/要点
  example: {             // 例题示范
    question: string;
    solution: string;
    answer: string;
  };
  memory: string;        // 记忆口诀
  tips: string[];        // 学习小贴士
}

// 所有教学数据按 grade -> chapterId -> topicId 组织
export const lessonData: Record<number, Record<number, Record<number, LessonContent>>> = {
  1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {},
};

// 获取某个知识点的教学内容
export function getLesson(grade: number, chapterId: number, topicId: number): LessonContent | null {
  return lessonData[grade]?.[chapterId]?.[topicId] || null;
}

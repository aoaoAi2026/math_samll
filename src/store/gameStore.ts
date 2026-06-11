import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, ExamRecord, WrongQuestionRecord } from '@/data/questions/types';

interface AddWrongQuestionPayload {
  questionId: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  type: 'choice' | 'blank' | 'answer';
  grade: number;
  topicId?: number;
  topicName?: string;
  source: 'practice' | 'exam';
}

interface GameState {
  userProgress: UserProgress;
  setUserName: (name: string) => void;
  setCurrentGrade: (grade: number) => void;
  updateQuestionProgress: (questionId: string, passed: boolean) => void;
  updateChapterStars: (grade: number, chapter: number, stars: number) => void;
  addExamRecord: (record: ExamRecord) => void;
  resetProgress: () => void;
  addWrongQuestion: (payload: AddWrongQuestionPayload) => void;
  markWrongQuestionCorrect: (questionId: string) => void;
  markWrongQuestionWrong: (questionId: string) => void;
  removeWrongQuestion: (questionId: string) => void;
  clearWrongQuestions: () => void;
}

const defaultProgress: UserProgress = {
  userName: '小数学家',
  currentGrade: 1,
  progress: {},
  examHistory: [],
  totalStars: 0,
  rank: '新手学员',
  wrongQuestions: [],
};

const CONSECUTIVE_THRESHOLD = 3;

function getExplanationFromQuestion(payload: AddWrongQuestionPayload): string {
  return payload.explanation;
}

export const useGameStore = create(
  persist<GameState>(
    (set, get) => ({
      userProgress: defaultProgress,
      setUserName: (name) => {
        set((state) => ({
          userProgress: { ...state.userProgress, userName: name },
        }));
      },
      setCurrentGrade: (grade) => {
        set((state) => ({
          userProgress: { ...state.userProgress, currentGrade: grade },
        }));
      },
      updateQuestionProgress: (questionId, passed) => {
        const state = get().userProgress;
        const grade = parseInt(questionId[1]);
        const chapter = parseInt(questionId[3]);

        const existingProgress = state.progress[grade]?.questions?.[questionId];
        const wrongCount = existingProgress?.wrongCount || 0;

        const newProgress = {
          ...state.progress,
          [grade]: {
            ...state.progress[grade],
            questions: {
              ...state.progress[grade]?.questions,
              [questionId]: {
                passed,
                wrongCount: passed ? wrongCount : wrongCount + 1,
              },
            },
          },
        };

        let totalStars = state.totalStars;
        if (passed && !existingProgress?.passed) {
          totalStars += 1;
        }

        let rank = state.rank;
        if (totalStars >= 500) rank = '奥数大师';
        else if (totalStars >= 300) rank = '数学天才';
        else if (totalStars >= 150) rank = '学霸';
        else if (totalStars >= 50) rank = '优秀学员';
        else if (totalStars >= 20) rank = '进步之星';
        else rank = '新手学员';

        set({
          userProgress: {
            ...state,
            progress: newProgress,
            totalStars,
            rank,
          },
        });
      },
      updateChapterStars: (grade, chapter, stars) => {
        const state = get().userProgress;
        const currentStars = state.progress[grade]?.chapters?.[chapter]?.stars || 0;

        const newProgress = {
          ...state.progress,
          [grade]: {
            ...state.progress[grade],
            chapters: {
              ...state.progress[grade]?.chapters,
              [chapter]: {
                stars: Math.max(currentStars, stars),
                passed: stars >= 3,
              },
            },
          },
        };

        set({
          userProgress: { ...state, progress: newProgress },
        });
      },
      addExamRecord: (record) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            examHistory: [...state.userProgress.examHistory, record],
          },
        }));
      },
      addWrongQuestion: (payload) => {
        const state = get().userProgress;
        const existing = state.wrongQuestions.find(w => w.questionId === payload.questionId);
        if (existing) {
          // 已存在的错题：重置连续答对次数
          const updated = state.wrongQuestions.map(w =>
            w.questionId === payload.questionId
              ? {
                  ...w,
                  consecutiveCorrect: 0,
                  totalAttempts: w.totalAttempts + 1,
                  addedAt: new Date().toISOString(),
                }
              : w
          );
          set({ userProgress: { ...state, wrongQuestions: updated } });
        } else {
          const newRecord: WrongQuestionRecord = {
            questionId: payload.questionId,
            question: payload.question,
            options: payload.options,
            answer: payload.answer,
            explanation: getExplanationFromQuestion(payload),
            type: payload.type,
            grade: payload.grade,
            topicId: payload.topicId,
            topicName: payload.topicName,
            source: payload.source,
            addedAt: new Date().toISOString(),
            consecutiveCorrect: 0,
            totalAttempts: 1,
          };
          set({
            userProgress: {
              ...state,
              wrongQuestions: [newRecord, ...state.wrongQuestions],
            },
          });
        }
      },
      markWrongQuestionCorrect: (questionId) => {
        const state = get().userProgress;
        const updated = state.wrongQuestions
          .map(w => {
            if (w.questionId !== questionId) return w;
            return { ...w, consecutiveCorrect: w.consecutiveCorrect + 1 };
          })
          .filter(w => w.consecutiveCorrect < CONSECUTIVE_THRESHOLD);
        set({ userProgress: { ...state, wrongQuestions: updated } });
      },
      markWrongQuestionWrong: (questionId) => {
        const state = get().userProgress;
        const updated = state.wrongQuestions.map(w =>
          w.questionId === questionId
            ? { ...w, consecutiveCorrect: 0, totalAttempts: w.totalAttempts + 1 }
            : w
        );
        set({ userProgress: { ...state, wrongQuestions: updated } });
      },
      removeWrongQuestion: (questionId) => {
        const state = get().userProgress;
        set({
          userProgress: {
            ...state,
            wrongQuestions: state.wrongQuestions.filter(w => w.questionId !== questionId),
          },
        });
      },
      clearWrongQuestions: () => {
        set((state) => ({
          userProgress: { ...state.userProgress, wrongQuestions: [] },
        }));
      },
      resetProgress: () => {
        set({ userProgress: defaultProgress });
      },
    }),
    {
      name: 'math-olympiad-storage',
    }
  )
);

export { CONSECUTIVE_THRESHOLD };

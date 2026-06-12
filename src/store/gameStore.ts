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
  chapter: number;
  difficulty: number;
  topicId?: number;
  topicName?: string;
  source: 'practice' | 'exam';
  teaching?: {
    point: string;
    method: string;
    steps: string[];
    memory: string;
    example: string;
  };
}

interface GameState {
  userProgress: UserProgress;
  dailyMissions: Record<string, number>;
  rankJustChanged: string | null;
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
  recordAnswer: (correct: boolean) => void;
  completeMission: (missionId: string) => void;
  getDailyMissions: () => Record<string, number>;
  clearRankChanged: () => void;
}

const defaultProgress: UserProgress = {
  userName: '小数学家',
  currentGrade: 1,
  progress: {},
  examHistory: [],
  totalStars: 0,
  rank: '🌰 数学小种子',
  wrongQuestions: [],
};

const CONSECUTIVE_THRESHOLD = 3;
const DATA_VERSION = 2;

// ---- 每日任务 localStorage 辅助 ----
const MISSIONS_KEY = 'math-missions';

function loadDailyMissions(): Record<string, number> {
  try {
    const today = new Date().toDateString();
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) return data.progress || {};
    }
  } catch { /* ignore corrupt data */ }
  return {};
}

function saveDailyMissions(progress: Record<string, number>) {
  const today = new Date().toDateString();
  localStorage.setItem(MISSIONS_KEY, JSON.stringify({ date: today, progress }));
}

// ---- 数据迁移 ----
function migrateData(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;
  const d = data as Record<string, unknown>;
  const state = d.state as Record<string, unknown> | undefined;
  if (!state?.userProgress) return data;

  const version = (state._dataVersion as number) || 0;
  const progress = state.userProgress as Record<string, unknown>;

  if (version < 1) {
    const wrongQuestions = (progress.wrongQuestions as WrongQuestionRecord[]) || [];
    progress.wrongQuestions = wrongQuestions.map(w => ({
      ...w,
      chapter: (w as Record<string, unknown>).chapter || 0,
      difficulty: (w as Record<string, unknown>).difficulty || 1,
    }));
  }

  if (version < 2) {
    const wrongQuestions = (progress.wrongQuestions as WrongQuestionRecord[]) || [];
    progress.wrongQuestions = wrongQuestions.map(w => ({
      ...w,
      teaching: (w as Record<string, unknown>).teaching || undefined,
    }));
  }

  state._dataVersion = DATA_VERSION;
  return data;
}

function getExplanationFromQuestion(payload: AddWrongQuestionPayload): string {
  return payload.explanation;
}

// ---- 段位计算 ----
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

function computeRank(totalStars: number): string {
  for (const r of RANK_LIST) {
    if (totalStars >= r.threshold) return r.label;
  }
  return RANK_LIST[RANK_LIST.length - 1].label;
}

export const useGameStore = create(
  persist<GameState>(
    (set, get) => ({
      userProgress: defaultProgress,
      dailyMissions: loadDailyMissions(),
      rankJustChanged: null,

      // ====== 个人信息 ======
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

      // ====== 答题进度 ======
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

        const oldRank = state.rank;
        const newRank = computeRank(totalStars);
        const rankChanged = oldRank !== newRank ? newRank : null;

        set({
          userProgress: {
            ...state,
            progress: newProgress,
            totalStars,
            rank: newRank,
          },
          rankJustChanged: rankChanged,
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

      // ====== 错题管理 ======
      addWrongQuestion: (payload) => {
        const state = get().userProgress;
        const existing = state.wrongQuestions.find(w => w.questionId === payload.questionId);
        if (existing) {
          const updated = state.wrongQuestions.map(w =>
            w.questionId === payload.questionId
              ? {
                  ...w,
                  consecutiveCorrect: 0,
                  totalAttempts: w.totalAttempts + 1,
                  addedAt: new Date().toISOString(),
                  teaching: payload.teaching || w.teaching,
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
            chapter: payload.chapter,
            difficulty: payload.difficulty,
            topicId: payload.topicId,
            topicName: payload.topicName,
            source: payload.source,
            addedAt: new Date().toISOString(),
            consecutiveCorrect: 0,
            totalAttempts: 1,
            teaching: payload.teaching,
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

      // ====== 每日任务 ======
      recordAnswer: (correct: boolean) => {
        const missions = { ...get().dailyMissions };
        // 答对题目计数
        if (correct) {
          missions.answer = (missions.answer || 0) + 1;
          // 连续答对计数
          missions._streak = (missions._streak || 0) + 1;
        } else {
          missions._streak = 0;
        }
        missions.streak = Math.max(missions.streak || 0, missions._streak || 0);

        saveDailyMissions(missions);
        set({ dailyMissions: missions });
      },

      completeMission: (missionId: string) => {
        const missions = { ...get().dailyMissions };
        missions[missionId] = (missions[missionId] || 0) + 1;
        saveDailyMissions(missions);
        set({ dailyMissions: missions });
      },

      getDailyMissions: () => {
        return { ...get().dailyMissions };
      },

      clearRankChanged: () => {
        set({ rankJustChanged: null });
      },

      resetProgress: () => {
        set({ userProgress: defaultProgress });
      },
    }),
    {
      name: 'math-olympiad-storage',
      version: DATA_VERSION,
      migrate: (persistedState, version) => {
        return migrateData(persistedState) as typeof persistedState;
      },
    }
  )
);

export { CONSECUTIVE_THRESHOLD };

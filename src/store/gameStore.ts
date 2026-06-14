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

// 仅需要持久化的数据字段（排除函数、临时状态）
interface PersistedGameState {
  userProgress: UserProgress;
  dailyMissions: Record<string, number>;
}

interface GameState extends PersistedGameState {
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

// ---- 深合并：确保 progress 等嵌套对象被正确合并 ----
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  if (!source) return target;
  const result: Record<string, any> = { ...target };
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];
    if (
      sourceVal &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(targetVal as Record<string, any>, sourceVal as Record<string, any>);
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal;
    }
  }
  return result as T;
}

// ---- 解析题目 ID：g1c1q1 => { grade: 1, chapter: 1, question: 1 } ----
function parseQuestionId(id: string): { grade: number; chapter: number; question: number } {
  // 格式：g{年级}c{章节}q{题号}，例如 g1c1q1、g11c12q34
  const match = id.match(/^g(\d+)c(\d+)q(\d+)$/);
  if (match) {
    return {
      grade: parseInt(match[1], 10),
      chapter: parseInt(match[2], 10),
      question: parseInt(match[3], 10),
    };
  }
  // 兼容旧格式：按字符位置解析
  const grade = parseInt(id[1] || '1', 10);
  const chapterMatch = id.match(/c(\d+)/);
  const chapter = chapterMatch ? parseInt(chapterMatch[1], 10) : 0;
  return { grade: isNaN(grade) ? 1 : grade, chapter: isNaN(chapter) ? 1 : chapter, question: 0 };
}

// ---- 数据迁移（zustand v5 migrate 接收 state 对象本身） ----
function migrateState(state: any, version: number): PersistedGameState {
  if (!state || typeof state !== 'object') {
    return { userProgress: defaultProgress, dailyMissions: {} };
  }

  const userProgress: UserProgress = state.userProgress || { ...defaultProgress };

  // 确保 progress 对象存在
  if (!userProgress.progress || typeof userProgress.progress !== 'object') {
    userProgress.progress = {};
  }
  // 确保其他必需字段存在
  if (typeof userProgress.userName !== 'string') userProgress.userName = '小数学家';
  if (typeof userProgress.currentGrade !== 'number') userProgress.currentGrade = 1;
  if (!Array.isArray(userProgress.examHistory)) userProgress.examHistory = [];
  if (typeof userProgress.totalStars !== 'number') userProgress.totalStars = 0;
  if (typeof userProgress.rank !== 'string') userProgress.rank = '🌰 数学小种子';
  if (!Array.isArray(userProgress.wrongQuestions)) userProgress.wrongQuestions = [];

  // v0 → v1：错题补充章节和难度字段
  if (version < 1) {
    userProgress.wrongQuestions = userProgress.wrongQuestions.map((w: any) => ({
      ...w,
      chapter: w.chapter ?? 0,
      difficulty: w.difficulty ?? 1,
    }));
  }

  // v1 → v2：错题补充 teaching 字段
  if (version < 2) {
    userProgress.wrongQuestions = userProgress.wrongQuestions.map((w: any) => ({
      ...w,
      teaching: w.teaching ?? undefined,
    }));
  }

  // dailyMissions：从独立 localStorage 读取（如果 state 中没有的话）
  let dailyMissions: Record<string, number> = state.dailyMissions;
  if (!dailyMissions || typeof dailyMissions !== 'object' || Array.isArray(dailyMissions)) {
    dailyMissions = loadDailyMissions();
  }

  return { userProgress, dailyMissions };
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
  persist(
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
        const { grade } = parseQuestionId(questionId);

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
        const isNewPassed = stars >= 3 && currentStars < 3;

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

        // 累计章节通关星星到 totalStars
        let totalStars = state.totalStars;
        if (stars > currentStars) {
          totalStars += (stars - currentStars);
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
          rankJustChanged: rankChanged ?? null,
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
      // 只持久化数据字段，排除函数和临时状态
      partialize: (state: GameState) => ({
        userProgress: state.userProgress,
        dailyMissions: state.dailyMissions,
      }),
      // 深合并，确保嵌套的 progress 对象被正确恢复
      merge: (persistedState: any, currentState: GameState): GameState => {
        if (!persistedState || typeof persistedState !== 'object') return currentState;
        const persisted = persistedState as Partial<Pick<GameState, 'userProgress' | 'dailyMissions'>>;
        return {
          ...currentState,
          userProgress: persisted.userProgress
            ? deepMerge(currentState.userProgress, persisted.userProgress)
            : currentState.userProgress,
          dailyMissions: persisted.dailyMissions || currentState.dailyMissions,
        };
      },
      migrate: (persistedState: any, version: number) => {
        const migrated = migrateState(persistedState, version);
        return migrated;
      },
    }
  )
);

export { CONSECUTIVE_THRESHOLD };

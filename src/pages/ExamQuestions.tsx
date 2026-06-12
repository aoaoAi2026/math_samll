import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Target, Play, ChevronRight, ChevronLeft, CheckCircle, XCircle, BookOpen, Trophy, ArrowLeft } from 'lucide-react';
import { getExamQuestions, getCompetitionList, getYearList, getGradeList } from '@/data/exam/examQuestions';
import type { ExamQuestion } from '@/data/exam/examQuestions';
import { useGameStore } from '@/store/gameStore';
import ConfettiEffect from '@/components/ConfettiEffect';
import RankUpModal from '@/components/RankUpModal';
type Competition = '希望杯' | 'YMO' | '迎春杯' | '华杯赛' | 'IMC';
type Year = 2019 | 2020 | 2021 | 2022 | 2023 | 2024;
type Grade = 1 | 2 | 3 | 4 | 5 | 6;

const COMPETITION_EMOJIS: Record<string, string> = {
  '希望杯': '🏆', 'YMO': '🌟', '迎春杯': '🌸', '华杯赛': '🎓', 'IMC': '🌍'
};

const COMPETITION_COLORS: Record<string, string> = {
  '希望杯': 'from-amber-400 to-orange-500',
  'YMO': 'from-blue-400 to-cyan-500',
  '迎春杯': 'from-pink-400 to-rose-500',
  '华杯赛': 'from-purple-400 to-indigo-500',
  'IMC': 'from-green-400 to-emerald-500',
};

export default function ExamQuestions() {
  const { recordAnswer, rankJustChanged, clearRankChanged, userProgress } = useGameStore();
  const [competition, setCompetition] = useState<Competition>('希望杯');
  const [year, setYear] = useState<Year>(2024);
  const [grade, setGrade] = useState<Grade>(3);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<ExamQuestion[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const competitions = getCompetitionList();
  const years = getYearList();
  const grades = getGradeList();

  const startExam = () => {
    const examQuestions = getExamQuestions(year, competition, grade);
    if (examQuestions.length === 0) {
      alert('该条件下暂无真题，请选择其他条件');
      return;
    }
    setQuestions(examQuestions);
    setAnswers({});
    setResults({});
    setHasAnswered(false);
    setCurrentIndex(0);
    const totalSeconds = examQuestions.length * 180;
    setTimeLeft(totalSeconds);
    setIsExamStarted(true);
    setIsFinished(false);
    setScore(0);
    setWrongQuestions([]);
    setShowExplanation(false);

    // 启动倒计时
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAnswer = (questionId: string, answer: string) => {
    // 已经答过这题就不再响应
    if (answers[questionId]) return;
    const q = questions.find(x => x.id === questionId);
    if (!q) return;
    const correct = q.options[q.answer].trim();
    const isCorrect = answer.trim() === correct;

    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    setResults(prev => ({ ...prev, [questionId]: isCorrect }));
    setHasAnswered(true);
    recordAnswer(isCorrect);
    if (isCorrect) setShowConfetti(true);
    setShowExplanation(true);
  };

  // 段位升级监听
  useEffect(() => {
    if (rankJustChanged) setShowRankUp(true);
  }, [rankJustChanged]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const submitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    let correct = 0;
    const wrong: ExamQuestion[] = [];

    questions.forEach(q => {
      if (results[q.id]) {
        correct++;
      } else {
        wrong.push(q);
      }
    });

    const examScore = Math.round((correct / questions.length) * 100);
    setScore(examScore);
    setWrongQuestions(wrong);
    setIsFinished(true);
  };

  // ==================== 选择参数页 ====================
  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors flex items-center gap-2 font-bold">
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          <div className="flex items-center gap-2 text-white">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-bold">🏆 真题练习</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/30">
              <span className="text-5xl">🏆</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">历年奥数真题</h1>
            <p className="text-white/50">希望杯、YMO、迎春杯等竞赛真题，挑战真实赛场！</p>
          </div>

          {/* 参数选择 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20 mb-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-white/60 text-sm mb-2 font-bold">🏅 选择竞赛</label>
                <div className="grid grid-cols-5 gap-2">
                  {competitions.map(c => (
                    <button
                      key={c}
                      onClick={() => setCompetition(c)}
                      className={`py-3 rounded-2xl font-bold text-xs transition-all hover:scale-105 ${
                        competition === c
                          ? `bg-gradient-to-r ${COMPETITION_COLORS[c]} text-white shadow-lg`
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-lg mb-0.5">{COMPETITION_EMOJIS[c]}</div>
                      <div>{c}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 font-bold">📅 选择年份</label>
                <div className="grid grid-cols-3 gap-2">
                  {years.map(y => (
                    <button
                      key={y}
                      onClick={() => setYear(y)}
                      className={`py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 ${
                        year === y
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-lg">{y}</div>
                      <div className="text-xs mt-0.5 opacity-60">年</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 font-bold">📚 选择年级</label>
                <div className="grid grid-cols-6 gap-2">
                  {grades.map(g => (
                    <button
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`py-3 rounded-2xl font-bold text-xs transition-all hover:scale-105 ${
                        grade === g
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-lg">{['🌱', '🌿', '🌳', '🍎', '🏆', '👑'][g - 1]}</div>
                      <div className="mt-0.5">{g}年级</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 试卷信息预览 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 overflow-hidden mb-6 shadow-xl">
            <div className="p-4 border-b border-white/20 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">📋 试卷信息</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
              <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                <div className="text-3xl mb-1">{COMPETITION_EMOJIS[competition]}</div>
                <div className="font-extrabold text-yellow-400 text-sm">{competition}</div>
                <div className="text-white/40 text-xs mt-0.5">竞赛名称</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                <div className="text-3xl font-extrabold text-blue-400 mb-1">{year}</div>
                <div className="text-white/40 text-xs">考试年份</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                <div className="text-3xl mb-1">{['🌱', '🌿', '🌳', '🍎', '🏆', '👑'][grade - 1]}</div>
                <div className="font-extrabold text-green-400 text-sm">{grade}年级</div>
                <div className="text-white/40 text-xs mt-0.5">适用年级</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors">
                <div className="text-3xl font-extrabold text-purple-400 mb-1">5</div>
                <div className="text-white/40 text-xs">题目数量</div>
              </div>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-5 h-5" />
            🚀 开始真题练习
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ==================== 结果页 ====================
  if (isFinished) {
    const correctCount = questions.length - wrongQuestions.length;
    const scoreEmoji = score >= 80 ? '🏆' : score >= 60 ? '👍' : '💪';
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors flex items-center gap-2 font-bold">
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </Link>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            {COMPETITION_EMOJIS[competition]} {competition} {year}年
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
          {/* 分数圆环 */}
          <div className="text-center mb-8">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl ${
              score >= 80 ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30' :
              score >= 60 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-orange-500/30' :
              'bg-gradient-to-br from-red-400 to-pink-500 shadow-red-500/30'
            }`}>
              <div className="text-center">
                <div className="text-3xl">{scoreEmoji}</div>
                <div className="text-3xl font-extrabold text-white">{score}</div>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              {score >= 80 ? '🎉 太棒了！' : score >= 60 ? '👍 继续努力！' : '💪 加油！'}
            </h1>
            <p className="text-white/50">
              {COMPETITION_EMOJIS[competition]} {competition} {year}年 {grade}年级 — 答对 {correctCount}/{questions.length} 题
            </p>
          </div>

          {/* 数据统计 */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
              <div className="text-3xl font-extrabold text-green-400">{correctCount}</div>
              <div className="text-white/40 text-xs mt-1">✅ 正确</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
              <div className="text-3xl font-extrabold text-red-400">{wrongQuestions.length}</div>
              <div className="text-white/40 text-xs mt-1">❌ 错误</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
              <div className="text-3xl font-extrabold text-yellow-400">{Math.round(correctCount / questions.length * 100)}%</div>
              <div className="text-white/40 text-xs mt-1">🎯 正确率</div>
            </div>
          </div>

          {/* 错题回顾 */}
          {wrongQuestions.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 overflow-hidden mb-6 shadow-xl">
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-red-400" />
                  <span className="text-white font-bold">📋 错题回顾</span>
                </div>
              </div>
              <div className="divide-y divide-white/10">
                {wrongQuestions.map((q, index) => (
                  <div key={q.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full text-xs font-bold">错题 {index + 1}</span>
                      <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-bold ${
                        q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        q.difficulty === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {q.difficulty === 'easy' ? '🌱 简单' : q.difficulty === 'medium' ? '🌿 中等' : '🔥 困难'}
                      </span>
                    </div>
                    <p className="text-white text-sm mb-3">{q.question}</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {q.options.map((opt, i) => (
                        <div key={i} className={`p-2.5 rounded-xl text-sm ${
                          i === q.answer
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : answers[q.id] === opt
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-white/5 text-white/50'
                        }`}>
                          {['A', 'B', 'C', 'D'][i]}. {opt}
                          {i === q.answer && ' ✅'}
                          {answers[q.id] === opt && i !== q.answer && ' ❌ 你的答案'}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-purple-500/15 rounded-xl border border-purple-500/20">
                      <div className="flex items-center gap-2 text-purple-300 mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-bold">📖 解析</span>
                      </div>
                      <p className="text-white/80 text-sm">{q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={startExam}
              className="flex-1 py-4 bg-white/10 rounded-2xl text-white font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/20"
            >
              🔄 再考一次
            </button>
            <Link
              to="/"
              className="flex-1 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              🏠 返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 答题页 ====================
  // 粒子礼花
  const confettiEl = showConfetti && <ConfettiEffect count={35} onDone={() => setShowConfetti(false)} />;
  // 段位升级弹窗
  const rankUpEl = showRankUp && rankJustChanged && (
    <RankUpModal newRank={rankJustChanged} totalStars={userProgress.totalStars}
      onClose={() => { setShowRankUp(false); clearRankChanged(); }} />
  );

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const userAnswer = answers[currentQuestion?.id] || '';
  const correctOptionIndex = currentQuestion?.answer;
  const correctOptionText = currentQuestion?.options?.[correctOptionIndex];
  const isThisCorrect = results[currentQuestion?.id];

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
      setHasAnswered(false);
    }
  };

  const goPrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setShowExplanation(false);
    // 回到已答过的题，显示之前的结果
    const prevQ = questions[currentIndex - 1];
    if (prevQ && answers[prevQ.id]) {
      setHasAnswered(true);
      setShowExplanation(true);
    } else {
      setHasAnswered(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {confettiEl}
      {rankUpEl}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-60 h-60 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* 顶部导航栏 */}
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-sm">
            {COMPETITION_EMOJIS[competition]} {competition} {year}年
          </span>
          <span className="text-white/30">|</span>
          <span className="text-white text-sm">{currentIndex + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm ${
            timeLeft < 300 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-white/10 text-white border border-white/20'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-bold">{currentIndex + 1}/{questions.length}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-4 relative z-10">
        {/* 进度条 */}
        <div className="mb-4 bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>

        {/* 题目卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20 mb-4 shadow-xl">
          {/* 题目标签 */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold">
              {COMPETITION_EMOJIS[competition]} {competition}
            </span>
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">{year}年</span>
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold">{grade}年级</span>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
              currentQuestion?.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              currentQuestion?.difficulty === 'medium' ? 'bg-blue-500/20 text-blue-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {currentQuestion?.difficulty === 'easy' ? '🌱 简单' : currentQuestion?.difficulty === 'medium' ? '🌿 中等' : '🔥 困难'}
            </span>
          </div>

          {/* 题目内容 */}
          <div className="text-xl sm:text-2xl text-white mb-6 leading-relaxed font-medium">
            {currentQuestion?.question}
          </div>

          {/* 选项 —— 点击即判对错 */}
          <div className="space-y-2.5">
            {currentQuestion?.options.map((opt, i) => {
              const isCorrectOption = i === correctOptionIndex;
              const isSelected = userAnswer === opt;
              let optionStyle = 'bg-white/5 border-white/10 text-white/80 hover:border-white/30 hover:bg-white/10';
              let letterStyle = 'bg-white/10 text-white/60';

              if (hasAnswered) {
                if (isCorrectOption) {
                  optionStyle = 'bg-green-500/20 border-green-400/50 text-green-300';
                  letterStyle = 'bg-green-400 text-white';
                } else if (isSelected && !isThisCorrect) {
                  optionStyle = 'bg-red-500/20 border-red-400/50 text-red-300';
                  letterStyle = 'bg-red-400 text-white';
                } else {
                  optionStyle = 'bg-white/5 border-white/10 text-white/50 opacity-50';
                  letterStyle = 'bg-white/10 text-white/40';
                }
              } else if (isSelected) {
                optionStyle = 'bg-yellow-500/20 border-yellow-400/50 text-white shadow-lg shadow-yellow-500/10 scale-[1.02]';
                letterStyle = 'bg-yellow-400 text-white';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(currentQuestion!.id, opt)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-3 ${optionStyle}`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${letterStyle}`}>
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {hasAnswered && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
                  {hasAnswered && isSelected && !isThisCorrect && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* 答完后的反馈 + 自动显示解析 */}
          {hasAnswered && (
            <div className="mt-4">
              <div className={`p-3 rounded-2xl mb-3 flex items-center gap-2 ${
                isThisCorrect ? 'bg-green-500/15 border border-green-500/30' : 'bg-red-500/15 border border-red-500/30'
              }`}>
                <span className="text-2xl">{isThisCorrect ? '🎉' : '😅'}</span>
                <span className={`font-bold ${isThisCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isThisCorrect ? '回答正确！' : `不对哦～ 正确答案是 ${['A', 'B', 'C', 'D'][correctOptionIndex]}. ${correctOptionText}`}
                </span>
              </div>
              <div className="p-4 bg-purple-500/15 rounded-2xl border border-purple-500/30">
                <div className="flex items-center gap-2 text-purple-300 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-bold text-sm">📖 解析</span>
                </div>
                <p className="text-white/80 text-sm whitespace-pre-line leading-relaxed">{currentQuestion?.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* 上一题 / 下一题 导航 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            上一题
          </button>

          {/* 题目编号快切 */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[45%] scrollbar-hide">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  if (answers[q.id]) {
                    setHasAnswered(true);
                    setShowExplanation(true);
                  } else {
                    setHasAnswered(false);
                    setShowExplanation(false);
                  }
                }}
                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all flex-shrink-0 ${
                  idx === currentIndex
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110'
                    : results[q.id] === true
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : results[q.id] === false
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/10 text-white/50 hover:bg-white/20'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <button
              onClick={submitExam}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white font-bold text-sm hover:shadow-xl hover:shadow-green-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              📊 查看成绩
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!hasAnswered}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-sm transition-all ${
                hasAnswered
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95'
                  : 'bg-white/10 opacity-40 cursor-not-allowed'
              }`}
            >
              下一题
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 答题统计 */}
        <div className="text-center text-white/30 text-xs">
          已作答 {answeredCount}/{questions.length} 题
          {answeredCount < questions.length && (
            <span className="text-yellow-400 ml-1">（还剩 {questions.length - answeredCount} 题）</span>
          )}
          {answeredCount === questions.length && (
            <span className="text-green-400 ml-1 font-bold animate-pulse"> 全部完成，查看成绩吧！</span>
          )}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

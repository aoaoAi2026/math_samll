import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Target, Play, ChevronRight, CheckCircle, XCircle, BookOpen, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { generateExamQuestions, getDifficultyLabel } from '@/data/questions';
import type { Question } from '@/data/questions/types';

const GRADE_EMOJIS = ['🌱', '🌿', '🌳', '🍎', '🏆', '👑'];

export default function Exam() {
  const { userProgress, addExamRecord, addWrongQuestion } = useGameStore();
  const [grade, setGrade] = useState(1);
  const [questionCount, setQuestionCount] = useState(10);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const startExam = () => {
    const examQuestions = generateExamQuestions(grade, questionCount);
    setQuestions(examQuestions);
    setAnswers({});
    setCurrentIndex(0);
    const totalSeconds = questionCount * 180;
    setTimeLeft(totalSeconds);
    setIsExamStarted(true);
    setIsFinished(false);
    setScore(0);
    setWrongQuestions([]);

    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitExam = () => {
    if (timerInterval) clearInterval(timerInterval);
    let correct = 0;
    const wrong: Question[] = [];
    
    questions.forEach(q => {
      const userAnswer = answers[q.id]?.trim().toLowerCase() || '';
      if (userAnswer === q.answer.toLowerCase()) {
        correct++;
      } else {
        wrong.push(q);
      }
    });

    const examScore = Math.round((correct / questions.length) * 100);
    setScore(examScore);
    setWrongQuestions(wrong);
    setIsFinished(true);
    
    addExamRecord({
      date: new Date().toISOString(),
      grade,
      score: examScore,
      totalQuestions: questions.length,
      wrongQuestions: wrong.map(q => q.id),
    });

    wrong.forEach(q => {
      addWrongQuestion({
        questionId: q.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.teaching?.steps?.join('；') || '',
        type: q.type,
        grade: q.grade,
        chapter: q.chapter,
        difficulty: q.difficulty,
        topicId: q.topicId,
        topicName: q.topicName,
        source: 'exam',
        teaching: q.teaching,
      });
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors font-bold">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-2 bg-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/30">
              <span className="text-5xl">🎯</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">模拟考试</h1>
            <p className="text-white/50">检验你的奥数学习成果，准备好了吗？</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20 mb-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-white/70 font-bold mb-2 block text-sm">📚 选择年级</label>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map(g => (
                    <button
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`p-3 rounded-2xl font-bold transition-all hover:scale-105 ${
                        grade === g
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-lg">{GRADE_EMOJIS[g - 1]}</div>
                      <div className="text-xs mt-0.5">{g}年级</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white/70 font-bold mb-2 block text-sm">📝 题目数量</label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 30].map(count => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`p-4 rounded-2xl font-bold transition-all hover:scale-105 ${
                        questionCount === count
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-xl">{count}</div>
                      <div className="text-xs mt-0.5">题</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 p-4 bg-white/5 rounded-2xl flex items-center gap-4 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>⏱️ 预计 {questionCount * 3} 分钟</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>共 {questionCount} 道题</span>
              </div>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full py-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-5 h-5" />
            🚀 开始考试
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 考试历史 */}
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold text-white">📋 考试历史</h2>
            </div>
            {userProgress.examHistory.length === 0 ? (
              <div className="text-center text-white/40 py-8">
                <div className="text-4xl mb-2">📝</div>
                还没有参加过考试哦～
              </div>
            ) : (
              <div className="space-y-2">
                {userProgress.examHistory.slice(-5).reverse().map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div>
                      <span className="text-white font-bold">{record.grade}年级</span>
                      <span className="text-white/40 ml-2 text-sm">
                        {new Date(record.date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <div className={`text-xl font-extrabold ${
                      record.score >= 80 ? 'text-green-400' :
                      record.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {record.score >= 80 ? '🎉 ' : record.score >= 60 ? '👍 ' : '💪 '}
                      {record.score}分
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const correctCount = questions.length - wrongQuestions.length;
    const scoreEmoji = score >= 80 ? '🏆' : score >= 60 ? '👍' : '💪';
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors font-bold">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-2 bg-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
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
              答对 {correctCount}/{questions.length} 道题目
            </p>
          </div>

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

          {wrongQuestions.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 overflow-hidden mb-6 shadow-xl">
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-red-400" />
                  <span className="text-white font-bold">📋 错题回顾</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-yellow-300 bg-yellow-500/10 px-2.5 py-1 rounded-full font-bold">
                    已自动加入错题库
                  </span>
                  <Link
                    to="/wrong-questions"
                    className="text-xs px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full hover:bg-yellow-500/30 font-bold"
                  >
                    去练习 →
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-white/10">
                {wrongQuestions.map((q, index) => (
                  <div key={index} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-red-400 font-bold">第{index + 1}题</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        q.type === 'choice' ? 'bg-blue-500/20 text-blue-400' :
                        q.type === 'blank' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {getDifficultyLabel(q.difficulty)}
                      </span>
                    </div>
                    <div className="text-white text-sm mb-2">{q.question}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/40">你的答案：</span>
                      <span className="text-red-400 font-bold">{answers[q.id] || '未作答'}</span>
                      <span className="text-white/20">|</span>
                      <span className="text-white/40">正确答案：</span>
                      <span className="text-green-400 font-bold">{q.answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              to="/exam"
              className="flex-1 py-4 bg-white/10 rounded-2xl text-white font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2 border border-white/20"
            >
              🔄 再考一次
            </Link>
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

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(k => answers[k].trim()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-60 h-60 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold">{grade}年级模拟考试</span>
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
          <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span>
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

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20 mb-4 shadow-xl">
          <div className="flex items-start gap-2 mb-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              currentQuestion.type === 'choice' ? 'bg-blue-500/20 text-blue-300' :
              currentQuestion.type === 'blank' ? 'bg-green-500/20 text-green-300' :
              'bg-purple-500/20 text-purple-300'
            }`}>
              {currentQuestion.type === 'choice' ? '🔤 选择题' : currentQuestion.type === 'blank' ? '✏️ 填空题' : '📝 问答题'}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${star <= currentQuestion.difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                />
              ))}
            </div>
          </div>

          <div className="text-xl sm:text-2xl text-white mb-6 leading-relaxed font-medium">
            {currentQuestion.question}
          </div>

          {currentQuestion.type === 'choice' && currentQuestion.options && (
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, String.fromCharCode(65 + index))}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-3 ${
                    answers[currentQuestion.id] === String.fromCharCode(65 + index)
                      ? 'bg-white/20 border-yellow-400/50 text-white shadow-lg shadow-yellow-500/10 scale-[1.02]'
                      : 'bg-white/10 border-white/20 text-white/80 hover:border-white/40 hover:bg-white/15'
                  }`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    answers[currentQuestion.id] === String.fromCharCode(65 + index)
                      ? 'bg-yellow-400 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                </button>
              ))}
            </div>
          )}

          {(currentQuestion.type === 'blank' || currentQuestion.type === 'answer') && (
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="✍️ 输入你的答案..."
              className="w-full p-5 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-lg placeholder-white/30 focus:border-yellow-400/50 focus:outline-none focus:bg-white/15 transition-all"
            />
          )}
        </div>

        {/* 题目导航 + 按钮 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm"
          >
            ← 上一题
          </button>

          {/* 题目编号 */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50%] scrollbar-hide">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all flex-shrink-0 ${
                  idx === currentIndex
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110'
                    : answers[q.id]
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/10 text-white/50 hover:bg-white/20'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-sm hover:shadow-xl hover:shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
            >
              下一题 →
            </button>
          ) : (
            <button
              onClick={submitExam}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white font-bold text-sm hover:shadow-xl hover:shadow-green-500/30 transition-all hover:scale-105 active:scale-95 animate-pulse"
            >
              ✅ 提交试卷
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
            <span className="text-green-400 ml-1 font-bold"> 全部答完，可以交卷啦！</span>
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

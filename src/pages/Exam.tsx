import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Target, Play, ChevronRight, CheckCircle, XCircle, BookOpen, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { generateExamQuestions, getDifficultyLabel } from '@/data/questions';
import type { Question } from '@/data/questions/types';

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

  const startExam = () => {
    const examQuestions = generateExamQuestions(grade, questionCount);
    setQuestions(examQuestions);
    setAnswers({});
    setCurrentIndex(0);
    setTimeLeft(questionCount * 180);
    setIsExamStarted(true);
    setIsFinished(false);
    setScore(0);
    setWrongQuestions([]);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitExam = () => {
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

    // 考试错题自动加入错题库
    wrong.forEach(q => {
      addWrongQuestion({
        questionId: q.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.teaching?.steps?.join('；') || '',
        type: q.type,
        grade: q.grade,
        topicId: q.topicId,
        topicName: q.topicName,
        source: 'exam',
      });
    });
  };

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-white hover:text-yellow-400 transition-colors">
            <span className="text-xl font-bold">奥数闯关王</span>
          </Link>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white">{userProgress.totalStars}</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">模拟考试</h1>
            <p className="text-white/60">检验你的奥数学习成果</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-white/80 mb-2 block">选择年级</label>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map(g => (
                    <button
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`p-3 rounded-xl font-semibold transition-all ${
                        grade === g
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {g}年级
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-white/80 mb-2 block">题目数量</label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 30].map(count => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`p-3 rounded-xl font-semibold transition-all ${
                        questionCount === count
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {count}题
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>预计用时：{questionCount * 3}分钟</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>共{questionCount}道题目</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full py-4 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            开始考试
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">考试历史</h2>
            </div>
            {userProgress.examHistory.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                还没有参加过考试
              </div>
            ) : (
              <div className="space-y-3">
                {userProgress.examHistory.slice(-5).reverse().map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <span className="text-white font-semibold">{record.grade}年级</span>
                      <span className="text-white/60 ml-2">
                        {new Date(record.date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <div className={`text-xl font-bold ${
                      record.score >= 80 ? 'text-green-400' :
                      record.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-white hover:text-yellow-400 transition-colors">
            <span className="text-xl font-bold">奥数闯关王</span>
          </Link>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white">{userProgress.totalStars}</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              score >= 80 ? 'bg-gradient-to-br from-green-500 to-teal-500' :
              score >= 60 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
              'bg-gradient-to-br from-red-500 to-pink-500'
            }`}>
              <span className="text-4xl font-bold text-white">{score}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {score >= 80 ? '太棒了！' : score >= 60 ? '继续努力！' : '加油！'}
            </h1>
            <p className="text-white/60">
              答对{questions.length - wrongQuestions.length}/{questions.length}道题目
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{questions.length - wrongQuestions.length}</div>
              <div className="text-white/60 text-sm">正确</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{wrongQuestions.length}</div>
              <div className="text-white/60 text-sm">错误</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round((questions.length - wrongQuestions.length) / questions.length * 100)}%
              </div>
              <div className="text-white/60 text-sm">正确率</div>
            </div>
          </div>

          {wrongQuestions.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden mb-8">
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-red-400" />
                  <span className="text-white font-semibold">错题回顾</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-yellow-300 bg-yellow-500/10 px-2 py-1 rounded">
                    已自动加入错题库
                  </span>
                  <Link
                    to="/wrong-questions"
                    className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded hover:bg-yellow-500/30"
                  >
                    去练习 →
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-white/10">
                {wrongQuestions.map((q, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-red-400 font-semibold">第{index + 1}题</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        q.type === 'choice' ? 'bg-blue-500/20 text-blue-400' :
                        q.type === 'blank' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {getDifficultyLabel(q.difficulty)}
                      </span>
                    </div>
                    <div className="text-white mb-3">{q.question}</div>
                    {q.type === 'choice' && q.options && (
                      <div className="space-y-2 mb-3">
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} className={`flex items-center gap-2 ${
                            option === q.answer ? 'text-green-400' : 'text-white/50'
                          }`}>
                            {option === q.answer && <CheckCircle className="w-4 h-4" />}
                            <span>{String.fromCharCode(65 + optIndex)}. {option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-white/60">你的答案：</span>
                      <span className="text-red-400">{answers[q.id] || '未作答'}</span>
                      <span className="text-white/40">|</span>
                      <span className="text-white/60">正确答案：</span>
                      <span className="text-green-400 font-semibold">{q.answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              to="/exam"
              className="flex-1 py-4 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              再考一次
            </Link>
            <Link
              to="/"
              className="flex-1 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold">{grade}年级模拟考试</span>
          <span className="text-white/60">|</span>
          <span className="text-white">{currentIndex + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            timeLeft < 300 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm">{userProgress.totalStars}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              currentQuestion.type === 'choice' ? 'bg-blue-500/20 text-blue-400' :
              currentQuestion.type === 'blank' ? 'bg-green-500/20 text-green-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {currentQuestion.type === 'choice' ? '选择题' : currentQuestion.type === 'blank' ? '填空题' : '问答题'}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= currentQuestion.difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                />
              ))}
            </div>
          </div>

          <div className="text-xl text-white mb-6">{currentQuestion.question}</div>

          {currentQuestion.type === 'choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion.id, String.fromCharCode(65 + index))}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 ${
                    answers[currentQuestion.id] === String.fromCharCode(65 + index)
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/10 border-white/20 text-white/80 hover:border-white/40'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    answers[currentQuestion.id] === String.fromCharCode(65 + index)
                      ? 'bg-white/30 text-white'
                      : 'bg-white/20 text-white/80'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </button>
              ))}
            </div>
          )}

          {(currentQuestion.type === 'blank' || currentQuestion.type === 'answer') && (
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="请输入答案..."
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一题
          </button>

          <div className="flex items-center gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg font-semibold transition-all ${
                  idx === currentIndex
                    ? 'bg-yellow-400 text-white'
                    : answers[q.id]
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              下一题
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={submitExam}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
              提交试卷
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

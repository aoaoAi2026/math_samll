import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Target, Play, ChevronRight, CheckCircle, XCircle, BookOpen, Trophy, ArrowLeft } from 'lucide-react';
import { getExamQuestions, getCompetitionList, getYearList, getGradeList } from '@/data/exam/examQuestions';
import type { ExamQuestion } from '@/data/exam/examQuestions';
type Competition = '希望杯' | 'YMO' | '迎春杯' | '华杯赛' | 'IMC';
type Year = 2019 | 2020 | 2021 | 2022 | 2023 | 2024;
type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export default function ExamQuestions() {
  const [competition, setCompetition] = useState<Competition>('希望杯');
  const [year, setYear] = useState<Year>(2024);
  const [grade, setGrade] = useState<Grade>(1);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<ExamQuestion[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

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
    setCurrentIndex(0);
    setTimeLeft(examQuestions.length * 180);
    setIsExamStarted(true);
    setIsFinished(false);
    setScore(0);
    setWrongQuestions([]);
    setShowExplanation(false);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitExam = () => {
    let correct = 0;
    const wrong: ExamQuestion[] = [];
    
    questions.forEach(q => {
      const userAnswer = answers[q.id]?.trim().toLowerCase() || '';
      const correctAnswer = q.options[q.answer];
      if (userAnswer === correctAnswer.toLowerCase()) {
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

  const goToNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <nav className="max-w-4xl mx-auto flex items-center justify-between py-4">
          <Link to="/" className="text-white hover:text-yellow-400 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xl font-bold">返回首页</span>
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white">真题练习</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">历年奥数真题练习</h1>
            <p className="text-white/60">选择竞赛、年份和年级，开始真题训练</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">选择竞赛</label>
                <select
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value as Competition)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                >
                  {competitions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">选择年份</label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) as Year)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}年</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">选择年级</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(parseInt(e.target.value) as Grade)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                >
                  {grades.map(g => (
                    <option key={g} value={g}>{g}年级</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              真题信息
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{competition}</div>
                <div className="text-white/60 text-sm">竞赛名称</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{year}年</div>
                <div className="text-white/60 text-sm">考试年份</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{grade}年级</div>
                <div className="text-white/60 text-sm">适用年级</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">5道</div>
                <div className="text-white/60 text-sm">题目数量</div>
              </div>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            开始真题练习
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <nav className="max-w-4xl mx-auto flex items-center justify-between py-4">
          <Link to="/" className="text-white hover:text-yellow-400 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xl font-bold">返回首页</span>
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{score >= 60 ? '🎉' : '💪'}</div>
            <h1 className="text-3xl font-bold text-white mb-2">考试完成!</h1>
            <p className="text-white/60">{competition} {year}年 {grade}年级真题</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-8 mb-6 text-center">
            <div className="text-6xl font-bold text-yellow-400 mb-4">{score}</div>
            <div className="text-white/80">总分</div>
            <div className="flex justify-center gap-4 mt-6">
              <div className="bg-white/10 rounded-xl px-6 py-3">
                <div className="text-2xl font-bold text-green-400">{questions.length - wrongQuestions.length}</div>
                <div className="text-white/60 text-sm">答对</div>
              </div>
              <div className="bg-white/10 rounded-xl px-6 py-3">
                <div className="text-2xl font-bold text-red-400">{wrongQuestions.length}</div>
                <div className="text-white/60 text-sm">答错</div>
              </div>
              <div className="bg-white/10 rounded-xl px-6 py-3">
                <div className="text-2xl font-bold text-blue-400">{Math.round(timeLeft / 60)}分</div>
                <div className="text-white/60 text-sm">剩余时间</div>
              </div>
            </div>
          </div>

          {wrongQuestions.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                错题回顾 ({wrongQuestions.length})
              </h3>
              <div className="space-y-4">
                {wrongQuestions.map((q, index) => (
                  <div key={q.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-sm">错题 {index + 1}</span>
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        q.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        q.difficulty === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {q.difficulty === 'easy' ? '简单' : q.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                    </div>
                    <p className="text-white mt-3">{q.question}</p>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {q.options.map((opt, i) => (
                        <div key={i} className={`p-2 rounded-lg ${
                          i === q.answer ? 'bg-green-500/20 text-green-400' : 'bg-white/5'
                        }`}>
                          {['A', 'B', 'C', 'D'][i]}. {opt} {i === q.answer && '(正确答案)'}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                      <div className="flex items-center gap-2 text-purple-300 mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm font-semibold">解析</span>
                      </div>
                      <p className="text-white/80 text-sm">{q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={startExam}
              className="flex-1 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
            >
              再考一次
            </button>
            <Link
              to="/"
              className="flex-1 py-4 bg-white/10 border border-white/20 rounded-xl text-white font-semibold text-center hover:bg-white/20 transition-all duration-300"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentQuestion?.id || ''];
  const isAnswerSelected = selectedAnswer !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <nav className="max-w-4xl mx-auto flex items-center justify-between py-4">
        <Link to="/" className="text-white hover:text-yellow-400 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">返回</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm">{currentIndex + 1}/{questions.length}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">{competition}</span>
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">{year}年</span>
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">{grade}年级</span>
            <span className={`ml-auto px-3 py-1 rounded-full text-sm ${
              currentQuestion?.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              currentQuestion?.difficulty === 'medium' ? 'bg-blue-500/20 text-blue-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {currentQuestion?.difficulty === 'easy' ? '简单' : currentQuestion?.difficulty === 'medium' ? '中等' : '困难'}
            </span>
          </div>

          <h2 className="text-xl text-white mb-6">{currentQuestion?.question}</h2>

          <div className="space-y-3">
            {currentQuestion?.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(currentQuestion!.id, opt)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 ${
                  selectedAnswer === opt
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedAnswer === opt
                    ? 'bg-yellow-500 text-white'
                    : 'bg-white/10 text-white/60'
                }`}>
                  {['A', 'B', 'C', 'D'][i]}
                </span>
                <span className="flex-1">{opt}</span>
                {selectedAnswer === opt && (
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                )}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-4 p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <div className="flex items-center gap-2 text-purple-300 mb-2">
                <BookOpen className="w-4 h-4" />
                <span className="font-semibold">解析</span>
              </div>
              <p className="text-white/80">{currentQuestion?.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex-1 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            {showExplanation ? '隐藏解析' : '查看解析'}
          </button>
          {currentIndex === questions.length - 1 ? (
            <button
              onClick={submitExam}
              disabled={!isAnswerSelected}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              提交试卷
            </button>
          ) : (
            <button
              onClick={goToNext}
              disabled={!isAnswerSelected}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              下一题
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setShowExplanation(false);
              }}
              className={`w-8 h-8 rounded-lg transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-yellow-500 text-white'
                  : answers[questions[index]?.id]
                    ? 'bg-green-500/50 text-green-400'
                    : 'bg-white/10 text-white/60'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
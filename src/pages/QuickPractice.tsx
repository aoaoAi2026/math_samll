import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, CheckCircle, XCircle, Lightbulb, BookOpen, Shuffle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { allQuestions, getDifficultyLabel } from '@/data/questions';
import type { Question } from '@/data/questions/types';

export default function QuickPractice() {
  const navigate = useNavigate();
  const { updateQuestionProgress, userProgress } = useGameStore();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTeaching, setShowTeaching] = useState(false);
  const [combo, setCombo] = useState(0);
  const [practiceCount, setPracticeCount] = useState(0);

  const getRandomQuestion = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const randomQuestion = shuffled[0];
    setQuestion(randomQuestion);
    setUserAnswer('');
    setShowResult(false);
    setShowTeaching(false);
  };

  useEffect(() => {
    getRandomQuestion();
  }, []);

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const correct = userAnswer.trim().toLowerCase() === question.answer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    updateQuestionProgress(question.id, correct);
    setPracticeCount(prev => prev + 1);
    
    if (correct) {
      setCombo(prev => prev + 1);
    } else {
      setCombo(0);
    }
  };

  const handleNext = () => {
    getRandomQuestion();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-white hover:text-yellow-400 transition-colors">
          <span className="text-xl font-bold">奥数闯关王</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm">{userProgress.totalStars}</span>
          </div>
          {combo >= 3 && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 rounded-full text-white text-sm font-semibold animate-pulse">
              连击 x{combo}!
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-purple-400" />
            <span className="text-white">快速练习</span>
            <span className="text-white/60">|</span>
            <span className="text-white">已练习 {practiceCount} 题</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= question.difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
              />
            ))}
            <span className="text-white/60 ml-2">{getDifficultyLabel(question.difficulty)}</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              question.type === 'choice' ? 'bg-blue-500/20 text-blue-400' :
              question.type === 'blank' ? 'bg-green-500/20 text-green-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {question.type === 'choice' ? '选择题' : question.type === 'blank' ? '填空题' : '问答题'}
            </span>
            <span className="text-white/60 text-sm">{question.grade}年级 - 第{question.chapter}章</span>
          </div>
          
          <div className="text-xl text-white mb-6 leading-relaxed">
            {question.question}
          </div>

          {question.type === 'choice' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && setUserAnswer(String.fromCharCode(65 + index))}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 ${
                    showResult
                      ? option === question.answer
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : userAnswer === String.fromCharCode(65 + index) && !isCorrect
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-white/5 border-white/10 text-white/50'
                      : userAnswer === String.fromCharCode(65 + index)
                        ? 'bg-white/20 border-white/40 text-white'
                        : 'bg-white/10 border-white/20 text-white/80 hover:border-white/40'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    showResult && option === question.answer
                      ? 'bg-green-500 text-white'
                      : showResult && userAnswer === String.fromCharCode(65 + index) && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white/80'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {showResult && option === question.answer && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                  {showResult && userAnswer === String.fromCharCode(65 + index) && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}

          {(question.type === 'blank' || question.type === 'answer') && (
            <div>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showResult}
                placeholder="请输入答案..."
                className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
              />
            </div>
          )}

          {!showResult && (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="mt-6 w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交答案
            </button>
          )}

          {showResult && (
            <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <div className="flex items-center gap-3 mb-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <span className={`text-lg font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? '回答正确！' : '回答错误'}
                </span>
                {isCorrect && (
                  <span className="ml-auto text-yellow-400 flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400" /> +1
                  </span>
                )}
              </div>
              <div className="text-white/80">
                正确答案：<span className="font-semibold">{question.answer}</span>
              </div>
            </div>
          )}
        </div>

        {showResult && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden mb-6">
            <button
              onClick={() => setShowTeaching(!showTeaching)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">教学解析</div>
                  <div className="text-white/60 text-sm">学习解题方法和技巧</div>
                </div>
              </div>
            </button>
            
            {showTeaching && (
              <div className="px-4 pb-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">知识点</span>
                  </div>
                  <div className="text-white/80 pl-6">{question.teaching.point}</div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 font-semibold">解题思路</span>
                  </div>
                  <div className="text-white/80 pl-6">{question.teaching.method}</div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 font-semibold">分步解析</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    {question.teaching.steps.map((step, index) => (
                      <div key={index} className="text-white/80 flex items-start gap-2">
                        <span className="text-green-400 font-semibold">{index + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-purple-400 font-semibold">记忆口诀</span>
                  </div>
                  <div className="text-white/80 pl-6 bg-purple-500/20 p-3 rounded-xl">
                    {question.teaching.memory}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-400 font-semibold">举一反三</span>
                  </div>
                  <div className="text-white/80 pl-6">{question.teaching.example}</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            返回首页
          </Link>

          {showResult && (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              下一题
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

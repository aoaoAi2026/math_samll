import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, CheckCircle, XCircle, Lightbulb, BookOpen, RotateCcw, Home } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getQuestionById, getQuestionsByChapter, getDifficultyLabel } from '@/data/questions';
import type { Question } from '@/data/questions/types';

export default function Practice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateQuestionProgress, updateChapterStars, userProgress, addWrongQuestion, markWrongQuestionCorrect, markWrongQuestionWrong } = useGameStore();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTeaching, setShowTeaching] = useState(false);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (id) {
      // 先尝试从当前知识点的题目列表中查找
      const storageKey = `questions_${(sessionStorage.getItem('lastGrade') || '1')}_${(sessionStorage.getItem('lastTopicId') || '1')}`;
      const storageData = sessionStorage.getItem(storageKey);
      if (storageData) {
        const questions = JSON.parse(storageData);
        const q = questions.find((q: Question) => q.id === id);
        if (q) {
          setQuestion(q);
          setUserAnswer('');
          setShowResult(false);
          setShowTeaching(false);
          return;
        }
      }
      
      // 从单个题目的 sessionStorage 中查找
      const storedQuestion = sessionStorage.getItem('currentQuestion');
      if (storedQuestion) {
        const parsed = JSON.parse(storedQuestion);
        if (parsed.id === id) {
          setQuestion(parsed);
          setUserAnswer('');
          setShowResult(false);
          setShowTeaching(false);
          return;
        }
      }
      
      // 如果 sessionStorage 没有，从题库中查找
      const q = getQuestionById(id);
      if (q) {
        setQuestion(q);
        setUserAnswer('');
        setShowResult(false);
        setShowTeaching(false);
      }
    }
  }, [id]);

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">题目不存在</div>
      </div>
    );
  }

  const grade = question.grade;
  const chapter = question.chapter;
  
  // 从 sessionStorage 获取题目列表（支持 mock 题目的导航）
  let questions: Question[] = [];
  const storageKey = `questions_${grade}_${chapter}`;
  const storedQuestions = sessionStorage.getItem(storageKey);
  if (storedQuestions) {
    questions = JSON.parse(storedQuestions);
  } else {
    questions = getQuestionsByChapter(grade, chapter);
  }
  
  const currentIndex = questions.findIndex(q => q.id === id);
  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    let correct = false;
    if (question.type === 'choice' && question.options) {
      // 选择题：用户选择的是字母，需要转换为选项内容后比较
      const answerIndex = userAnswer.charCodeAt(0) - 65; // A->0, B->1, C->2, D->3
      if (answerIndex >= 0 && answerIndex < question.options.length) {
        const selectedOption = question.options[answerIndex];
        correct = selectedOption === question.answer;
      }
    } else {
      // 填空题/问答题：直接比较答案
      correct = userAnswer.trim().toLowerCase() === question.answer.toLowerCase();
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    updateQuestionProgress(question.id, correct);
    
    // 错题库逻辑
    const isInWrongList = userProgress.wrongQuestions?.some(w => w.questionId === question.id);
    if (!correct) {
      // 答错：加入错题库或重置连对
      addWrongQuestion({
        questionId: question.id,
        question: question.question,
        options: question.options,
        answer: question.answer,
        explanation: question.teaching?.steps?.join('；') || '',
        type: question.type,
        grade: question.grade,
        topicId: question.topicId,
        topicName: question.topicName,
        source: 'practice',
      });
    } else if (isInWrongList) {
      // 答对且原本在错题库中：累加连对次数
      markWrongQuestionCorrect(question.id);
    }
    
    if (correct) {
      setCombo(prev => prev + 1);
      const chapterProgress = userProgress.progress[grade]?.chapters?.[chapter];
      const currentStars = chapterProgress?.stars || 0;
      const newStars = Math.min(4, currentStars + (combo >= 3 ? 2 : 1));
      updateChapterStars(grade, chapter, newStars);
    } else {
      setCombo(0);
    }
  };

  const handleNext = () => {
    if (nextQuestion) {
      navigate(`/practice/${nextQuestion.id}`);
    }
  };

  const handlePrev = () => {
    if (prevQuestion) {
      navigate(`/practice/${prevQuestion.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full">
      <nav className="w-full px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            to={`/grade/${grade}`} 
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-xl font-bold">返回</span>
          </Link>
        </div>
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

      <div className="w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-white/60">第{chapter}章</span>
            <span className="text-white">|</span>
            <span className="text-white">{currentIndex + 1}/{questions.length}</span>
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
              {!isCorrect && (
                <div className="mt-3 flex items-center gap-2 text-yellow-300 text-sm bg-yellow-500/10 px-3 py-2 rounded-lg">
                  <BookOpen className="w-4 h-4" />
                  <span>本题已自动加入「错题库」，需连续答对 3 次才能从错题库中移除</span>
                </div>
              )}
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
              <ChevronRight className={`w-5 h-5 text-white/60 transition-transform ${showTeaching ? 'rotate-90' : ''}`} />
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
          <button
            onClick={handlePrev}
            disabled={!prevQuestion}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            上一题
          </button>
          
          <div className="flex items-center gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => navigate(`/practice/${q.id}`)}
                className={`w-3 h-3 rounded-full transition-all ${
                  q.id === id
                    ? 'bg-yellow-400 scale-125'
                    : userProgress.progress[grade]?.questions?.[q.id]?.passed
                      ? 'bg-green-400'
                      : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {nextQuestion ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              下一题
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <Link
              to={`/grade/${grade}`}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
              <Home className="w-5 h-5" />
              返回章节
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

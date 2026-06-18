import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, CheckCircle, XCircle, Lightbulb, BookOpen, Home } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getQuestionById, getQuestionsByChapter, getDifficultyLabel } from '@/data/questions';
import type { Question } from '@/data/questions/types';
import { resolveQuestionImage } from '@/utils/resolveQuestionImage';
import ConfettiEffect from '@/components/ConfettiEffect';
import RankUpModal from '@/components/RankUpModal';
import { sound } from '@/utils/sound';

const COMBO_EMOJIS = ['😊', '😄', '🔥', '💪', '⚡', '🌟', '🎯', '🏆', '👑', '🚀'];
const CORRECT_EMOJIS = ['🎉', '👏', '💯', '✨', '🌟', '🏅', '🥳', '😎', '🎊', '💪'];
const WRONG_EMOJIS = ['💪', '🤔', '📚', '🧐', '😤', '🔄', '🎯', '🌱'];

export default function Practice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateQuestionProgress, updateChapterStars, userProgress, addWrongQuestion, markWrongQuestionCorrect, recordAnswer, rankJustChanged, clearRankChanged } = useGameStore();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTeaching, setShowTeaching] = useState(false);
  const [teachingStep, setTeachingStep] = useState(-1); // -1=折叠, 0=展开但未逐步, 1+=逐步显现
  const [teachingExpanded, setTeachingExpanded] = useState(false); // 一键展开所有内容
  const [combo, setCombo] = useState(0);
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [feedbackEmoji, setFeedbackEmoji] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);

  useEffect(() => {
    if (id) {
      const storageKey = `questions_${(sessionStorage.getItem('lastGrade') || '1')}_${(sessionStorage.getItem('lastTopicId') || '1')}`;
      const storageData = sessionStorage.getItem(storageKey);
      if (storageData) {
        let questions: Question[] = [];
        try { questions = JSON.parse(storageData); } catch { /* 数据损坏，跳过 */ }
        const q = questions.find((q: Question) => q.id === id);
        if (q) {
          setQuestion({ ...q, image: resolveQuestionImage(q) || (q as any).image });
          resetState();
          return;
        }
      }
      
      const storedQuestion = sessionStorage.getItem('currentQuestion');
      if (storedQuestion) {
        let parsed: Question | null = null;
        try { parsed = JSON.parse(storedQuestion); } catch { /* 跳过 */ }
        if (parsed && parsed.id === id) {
          setQuestion({ ...parsed, image: resolveQuestionImage(parsed) || (parsed as any).image });
          resetState();
          return;
        }
      }
      
      const q = getQuestionById(id);
      if (q) {
        setQuestion({ ...q, image: resolveQuestionImage(q) || (q as any).image });
        resetState();
      }
    }
  }, [id]);

  const resetState = () => {
    setUserAnswer('');
    setShowResult(false);
    setShowTeaching(false);
    setTeachingStep(-1);
    setTeachingExpanded(false);
    setShowComboEffect(false);
    setFeedbackEmoji('');
  };

  const grade = question?.grade || 1;
  const chapter = question?.chapter || 1;
  
  let questions: Question[] = [];
  const storageKey = `questions_${grade}_${chapter}`;
  const storedQuestions = sessionStorage.getItem(storageKey);
  if (storedQuestions) {
    try { questions = JSON.parse(storedQuestions); } catch { /* 损坏跳过 */ }
  } else {
    questions = getQuestionsByChapter(grade, chapter);
  }
  
  const currentIndex = questions.findIndex(q => q.id === id);
  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  const handleSubmit = () => handleSubmitWithAnswer();

  const handleSubmitWithAnswer = (forcedAnswer?: string) => {
    const answer = forcedAnswer ?? userAnswer;
    if (!answer.trim()) return;
    
    let correct = false;
    if (question.type === 'choice' && question.options) {
      const answerIndex = answer.charCodeAt(0) - 65;
      if (answerIndex >= 0 && answerIndex < question.options.length) {
        correct = question.options[answerIndex] === question.answer;
      }
    } else {
      correct = answer.trim().toLowerCase() === question.answer.toLowerCase();
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    updateQuestionProgress(question.id, correct);
    recordAnswer(correct);

    // 音效 + 粒子庆祝
    if (correct) {
      sound.correct();
      if (combo + 1 >= 3) sound.combo(combo + 1);
      setShowConfetti(true);
    } else {
      sound.wrong();
    }
    
    const isInWrongList = userProgress.wrongQuestions?.some(w => w.questionId === question.id);
    if (!correct) {
      addWrongQuestion({
        questionId: question.id,
        question: question.question,
        options: question.options,
        answer: question.answer,
        explanation: question.teaching?.steps?.join('；') || '',
        type: question.type,
        grade: question.grade,
        chapter: question.chapter,
        difficulty: question.difficulty,
        topicId: question.topicId,
        topicName: question.topicName,
        source: 'practice',
        teaching: question.teaching,
      });
      setFeedbackEmoji(WRONG_EMOJIS[Math.floor(Math.random() * WRONG_EMOJIS.length)]);
    } else if (isInWrongList) {
      markWrongQuestionCorrect(question.id);
    }
    
    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setFeedbackEmoji(CORRECT_EMOJIS[Math.floor(Math.random() * CORRECT_EMOJIS.length)]);
      if (newCombo >= 3 && newCombo % 3 === 0) {
        setShowComboEffect(true);
        setTimeout(() => setShowComboEffect(false), 2000);
      }
      const chapterProgress = userProgress.progress[grade]?.chapters?.[chapter];
      const currentStars = chapterProgress?.stars || 0;
      const newStars = Math.min(4, currentStars + (combo >= 3 ? 2 : 1));
      updateChapterStars(grade, chapter, newStars);
      
      // 答题正确后自动跳转下一题
      if (nextQuestion) {
        setTimeout(() => {
          sound.navigate();
          navigate(`/practice/${nextQuestion.id}`);
        }, 1500); // 1.5秒后自动跳转
      }
    } else {
      setCombo(0);
      // 答题错误，自动展开教学解析全部内容
      setShowTeaching(true);
      setTeachingExpanded(true);
    }
  };

  // 段位升级监听
  useEffect(() => {
    if (rankJustChanged) {
      setShowRankUp(true);
    }
  }, [rankJustChanged]);

  const handleNext = () => {
    if (nextQuestion) { sound.navigate(); navigate(`/practice/${nextQuestion.id}`); }
  };

  const handlePrev = () => {
    if (prevQuestion) { sound.navigate(); navigate(`/practice/${prevQuestion.id}`); }
  };

  const difficultyColors = ['from-green-400 to-emerald-500', 'from-blue-400 to-cyan-500', 'from-orange-400 to-amber-500', 'from-red-400 to-pink-500'];
  const difficultyEmojis = ['🌱', '🌿', '🔥', '💎'];

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex flex-col items-center justify-center gap-6">
        <div className="text-white text-xl animate-bounce">🔍 正在寻找题目...</div>
        <Link to="/" className="text-white/50 hover:text-white/80 text-sm underline">← 返回首页</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 w-full relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 连击特效 */}
      {showComboEffect && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-2">🔥</div>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
              {combo} 连击！
            </div>
            <div className="text-2xl mt-1 text-yellow-300">太厉害了！</div>
          </div>
        </div>
      )}

      {/* 粒子礼花 */}
      {showConfetti && (
        <ConfettiEffect count={35} onDone={() => setShowConfetti(false)} />
      )}

      {/* 段位升级弹窗 */}
      {showRankUp && rankJustChanged && (
        <RankUpModal
          newRank={rankJustChanged}
          totalStars={userProgress.totalStars}
          onClose={() => { setShowRankUp(false); clearRankChanged(); }}
        />
      )}

      <nav className="w-full px-4 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Link 
            to={`/grade/${grade}`} 
            className="flex items-center gap-2 text-white/80 hover:text-yellow-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold">返回</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span>
          </div>
          {combo >= 2 && (
            <div className="bg-gradient-to-r from-orange-400 to-red-500 px-3 py-1.5 rounded-full text-white text-sm font-bold animate-pulse shadow-lg shadow-orange-500/30">
              {COMBO_EMOJIS[Math.min(combo - 1, COMBO_EMOJIS.length - 1)]} x{combo}
            </div>
          )}
        </div>
      </nav>

      <div className="w-full px-4 py-4 relative z-10">
        {/* 顶部信息栏 + 上下题导航（移到上面方便手机点击） */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">第{chapter}章</span>
              <span className="text-white/30">|</span>
              <span className="text-white text-sm font-bold">{currentIndex + 1}/{questions.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= question.difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                />
              ))}
              <span className="text-white/50 text-sm ml-1">{difficultyEmojis[question.difficulty - 1]} {getDifficultyLabel(question.difficulty)}</span>
            </div>
          </div>

          {/* 上一题 / 下一题大按钮（放在题目上方，方便拇指点击） */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrev}
              disabled={!prevQuestion}
              className="flex items-center justify-center gap-2 px-4 py-4 bg-white/10 rounded-2xl text-white font-bold text-base hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
              上一题
            </button>
            {nextQuestion ? (
              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-base hover:shadow-xl hover:shadow-orange-500/30 transition-all active:scale-95"
              >
                下一题
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to={`/grade/${grade}`}
                className="flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white font-bold text-base hover:shadow-xl hover:shadow-green-500/30 transition-all active:scale-95"
              >
                <Home className="w-5 h-5" />
                完成章节
              </Link>
            )}
          </div>
        </div>

        {/* 题目卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-4 shadow-2xl shadow-purple-900/20">
          <div className="flex items-start gap-2 mb-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              question.type === 'choice' ? 'bg-blue-500/20 text-blue-300' :
              question.type === 'blank' ? 'bg-green-500/20 text-green-300' :
              'bg-purple-500/20 text-purple-300'
            }`}>
              {question.type === 'choice' ? '🔤 选择题' : question.type === 'blank' ? '✏️ 填空题' : '📝 问答题'}
            </span>
            {question.topicName && (
              <span className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/40">
                {question.topicName}
              </span>
            )}
          </div>
          
          <div className="text-xl sm:text-2xl text-white mb-4 leading-relaxed font-medium whitespace-pre-wrap">
            {question.question}
          </div>

          {question.image && (
            <div className="mb-4 -mx-2">
              <img
                src={question.image}
                alt="题目图片"
                className="w-full h-auto rounded-2xl shadow-lg" style={{ maxHeight: '60vh' }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
          )}

          {question.type === 'choice' && question.options && (
            <div className="space-y-2.5">
              {question.options.map((option, index) => {
                const letter = String.fromCharCode(65 + index);
                const isSelected = userAnswer === letter;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (showResult) return;
                      // 单选：选中后自动提交
                      sound.navigate();
                      setUserAnswer(letter);
                      setTimeout(() => handleSubmitWithAnswer(letter), 50);
                    }}
                    disabled={showResult}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-3 ${
                      showResult
                        ? option === question.answer
                          ? 'bg-green-500/20 border-green-400 text-green-300 shadow-lg shadow-green-500/10'
                          : isSelected && option !== question.answer
                            ? 'bg-red-500/20 border-red-400 text-red-300'
                            : 'bg-white/5 border-white/10 text-white/40'
                        : isSelected
                          ? 'bg-white/20 border-yellow-400/50 text-white shadow-lg shadow-yellow-500/10 scale-[1.02]'
                          : 'bg-white/10 border-white/20 text-white/80 hover:border-white/40 hover:bg-white/15'
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                      showResult && option === question.answer
                        ? 'bg-green-500 text-white'
                        : showResult && isSelected && option !== question.answer
                          ? 'bg-red-500 text-white'
                          : isSelected && !showResult
                            ? 'bg-yellow-400 text-white'
                            : 'bg-white/10 text-white/60'
                    }`}>
                      {letter}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && option === question.answer && (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    )}
                    {showResult && isSelected && option !== question.answer && (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {(question.type === 'blank' || question.type === 'answer') && (
            <div className="relative">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showResult}
                placeholder="✍️ 在这里输入你的答案..."
                className="w-full p-5 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-lg placeholder-white/30 focus:border-yellow-400/50 focus:outline-none focus:bg-white/15 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
              />
              {!showResult && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 text-sm">
                  按 Enter 提交
                </span>
              )}
            </div>
          )}

          {/* 提交按钮：仅非选择题显示（单选点选项即提交） */}
          {!showResult && question.type !== 'choice' && (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="mt-5 w-full py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
            >
              ✨ 提交答案
            </button>
          )}

          {showResult && (
            <div className={`mt-5 p-5 rounded-2xl border-2 transition-all animate-[fadeIn_0.3s_ease] ${
              isCorrect ? 'bg-green-500/10 border-green-400/30' : 'bg-red-500/10 border-red-400/30'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{feedbackEmoji}</span>
                <div>
                  <div className={`text-lg font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                    {isCorrect ? '太棒了，答对了！' : '没关系，再试一次！'}
                  </div>
                  {isCorrect && combo >= 2 && (
                    <div className="text-yellow-300 text-sm font-bold">🔥 连击 ×{combo}！</div>
                  )}
                </div>
                {isCorrect && (
                  <div className="ml-auto flex items-center gap-1 bg-yellow-400/20 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold">+1</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/80 bg-white/5 rounded-xl p-3">
                <span className="text-white/40 text-sm">✅ 正确答案：</span>
                <span className="font-bold text-white">{question.answer}</span>
              </div>
              {!isCorrect && (
                <div className="mt-3 flex items-center gap-2 text-yellow-300 text-sm bg-yellow-500/10 px-4 py-2.5 rounded-xl">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span>已自动加入错题库，连续答对 3 次即可出库哦～</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 教学解析 - 逐步演绎动画 */}
        {showResult && question.teaching && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden mb-4 shadow-lg">
            <button
              onClick={() => { 
                const open = !showTeaching; 
                setShowTeaching(open); 
                if (open) setTeachingExpanded(true); // 一键展开所有内容
                setTeachingStep(open ? 999 : -1); // 展开时设置为足够大的值，显示所有内容
              }}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold">📖 教学解析</div>
                  <div className="text-white/50 text-sm">{isCorrect ? '做对了！再来回顾一下吧～' : '别灰心，跟着步骤再学一遍！'}</div>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-white/60 transition-transform ${showTeaching ? 'rotate-90' : ''}`} />
            </button>
            
            {showTeaching && (
              <div className="px-5 pb-5 space-y-4">
                {/* 知识点 - 始终显示 */}
                <div className="animate-[fadeIn_0.3s_ease]">
                  <div className="flex items-center gap-2 mb-2"><Lightbulb className="w-4 h-4 text-yellow-400" /><span className="text-yellow-400 font-bold">💡 知识点</span></div>
                  <div className="text-white/80 pl-6">{question.teaching.point}</div>
                </div>
                
                {/* 解题思路 - 始终显示 */}
                <div className="animate-[fadeIn_0.3s_ease]">
                  <div className="flex items-center gap-2 mb-2"><span className="text-blue-400 font-bold">🧭 解题思路</span></div>
                  <div className="text-white/80 pl-6">{question.teaching.method}</div>
                </div>
                
                {/* 分步解析 - 始终显示所有步骤 */}
                <div className="animate-[fadeIn_0.3s_ease]">
                  <div className="flex items-center gap-2 mb-2"><span className="text-green-400 font-bold">📋 分步解析</span></div>
                  {question.teaching.steps.map((step, index) => (
                    <div key={index} className="text-white/80 pl-6 flex items-start gap-2 mb-1">
                      <span className="text-green-400 font-bold flex-shrink-0">{index + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                
                {/* 记忆口诀 - 始终显示 */}
                {question.teaching.memory && (
                  <div className="animate-[fadeIn_0.3s_ease]">
                    <div className="flex items-center gap-2 mb-2"><span className="text-purple-400 font-bold">🎵 记忆口诀</span></div>
                    <div className="text-white/80 pl-6 bg-purple-500/15 p-4 rounded-2xl border border-purple-500/20">{question.teaching.memory}</div>
                  </div>
                )}
                
                {/* 示例 - 始终显示 */}
                {question.teaching.example && (
                  <div className="animate-[fadeIn_0.3s_ease]">
                    <div className="flex items-center gap-2 mb-2"><span className="text-cyan-400 font-bold">💬 典型例题</span></div>
                    <div className="text-white/80 pl-6 bg-cyan-500/15 p-4 rounded-2xl border border-cyan-500/20">{question.teaching.example}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 进度圆点（点击跳转） */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 mb-4">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => navigate(`/practice/${q.id}`)}
              className={`transition-all rounded-full ${
                q.id === id
                  ? 'w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 scale-125 shadow-lg shadow-orange-500/30'
                  : userProgress.progress[grade]?.questions?.[q.id]?.passed
                    ? 'w-3 h-3 bg-green-400'
                    : 'w-3 h-3 bg-white/20 hover:bg-white/40'
              }`}
              title={`第${idx + 1}题`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, CheckCircle, XCircle, Lightbulb, BookOpen, Shuffle, Sparkles, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { allQuestions, getDifficultyLabel } from '@/data/questions';
import type { Question } from '@/data/questions/types';
import ConfettiEffect from '@/components/ConfettiEffect';
import RankUpModal from '@/components/RankUpModal';
import { sound } from '@/utils/sound';

const COMBO_EMOJIS = ['😊', '😄', '🔥', '💪', '⚡', '🌟', '🎯', '🏆', '👑', '🚀'];
const CORRECT_EMOJIS = ['🎉', '👏', '💯', '✨', '🌟', '🏅', '🥳', '😎', '🎊', '💪'];
const WRONG_EMOJIS = ['💪', '🤔', '📚', '🧐', '😤', '🔄', '🎯', '🌱'];

export default function QuickPractice() {
  const { updateQuestionProgress, userProgress, addWrongQuestion, markWrongQuestionCorrect, recordAnswer, rankJustChanged, clearRankChanged } = useGameStore();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTeaching, setShowTeaching] = useState(false);
  const [teachingStep, setTeachingStep] = useState(-1);
  const [combo, setCombo] = useState(0);
  const [practiceCount, setPracticeCount] = useState(0);
  const [feedbackEmoji, setFeedbackEmoji] = useState('');
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);

  const getRandomQuestion = () => {
    // 避免短时间内重复出现同一题
    let available = allQuestions.filter(q => !questionHistory.slice(-10).includes(q.id));
    if (available.length === 0) available = [...allQuestions];
    const randomQuestion = available[Math.floor(Math.random() * available.length)];
    setQuestion(randomQuestion);
    setQuestionHistory(prev => [...prev.slice(-20), randomQuestion.id]);
    setUserAnswer('');
    setShowResult(false);
    setShowTeaching(false);
    setTeachingStep(-1);
    setFeedbackEmoji('');
  };

  useEffect(() => {
    getRandomQuestion();
  }, []);

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl animate-bounce">🎲 正在随机抽题...</div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    let correct = false;
    if (question.type === 'choice' && question.options) {
      const answerIndex = userAnswer.charCodeAt(0) - 65;
      if (answerIndex >= 0 && answerIndex < question.options.length) {
        const selectedOption = question.options[answerIndex];
        correct = selectedOption === question.answer;
      }
    } else {
      correct = userAnswer.trim().toLowerCase() === question.answer.toLowerCase();
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    updateQuestionProgress(question.id, correct);
    recordAnswer(correct);
    setPracticeCount(prev => prev + 1);
    // 音效
    if (correct) { sound.correct(); setShowConfetti(true); }
    else { sound.wrong(); }
    
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
    } else {
      setCombo(0);
    }
  };

  // 段位升级监听
  useEffect(() => {
    if (rankJustChanged) setShowRankUp(true);
  }, [rankJustChanged]);

  const handleNext = () => {
    getRandomQuestion();
  };

  const difficultyEmojis = ['🌱', '🌿', '🔥', '💎'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-60 h-60 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
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

      <nav className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors">
          <span className="text-xl font-bold">🎮 奥数闯关王</span>
        </Link>
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

      <div className="max-w-3xl mx-auto px-4 py-4 relative z-10">
        {/* 顶部导航：上一题 / 下一题 */}
        {showResult && (
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all font-bold text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              上一题
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-sm hover:shadow-xl hover:shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
            >
              下一题
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 信息栏 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shuffle className="w-4 h-4 text-purple-300" />
            <span className="text-white/80 text-sm">🎲 快速练习</span>
            <span className="text-white/30">|</span>
            <span className="text-white/80 text-sm">已练 {practiceCount} 题</span>
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
            <span className="text-white/40 text-sm">{question.grade}年级 · 第{question.chapter}章</span>
          </div>
          
          <div className="text-xl sm:text-2xl text-white mb-6 leading-relaxed font-medium">
            {question.question}
          </div>

          {question.type === 'choice' && question.options && (
            <div className="space-y-2.5">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && setUserAnswer(String.fromCharCode(65 + index))}
                  disabled={showResult}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-3 ${
                    showResult
                      ? option === question.answer
                        ? 'bg-green-500/20 border-green-400 text-green-300 shadow-lg shadow-green-500/10'
                        : userAnswer === String.fromCharCode(65 + index) && !isCorrect
                          ? 'bg-red-500/20 border-red-400 text-red-300'
                          : 'bg-white/5 border-white/10 text-white/40'
                      : userAnswer === String.fromCharCode(65 + index)
                        ? 'bg-white/20 border-yellow-400/50 text-white shadow-lg shadow-yellow-500/10 scale-[1.02]'
                        : 'bg-white/10 border-white/20 text-white/80 hover:border-white/40 hover:bg-white/15'
                  }`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    showResult && option === question.answer
                      ? 'bg-green-500 text-white'
                      : showResult && userAnswer === String.fromCharCode(65 + index) && !isCorrect
                        ? 'bg-red-500 text-white'
                        : userAnswer === String.fromCharCode(65 + index) && !showResult
                          ? 'bg-yellow-400 text-white'
                          : 'bg-white/10 text-white/60'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && option === question.answer && (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  )}
                  {showResult && userAnswer === String.fromCharCode(65 + index) && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                </button>
              ))}
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
            </div>
          )}

          {!showResult && (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="mt-5 w-full py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
            >
              ✨ 提交答案
            </button>
          )}

          {showResult && (
            <div className={`mt-5 p-5 rounded-2xl border-2 animate-[fadeIn_0.3s_ease] ${
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
            </div>
          )}
        </div>

        {/* 教学解析 - 逐步演绎动画 */}
        {showResult && question.teaching && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden mb-4 shadow-lg">
            <button
              onClick={() => { const open = !showTeaching; setShowTeaching(open); setTeachingStep(open ? 0 : -1); }}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold">📖 教学解析</div>
                  <div className="text-white/50 text-sm">{isCorrect ? '做对了！回顾一下吧～' : '别灰心，跟着步骤再学一遍！'}</div>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-white/60 transition-transform ${showTeaching ? 'rotate-90' : ''}`} />
            </button>
            {showTeaching && (
              <div className="px-5 pb-5 space-y-4">
                {teachingStep >= 0 && (
                  <div className="animate-[fadeIn_0.3s_ease]">
                    <div className="flex items-center gap-2 mb-2"><Lightbulb className="w-4 h-4 text-yellow-400" /><span className="text-yellow-400 font-bold">💡 知识点</span></div>
                    <div className="text-white/80 pl-6">{question.teaching.point}</div>
                    {teachingStep === 0 && (
                      <button onClick={() => { sound.navigate(); setTeachingStep(1); }} className="mt-3 flex items-center gap-1 text-yellow-400 text-sm font-bold hover:text-yellow-300">看解题思路 <ArrowRight className="w-3 h-3" /></button>
                    )}
                  </div>
                )}
                {teachingStep >= 1 && (
                  <div className="animate-[fadeIn_0.3s_ease]">
                    <div className="flex items-center gap-2 mb-2"><span className="text-blue-400 font-bold">🧭 解题思路</span></div>
                    <div className="text-white/80 pl-6">{question.teaching.method}</div>
                    {teachingStep === 1 && (
                      <button onClick={() => { sound.navigate(); setTeachingStep(2); }} className="mt-3 flex items-center gap-1 text-blue-400 text-sm font-bold hover:text-blue-300">看分步解析 <ArrowRight className="w-3 h-3" /></button>
                    )}
                  </div>
                )}
                {teachingStep >= 2 && question.teaching.steps.map((step, index) => (
                  <div key={index} className={index < teachingStep - 1 ? '' : 'animate-[fadeIn_0.3s_ease]'}>
                    {index === 0 && <div className="flex items-center gap-2 mb-2"><span className="text-green-400 font-bold">📋 分步解析</span></div>}
                    <div className="text-white/80 pl-6 flex items-start gap-2"><span className="text-green-400 font-bold flex-shrink-0">{index + 1}.</span><span>{step}</span></div>
                    {index === teachingStep - 2 && index < question.teaching.steps.length - 1 && (
                      <button onClick={() => { sound.navigate(); setTeachingStep(s => s + 1); }} className="ml-6 mt-2 text-green-400 text-xs font-bold hover:text-green-300 flex items-center gap-1">下一步 <ArrowRight className="w-3 h-3" /></button>
                    )}
                    {index === question.teaching.steps.length - 1 && teachingStep <= question.teaching.steps.length + 1 && (
                      <button onClick={() => { sound.navigate(); setTeachingStep(question.teaching.steps.length + 2); }} className="ml-6 mt-2 text-purple-400 text-xs font-bold hover:text-purple-300 flex items-center gap-1">看口诀 <ArrowRight className="w-3 h-3" /></button>
                    )}
                  </div>
                ))}
                {teachingStep >= question.teaching.steps.length + 2 && (
                  <div className="animate-[fadeIn_0.3s_ease]">
                    <div className="flex items-center gap-2 mb-2"><span className="text-purple-400 font-bold">🎵 记忆口诀</span></div>
                    <div className="text-white/80 pl-6 bg-purple-500/15 p-4 rounded-2xl border border-purple-500/20">{question.teaching.memory}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 底部返回按钮 */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all font-bold text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

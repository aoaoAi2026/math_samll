import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, XCircle, Trash2, Filter, RefreshCw, BookOpen, CheckCircle2, Award, Lightbulb, Star, Sparkles, Flame, Play, Printer } from 'lucide-react';
import { useGameStore, CONSECUTIVE_THRESHOLD } from '@/store/gameStore';
import type { WrongQuestionRecord } from '@/data/questions/types';

export default function WrongQuestions() {
  const { userProgress, removeWrongQuestion, clearWrongQuestions, markWrongQuestionWrong } = useGameStore();
  const navigate = useNavigate();
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'practice' | 'exam'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);

  const wrongList = userProgress.wrongQuestions || [];

  const filteredList = useMemo(() => {
    return wrongList.filter(w => {
      if (filterGrade !== 'all' && w.grade !== filterGrade) return false;
      if (filterSource !== 'all' && w.source !== filterSource) return false;
      return true;
    });
  }, [wrongList, filterGrade, filterSource]);

  const stats = useMemo(() => {
    const total = wrongList.length;
    const mastered = wrongList.filter(w => w.consecutiveCorrect >= CONSECUTIVE_THRESHOLD).length;
    const needMore = wrongList.filter(w => w.consecutiveCorrect < CONSECUTIVE_THRESHOLD).length;
    const avgConsecutive = total > 0
      ? (wrongList.reduce((sum, w) => sum + w.consecutiveCorrect, 0) / total).toFixed(1)
      : '0';
    return { total, mastered, needMore, avgConsecutive };
  }, [wrongList]);

  const selectedRecord = selectedId
    ? wrongList.find(w => w.questionId === selectedId) || null
    : null;

  if (wrongList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 w-full relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-60 h-60 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>
        <nav className="w-full px-4 py-4 flex items-center justify-between relative z-10">
          <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xl font-bold">返回首页</span>
          </Link>
          <div className="flex items-center gap-2 text-white">
            <BookOpen className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-bold">📝 错题库</span>
          </div>
        </nav>

        <div className="w-full px-4 py-12 flex flex-col items-center justify-center relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 max-w-md w-full text-center shadow-2xl">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-extrabold text-white mb-3">错题库是空的！</h2>
            <p className="text-white/60 mb-6">太厉害了，你目前没有错题记录！</p>
            <div className="flex items-center justify-center gap-1 mb-6">
              {['🌟', '⭐', '💫', '✨', '🎯'].map((e, i) => (
                <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
              ))}
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold hover:shadow-xl hover:shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
            >
              🚀 继续学习
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 w-full relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-60 h-60 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="w-full px-4 py-4 flex items-center justify-between relative z-10">
        <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xl font-bold">返回首页</span>
        </Link>
        <div className="flex items-center gap-2 text-white">
          <BookOpen className="w-5 h-5 text-yellow-400" />
          <span className="text-lg font-bold">📝 错题库</span>
        </div>
      </nav>

      <div className="w-full px-4 pb-12 relative z-10">
        {/* 统计面板 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center hover:scale-105 transition-transform">
            <div className="text-3xl font-extrabold text-yellow-400">{stats.total}</div>
            <div className="text-white/50 text-xs mt-1">📋 总错题数</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center hover:scale-105 transition-transform">
            <div className="text-3xl font-extrabold text-red-400">{stats.needMore}</div>
            <div className="text-white/50 text-xs mt-1">🎯 待巩固</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center hover:scale-105 transition-transform">
            <div className="text-3xl font-extrabold text-green-400">{stats.mastered}</div>
            <div className="text-white/50 text-xs mt-1">✅ 已掌握</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center hover:scale-105 transition-transform">
            <div className="text-3xl font-extrabold text-blue-400">{stats.avgConsecutive}</div>
            <div className="text-white/50 text-xs mt-1">🔥 平均连对</div>
          </div>
        </div>

        {/* 规则提示 */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 text-yellow-300 mb-2">
            <Award className="w-5 h-5" />
            <span className="font-bold">🏆 错题出库规则</span>
          </div>
          <p className="text-white/70 text-sm">
            每道错题需要 <span className="text-yellow-300 font-bold">连续答对 {CONSECUTIVE_THRESHOLD} 次</span> 才能从错题库中剔除。
            答错一次就要重新开始哦！加油 💪
          </p>
        </div>

        {/* 🔴 错题重练 & 打印按钮 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              if (wrongList.length === 0) return;
              const ids = wrongList.slice(0, 10).map(w => w.questionId);
              ids.forEach(id => sessionStorage.setItem(`wrong_review_${id}`, 'true'));
              sessionStorage.setItem('wrong_review_ids', JSON.stringify(ids));
              if (ids.length > 0) navigate(`/practice/${ids[0]}`);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl text-white font-bold text-sm hover:shadow-xl hover:shadow-red-500/30 transition-all active:scale-95"
          >
            <Play className="w-4 h-4" />🔥 错题重练 (限10题)
          </button>
          <button
            onClick={() => {
              const qs = wrongList.slice(0, 20).map((w, i) => `${i + 1}. ${w.question || '错题'} [答案: ${w.answer || '—'}]`).join('\n\n');
              const w = window.open('', '_blank');
              if (w) {
                w.document.write(`<html><head><title>错题打印</title><meta charset="utf-8"><style>body{font-family:sans-serif;padding:20px;line-height:1.8} .q{font-size:16px;margin-bottom:12px;border-bottom:1px solid #ddd;padding-bottom:12px}</style></head><body><h2>📝 错题练习卷 (${new Date().toLocaleDateString()})</h2><div>${qs}</div></body></html>`);
                w.document.close();
                setTimeout(() => w.print(), 500);
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 rounded-2xl text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-all"
          >
            <Printer className="w-4 h-4" />打印练习卷
          </button>
        </div>

        {/* 筛选 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 mb-4">
          <div className="flex items-center gap-2 mb-3 text-white">
            <Filter className="w-4 h-4" />
            <span className="font-bold text-sm">筛选条件</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-white/60 text-xs mb-1.5">年级</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
              >
                <option value="all">全部年级</option>
                {[1, 2, 3, 4, 5, 6].map(g => (
                  <option key={g} value={g}>{g}年级</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-xs mb-1.5">来源</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value as 'all' | 'practice' | 'exam')}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-yellow-400 text-sm"
              >
                <option value="all">全部来源</option>
                <option value="practice">📝 练习</option>
                <option value="exam">📋 考试</option>
              </select>
            </div>
          </div>
          {wrongList.length > 0 && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => {
                  if (confirm('确定要清空所有错题吗？此操作不可恢复！')) {
                    clearWrongQuestions();
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors text-sm font-bold"
              >
                <Trash2 className="w-4 h-4" />
                清空错题库
              </button>
            </div>
          )}
        </div>

        {selectedRecord ? (
          <WrongQuestionDetail
            record={selectedRecord}
            onClose={() => setSelectedId(null)}
            onMarkWrong={() => {
              markWrongQuestionWrong(selectedRecord.questionId);
              alert('已标记为答错，连续答对次数已重置 😤');
              setSelectedId(null);
            }}
            onRemove={() => {
              if (confirm('确定要从错题库中移除这道题吗？')) {
                removeWrongQuestion(selectedRecord.questionId);
                setSelectedId(null);
              }
            }}
          />
        ) : (
          <div className="space-y-3">
            {filteredList.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-white/60">没有符合条件的错题</p>
              </div>
            ) : (
              filteredList.map((w) => {
                const progress = (w.consecutiveCorrect / CONSECUTIVE_THRESHOLD) * 100;
                const willBeCleared = w.consecutiveCorrect >= CONSECUTIVE_THRESHOLD;
                return (
                  <div
                    key={w.questionId}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border-2 border-white/20 hover:border-yellow-400/40 transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full text-xs font-bold">
                            {w.grade}年级
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            w.source === 'exam'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {w.source === 'exam' ? '📋 考试' : '📝 练习'}
                          </span>
                          {w.topicName && (
                            <span className="bg-white/10 text-white/50 px-2.5 py-1 rounded-full text-xs">
                              {w.topicName}
                            </span>
                          )}
                          <span className="ml-auto text-white/30 text-xs">
                            练习 {w.totalAttempts} 次
                          </span>
                        </div>
                        <p className="text-white text-sm line-clamp-2 mb-3 leading-relaxed">{w.question}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white/10 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                willBeCleared
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                  : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                              }`}
                              style={{ width: `${Math.max(progress, 5)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold whitespace-nowrap ${
                            willBeCleared ? 'text-green-400' : 'text-yellow-300'
                          }`}>
                            {willBeCleared ? '✅ ' : '🔥 '}
                            {w.consecutiveCorrect}/{CONSECUTIVE_THRESHOLD}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedId(w.questionId)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                      >
                        💪 练习
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface DetailProps {
  record: WrongQuestionRecord;
  onClose: () => void;
  onMarkWrong: () => void;
  onRemove: () => void;
}

function WrongQuestionDetail({ record, onClose, onMarkWrong, onRemove }: DetailProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTeaching, setShowTeaching] = useState(false);
  const { markWrongQuestionCorrect } = useGameStore();

  const isChoice = record.type === 'choice' && record.options && record.options.length > 0;
  const isCorrect =
    showAnswer &&
    (isChoice
      ? userAnswer === record.answer
      : userAnswer.trim().toLowerCase() === record.answer.trim().toLowerCase());

  const handleSubmit = () => {
    if (!userAnswer.trim() && !isChoice) return;
    setShowAnswer(true);
  };

  const handleMarkCorrect = () => {
    markWrongQuestionCorrect(record.questionId);
    const newCount = record.consecutiveCorrect + 1;
    alert(`太棒了！连续答对次数 +1（${newCount}/${CONSECUTIVE_THRESHOLD}）${newCount >= CONSECUTIVE_THRESHOLD ? '\n🎉 恭喜！此错题已从错题库中移除！' : '\n继续加油，还差 ' + (CONSECUTIVE_THRESHOLD - newCount) + ' 次！'}`);
    onClose();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20 shadow-2xl animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50 font-bold">
            🔥 连对 {record.consecutiveCorrect}/{CONSECUTIVE_THRESHOLD}
          </span>
          <button
            onClick={onMarkWrong}
            className="text-xs px-3 py-1.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 font-bold"
          >
            ❌ 标记为错
          </button>
          <button
            onClick={onRemove}
            className="text-xs px-3 py-1.5 bg-white/10 text-white/50 rounded-xl hover:bg-white/20 font-bold"
          >
            🗑️ 移除
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full text-xs font-bold">{record.grade}年级</span>
          <span className="bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full text-xs font-bold">
            {record.type === 'choice' ? '🔤 选择题' : record.type === 'blank' ? '✏️ 填空题' : '📝 问答题'}
          </span>
          {record.difficulty > 0 && (
            <span className="flex items-center gap-0.5 bg-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-full text-xs font-bold">
              {Array.from({ length: record.difficulty }, (_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400" />
              ))}
            </span>
          )}
          {record.topicName && (
            <span className="bg-white/10 text-white/50 px-2.5 py-1 rounded-full text-xs">
              {record.topicName}
            </span>
          )}
        </div>
        <p className="text-white text-lg leading-relaxed mb-4 font-medium">{record.question}</p>

        {isChoice && record.options && (
          <div className="space-y-2">
            {record.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected = userAnswer === opt;
              const isAnswer = showAnswer && opt === record.answer;
              return (
                <button
                  key={i}
                  onClick={() => !showAnswer && setUserAnswer(opt)}
                  disabled={showAnswer}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    isAnswer
                      ? 'bg-green-500/20 border-green-400 text-green-300'
                      : isSelected
                        ? showAnswer
                          ? 'bg-red-500/20 border-red-400 text-red-300'
                          : 'bg-yellow-500/20 border-yellow-400 text-white shadow-lg shadow-yellow-500/10'
                        : 'bg-white/5 border-white/10 text-white/80 hover:border-white/30'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                    isAnswer ? 'bg-green-500 text-white' :
                    isSelected && !showAnswer ? 'bg-yellow-400 text-white' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {letter}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {isAnswer && <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {!isChoice && (
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={showAnswer}
            placeholder="✍️ 请输入答案..."
            className="w-full p-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400 text-lg"
            onKeyPress={(e) => e.key === 'Enter' && !showAnswer && handleSubmit()}
          />
        )}
      </div>

      {!showAnswer ? (
        <button
          onClick={handleSubmit}
          disabled={!userAnswer.trim() && !isChoice}
          className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
        >
          ✨ 提交答案
        </button>
      ) : (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
          <div className={`p-5 rounded-2xl border-2 ${isCorrect ? 'bg-green-500/10 border-green-400/30' : 'bg-red-500/10 border-red-400/30'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{isCorrect ? '🎉' : '💪'}</span>
              <span className={`font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect ? '答对了！真棒！' : '答错了，继续加油！'}
              </span>
            </div>
            {!isCorrect && (
              <div className="flex items-center gap-2 text-white/80 bg-white/5 rounded-xl p-3">
                <span className="text-white/40 text-sm">✅ 正确答案：</span>
                <span className="font-bold text-white">{record.answer}</span>
              </div>
            )}
            {record.explanation && !record.teaching && (
              <div className="mt-3 p-3 bg-purple-500/15 rounded-xl border border-purple-500/20">
                <div className="text-purple-300 text-xs font-bold mb-1">📖 解析</div>
                <p className="text-white/80 text-sm">{record.explanation}</p>
              </div>
            )}
          </div>

          {record.teaching && (
            <div className="bg-white/5 rounded-2xl border-2 border-white/10 overflow-hidden">
              <button
                onClick={() => setShowTeaching(!showTeaching)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold">📖 教学解析</div>
                    <div className="text-white/50 text-sm">看看这道题怎么解～</div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-white/60 transition-transform duration-300 ${showTeaching ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {showTeaching && (
                <div className="px-5 pb-5 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">💡 知识点</span>
                    </div>
                    <div className="text-white/80 pl-6">{record.teaching.point}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-400 font-bold">🧭 解题思路</span>
                    </div>
                    <div className="text-white/80 pl-6">{record.teaching.method}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 font-bold">📋 分步解析</span>
                    </div>
                    <div className="pl-6 space-y-2">
                      {record.teaching.steps.map((step, index) => (
                        <div key={index} className="text-white/80 flex items-start gap-2">
                          <span className="text-green-400 font-bold flex-shrink-0">{index + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-purple-400 font-bold">🎵 记忆口诀</span>
                    </div>
                    <div className="text-white/80 pl-6 bg-purple-500/15 p-4 rounded-2xl border border-purple-500/20">
                      {record.teaching.memory}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-orange-400 font-bold">🔄 举一反三</span>
                    </div>
                    <div className="text-white/80 pl-6">{record.teaching.example}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isCorrect ? (
            <button
              onClick={handleMarkCorrect}
              className="w-full py-3.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-green-500/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              ✅ 标记为答对（连对次数 +1）
            </button>
          ) : (
            <button
              onClick={() => {
                setShowAnswer(false);
                setUserAnswer('');
              }}
              className="w-full py-3.5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              再试一次
            </button>
          )}
        </div>
      )}
    </div>
  );
}

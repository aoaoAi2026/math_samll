import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, XCircle, Trash2, Filter, RefreshCw, BookOpen, CheckCircle2, Award } from 'lucide-react';
import { useGameStore, CONSECUTIVE_THRESHOLD } from '@/store/gameStore';
import type { WrongQuestionRecord } from '@/data/questions/types';

export default function WrongQuestions() {
  const { userProgress, removeWrongQuestion, clearWrongQuestions, markWrongQuestionWrong } = useGameStore();
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'practice' | 'exam'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full">
        <nav className="w-full px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-white hover:text-yellow-400 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xl font-bold">返回首页</span>
          </Link>
          <div className="flex items-center gap-2 text-white">
            <BookOpen className="w-5 h-5 text-yellow-400" />
            <span className="text-lg">错题库</span>
          </div>
        </nav>

        <div className="w-full px-4 py-12 flex flex-col items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-3">错题库是空的</h2>
            <p className="text-white/60 mb-6">恭喜！你目前没有错题记录，继续保持！</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              继续学习
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full">
      <nav className="w-full px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-white hover:text-yellow-400 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xl font-bold">返回首页</span>
        </Link>
        <div className="flex items-center gap-2 text-white">
          <BookOpen className="w-5 h-5 text-yellow-400" />
          <span className="text-lg">错题库</span>
        </div>
      </nav>

      <div className="w-full px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-yellow-400">{stats.total}</div>
            <div className="text-white/60 text-sm mt-1">总错题数</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-red-400">{stats.needMore}</div>
            <div className="text-white/60 text-sm mt-1">待巩固</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-green-400">{stats.mastered}</div>
            <div className="text-white/60 text-sm mt-1">已掌握</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.avgConsecutive}</div>
            <div className="text-white/60 text-sm mt-1">平均连对</div>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-yellow-300">
            <Award className="w-5 h-5" />
            <span className="font-semibold">错题出库规则</span>
          </div>
          <p className="text-white/80 text-sm mt-2">
            每道错题需要<span className="text-yellow-300 font-semibold"> 连续答对 {CONSECUTIVE_THRESHOLD} 次 </span>才能从错题库中剔除。
            任何一次答错都会重置连续答对次数。
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 mb-6">
          <div className="flex items-center gap-2 mb-3 text-white">
            <Filter className="w-4 h-4" />
            <span className="font-semibold">筛选条件</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">年级</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="all">全部年级</option>
                <option value={1}>1年级</option>
                <option value={2}>2年级</option>
                <option value={3}>3年级</option>
                <option value={4}>4年级</option>
                <option value={5}>5年级</option>
                <option value={6}>6年级</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-2">来源</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value as 'all' | 'practice' | 'exam')}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="all">全部来源</option>
                <option value="practice">练习</option>
                <option value="exam">考试</option>
              </select>
            </div>
          </div>
          {wrongList.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  if (confirm('确定要清空所有错题吗？此操作不可恢复！')) {
                    clearWrongQuestions();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
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
              alert('已标记为答错，连续答对次数已重置');
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
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                <p className="text-white/60">没有符合条件的错题</p>
              </div>
            ) : (
              filteredList.map((w) => {
                const progress = (w.consecutiveCorrect / CONSECUTIVE_THRESHOLD) * 100;
                const willBeCleared = w.consecutiveCorrect >= CONSECUTIVE_THRESHOLD;
                return (
                  <div
                    key={w.questionId}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-yellow-400/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs">
                            {w.grade}年级
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            w.source === 'exam'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {w.source === 'exam' ? '考试' : '练习'}
                          </span>
                          {w.topicName && (
                            <span className="bg-white/10 text-white/60 px-2 py-0.5 rounded-full text-xs">
                              {w.topicName}
                            </span>
                          )}
                          <span className="ml-auto text-white/40 text-xs">
                            练习 {w.totalAttempts} 次
                          </span>
                        </div>
                        <p className="text-white text-sm line-clamp-2 mb-3">{w.question}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                willBeCleared
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                  : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className={`text-xs whitespace-nowrap ${
                            willBeCleared ? 'text-green-400' : 'text-yellow-300'
                          }`}>
                            连对 {w.consecutiveCorrect}/{CONSECUTIVE_THRESHOLD}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedId(w.questionId)}
                          className="px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors"
                        >
                          练习
                        </button>
                      </div>
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
    alert(`太棒了！连续答对次数 +1（${record.consecutiveCorrect + 1}/${CONSECUTIVE_THRESHOLD}）${
      record.consecutiveCorrect + 1 >= CONSECUTIVE_THRESHOLD ? '\n🎉 恭喜！此错题已从错题库中移除！' : ''
    }`);
    onClose();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">
            连对 {record.consecutiveCorrect}/{CONSECUTIVE_THRESHOLD}
          </span>
          <button
            onClick={onMarkWrong}
            className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
          >
            标记为错
          </button>
          <button
            onClick={onRemove}
            className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded hover:bg-white/20"
          >
            移除
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs">{record.grade}年级</span>
          <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs">
            {record.type === 'choice' ? '选择题' : record.type === 'blank' ? '填空题' : '问答题'}
          </span>
        </div>
        <p className="text-white text-lg leading-relaxed mb-4">{record.question}</p>

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
                  className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                    isAnswer
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : isSelected
                        ? showAnswer
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-yellow-500/20 border-yellow-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-white/80 hover:border-white/30'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isAnswer ? 'bg-green-500 text-white' :
                    isSelected ? 'bg-yellow-500 text-white' :
                    'bg-white/10 text-white/80'
                  }`}>
                    {letter}
                  </span>
                  <span>{opt}</span>
                  {isAnswer && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />}
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
            placeholder="请输入答案..."
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
            onKeyPress={(e) => e.key === 'Enter' && !showAnswer && handleSubmit()}
          />
        )}
      </div>

      {!showAnswer ? (
        <button
          onClick={handleSubmit}
          disabled={!userAnswer.trim() && !isChoice}
          className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          提交答案
        </button>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '答对了！' : '答错了'}
              </span>
            </div>
            {!isCorrect && (
              <p className="text-white/80 text-sm">
                正确答案：<span className="font-semibold">{record.answer}</span>
              </p>
            )}
            {record.explanation && (
              <div className="mt-3 p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <div className="text-purple-300 text-xs font-semibold mb-1">解析</div>
                <p className="text-white/80 text-sm">{record.explanation}</p>
              </div>
            )}
          </div>

          {isCorrect ? (
            <button
              onClick={handleMarkCorrect}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
              标记为答对（连对次数 +1）
            </button>
          ) : (
            <button
              onClick={() => {
                setShowAnswer(false);
                setUserAnswer('');
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
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

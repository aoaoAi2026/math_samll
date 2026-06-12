import { Link, useParams } from 'react-router-dom';
import { Star, BookOpen, Target, Trophy, Play, Sparkles } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { difficultyLabels, getTopicById } from '@/data/knowledge';
import { generateMockQuestions } from '@/utils/generateMockQuestions';
import { useState, useEffect } from 'react';
import type { Question } from '@/data/questions/types';

const DIFFICULTY_EMOJIS = ['🌱', '🌿', '🔥', '💎'];

export default function TopicPractice() {
  const { grade: gradeParam, topicId: topicIdParam } = useParams<{ grade: string; topicId: string }>();
  const grade = gradeParam ? parseInt(gradeParam) : 1;
  const topicId = topicIdParam ? parseInt(topicIdParam) : 1;
  const { userProgress } = useGameStore();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const topic = getTopicById(grade, topicId);

  useEffect(() => {
    sessionStorage.setItem('lastGrade', String(grade));
    sessionStorage.setItem('lastTopicId', String(topicId));
    
    fetch(`http://localhost:3001/api/questions?grade=${grade}&topicId=${topicId}&limit=50`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.questions && data.questions.length > 0) {
          const processed = data.questions.map((q: any) => ({
            ...q,
            chapter: q.chapter || topicId
          }));
          setQuestions(processed);
          sessionStorage.setItem(`questions_${grade}_${topicId}`, JSON.stringify(processed));
        } else {
          const mockData = generateMockQuestions(grade, topicId);
          setQuestions(mockData);
          sessionStorage.setItem(`questions_${grade}_${topicId}`, JSON.stringify(mockData));
        }
        setLoading(false);
      })
      .catch(() => {
        const mockData = generateMockQuestions(grade, topicId);
        setQuestions(mockData);
        sessionStorage.setItem(`questions_${grade}_${topicId}`, JSON.stringify(mockData));
        setLoading(false);
      });
  }, [grade, topicId]);

  const topicProgress = userProgress.progress[grade]?.topics?.[topicId] || { completed: 0, stars: 0 };
  const completedCount = Object.entries(userProgress.progress[grade]?.questions || {})
    .filter(([id]) => id.startsWith(`g${grade}t${topicId}`))
    .filter(([, data]) => (data as { passed: boolean }).passed).length;

  const getSolvingTip = () => {
    const name = topic?.name || '';
    if (name.includes('和差')) return '大数=(和+差)÷2，小数=(和-差)÷2';
    if (name.includes('和倍')) return '1倍数=和÷(倍数+1)，多倍数=1倍数×倍数';
    if (name.includes('差倍')) return '1倍数=差÷(倍数-1)';
    if (name.includes('鸡兔同笼')) return '假设法：先假设全是鸡或兔';
    if (name.includes('植树')) return '分清三种情况：两端种、一端种、两端不种';
    if (name.includes('相遇')) return '路程和=速度和×相遇时间';
    if (name.includes('追及')) return '路程差=速度差×追及时间';
    if (name.includes('等差数列')) return '和=(首项+末项)×项数÷2';
    if (name.includes('工程')) return '工作效率×工作时间=工作总量';
    if (name.includes('浓度')) return '溶质÷溶液=浓度';
    return '认真分析题意，找准解题方法 💡';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <Link to={`/grade/${grade}`} className="text-white/80 hover:text-yellow-400 transition-colors font-bold">
          ← 返回{grade}年级
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/exam" className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/20">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-bold">模拟考试</span>
          </Link>
          <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
        {/* 题型头部 */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${
            topic?.difficulty === 1 ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30' :
            topic?.difficulty === 2 ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-blue-500/30' :
            topic?.difficulty === 3 ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/30' :
            'bg-gradient-to-br from-red-400 to-pink-500 shadow-red-500/30'
          }`}>
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              {topic?.name || '题型练习'}
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </h1>
            <p className="text-white/50 text-sm">
              {grade}年级 · {DIFFICULTY_EMOJIS[(topic?.difficulty || 1) - 1]} {difficultyLabels[topic?.difficulty || 1]}
            </p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-extrabold text-white">{questions.length || '...'}</div>
            <div className="text-white/40 text-xs mt-1">📝 题目数量</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-extrabold text-green-400">{completedCount}</div>
            <div className="text-white/40 text-xs mt-1">✅ 已完成</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center">
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= (topicProgress.stars || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                />
              ))}
            </div>
            <div className="text-white/40 text-xs mt-1">⭐ 获得星星</div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-xl animate-bounce">🔍 加载题目中...</div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border-2 border-white/20 text-center">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-white text-xl font-bold mb-2">该题型暂无题目</div>
            <div className="text-white/50 mb-6">题目库正在更新中，敬请期待～</div>
            <Link
              to={`/grade/${grade}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-colors font-bold border border-white/20"
            >
              返回年级页面
            </Link>
          </div>
        ) : (
          <>
            {/* 题目网格 */}
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2 mb-6">
              {questions.map((q, index) => {
                const isCompleted = userProgress.progress[grade]?.questions?.[q.id]?.passed;
                return (
                  <Link
                    key={q.id}
                    onClick={() => {
                      sessionStorage.setItem('currentQuestion', JSON.stringify(q));
                    }}
                    to={`/practice/${q.id}`}
                    className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                      isCompleted 
                        ? 'bg-green-500/15 border-green-400/40 hover:shadow-green-500/20' 
                        : 'bg-white/10 border-white/20 hover:border-white/40 hover:shadow-purple-500/20'
                    }`}
                  >
                    <span className={`text-lg font-extrabold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                      {isCompleted ? '✓' : index + 1}
                    </span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2].map((s) => (
                        <div
                          key={s}
                          className={`w-1 h-1 rounded-full ${s <= q.difficulty ? 'bg-yellow-400' : 'bg-white/20'}`}
                        />
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* 开始按钮 */}
            <div className="flex justify-center mb-8">
              <Link
                to={`/practice/${questions[0]?.id || ''}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5" />
                🚀 开始练习
              </Link>
            </div>
          </>
        )}

        {/* 知识点详解 */}
        {topic && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              💡 知识点详解
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-white/40 text-xs mb-1">题型名称</div>
                <div className="text-white font-bold">{topic.name}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-white/40 text-xs mb-1">难度等级</div>
                <div className={`font-bold ${
                  topic.difficulty === 1 ? 'text-green-400' :
                  topic.difficulty === 2 ? 'text-blue-400' :
                  topic.difficulty === 3 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {DIFFICULTY_EMOJIS[topic.difficulty - 1]} {difficultyLabels[topic.difficulty]}
                </div>
              </div>
              <div className="sm:col-span-2 p-3 bg-white/5 rounded-xl">
                <div className="text-white/40 text-xs mb-1">题型描述</div>
                <div className="text-white text-sm">{topic.description}</div>
              </div>
              <div className="sm:col-span-2 p-3 bg-white/5 rounded-xl">
                <div className="text-white/40 text-xs mb-1">解题技巧</div>
                <div className="text-white text-sm font-bold">{getSolvingTip()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

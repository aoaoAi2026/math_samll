import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Award, ChevronLeft, Calendar, Zap, BookOpen, AlertCircle, Target } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { safeGet } from '@/utils/storage';

export default function Report() {
  const { userProgress } = useGameStore();
  const [weekOffset, setWeekOffset] = useState(0);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() - weekOffset * 7);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  const weekLabel = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

  // 本周统计数据（从localStorage读取）
  const stats = useMemo(() => {
    const all = safeGet<Record<string, { answered: number; correct: number; stars: number; timeMinutes: number }>>('math-weekly-stats', {});
    const key = startOfWeek.toDateString();
    const weekData = all[key] || { answered: 0, correct: 0, stars: 0, timeMinutes: 0 };

    // 累计数据
    let totalAnswered = 0, totalCorrect = 0;
    Object.values(all).forEach((d: any) => { totalAnswered += d.answered || 0; totalCorrect += d.correct || 0; });

    return { weekData, totalAnswered, totalCorrect };
  }, [weekOffset]);

  // 模拟近期正确率趋势（从localStorage daily数据）
  const accuracyTrend = useMemo(() => {
    const days: { label: string; rate: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const key = d.toDateString();
      const all = safeGet<Record<string, { answered: number; correct: number }>>('math-daily-stats', {});
      const day = all[key] || { answered: 0, correct: 0 };
      days.push({
        label: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        rate: day.answered > 0 ? Math.round((day.correct / day.answered) * 100) : 0,
      });
    }
    return days;
  }, [weekOffset]);

  // 薄弱知识点分析
  const weakTopics = useMemo(() => {
    const topics: { name: string; wrong: number; total: number }[] = [];
    Object.entries(userProgress.progress).forEach(([grade, gp]) => {
      Object.entries(gp.topics || {}).forEach(([tid, tp]: [string, any]) => {
        if (tp.completed > 0 && tp.stars < tp.completed * 2) {
          try {
            const t = require('@/data/knowledge').getTopicById(parseInt(grade), parseInt(tid));
            topics.push({ name: t?.name || `知识点${tid}`, wrong: tp.completed - Math.floor(tp.stars / 2), total: tp.completed });
          } catch { topics.push({ name: `知识点${tid}`, wrong: tp.completed - Math.floor(tp.stars / 2), total: tp.completed }); }
        }
      });
    });
    return topics.sort((a, b) => b.wrong - a.wrong).slice(0, 5);
  }, [userProgress]);

  // 成就统计
  const totalExamCount = userProgress.examHistory?.length || 0;
  const totalWrong = userProgress.wrongQuestions?.length || 0;
  const maxRate = accuracyTrend.reduce((m, d) => Math.max(m, d.rate), 0);
  const avgRate = accuracyTrend.reduce((s, d) => s + d.rate, 0) / (accuracyTrend.filter(d => d.rate > 0).length || 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>
      <nav className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <Link to="/" className="text-white/80 hover:text-yellow-400 flex items-center gap-2 font-bold"><ChevronLeft className="w-5 h-5" />返回首页</Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-full"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span></div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl flex items-center justify-center shadow-xl"><TrendingUp className="w-8 h-8 text-white" /></div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-white">学习报告</h1>
            <p className="text-white/50 text-sm">了解你的学习情况</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setWeekOffset(o => o + 1)} className="p-2 bg-white/10 rounded-xl text-white/60 hover:text-white">←</button>
            <button onClick={() => setWeekOffset(o => Math.min(o - 1, 0))} className="p-2 bg-white/10 rounded-xl text-white/60 hover:text-white" disabled={weekOffset === 0}>→</button>
          </div>
        </div>

        <div className="text-white/40 text-sm mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" />{weekLabel}</div>

        {/* 核心数据卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: '📝', label: '本周做题', value: stats.weekData.answered, unit: '题', color: 'from-blue-400 to-cyan-500' },
            { icon: '✅', label: '本周正确率', value: `${stats.weekData.answered > 0 ? Math.round(stats.weekData.correct / stats.weekData.answered * 100) : 0}%`, unit: '', color: 'from-green-400 to-emerald-500' },
            { icon: '⭐', label: '本周获得星星', value: stats.weekData.stars, unit: '颗', color: 'from-yellow-400 to-orange-500' },
            { icon: '⏱️', label: '学习时长', value: stats.weekData.timeMinutes || 0, unit: '分钟', color: 'from-purple-400 to-pink-500' },
          ].map((c, i) => (
            <div key={i} className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 text-center`}>
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className={`text-2xl font-extrabold bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>{c.value}</div>
              <div className="text-white/40 text-xs">{c.label}</div>
            </div>
          ))}
        </div>

        {/* 正确率趋势图 */}
        <div className="bg-white/10 rounded-3xl border border-white/20 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-blue-400" /><span className="text-white font-bold">本周正确率趋势</span></div>
          <div className="flex items-end gap-2 h-32">
            {accuracyTrend.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-white/60 text-xs font-bold">{d.rate}%</span>
                <div className="w-full bg-gradient-to-t from-blue-400 to-cyan-400 rounded-t-lg transition-all" style={{ height: `${Math.max(d.rate * 0.8, 4)}%` }} />
                <span className="text-white/30 text-xs">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-white/40 text-xs">
            <span>最高: {maxRate}%</span><span>平均: {Math.round(avgRate)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 薄弱知识点 */}
          <div className="bg-white/10 rounded-3xl border border-white/20 p-5">
            <div className="flex items-center gap-2 mb-4"><AlertCircle className="w-5 h-5 text-orange-400" /><span className="text-white font-bold">薄弱知识点</span></div>
            {weakTopics.length > 0 ? (
              <div className="space-y-2">
                {weakTopics.map((t, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{i + 1}.</span>
                      <span className="text-white/70 text-sm">{t.name}</span>
                    </div>
                    <span className="text-xs text-red-400">{t.wrong}/{t.total} 错误</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/40 text-sm text-center py-4">暂无薄弱知识点，继续加油！</p>
            )}
          </div>

          {/* 学习成就 */}
          <div className="bg-white/10 rounded-3xl border border-white/20 p-5">
            <div className="flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-yellow-400" /><span className="text-white font-bold">学习成就</span></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                <span className="text-white/70 text-sm">📊 累计做题</span>
                <span className="text-yellow-400 font-bold">{stats.totalAnswered}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                <span className="text-white/70 text-sm">📈 累计正确</span>
                <span className="text-green-400 font-bold">{stats.totalCorrect}</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                <span className="text-white/70 text-sm">📝 模拟考试</span>
                <span className="text-blue-400 font-bold">{totalExamCount} 次</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                <span className="text-white/70 text-sm">📕 错题本存量</span>
                <span className="text-orange-400 font-bold">{totalWrong} 题</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                <span className="text-white/70 text-sm">🏅 当前段位</span>
                <span className="text-purple-400 font-bold">{userProgress.rank}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-white/20 text-xs">数据存储于本地浏览器，不会上传到服务器</p>
        </div>
      </div>
    </div>
  );
}

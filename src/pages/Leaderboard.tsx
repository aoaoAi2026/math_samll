import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, ChevronLeft, Flame, Target, BookOpen, Zap } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

const RANKS = ['🌰 种子', '🐣 萌新', '🌱 新星', '⭐ 达人', '📚 学霸', '🎖️ 大师', '🧠 天才', '🏆 宗师', '👑 传奇', '🌟 大神'];

const FAKE_PLAYERS = [
  { name: '小明', stars: 520, streak: 12, accuracy: 92 },
  { name: '小红', stars: 380, streak: 8, accuracy: 88 },
  { name: '数学小王子', stars: 280, streak: 5, accuracy: 85 },
  { name: '奥数达人', stars: 190, streak: 15, accuracy: 95 },
  { name: '速算小能手', stars: 150, streak: 3, accuracy: 78 },
];

export default function Leaderboard() {
  const { userProgress } = useGameStore();
  const [tab, setTab] = useState<'stars' | 'streak' | 'accuracy'>('stars');

  const getRank = (stars: number) => {
    const thresholds = [0, 15, 35, 70, 120, 200, 350, 500, 700, 1000];
    let r = 0;
    for (let i = thresholds.length - 1; i >= 0; i--) { if (stars >= thresholds[i]) { r = i; break; } }
    return RANKS[r];
  };

  const isMe = (name: string) => name === '我';

  // 读取连续打卡天数
  const streakDays = useMemo(() => {
    const stored = localStorage.getItem('math-checkin-dates');
    const dates: string[] = stored ? JSON.parse(stored) : [];
    let count = 0; const d = new Date();
    for (let i = 0; i < 30; i++) {
      const cd = new Date(d.getTime() - i * 86400000).toDateString();
      if (dates.includes(cd)) count++; else break;
    }
    return count;
  }, []);

  const myEntry = {
    name: '我',
    stars: userProgress.totalStars,
    streak: streakDays,
    accuracy: 80 + Math.floor(Math.random() * 15), // 模拟
  };

  const allPlayers = useMemo(() => {
    const list = [...FAKE_PLAYERS, myEntry];
    if (tab === 'stars') list.sort((a, b) => b.stars - a.stars);
    else if (tab === 'streak') list.sort((a, b) => b.streak - a.streak);
    else list.sort((a, b) => b.accuracy - a.accuracy);
    return list;
  }, [tab, userProgress.totalStars]);

  const myRank = allPlayers.findIndex(p => p.name === '我') + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>
      <nav className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <Link to="/" className="text-white/80 hover:text-yellow-400 flex items-center gap-2 font-bold"><ChevronLeft className="w-5 h-5" />返回首页</Link>
        <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl"><Trophy className="w-8 h-8 text-white" /></div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">排行榜</h1>
            <p className="text-white/50 text-sm">本地模拟排行 · 你的排名: <span className="text-yellow-400 font-bold">第{myRank}名</span></p>
          </div>
        </div>

        {/* 排序Tab */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'stars' as const, label: '💎 星星榜', icon: Star },
            { id: 'streak' as const, label: '🔥 坚持榜', icon: Flame },
            { id: 'accuracy' as const, label: '✅ 正确率榜', icon: Target },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${tab === t.id ? 'bg-white/20 border-yellow-400/50 text-yellow-400' : 'bg-white/5 border-white/10 text-white/60'}`}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {/* 排行榜列表 */}
        <div className="bg-white/10 rounded-3xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-white/5 border-b border-white/10 text-white/40 text-xs font-bold">
            <span className="col-span-1 text-center">#</span>
            <span className="col-span-4">玩家</span>
            <span className="col-span-3 text-center">段位</span>
            <span className="col-span-2 text-center">{tab === 'stars' ? '星星' : tab === 'streak' ? '连签' : '正确率'}</span>
            <span className="col-span-2 text-center">🏅</span>
          </div>
          <div className="divide-y divide-white/5">
            {allPlayers.map((p, i) => {
              const me = isMe(p.name);
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={i} className={`grid grid-cols-12 gap-2 px-4 py-3 items-center transition-all ${me ? 'bg-yellow-500/10' : 'hover:bg-white/5'}`}>
                  <span className="col-span-1 text-center text-lg">{i < 3 ? medals[i] : <span className="text-white/30 text-sm">{i + 1}</span>}</span>
                  <span className={`col-span-4 font-bold text-sm flex items-center gap-1 ${me ? 'text-yellow-400' : 'text-white'}`}>{p.name}{me && ' ⭐'}</span>
                  <span className="col-span-3 text-center text-white/50 text-xs">{getRank(p.stars)}</span>
                  <span className={`col-span-2 text-center font-bold text-sm ${me ? 'text-yellow-400' : 'text-white/80'}`}>
                    {tab === 'stars' ? p.stars : tab === 'streak' ? `${p.streak}天` : `${p.accuracy}%`}
                  </span>
                  <span className="col-span-2 text-center">{p.stars >= 1000 ? '🐉' : p.stars >= 500 ? '🦅' : p.stars >= 200 ? '🦉' : p.stars >= 70 ? '🐥' : '🐣'}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 mt-4 text-center">
          <p className="text-white/30 text-xs">排行榜数据为本地模拟，仅供激励参考</p>
          <p className="text-white/30 text-xs mt-1">你的真实排名只有在连接服务器后才会显示</p>
        </div>

        {/* 段位进度 */}
        <div className="bg-white/10 rounded-3xl border border-white/20 p-5 mt-6">
          <div className="flex items-center gap-2 mb-3"><Trophy className="w-5 h-5 text-yellow-400" /><span className="text-white font-bold">你的段位进度</span></div>
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>{RANKS[0]}</span><span>{RANKS[RANKS.length - 1]}</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all" style={{ width: `${Math.min(userProgress.totalStars / 1000 * 100, 100)}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span></div>
            <span className="text-white/30 text-xs">目标: 1000 (🌟奥数之神)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

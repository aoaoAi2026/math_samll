import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, BookOpen, Target, Zap, Gamepad2, BookMarked, AlertCircle, Sparkles, Flame, CalendarCheck, Medal, Compass, Volume2, VolumeX, BarChart3, Settings, Users, Lightbulb, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { sound, isMuted, toggleMute } from '@/utils/sound';

const GRADES = [1, 2, 3, 4, 5, 6];
const GRADE_EMOJIS = ['🌱', '🌿', '🌳', '🍎', '🏆', '👑'];

// ======= 宠物养成系统 =======
interface PetStage { emoji: string; name: string; minStars: number; color: string; }
const PET_STAGES: PetStage[] = [
  { emoji: '🥚', name: '奥数蛋', minStars: 0, color: 'from-gray-300 to-gray-400' },
  { emoji: '🐣', name: '小鸡崽', minStars: 15, color: 'from-yellow-200 to-yellow-400' },
  { emoji: '🐥', name: '小黄鸡', minStars: 35, color: 'from-yellow-300 to-amber-400' },
  { emoji: '🦉', name: '猫头鹰', minStars: 70, color: 'from-amber-400 to-orange-500' },
  { emoji: '🐲', name: '小龙', minStars: 200, color: 'from-purple-400 to-pink-500' },
  { emoji: '🐉', name: '神龙', minStars: 500, color: 'from-yellow-300 via-orange-400 to-red-500' },
];

// ======= 每日挑战任务 =======
interface DailyMission { id: string; icon: string; title: string; target: number; unit: string; }
const DAILY_MISSIONS: DailyMission[] = [
  { id: 'answer', icon: '✅', title: '答对题目', target: 10, unit: '题' },
  { id: 'streak', icon: '🔥', title: '连续答对', target: 5, unit: '题' },
  { id: 'wrong', icon: '📝', title: '消灭错题', target: 3, unit: '题' },
];

const ENCOURAGE_MSGS = [
  '太厉害了！', '你是最棒的！', '继续加油！', '数学小天才！',
  '冲冲冲！', '又进步了！', '没人能挡你！', '学霸就是你！',
];

export default function Home() {
  const { userProgress, dailyMissions } = useGameStore();
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [streak, setStreak] = useState(0);
  const [missionProgress, setMissionProgress] = useState<Record<string, number>>(dailyMissions);
  const [encourageMsg, setEncourageMsg] = useState('');
  const [muted, setMuted] = useState(() => isMuted());

  // 每日打卡计算
  useEffect(() => {
    const stored = localStorage.getItem('math-checkin-dates');
    const dates: string[] = stored ? JSON.parse(stored) : [];
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(d.getTime() - i * 86400000).toDateString();
      if (dates.includes(checkDate)) count++;
      else break;
    }
    setStreak(count);
  }, []);

  // 同步每日任务进度
  useEffect(() => {
    setMissionProgress(dailyMissions);
  }, [dailyMissions]);

  const handleCheckIn = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('math-checkin-dates');
    const dates: string[] = stored ? JSON.parse(stored) : [];
    if (!dates.includes(today)) {
      dates.push(today);
      localStorage.setItem('math-checkin-dates', JSON.stringify(dates));
      const newStreak = streak + 1;
      setStreak(newStreak);
      setShowCelebrate(true);
      setEncourageMsg(ENCOURAGE_MSGS[Math.floor(Math.random() * ENCOURAGE_MSGS.length)]);
      sound.checkIn();
      setTimeout(() => {
        setShowCelebrate(false);
        setEncourageMsg('');
      }, 2500);
    }
  };

  const today = new Date().toDateString();
  const stored = localStorage.getItem('math-checkin-dates');
  const dates: string[] = stored ? JSON.parse(stored) : [];
  const checkedInToday = dates.includes(today);

  // 宠物进化阶段
  const pet = useMemo(() => {
    const stars = userProgress.totalStars;
    let stage = PET_STAGES[0];
    for (const s of PET_STAGES) {
      if (stars >= s.minStars) stage = s;
    }
    const nextStage = PET_STAGES.find(s => s.minStars > stars);
    const progress = nextStage ? Math.round(((stars - stage.minStars) / (nextStage.minStars - stage.minStars)) * 100) : 100;
    return { ...stage, nextStage, progress: Math.min(progress, 100) };
  }, [userProgress.totalStars]);

  // ===== 功能入口（大卡片，每个都有明显的大表情和标题）=====
  const features = [
    { emoji: '📖', title: '学习中心', description: '先学知识点，再做练习题', color: 'from-green-500/25 to-emerald-500/25', link: '/learn' },
    { emoji: '⚡', title: '口算挑战', description: '限时答题，测反应速度', color: 'from-yellow-500/25 to-orange-500/25', link: '/speed-calc' },
    { emoji: '🗺️', title: '数学大冒险', description: '探险式闯关，好玩停不下', color: 'from-amber-500/25 to-orange-500/25', link: '/adventure' },
    { emoji: '🎮', title: '闯关学习', description: '像玩游戏一样学奥数', color: 'from-purple-500/25 to-pink-500/25', link: '/grade' },
    { emoji: '🚀', title: '快速练习', description: '随机刷题，越来越厉害', color: 'from-orange-500/25 to-red-500/25', link: '/practice' },
    { emoji: '🏆', title: '历年真题', description: '挑战经典好题目', color: 'from-yellow-500/25 to-amber-500/25', link: '/exam-questions' },
    { emoji: '🎯', title: '模拟考试', description: '智能组卷，检验成果', color: 'from-green-500/25 to-teal-500/25', link: '/exam' },
    { emoji: '📝', title: '错题库', description: '连对3次自动出库', color: 'from-red-500/25 to-pink-500/25', link: '/wrong-questions' },
    { emoji: '📊', title: '学习报告', description: '看看你的进步曲线', color: 'from-blue-500/25 to-cyan-500/25', link: '/report' },
    { emoji: '🏅', title: '排行榜', description: '跟小伙伴比一比', color: 'from-indigo-500/25 to-purple-500/25', link: '/leaderboard' },
  ];

  const badges = [
    { icon: '🌟', name: '新手起航', req: 0 },
    { icon: '⭐', name: '进步之星', req: 20 },
    { icon: '🎖️', name: '优秀学员', req: 50 },
    { icon: '🏅', name: '超级学霸', req: 150 },
    { icon: '🧠', name: '数学天才', req: 300 },
    { icon: '👑', name: '奥数大师', req: 500 },
    { icon: '🔥', name: '持之以恒', req: -1 },
    { icon: '💪', name: '百题斩', req: -1 },
  ];

  const totalPassed = Object.values(userProgress.progress).reduce((sum, g) =>
    sum + Object.values(g.questions || {}).filter(q => q.passed).length, 0);
  const wrongCount = (userProgress.wrongQuestions || []).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-x-hidden">
      {/* 简化的背景装饰 - 3个大光球 + 少量星星 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-40 -left-32 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
        <div className="absolute top-20 left-1/4 text-3xl opacity-50">✨</div>
        <div className="absolute top-1/3 right-20 text-2xl opacity-40">⭐</div>
        <div className="absolute bottom-40 left-20 text-3xl opacity-40">💫</div>
        <div className="absolute bottom-20 right-1/4 text-2xl opacity-30">🌟</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-6">
        {/* ===== 顶部：标题 + 星星 + 声音 ===== */}
        <nav className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 bg-gradient-to-br ${pet.color} rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20`}>
              <span className="text-3xl">{pet.emoji}</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 leading-tight">
                奥数闯关王
              </h1>
              <div className="text-xs text-white/50 font-bold mt-0.5">{pet.name} · {userProgress.rank}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMuted(toggleMute()); }}
              className="w-11 h-11 bg-white/10 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center"
              title={muted ? '开启音效' : '关闭音效'}
            >
              {muted ? <VolumeX className="w-6 h-6 text-white/50" /> : <Volume2 className="w-6 h-6 text-yellow-400" />}
            </button>
            <div className="flex items-center gap-2 bg-yellow-400/20 px-4 py-2.5 rounded-2xl border border-yellow-400/30">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-extrabold text-lg">{userProgress.totalStars}</span>
            </div>
          </div>
        </nav>

        {/* ===== 欢迎区：大宠物 + 欢迎语 ===== */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 p-6 mb-6 relative overflow-hidden">
          {showCelebrate && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-400/40 to-orange-500/40 z-20 animate-pulse">
              <div className="text-center">
                <div className="text-8xl mb-3">{pet.emoji}</div>
                <div className="text-4xl font-extrabold text-white drop-shadow-lg">{encourageMsg}</div>
                <div className="flex justify-center gap-3 mt-4 text-4xl">⭐ 🌟 💫 ✨ 🎉</div>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${pet.color} flex items-center justify-center shadow-2xl shadow-orange-500/30 flex-shrink-0`}>
              <span className="text-7xl animate-bounce" style={{ animationDuration: '3s' }}>{pet.emoji}</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-xl font-bold text-white mb-1">
                👋 Hi，{userProgress.userName}！
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 mb-2 leading-tight">
                今天也要加油哦！
              </h2>
              <p className="text-white/60 text-base mb-3">你已经收集了 <span className="text-yellow-400 font-bold text-xl">{userProgress.totalStars}</span> 颗星星啦！</p>
              {pet.nextStage ? (
                <div>
                  <div className="text-sm text-white/50 mb-1">距离 <span className="text-yellow-300 font-bold">{pet.nextStage.emoji}{pet.nextStage.name}</span> 还差 {pet.nextStage.minStars - userProgress.totalStars} 颗 ⭐</div>
                  <div className="bg-white/10 rounded-full h-3 overflow-hidden max-w-sm">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700" style={{ width: `${pet.progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <div className="text-yellow-300 font-bold text-lg">🎊 已达最高段位！你是传奇！</div>
              )}
            </div>
          </div>
        </div>

        {/* ===== 每日打卡卡片（独立突出）===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button onClick={handleCheckIn} disabled={checkedInToday}
            className={`text-left rounded-3xl p-5 border-2 transition-all duration-300 ${
              checkedInToday
                ? 'bg-green-500/10 border-green-400/30'
                : 'bg-gradient-to-br from-yellow-500/25 to-orange-500/25 border-yellow-400/40 hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-orange-500/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{checkedInToday ? '✅' : '📅'}</div>
              <div className="flex-1">
                <div className="text-xl font-bold text-white mb-1">
                  {checkedInToday ? '今日已打卡' : '点击打卡'}
                </div>
                <div className="text-white/60 text-sm">
                  连续打卡 <span className="text-yellow-400 font-bold text-lg">{streak}</span> 天
                </div>
              </div>
            </div>
          </button>

          <Link to="/grade" onClick={() => sound.navigate()}
            className="text-left rounded-3xl p-5 border-2 bg-gradient-to-br from-purple-500/25 to-pink-500/25 border-purple-400/40 hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎮</div>
              <div className="flex-1">
                <div className="text-xl font-bold text-white mb-1">开始闯关</div>
                <div className="text-white/60 text-sm">
                  已答对 <span className="text-yellow-400 font-bold text-lg">{totalPassed}</span> 道题
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ===== 主要功能区（大卡片网格）===== */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🚀</span>
            <h3 className="text-xl font-extrabold text-white">开始学习</h3>
            <span className="text-white/30 text-sm ml-auto">选一个开始吧 →</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.slice(0, 6).map((f, i) => (
              <Link key={i} to={f.link} onClick={() => sound.navigate()}
                className={`group relative p-6 rounded-3xl bg-gradient-to-br ${f.color} backdrop-blur-lg border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl active:scale-95`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{f.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-extrabold text-white mb-1">{f.title}</h4>
                    <p className="text-white/60 text-sm">{f.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== 选择年级（大按钮）===== */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📚</span>
            <h3 className="text-xl font-extrabold text-white">选择年级</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {GRADES.map(grade => {
              const chapters = userProgress.progress[grade]?.chapters || {};
              const completed = Object.values(chapters).filter(c => c.passed).length;
              const isCurrent = grade === userProgress.currentGrade;
              return (
                <Link key={grade} to={`/grade/${grade}`} onClick={() => sound.navigate()}
                  className={`p-5 rounded-3xl border-2 transition-all duration-300 hover:scale-[1.03] active:scale-95 flex flex-col items-center gap-1 text-center ${
                    isCurrent
                      ? 'bg-white/15 border-yellow-400/50 shadow-lg shadow-yellow-500/10'
                      : 'bg-white/10 border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="text-4xl mb-1">{GRADE_EMOJIS[grade - 1]}</div>
                  <div className="text-white font-extrabold text-base">{grade}年级</div>
                  <div className="text-white/40 text-xs">{completed}/15章</div>
                  {isCurrent && <div className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-bold mt-1">当前</div>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ===== 更多功能 ===== */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎁</span>
            <h3 className="text-xl font-extrabold text-white">更多玩法</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.slice(6).map((f, i) => (
              <Link key={i} to={f.link} onClick={() => sound.navigate()}
                className={`group p-5 rounded-3xl bg-gradient-to-br ${f.color} border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:shadow-xl`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{f.emoji}</div>
                  <div className="flex-1">
                    <div className="text-lg font-extrabold text-white">{f.title}</div>
                    <div className="text-white/50 text-sm">{f.description}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ===== 每日任务（简单卡片）===== */}
        <div className="mb-7 bg-white/10 rounded-3xl border-2 border-white/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-extrabold text-white">每日任务</h3>
            <Sparkles className="w-5 h-5 text-yellow-400 ml-auto" />
          </div>
          <div className="space-y-3">
            {DAILY_MISSIONS.map(m => {
              const done = (missionProgress[m.id] || 0) >= m.target;
              const prog = Math.min((missionProgress[m.id] || 0) / m.target * 100, 100);
              return (
                <div key={m.id} className={`p-4 rounded-2xl transition-all ${done ? 'bg-green-500/15 border border-green-400/30' : 'bg-white/5 border border-white/10'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/90 font-bold flex items-center gap-2 text-base">
                      <span className="text-2xl">{done ? '✅' : m.icon}</span>
                      {m.title}
                    </span>
                    <span className={`text-base font-extrabold ${done ? 'text-green-400' : 'text-white/60'}`}>
                      {missionProgress[m.id] || 0}/{m.target}
                    </span>
                  </div>
                  <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-green-400' : 'bg-gradient-to-r from-blue-400 to-cyan-400'}`}
                      style={{ width: `${prog}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== 成就徽章（简单横向滚动）===== */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🏅</span>
            <h3 className="text-xl font-extrabold text-white">我的徽章</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
            {badges.map((badge, i) => {
              let unlocked = false;
              if (badge.req === -1) {
                if (badge.name === '持之以恒') unlocked = streak >= 7;
                if (badge.name === '百题斩') unlocked = totalPassed >= 100;
              } else unlocked = userProgress.totalStars >= badge.req;
              return (
                <div key={i} className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-5 rounded-3xl min-w-[110px] transition-all ${
                  unlocked
                    ? 'bg-gradient-to-b from-yellow-400/25 to-orange-500/25 border-2 border-yellow-400/40 shadow-lg shadow-yellow-500/10'
                    : 'bg-white/5 border-2 border-white/10 opacity-60'
                }`}>
                  <span className={`text-5xl ${unlocked ? '' : 'grayscale'}`}>{badge.icon}</span>
                  <span className={`text-sm font-extrabold ${unlocked ? 'text-yellow-300' : 'text-white/40'}`}>{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== 打卡日历（简化版）===== */}
        <div className="mb-7 bg-white/10 rounded-3xl border-2 border-white/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-extrabold text-white">打卡日历</h3>
            <div className="ml-auto flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 font-extrabold text-lg">连签 {streak} 天</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {(() => {
              const stored = localStorage.getItem('math-checkin-dates');
              const dts: string[] = stored ? JSON.parse(stored) : [];
              const cells = [];
              for (let i = 13; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const checked = dts.includes(d.toDateString());
                const isToday = i === 0;
                cells.push(
                  <div key={i} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-base transition-all ${
                    checked
                      ? 'bg-green-500/30 border-2 border-green-400/40 text-green-300 font-extrabold'
                      : isToday
                      ? 'bg-white/10 border-2 border-yellow-400/50 text-white font-bold'
                      : 'bg-white/5 border border-white/10 text-white/30'
                  }`}>
                    {checked ? '✓' : d.getDate()}
                  </div>
                );
              }
              for (let i = 14; i < 21; i++) {
                const d = new Date();
                d.setDate(d.getDate() + (i - 13));
                cells.push(
                  <div key={i} className="aspect-square rounded-xl flex flex-col items-center justify-center text-base bg-white/3 border border-white/5 text-white/20">
                    {d.getDate()}
                  </div>
                );
              }
              return cells;
            })()}
          </div>
          <button onClick={handleCheckIn} disabled={checkedInToday}
            className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all active:scale-95 ${
              checkedInToday
                ? 'bg-green-500/15 text-green-400 border border-green-400/30'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.01]'
            }`}
          >
            {checkedInToday ? '✅ 今日已打卡，明天继续！' : '🔥 点击打卡领奖励'}
          </button>
        </div>

        {/* ===== 学习统计 ===== */}
        <div className="mb-7 bg-white/10 rounded-3xl border-2 border-white/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-extrabold text-white">学习成就</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { v: userProgress.totalStars, c: 'text-yellow-400', l: '⭐ 星星', sub: '累计收集' },
              { v: totalPassed, c: 'text-green-400', l: '✅ 答对', sub: '累计题目' },
              { v: userProgress.examHistory.length, c: 'text-blue-400', l: '📝 考试', sub: '参加次数' },
              { v: wrongCount, c: 'text-red-400', l: '📋 错题', sub: '待巩固' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className={`text-4xl font-extrabold mb-1 ${item.c}`}>{item.v}</div>
                <div className="text-white/80 text-sm font-bold">{item.l}</div>
                <div className="text-white/40 text-xs mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 底部辅助 ===== */}
        <div className="flex gap-3 mb-6">
          <Link to="/settings" onClick={() => sound.navigate()}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors text-white/60 hover:text-white/80 text-base font-bold">
            <Settings className="w-5 h-5" />
            家长设置
          </Link>
          <Link to="/platforms" onClick={() => sound.navigate()}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors text-white/60 hover:text-white/80 text-base font-bold">
            📚
            学习导航
          </Link>
        </div>

        <div className="text-center text-white/20 text-xs pb-4">
          数学很有趣 · 每天进步一点点
        </div>
      </div>

      <style>{`
        @keyframes floatIn{0%{opacity:0;transform:translateY(20px) scale(0.8);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes sparkle{0%,100%{opacity:1;}50%{opacity:0.3;}}
      `}</style>
    </div>
  );
}

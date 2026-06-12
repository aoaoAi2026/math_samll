import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, BookOpen, Target, Zap, Gamepad2, BookMarked, AlertCircle, Sparkles, Flame, CalendarCheck, Medal, TrendingUp, Compass, Volume2, VolumeX, BarChart3, Settings, Users, Lightbulb } from 'lucide-react';
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
  { emoji: '🦅', name: '雄鹰', minStars: 200, color: 'from-orange-400 to-red-500' },
  { emoji: '🐲', name: '小龙', minStars: 500, color: 'from-purple-400 to-pink-500' },
  { emoji: '🐉', name: '神龙', minStars: 1000, color: 'from-yellow-300 via-orange-400 to-red-500' },
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

const HERO_EMOJIS = ['🦊', '🐰', '🐼', '🐨', '🦄', '🐱', '🐶', '🐸'];

export default function Home() {
  const { userProgress, dailyMissions } = useGameStore();
  const [mascotIdx, setMascotIdx] = useState(0);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [streak, setStreak] = useState(0);
  const [missionProgress, setMissionProgress] = useState<Record<string, number>>(dailyMissions);
  const [encourageMsg, setEncourageMsg] = useState('');
  const [muted, setMuted] = useState(() => isMuted());

  // 吉祥物随机切换
  useEffect(() => {
    const interval = setInterval(() => {
      setMascotIdx(prev => (prev + 1) % HERO_EMOJIS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const features = [
    { emoji: '📖', icon: BookOpen, title: '学习中心', description: '先学知识点，再做练习题！', color: 'from-green-500/20 to-emerald-500/20', link: '/learn', isNew: true },
    { emoji: '⚡', icon: Zap, title: '口算挑战', description: '限时答题测反应速度', color: 'from-yellow-500/20 to-orange-500/20', link: '/speed-calc', isNew: true },
    { emoji: '🗺️', icon: Compass, title: '数学大冒险', description: '15个世界等你探索！', color: 'from-amber-500/20 to-orange-500/20', link: '/adventure' },
    { emoji: '🎮', icon: Gamepad2, title: '闯关学习', description: '像玩游戏一样学奥数！', color: 'from-purple-500/20 to-pink-500/20', link: '/grade' },
    { emoji: '🚀', icon: Zap, title: '快速练习', description: '随机刷题停不下来', color: 'from-orange-500/20 to-red-500/20', link: '/practice' },
    { emoji: '🏆', icon: Trophy, title: '历年真题', description: '5大竞赛真题等你挑战', color: 'from-yellow-500/20 to-orange-500/20', link: '/exam-questions' },
    { emoji: '🎯', icon: Target, title: '模拟考试', description: '智能组卷检验成果', color: 'from-green-500/20 to-emerald-500/20', link: '/exam' },
    { emoji: '📝', icon: AlertCircle, title: '错题库', description: '连对3次自动出库', color: 'from-red-500/20 to-pink-500/20', link: '/wrong-questions' },
    { emoji: '📊', icon: BarChart3, title: '学习报告', description: '看看你的进步曲线', color: 'from-blue-500/20 to-cyan-500/20', link: '/report' },
    { emoji: '🏅', icon: Users, title: '排行榜', description: '星星坚持正确率比拼', color: 'from-indigo-500/20 to-purple-500/20', link: '/leaderboard' },
  ];

  const badges = [
    { icon: '🌟', name: '新手起航', req: 0, desc: '开始奥数之旅' },
    { icon: '⭐', name: '进步之星', req: 20, desc: '获得20颗星星' },
    { icon: '🎖️', name: '优秀学员', req: 50, desc: '获得50颗星星' },
    { icon: '🏅', name: '超级学霸', req: 150, desc: '获得150颗星星' },
    { icon: '🧠', name: '数学天才', req: 300, desc: '获得300颗星星' },
    { icon: '👑', name: '奥数大师', req: 500, desc: '获得500颗星星' },
    { icon: '🔥', name: '持之以恒', req: -1, desc: '连续7天打卡' },
    { icon: '💪', name: '百题斩', req: -1, desc: '累计完成100题' },
  ];

  const totalPassed = Object.values(userProgress.progress).reduce((sum, g) =>
    sum + Object.values(g.questions || {}).filter(q => q.passed).length, 0);
  const wrongCount = (userProgress.wrongQuestions || []).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* 动画背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        {[...Array(16)].map((_, i) => (
          <div key={i} className="absolute text-xl animate-bounce" style={{
            left: `${(i * 17 + 5) % 100}%`, top: `${(i * 23 + 10) % 100}%`,
            animationDelay: `${(i * 0.4) % 3}s`, animationDuration: `${2 + (i % 3)}s`,
            opacity: 0.25 + (i % 5) * 0.05,
          }}>{['✨', '⭐', '💫', '🌟', '💡', '🎈', '🔮', '🪐'][i % 8]}</div>
        ))}
      </div>

      <div className="relative z-10">
        {/* 导航栏 */}
        <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-12 h-12 bg-gradient-to-br ${pet.color} rounded-2xl flex items-center justify-center shadow-lg animate-bounce`} style={{ animationDuration: '3s' }}>
              <span className="text-2xl">{pet.emoji}</span>
            </div>
            <div>
              <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400">奥数闯关王</span>
              <div className="text-[10px] text-white/40 -mt-0.5">宠物: {pet.name} ｜ {pet.nextStage ? `距进化还差${pet.nextStage.minStars - userProgress.totalStars}⭐` : '已满级！'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMuted(toggleMute()); }}
              className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
              title={muted ? '开启音效' : '关闭音效'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
            </button>
            <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <span className="text-xs">{HERO_EMOJIS[mascotIdx]}</span>
              <span className="text-white text-xs font-bold">{userProgress.rank}</span>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-4">
          {/* 英雄区 + 宠物 */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            {/* 宠物卡片 */}
            <Link to="/practice" className="flex-shrink-0 w-full md:w-48 bg-white/10 backdrop-blur-lg rounded-3xl p-5 border-2 border-white/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer group relative overflow-hidden">
              {/* 宠物进化进度环 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke={`url(#petGrad)`} strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - pet.progress / 100)}`}
                    strokeLinecap="round" className="transition-all duration-1000" />
                  <defs>
                    <linearGradient id="petGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{pet.emoji}</div>
                <div className="text-white font-bold text-sm">{pet.name}</div>
                <div className="text-yellow-400/70 text-xs mt-1">{pet.progress}% 进化中</div>
              </div>
            </Link>

            {/* 欢迎语 */}
            <div className="flex-1 text-center md:text-left">
              {showCelebrate && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="text-center">
                    <div className="text-6xl animate-bounce mb-2">{pet.emoji}</div>
                    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 animate-pulse">{encourageMsg}</div>
                    <div className="flex justify-center gap-2 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>{['⭐', '🌟', '💫', '✨', '🎉'][i]}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-3 border border-white/20">
                <span className="text-xl">{HERO_EMOJIS[mascotIdx]}</span>
                <span className="text-white/80 text-sm">Hi, {userProgress.userName}！今天又是学数学的好日子！</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                开启你的{' '}
                <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  奥数冒险
                </span>
                {' '}吧！
              </h1>
              <p className="text-white/50 text-sm max-w-lg">闯关、收集星星、养成宠物、解锁成就，让数学像游戏一样上瘾！</p>
            </div>
          </div>

          {/* 三栏布局：打卡 + 每日任务 + 段位进度 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 每日打卡 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold text-sm">每日打卡</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-400 animate-pulse' : 'text-white/30'}`} />
                  {streak > 0 && <span className="text-orange-400 font-bold text-xs">连续{streak}天</span>}
                </div>
              </div>
              <div className="flex items-center justify-between gap-1.5 mb-3">
                {['一','二','三','四','五','六','日'].map((day, i) => {
                  const checkDate = new Date(); checkDate.setDate(checkDate.getDate() - (6 - i));
                  const checked = dates.includes(checkDate.toDateString());
                  const isToday = checkDate.toDateString() === today;
                  return (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                        checked ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md shadow-orange-500/20' :
                        isToday ? 'bg-white/20 border-2 border-yellow-400/50 text-white' : 'bg-white/5 text-white/30'
                      }`}>{checked ? '✅' : isToday ? '📅' : day}</div>
                      <span className="text-white/30 text-[10px]">{day}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={handleCheckIn} disabled={checkedInToday}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                  checkedInToday ? 'bg-green-500/20 text-green-400 cursor-not-allowed' :
                  'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95'
                }`}
              >{checkedInToday ? '✅ 今日已打卡' : '📅 今日打卡领奖励'}</button>
            </div>

            {/* 每日任务 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold text-sm">每日任务</span>
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </div>
              <div className="space-y-2">
                {DAILY_MISSIONS.map(m => {
                  const done = (missionProgress[m.id] || 0) >= m.target;
                  const prog = Math.min((missionProgress[m.id] || 0) / m.target * 100, 100);
                  return (
                    <div key={m.id} className={`p-2 rounded-xl transition-all ${done ? 'bg-green-500/10' : 'bg-white/5'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70 text-xs flex items-center gap-1.5">
                          {done ? '✅' : m.icon} {m.title}
                        </span>
                        <span className={`text-xs font-bold ${done ? 'text-green-400' : 'text-white/50'}`}>
                          {missionProgress[m.id] || 0}/{m.target}{m.unit}
                        </span>
                      </div>
                      <div className="bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-green-400' : 'bg-gradient-to-r from-blue-400 to-cyan-400'}`}
                          style={{ width: `${prog}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 段位进度 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-pink-400" />
                <span className="text-white font-semibold text-sm">段位进度</span>
                <Medal className="w-3 h-3 text-yellow-400" />
              </div>
              <div className="text-center mb-2">
                <div className="text-4xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  {userProgress.rank}
                </div>
              </div>
              {/* 下一段位 */}
              <div className="bg-white/5 rounded-xl p-2.5 text-center">
                <div className="text-white/40 text-[10px]">
                  {pet.nextStage ? (
                    <>下个段位 <span className="text-yellow-400 font-bold">{pet.nextStage.emoji} {pet.nextStage.name}</span> 还需 {pet.nextStage.minStars - userProgress.totalStars}⭐</>
                  ) : (
                    <span className="text-yellow-300">🎊 已达最高段位！你是传奇！</span>
                  )}
                </div>
                {pet.nextStage && (
                  <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-700"
                      style={{ width: `${pet.progress}%` }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 成就徽章 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Medal className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold text-sm">成就徽章</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {badges.map((badge, i) => {
                let unlocked = false;
                if (badge.req === -1) {
                  if (badge.name === '持之以恒') unlocked = streak >= 7;
                  if (badge.name === '百题斩') unlocked = totalPassed >= 100;
                } else unlocked = userProgress.totalStars >= badge.req;
                return (
                  <div key={i} className={`flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-2xl min-w-[72px] transition-all ${
                    unlocked ? 'bg-gradient-to-b from-yellow-400/20 to-orange-500/20 border border-yellow-400/40 shadow-lg shadow-yellow-500/10' :
                    'bg-white/5 border border-white/10 opacity-50'
                  }`}>
                    <span className={`text-2xl ${unlocked ? 'animate-bounce' : 'grayscale'}`} style={unlocked ? { animationDuration: '2s' } : {}}>{badge.icon}</span>
                    <span className={`text-xs font-semibold ${unlocked ? 'text-yellow-300' : 'text-white/40'}`}>{badge.name}</span>
                    <span className="text-[10px] text-white/30 text-center leading-tight">{unlocked ? '已解锁' : badge.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔴 今日推荐学习路径 */}
          <div className="mb-4 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-pink-500/10 rounded-3xl border-2 border-yellow-400/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm">💡 今日推荐</span>
              {(() => {
                const wrongCount = (userProgress.wrongQuestions || []).length;
                const stored = localStorage.getItem('math-checkin-dates');
                const dts: string[] = stored ? JSON.parse(stored) : [];
                const hasCheckin = dts.includes(new Date().toDateString());
                if (!hasCheckin) return <span className="text-white/30 text-xs ml-auto">先打卡解锁推荐 →</span>;
                if (wrongCount > 0) return <span className="text-red-400 text-xs ml-auto">{wrongCount}道错题待巩固</span>;
                return <span className="text-green-400 text-xs ml-auto">今日已打卡 ✓</span>;
              })()}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {(() => {
                const recs: { icon: string; title: string; desc: string; link: string; color: string }[] = [];
                const wrongCount = (userProgress.wrongQuestions || []).length;
                // 推荐1：如果上次练了某年级就继续
                const lastGrade = userProgress.currentGrade || 1;
                const gp = userProgress.progress[lastGrade];
                const hasAnyQ = gp && Object.values(gp.questions || {}).length > 0;
                const hasAnyTopic = gp && Object.values(gp.topics || {}).length > 0;
                if (hasAnyTopic) {
                  const incompleteTopic = Object.entries(gp.topics || {}).find(([, tp]: [string, any]) => (tp.completed || 0) < 5);
                  if (incompleteTopic) {
                    recs.push({ icon: '🎯', title: '继续学习', desc: `${lastGrade}年级知识点`, link: `/grade/${lastGrade}`, color: 'from-blue-400 to-cyan-500' });
                  }
                }
                if (wrongCount > 0) {
                  recs.push({ icon: '📝', title: '消灭错题', desc: `还有${wrongCount}道`, link: '/wrong-questions', color: 'from-red-400 to-pink-500' });
                }
                recs.push({ icon: '⚡', title: '口算挑战', desc: '测反应速度', link: '/speed-calc', color: 'from-yellow-400 to-orange-500' });
                recs.push({ icon: '📖', title: '学习中心', desc: '先学后练', link: '/learn', color: 'from-green-400 to-emerald-500' });
                if (recs.length === 0) {
                  recs.push({ icon: '🎮', title: '开始闯关', desc: `${lastGrade}年级`, link: `/grade/${lastGrade}`, color: 'from-purple-400 to-pink-500' });
                  recs.push({ icon: '⚡', title: '口算挑战', desc: '测反应速度', link: '/speed-calc', color: 'from-yellow-400 to-orange-500' });
                }
                return recs.slice(0, 3).map((r, i) => (
                  <Link key={i} to={r.link} onClick={() => sound.navigate()}
                    className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-gradient-to-br ${r.color} bg-opacity-20 rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105`}>
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <div className="text-white font-bold text-sm">{r.title}</div>
                      <div className="text-white/50 text-xs">{r.desc}</div>
                    </div>
                  </Link>
                ));
              })()}
            </div>
          </div>

          {/* 功能入口 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {features.map((f, i) => (
              <Link key={i} to={f.link} onClick={() => sound.navigate()}
                className={`group relative p-3.5 rounded-2xl bg-gradient-to-br ${f.color} backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${(f as any).isNew ? 'ring-1 ring-amber-400/50' : ''}`}>
                {(f as any).isNew && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                    NEW
                  </span>
                )}
                <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform duration-300">{f.emoji}</div>
                <h3 className="text-white font-bold text-sm mb-0.5">{f.title}</h3>
                <p className="text-white/50 text-[11px] leading-tight">{f.description}</p>
              </Link>
            ))}
          </div>

          {/* 🔴 打卡日历热力图 */}
          <div className="mb-4 bg-white/10 rounded-3xl border border-white/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><CalendarCheck className="w-5 h-5 text-yellow-400" /><span className="text-white font-bold text-sm">打卡日历</span></div>
              <div className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-400" /><span className="text-orange-400 font-bold text-sm">连签 {streak} 天</span></div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const stored = localStorage.getItem('math-checkin-dates');
                const dts: string[] = stored ? JSON.parse(stored) : [];
                const today = new Date();
                const cells: { date: Date; checked: boolean; isToday: boolean }[] = [];
                for (let i = 34; i >= 0; i--) {
                  const d = new Date(today);
                  d.setDate(today.getDate() - i);
                  cells.push({ date: d, checked: dts.includes(d.toDateString()), isToday: i === 0 });
                }
                return cells.map((c, i) => (
                  <div key={i} title={c.date.toLocaleDateString('zh-CN')} className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${c.checked ? 'bg-green-500/30 border border-green-400/50 text-green-400' : 'bg-white/5 border border-white/10 text-white/20'} ${c.isToday ? 'ring-1 ring-yellow-400/50' : ''}`}>
                    {c.date.getDate()}
                  </div>
                ));
              })()}
            </div>
            <div className="flex items-center justify-between mt-3">
              <button onClick={handleCheckIn}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${checkedInToday ? 'bg-green-500/20 text-green-400 border border-green-400/30' : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/30'}`}>
                <Flame className="w-4 h-4" />{checkedInToday ? '✅ 今日已打卡' : '🔥 打卡签到'}
              </button>
              <div className="flex items-center gap-2 text-white/30 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-400/50" />已打卡</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-white/10" />未打卡</span>
              </div>
            </div>
          </div>

          {/* 年级入口 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="text-white font-bold text-sm">选择年级</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {GRADES.map(grade => {
                const chapters = userProgress.progress[grade]?.chapters || {};
                const completed = Object.values(chapters).filter(c => c.passed).length;
                return (
                  <Link key={grade} to={`/grade/${grade}`} onClick={() => sound.navigate()}
                    className={`p-4 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                      grade === userProgress.currentGrade ? 'bg-white/15 border-yellow-400/50 shadow-lg shadow-yellow-500/10' :
                      'bg-white/10 border-white/20 hover:border-white/40'
                    }`}>
                    <div className="text-center">
                      <div className="text-3xl mb-1">{GRADE_EMOJIS[grade - 1]}</div>
                      <div className="text-white font-bold text-sm">{grade}年级</div>
                      <div className="flex items-center justify-center gap-0.5 mt-1.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= Math.min(completed * 0.5, 5) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                        ))}
                      </div>
                      <div className="text-white/40 text-xs mt-1">{completed}/15章</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 学习成就面板 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold text-sm">学习成就</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: userProgress.totalStars, c: 'text-yellow-400', l: '🌟 获得星星' },
                { v: totalPassed, c: 'text-green-400', l: '✅ 答对题目' },
                { v: userProgress.examHistory.length, c: 'text-blue-400', l: '📝 参加考试' },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-white/5">
                  <div className={`text-3xl font-extrabold ${item.c}`}>{item.v}</div>
                  <div className="text-white/50 text-xs mt-1">{item.l}</div>
                </div>
              ))}
              <Link to="/wrong-questions" className="text-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors block">
                <div className="text-3xl font-extrabold text-red-400">{wrongCount}</div>
                <div className="text-white/50 text-xs mt-1">📋 待巩固错题</div>
              </Link>
            </div>
          </div>

          {/* 底部辅助工具栏 */}
          <div className="flex gap-2 mt-4">
            <Link to="/platforms" onClick={() => sound.navigate()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-white/60 hover:text-white/80 text-xs">
              📚 学习导航
            </Link>
            <Link to="/settings" onClick={() => sound.navigate()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-white/60 hover:text-white/80 text-xs">
              ⚙️ 家长控制
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar{display:none;}
        .scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none;}
        @keyframes floatIn{0%{opacity:0;transform:translateY(20px) scale(0.8);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes sparkle{0%,100%{opacity:1;}50%{opacity:0.3;}}
      `}</style>
    </div>
  );
}

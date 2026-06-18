import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Clock, Bell, Shield, Trash2, Star, Moon, Sun } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { sound } from '@/utils/sound';

const STORAGE_KEY = 'math-settings';

interface Settings {
  dailyLimit: number; // 每日练习时长上限(分钟), 0=不限
  restInterval: number; // 休息提醒间隔(分钟), 0=不提醒
  maxDifficulty: number; // 最高难度 1-4
  enableSound: boolean;
}

const DEFAULT: Settings = { dailyLimit: 0, restInterval: 30, maxDifficulty: 4, enableSound: true };

function load(): Settings {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; } catch { return { ...DEFAULT }; }
}
function save(s: Settings) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

export default function SettingsPage() {
  const { userProgress, resetProgress, isDarkMode, toggleDarkMode } = useGameStore();
  const [settings, setSettings] = useState<Settings>(load);
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => { save(settings); }, [settings]);

  const update = (patch: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetProgress();
    localStorage.removeItem('math-checkin-dates');
    localStorage.removeItem('math-missions');
    localStorage.removeItem('math-weekly-stats');
    localStorage.removeItem('math-daily-stats');
    localStorage.removeItem('math-adventure-storage');
    setShowReset(false);
    window.location.reload();
  };

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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl"><Shield className="w-8 h-8 text-white" /></div>
          <div><h1 className="text-2xl font-extrabold text-white">家长控制</h1><p className="text-white/50 text-sm">设置学习规则与数据管理</p></div>
        </div>

        {saved && <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-3 text-green-400 text-sm mb-4 text-center">✅ 设置已保存</div>}

        <div className="space-y-4">
          {/* 每日时长上限 */}
          <div className="bg-white/10 rounded-3xl border border-white/20 p-5">
            <div className="flex items-center gap-2 mb-4"><Clock className="w-5 h-5 text-blue-400" /><span className="text-white font-bold">每日练习时长上限</span></div>
            <p className="text-white/40 text-xs mb-3">超过时长后无法继续答题，0表示不限</p>
            <div className="flex gap-2">{[
              { label: '不限', value: 0 }, { label: '30分钟', value: 30 }, { label: '1小时', value: 60 }, { label: '2小时', value: 120 }
            ].map(opt => (
              <button key={opt.value} onClick={() => update({ dailyLimit: opt.value })}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${settings.dailyLimit === opt.value ? 'bg-white/20 border-yellow-400/50 text-yellow-400' : 'bg-white/5 border-white/10 text-white/60'}`}>
                {opt.label}
              </button>
            ))}</div>
          </div>

          {/* 休息提醒 */}
          <div className="bg-white/10 rounded-3xl border border-white/20 p-5">
            <div className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-green-400" /><span className="text-white font-bold">休息提醒间隔</span></div>
            <p className="text-white/40 text-xs mb-3">每学习一段时间提醒孩子休息，0表示不提醒</p>
            <div className="flex gap-2">{[
              { label: '不提醒', value: 0 }, { label: '20分钟', value: 20 }, { label: '30分钟', value: 30 }, { label: '45分钟', value: 45 }
            ].map(opt => (
              <button key={opt.value} onClick={() => update({ restInterval: opt.value })}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${settings.restInterval === opt.value ? 'bg-white/20 border-yellow-400/50 text-yellow-400' : 'bg-white/5 border-white/10 text-white/60'}`}>
                {opt.label}
              </button>
            ))}</div>
          </div>

          {/* 难度上限 */}
          <div className="bg-white/10 rounded-3xl border border-white/20 p-5">
            <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-orange-400" /><span className="text-white font-bold">最高难度限制</span></div>
            <p className="text-white/40 text-xs mb-3">限制可练习的题目难度上限</p>
            <div className="flex gap-2">{[
              { label: '⭐简单', value: 1 }, { label: '⭐⭐中等', value: 2 }, { label: '⭐⭐⭐困难', value: 3 }, { label: '⭐⭐⭐⭐极难', value: 4 }
            ].map(opt => (
              <button key={opt.value} onClick={() => update({ maxDifficulty: opt.value })}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${settings.maxDifficulty === opt.value ? 'bg-white/20 border-yellow-400/50 text-yellow-400' : 'bg-white/5 border-white/10 text-white/60'}`}>
                {opt.label}
              </button>
            ))}</div>
          </div>

          {/* 夜间模式 */}
          <div className="bg-white/10 rounded-3xl border border-white/20 p-5">
            <div className="flex items-center gap-2 mb-4"><Moon className="w-5 h-5 text-indigo-400" /><span className="text-white font-bold">夜间模式</span></div>
            <p className="text-white/40 text-xs mb-3">开启后使用深色主题，适合夜间使用</p>
            <button onClick={() => { sound.navigate(); toggleDarkMode(); }}
              className={`w-full py-4 rounded-xl text-base font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                isDarkMode ? 'bg-indigo-500/30 border-indigo-400/50 text-indigo-300' : 'bg-white/5 border-white/10 text-white/60'
              }`}>
              {isDarkMode ? <><Moon className="w-5 h-5" /> 深色模式已开启</> : <><Sun className="w-5 h-5" /> 浅色模式</>}
            </button>
          </div>

          {/* 声音设置 */}
          <div className="bg-white/10 rounded-3xl border border-white/20 p-5">
            <div className="flex items-center gap-2 mb-4"><span className="text-2xl">🔊</span><span className="text-white font-bold">音效开关</span></div>
            <button onClick={() => update({ enableSound: !settings.enableSound })}
              className={`w-full py-3 rounded-xl text-sm font-bold border-2 transition-all ${settings.enableSound ? 'bg-green-500/20 border-green-400/30 text-green-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
              {settings.enableSound ? '🔊 音效已开启' : '🔇 音效已关闭'}
            </button>
          </div>

          {/* 数据管理 */}
          <div className="bg-white/10 rounded-3xl border border-white/20 p-5">
            <div className="flex items-center gap-2 mb-4"><Trash2 className="w-5 h-5 text-red-400" /><span className="text-white font-bold">数据管理</span></div>
            <p className="text-white/40 text-xs mb-3">重置所有学习进度数据（不可恢复）</p>
            {!showReset ? (
              <button onClick={() => setShowReset(true)} className="w-full py-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-400 text-sm font-bold hover:bg-red-500/30 transition-colors">
                重置所有数据
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-red-400 text-sm text-center">⚠️ 确认重置？此操作不可恢复！</p>
                <div className="flex gap-2">
                  <button onClick={() => setShowReset(false)} className="flex-1 py-2 bg-white/10 rounded-xl text-white text-sm">取消</button>
                  <button onClick={handleReset} className="flex-1 py-2 bg-red-500 rounded-xl text-white text-sm font-bold">确认重置</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

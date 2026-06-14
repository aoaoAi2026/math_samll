import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Timer, ChevronLeft, Volume2, VolumeX, Play, RefreshCw } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { sound, isMuted, toggleMute } from '@/utils/sound';
import ConfettiEffect from '@/components/ConfettiEffect';

type Op = '+' | '-' | '×' | '÷';
const DIFFICULTIES = [
  { label: '简单 (20以内)', max: 20, ops: ['+', '-'] as Op[] },
  { label: '中等 (100以内)', max: 100, ops: ['+', '-', '×'] as Op[] },
  { label: '困难 (100以内全运算)', max: 100, ops: ['+', '-', '×', '÷'] as Op[] },
];

interface CalcQ { a: number; b: number; op: Op; answer: number; }
function gen(ops: Op[], max: number): CalcQ {
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, ans: number;
  if (op === '+') { a = Math.floor(Math.random() * max) + 1; b = Math.floor(Math.random() * (max - a)) + 1; ans = a + b; }
  else if (op === '-') { a = Math.floor(Math.random() * max) + 2; b = Math.floor(Math.random() * a) + 1; ans = a - b; }
  else if (op === '×') { a = Math.floor(Math.random() * 9) + 2; b = Math.floor(Math.random() * 9) + 2; ans = a * b; }
  else { b = Math.floor(Math.random() * 9) + 2; ans = Math.floor(Math.random() * 9) + 2; a = ans * b; }
  return { a, b, op, answer: ans };
}

export default function SpeedCalc() {
  const { userProgress, updateQuestionProgress } = useGameStore();
  const [muted, setMuted] = useState(isMuted());
  const [phase, setPhase] = useState<'setup' | 'cd' | 'play' | 'result'>('setup');
  const [diff, setDiff] = useState(0);
  const [secPerQ, setSecPerQ] = useState(5);
  const [total, setTotal] = useState(20);
  const [qs, setQs] = useState<CalcQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxC, setMaxC] = useState(0);
  const [timer, setTimer] = useState(5);
  const [cd, setCd] = useState(3);
  const [cf, setCf] = useState(false);
  const [res, setRes] = useState<{ q: CalcQ; u: number | null; ok: boolean }[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  const nxt = () => { if (idx + 1 >= total) { setPhase('result'); if (score >= total * 0.8) setCf(true); } else { setIdx(i => i + 1); setAns(''); setTimer(secPerQ); } };
  const timeout = useCallback(() => {
    setRes(r => [...r, { q: qs[idx], u: null, ok: false }]); setCombo(0); sound.wrong(); nxt();
  }, [idx]);
  const start = () => {
    const list: CalcQ[] = []; const { ops, max } = DIFFICULTIES[diff];
    for (let i = 0; i < total; i++) list.push(gen(ops, max));
    setQs(list); setIdx(0); setScore(0); setCombo(0); setMaxC(0); setAns(''); setRes([]); setTimer(secPerQ); setPhase('cd'); setCd(3); sound.navigate();
  };
  const sub = () => {
    const q = qs[idx]; const n = parseInt(ans); if (isNaN(n)) return;
    const ok = n === q.answer; setRes(r => [...r, { q, u: n, ok }]);
    if (ok) { sound.correct(); setScore(s => s + 1); setCombo(c => { const nc = c + 1; setMaxC(m => Math.max(m, nc)); if (nc >= 3) sound.combo(nc); return nc; }); updateQuestionProgress(`speed_${Date.now()}`, true); }
    else { sound.wrong(); setCombo(0); }
    nxt();
  };

  useEffect(() => { if (phase === 'cd' && cd <= 0) setPhase('play'); if (phase === 'cd') { const t = setTimeout(() => setCd(c => c - 1), 1000); return () => clearTimeout(t); } }, [phase, cd]);
  useEffect(() => { if (phase !== 'play') return; if (timer <= 0) { timeout(); return; } const iv = setInterval(() => setTimer(t => t <= 1 ? (clearInterval(iv), 0) : t - 1), 1000); return () => clearInterval(iv); }, [phase, timer, timeout]);
  useEffect(() => { if (phase === 'play') ref.current?.focus(); }, [phase, idx]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {cf && <ConfettiEffect />}
      <div className="absolute inset-0 pointer-events-none"><div className="absolute top-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" /></div>
      <nav className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <Link to="/" className="text-white/80 hover:text-yellow-400 flex items-center gap-2 font-bold"><ChevronLeft className="w-5 h-5" />返回</Link>
        <div className="flex items-center gap-3">
          <button onClick={() => setMuted(toggleMute())} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">{muted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}</button>
          <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-full"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /><span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span></div>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {phase === 'setup' && (
          <div className="text-center">
            <div className="text-7xl mb-4">⚡</div>
            <h1 className="text-3xl font-extrabold text-white mb-2">口算挑战</h1>
            <p className="text-white/50 mb-8">限时作答，测测你的反应速度！</p>
            <div className="bg-white/10 rounded-3xl border border-white/20 p-6 space-y-5">
              <div><label className="text-white/50 text-xs mb-2 block">难度</label><div className="grid grid-cols-3 gap-2">{DIFFICULTIES.map((d, i) => <button key={i} onClick={() => setDiff(i)} className={`p-3 rounded-xl text-xs font-bold border-2 ${i === diff ? 'bg-white/20 border-yellow-400/50 text-yellow-400' : 'bg-white/5 border-white/10 text-white/60'}`}>{d.label}</button>)}</div></div>
              <div><label className="text-white/50 text-xs mb-2 block">每题限时</label><div className="flex gap-2">{[3, 4, 5, 8].map(t => <button key={t} onClick={() => setSecPerQ(t)} className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 ${t === secPerQ ? 'bg-white/20 border-yellow-400/50 text-yellow-400' : 'bg-white/5 border-white/10 text-white/60'}`}>{t}秒</button>)}</div></div>
              <div><label className="text-white/50 text-xs mb-2 block">题量</label><div className="flex gap-2">{[10, 20, 30, 50].map(t => <button key={t} onClick={() => setTotal(t)} className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 ${t === total ? 'bg-white/20 border-yellow-400/50 text-yellow-400' : 'bg-white/5 border-white/10 text-white/60'}`}>{t}题</button>)}</div></div>
              <button onClick={start} className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"><Play className="w-5 h-5" />开始挑战</button>
            </div>
          </div>
        )}
        {phase === 'cd' && <div className="flex items-center justify-center min-h-[300px]"><div className="text-9xl font-extrabold text-yellow-400 animate-bounce">{cd}</div></div>}
        {phase === 'play' && qs[idx] && (
          <div>
            <div className="flex justify-between mb-6"><span className="text-white/40 text-sm">{idx + 1}/{total}</span><span className={`flex items-center gap-1 text-sm font-bold ${timer <= 2 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}><Timer className="w-4 h-4" />{timer}秒</span><span className="text-white/50 text-sm">得分:<span className="text-green-400 font-bold ml-1">{score}</span>{combo > 1 && <span className="text-orange-400 ml-1">{combo}连击!</span>}</span></div>
            <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden"><div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} /></div>
            <div className="bg-white/10 rounded-3xl border-2 border-white/20 p-8 text-center">
              <div className="text-6xl font-extrabold text-white mb-6 tracking-wider">{qs[idx].a} {qs[idx].op} {qs[idx].b} = ?</div>
              <input ref={ref} type="number" value={ans} onChange={e => setAns(e.target.value)} onKeyDown={e => e.key === 'Enter' && sub()} placeholder="输入答案..." className="w-full max-w-[200px] text-center py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white text-3xl font-bold focus:border-yellow-400/50 focus:outline-none" />
              <button onClick={sub} className="mt-4 w-full max-w-[200px] py-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white font-bold hover:shadow-lg active:scale-95">确定</button>
              <p className="text-white/30 text-xs mt-2">按 Enter 快速提交</p>
            </div>
          </div>
        )}
        {phase === 'result' && (
          <div className="text-center">
            <div className="text-7xl mb-4">{score >= total * 0.9 ? '🏆' : score >= total * 0.7 ? '⭐' : '💪'}</div>
            <h2 className="text-3xl font-extrabold text-white mb-2">挑战完成！</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-2xl p-4"><div className="text-3xl font-extrabold text-yellow-400">{score}/{total}</div><div className="text-white/40 text-xs">正确率 {Math.round(score / total * 100)}%</div></div>
              <div className="bg-white/10 rounded-2xl p-4"><div className="text-3xl font-extrabold text-orange-400">{maxC}</div><div className="text-white/40 text-xs">最大连击</div></div>
            </div>
            {res.filter(r => !r.ok).length > 0 && (
              <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left max-h-[250px] overflow-y-auto">
                <div className="text-white/40 text-xs mb-3">❌ 错题回顾</div>
                <div className="space-y-1.5">{res.filter(r => !r.ok).map((r, i) => <div key={i} className="flex justify-between text-sm bg-white/5 p-2 rounded-xl"><span className="text-white/70">{r.q.a} {r.q.op} {r.q.b} = <span className="text-red-400">{r.u ?? '超时'}</span></span><span className="text-green-400">→ {r.q.answer}</span></div>)}</div>
              </div>
            )}
            <div className="flex gap-3"><button onClick={start} className="flex-1 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2"><RefreshCw className="w-5 h-5" />再来一局</button><Link to="/" className="flex-1 py-4 bg-white/10 rounded-2xl text-white font-bold text-lg flex items-center justify-center">返回首页</Link></div>
          </div>
        )}
      </div>
    </div>
  );
}

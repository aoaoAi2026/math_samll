import { useState, useEffect } from 'react';
import { Sparkles, Star, Trophy } from 'lucide-react';

interface Props {
  newRank: string;
  onClose: () => void;
  totalStars: number;
}

const RANK_COLORS: Record<string, string> = {
  '🌟 奥数之神': 'from-yellow-300 via-orange-400 to-red-500',
  '👑 传奇大师': 'from-purple-300 via-pink-400 to-rose-500',
  '🏆 奥数大师': 'from-amber-300 via-orange-400 to-yellow-500',
  '🧠 数学天才': 'from-blue-300 via-indigo-400 to-purple-500',
  '🎖️ 超级学霸': 'from-emerald-300 via-green-400 to-teal-500',
  '📚 学霸达人': 'from-cyan-300 via-blue-400 to-indigo-500',
  '⭐ 优秀学员': 'from-yellow-300 via-amber-400 to-orange-500',
  '🌱 进步之星': 'from-green-300 via-lime-400 to-emerald-500',
  '🐣 初出茅庐': 'from-orange-300 via-yellow-400 to-amber-500',
  '🌰 数学小种子': 'from-stone-300 via-amber-400 to-yellow-500',
};

export default function RankUpModal({ newRank, onClose, totalStars }: Props) {
  const [visible, setVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    // 入场动画
    requestAnimationFrame(() => setVisible(true));
    const t1 = setTimeout(() => setShowContent(true), 400);
    const t2 = setTimeout(() => setShowStars(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const gradient = RANK_COLORS[newRank] || 'from-yellow-300 via-orange-400 to-pink-500';

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500 ${
      visible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
    }`}>
      {/* 背景星星 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {showStars && [...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.5,
              fontSize: `${12 + Math.random() * 20}px`,
            }}
          >
            {['✨', '⭐', '💫', '🌟'][i % 4]}
          </div>
        ))}
      </div>

      {/* 弹窗 */}
      <div
        className={`relative bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 rounded-[2.5rem] p-8 mx-4 max-w-sm w-full border-2 border-white/20 shadow-2xl transition-all duration-700 ${
          showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-20'
        }`}
      >
        {/* 顶部光效 */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-full blur-2xl opacity-60 animate-pulse`} />
        </div>

        {/* 奖杯 */}
        <div className="relative z-10 text-center mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 mb-3 animate-bounce">
            <Trophy className={`w-10 h-10 text-transparent`} style={{ 
              fill: 'url(#trophyGrad)',
              stroke: 'url(#trophyGrad)',
              strokeWidth: 2,
            }} />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-white/60 text-sm mb-1">
            <Sparkles className="w-4 h-4 inline text-yellow-400" /> 段位升级！ <Sparkles className="w-4 h-4 inline text-yellow-400" />
          </div>
          <h2 className={`text-3xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent animate-pulse`}>
            {newRank}
          </h2>
        </div>

        {/* 信息 */}
        <div className="relative z-10 bg-white/5 rounded-2xl p-4 mb-5 text-center">
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs mb-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            累计获得
          </div>
          <div className="text-3xl font-extrabold text-yellow-400">{totalStars}</div>
          <div className="text-yellow-400 text-xs">颗星星</div>
        </div>

        {/* 按钮 */}
        <button
          onClick={onClose}
          className="relative z-10 w-full py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-95"
        >
          🎉 继续闯关！
        </button>

        {/* 底部飘散粒子 */}
        {showStars && [...Array(8)].map((_, i) => (
          <div
            key={`bottom-${i}`}
            className="absolute bottom-0 text-yellow-400 animate-bounce pointer-events-none"
            style={{
              left: `${15 + i * 10}%`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${1.5 + i * 0.2}s`,
              fontSize: `${14 + i * 2}px`,
            }}
          >
            {['⭐', '✨', '🌟', '💫'][i % 4]}
          </div>
        ))}
      </div>
    </div>
  );
}

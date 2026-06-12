import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, BookOpen, Target, ChevronLeft, Volume2, VolumeX, PlayCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getKnowledgeByGrade, difficultyLabels } from '@/data/knowledge';
import { sound, isMuted, toggleMute } from '@/utils/sound';

const DIFFICULTY_EMOJIS = ['🌱', '🌿', '🔥', '💎'];
const GRADE_EMOJIS = ['🌱', '🌿', '🌳', '🍎', '🏆', '👑'];

export default function LearningCenter() {
  const { grade: gradeParam } = useParams<{ grade: string }>();
  const grade = gradeParam ? parseInt(gradeParam) : 1;
  const navigate = useNavigate();
  const { userProgress } = useGameStore();
  const [muted, setMuted] = useState(() => isMuted());

  const knowledgeChapters = getKnowledgeByGrade(grade);

  const handleMuteToggle = () => {
    setMuted(toggleMute());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-x-hidden">
      {/* 简化的背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* 导航栏 */}
      <nav className="max-w-4xl mx-auto px-5 py-5 flex items-center justify-between relative z-10">
        <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors font-extrabold flex items-center gap-2 text-lg">
          <ChevronLeft className="w-6 h-6" />
          返回首页
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleMuteToggle}
            className="w-11 h-11 bg-white/10 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            {muted ? <VolumeX className="w-6 h-6 text-white/50" /> : <Volume2 className="w-6 h-6 text-yellow-400" />}
          </button>
          <div className="flex items-center gap-2 bg-yellow-400/20 px-4 py-2.5 rounded-2xl border border-yellow-400/30">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-extrabold text-lg">{userProgress.totalStars}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-4 relative z-10">
        {/* 头部标题 */}
        <div className="text-center mb-7">
          <div className="text-6xl mb-3">📖</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">学习中心</h1>
          <p className="text-white/60 text-base">先学知识点，再做练习题，学习效果翻倍！</p>
        </div>

        {/* 年级切换（大按钮） */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {[1, 2, 3, 4, 5, 6].map((g) => (
            <button
              key={g}
              onClick={() => { sound.navigate(); navigate(`/learn/${g}`); }}
              className={`py-4 px-2 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-1 hover:scale-[1.03] active:scale-95 ${
                g === grade
                  ? 'bg-white/15 border-yellow-400/50 shadow-lg shadow-yellow-500/10'
                  : 'bg-white/10 border-white/20 hover:border-white/40'
              }`}
            >
              <div className="text-3xl mb-1">{GRADE_EMOJIS[g - 1]}</div>
              <div className={`font-extrabold text-base ${g === grade ? 'text-yellow-400' : 'text-white'}`}>
                {g}年级
              </div>
            </button>
          ))}
        </div>

        {/* 知识点章节卡片列表（每个章节一个大卡片） */}
        <div className="space-y-5">
          {knowledgeChapters.map((chapter) => {
            const chapterProgress = userProgress.progress[grade]?.chapters?.[chapter.id] || { completed: 0, total: chapter.topics.length };
            const chapterDone = chapterProgress.completed >= chapter.topics.length;
            return (
              <div key={chapter.id} className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 overflow-hidden">
                {/* 章节标题区 */}
                <div className="p-5 bg-white/5 flex items-center gap-4">
                  <span className="text-5xl">
                    {chapter.name.includes('计算') ? '🔢' :
                     chapter.name.includes('图形') ? '📐' :
                     chapter.name.includes('应用') ? '📝' :
                     chapter.name.includes('行程') ? '🚗' :
                     chapter.name.includes('逻辑') ? '🧠' :
                     chapter.name.includes('数论') ? '🔢' : '📚'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-extrabold text-white mb-1">{chapter.name}</h2>
                    <div className="text-white/50 text-sm">
                      共 <span className="text-yellow-400 font-bold">{chapter.topics.length}</span> 个知识点
                      {chapterDone && <span className="ml-2 text-green-400 font-bold">✅ 已掌握</span>}
                    </div>
                  </div>
                </div>

                {/* 知识点网格 - 每个知识点大卡片 */}
                <div className="p-5 pt-0 grid grid-cols-1 gap-3">
                  {chapter.topics.map((topic) => {
                    const topicProgress = userProgress.progress[grade]?.topics?.[topic.id] || { completed: 0, stars: 0 };
                    const isDone = topicProgress.completed >= 5;
                    const hasStarted = topicProgress.completed > 0;

                    return (
                      <Link
                        key={topic.id}
                        to={`/learn/${grade}/${topic.id}`}
                        onClick={() => sound.navigate()}
                        className={`p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                          isDone
                            ? 'bg-green-500/10 border-green-400/40'
                            : hasStarted
                            ? 'bg-yellow-500/10 border-yellow-400/40'
                            : 'bg-white/5 border-white/10 hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* 大图标 */}
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            isDone ? 'bg-green-500/20' : hasStarted ? 'bg-yellow-500/20' : 'bg-white/10'
                          }`}>
                            <span className="text-3xl">{isDone ? '✅' : hasStarted ? '📖' : '🎯'}</span>
                          </div>

                          {/* 标题和描述 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-extrabold text-white mb-1 flex items-center gap-2 flex-wrap">
                              {topic.name}
                              <span className={`text-xs px-3 py-0.5 rounded-full font-bold flex-shrink-0 ${
                                topic.difficulty === 1 ? 'bg-green-500/20 text-green-400' :
                                topic.difficulty === 2 ? 'bg-blue-500/20 text-blue-400' :
                                topic.difficulty === 3 ? 'bg-orange-500/20 text-orange-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {DIFFICULTY_EMOJIS[topic.difficulty - 1]} {difficultyLabels[topic.difficulty]}
                              </span>
                            </h3>
                            <p className="text-white/50 text-sm mb-2">{topic.description}</p>

                            {/* 星星进度 */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4].map((star) => (
                                  <Star key={star} className={`w-5 h-5 ${star <= topicProgress.stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}`} />
                                ))}
                              </div>
                              <span className="text-white/50 text-sm font-bold">
                                {isDone ? '已掌握' : hasStarted ? `进度 ${topicProgress.completed}/5` : '未开始'}
                              </span>
                            </div>
                          </div>

                          {/* 右侧箭头 */}
                          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-white/40 rotate-180" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 mb-6 text-center text-white/30 text-sm">
          💡 点击任意卡片开始学习
        </div>
      </div>
    </div>
  );
}

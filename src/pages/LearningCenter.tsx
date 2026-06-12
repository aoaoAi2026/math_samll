import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, BookOpen, Lightbulb, Target, Play, ChevronLeft, ChevronRight, Home, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getKnowledgeByGrade, getTopicById, difficultyLabels } from '@/data/knowledge';
import { getQuestionsByTopic } from '@/data/questions';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 导航栏 */}
      <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors font-bold flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          返回首页
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleMuteToggle}
            className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
          </button>
          <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
        {/* 头部 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-green-500/30">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              📖 学习中心
              <Lightbulb className="w-6 h-6 text-yellow-400" />
            </h1>
            <p className="text-white/50">先学知识点，再做练习题，学习效果翻倍！</p>
          </div>
        </div>

        {/* 年级切换 */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map((g) => (
            <button
              key={g}
              onClick={() => { sound.navigate(); navigate(`/learn/${g}`); }}
              className={`p-3 rounded-2xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                g === grade
                  ? 'bg-white/20 border-yellow-400/50 shadow-lg shadow-yellow-500/10'
                  : 'bg-white/10 border-white/20 hover:border-white/40'
              }`}
            >
              <div className="text-xl mb-1">{GRADE_EMOJIS[g - 1]}</div>
              <div className={`text-xs font-bold ${g === grade ? 'text-yellow-400' : 'text-white'}`}>
                {g}年级
              </div>
            </button>
          ))}
        </div>

        {/* 知识点列表 */}
        <div className="space-y-4">
          {knowledgeChapters.map((chapter) => (
            <div key={chapter.id} className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 overflow-hidden">
              <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
                <span className="text-2xl">{chapter.name.includes('计算') ? '🔢' : chapter.name.includes('图形') ? '📐' : chapter.name.includes('应用') ? '📝' : chapter.name.includes('行程') ? '🚗' : chapter.name.includes('逻辑') ? '🧠' : chapter.name.includes('数论') ? '🔢' : '📚'}</span>
                <h2 className="text-lg font-bold text-white">{chapter.name}</h2>
                <span className="text-white/40 text-sm ml-auto">{chapter.topics.length}种题型</span>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chapter.topics.map((topic) => {
                  const topicProgress = userProgress.progress[grade]?.topics?.[topic.id] || { completed: 0, stars: 0 };
                  const hasStarted = topicProgress.completed > 0;

                  return (
                    <Link
                      key={topic.id}
                      to={`/learn/${grade}/${topic.id}`}
                      onClick={() => sound.navigate()}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        hasStarted
                          ? 'bg-green-500/10 border-green-400/30'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-sm">{topic.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          topic.difficulty === 1 ? 'bg-green-500/20 text-green-400' :
                          topic.difficulty === 2 ? 'bg-blue-500/20 text-blue-400' :
                          topic.difficulty === 3 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {DIFFICULTY_EMOJIS[topic.difficulty - 1]} {difficultyLabels[topic.difficulty]}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs mb-2">{topic.description}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className={`w-3 h-3 ${star <= topicProgress.stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}`} />
                          ))}
                        </div>
                        <span className="text-white/30 text-xs ml-auto">
                          {hasStarted ? `✅ ${topicProgress.completed}题` : '未开始'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

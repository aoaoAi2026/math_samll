import { Link, useParams } from 'react-router-dom';
import { Star, BookOpen, Target, Trophy, Sparkles } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getKnowledgeByGrade, difficultyLabels } from '@/data/knowledge';

const CHAPTER_EMOJIS: Record<string, string> = {
  '认识数字': '🔢', '加减法': '➕', '比较大小': '⚖️', '图形认识': '🔺',
  '位置与方向': '🧭', '钟表与时间': '🕐', '人民币': '💰', '分类与统计': '📊',
  '找规律': '🔍', '逻辑推理': '🧩', '应用题': '📝', '几何初步': '📐',
  '计数': '🔢', '排列组合': '🎲', '概率': '🎯',
  '乘法': '✖️', '除法': '➗', '分数': '🍕', '小数': '🔢',
  '周长面积': '📏', '体积': '📦', '方程': '🔣', '比例': '⚡',
};

function getChapterEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(CHAPTER_EMOJIS)) {
    if (name.includes(key)) return emoji;
  }
  return '📚';
}

const DIFFICULTY_EMOJIS = ['🌱', '🌿', '🔥', '💎'];
const GRADE_EMOJIS = ['🌱', '🌿', '🌳', '🍎', '🏆', '👑'];

export default function GradeSelect() {
  const { grade: gradeParam } = useParams<{ grade: string }>();
  const grade = gradeParam ? parseInt(gradeParam) : 1;
  const { userProgress } = useGameStore();

  const knowledgeChapters = getKnowledgeByGrade(grade);

  const getTopicProgress = (topicId: number) => {
    return userProgress.progress[grade]?.topics?.[topicId] || { completed: 0, stars: 0 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <Link to="/" className="text-white/80 hover:text-yellow-400 transition-colors font-bold">
          ← 返回首页
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
        {/* 年级头部 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/30">
            <span className="text-4xl">{GRADE_EMOJIS[grade - 1]}</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              {grade}年级奥数
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </h1>
            <p className="text-white/50">
              {knowledgeChapters.length}个知识板块 · {knowledgeChapters.reduce((sum, c) => sum + c.topics.length, 0)}种题型
            </p>
          </div>
        </div>

        {/* 年级切换 */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map((g) => {
            const gradeProgress = userProgress.progress[g];
            const chapters = gradeProgress?.chapters || {};
            const completedChapters = Object.values(chapters).filter(c => c.passed).length;
            return (
              <Link
                key={g}
                to={`/grade/${g}`}
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
                <div className="text-white/30 text-[10px]">{completedChapters}/15</div>
              </Link>
            );
          })}
        </div>

        {/* 知识点分类展示 */}
        <div className="space-y-4">
          {knowledgeChapters.map((chapter) => (
            <div key={chapter.id} className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 overflow-hidden shadow-xl">
              <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
                <span className="text-2xl">{getChapterEmoji(chapter.name)}</span>
                <h2 className="text-lg font-bold text-white">{chapter.name}</h2>
                <span className="text-white/40 text-sm ml-auto">{chapter.topics.length}种题型</span>
              </div>
              
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {chapter.topics.map((topic) => {
                  const progress = getTopicProgress(topic.id);
                  const completed = progress.completed > 0;
                  const stars = progress.stars;

                  return (
                    <Link
                      key={topic.id}
                      to={`/topic/${grade}/${topic.id}`}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
                        completed 
                          ? 'bg-gradient-to-br from-green-500/15 to-emerald-500/15 border-green-400/40' 
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xl ${completed ? '' : 'opacity-50'}`}>
                            {completed ? '✅' : '⬜'}
                          </span>
                          <span className="text-white font-bold text-sm">{topic.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          topic.difficulty === 1 ? 'bg-green-500/20 text-green-400' :
                          topic.difficulty === 2 ? 'bg-blue-500/20 text-blue-400' :
                          topic.difficulty === 3 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {DIFFICULTY_EMOJIS[topic.difficulty - 1]} {difficultyLabels[topic.difficulty]}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs mb-2 leading-relaxed">{topic.description}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'}`}
                          />
                        ))}
                        <span className="text-white/30 text-xs ml-1">
                          {progress.completed > 0 ? `${progress.completed}题` : '未开始'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 学习统计 */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            📊 学习进度总览
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {knowledgeChapters.flatMap(chapter => 
              chapter.topics.map(topic => {
                const topicProgress = userProgress.progress[grade]?.topics?.[topic.id];
                const count = topicProgress?.completed || 0;
                return (
                  <div key={topic.id} className="text-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-white font-bold text-sm truncate">{topic.name}</div>
                    <div className={`text-sm font-bold mt-1 ${count > 0 ? 'text-green-400' : 'text-white/30'}`}>
                      {count > 0 ? `✅ ${count}题` : '待开始'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

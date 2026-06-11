import { Link, useParams } from 'react-router-dom';
import { Star, ChevronRight, Lock, CheckCircle, BookOpen, Target, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getKnowledgeByGrade, difficultyLabels } from '@/data/knowledge';

export default function GradeSelect() {
  const { grade: gradeParam } = useParams<{ grade: string }>();
  const grade = gradeParam ? parseInt(gradeParam) : 1;
  const { userProgress } = useGameStore();

  const knowledgeChapters = getKnowledgeByGrade(grade);
  const previousGradeProgress = userProgress.progress[grade - 1];
  const canAccess = grade === 1 || (previousGradeProgress && 
    Object.values(previousGradeProgress.chapters || {}).filter(c => c.passed).length >= 8);

  const getTopicProgress = (topicId: number) => {
    const key = `${grade}-${topicId}`;
    return userProgress.progress[grade]?.topics?.[topicId] || { completed: 0, stars: 0 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-white hover:text-yellow-400 transition-colors">
          <span className="text-xl font-bold">奥数闯关王</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/exam" className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm">模拟考试</span>
          </Link>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white">{userProgress.totalStars}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{grade}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{grade}年级奥数</h1>
            <p className="text-white/60">{knowledgeChapters.length}个知识板块，共{knowledgeChapters.reduce((sum, c) => sum + c.topics.length, 0)}种题型</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((g) => {
            const gradeProgress = userProgress.progress[g];
            const chapters = gradeProgress?.chapters || {};
            const completedChapters = Object.values(chapters).filter(c => c.passed).length;

            return (
              <Link
                key={g}
                to={`/grade/${g}`}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  g === grade 
                    ? 'bg-white/20 border-yellow-400/50' 
                    : 'bg-white/10 border-white/20 hover:border-white/40'
                }`}
              >
                <div className="text-center relative">
                  <div className={`text-2xl font-bold ${g === grade ? 'text-yellow-400' : 'text-white'}`}>
                    {g}年级
                  </div>
                  <div className="flex items-center justify-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= Math.min(completedChapters * 0.5, 5) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 知识点分类展示 */}
        <div className="space-y-6">
          {knowledgeChapters.map((chapter) => (
            <div key={chapter.id} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
              <div className="p-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">{chapter.name}</h2>
                  <span className="text-white/60 text-sm">{chapter.topics.length}种题型</span>
                </div>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {chapter.topics.map((topic) => {
                  const progress = getTopicProgress(topic.id);
                  const completed = progress.completed > 0;
                  const stars = progress.stars;

                  return (
                    <Link
                      key={topic.id}
                      to={`/topic/${grade}/${topic.id}`}
                      className={`p-3 rounded-xl border transition-all duration-300 hover:scale-102 ${
                        completed 
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50' 
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {completed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-white/30"></div>
                          )}
                          <span className="text-white font-medium text-sm">{topic.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          topic.difficulty === 1 ? 'bg-green-500/20 text-green-400' :
                          topic.difficulty === 2 ? 'bg-blue-500/20 text-blue-400' :
                          topic.difficulty === 3 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {difficultyLabels[topic.difficulty]}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs mb-2">{topic.description}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`}
                          />
                        ))}
                        <span className="text-white/40 text-xs ml-1">
                          {progress.completed > 0 ? `${progress.completed}题已做` : '未开始'}
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
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            学习进度
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {knowledgeChapters.flatMap(chapter => 
              chapter.topics.map(topic => {
                const topicProgress = userProgress.progress[grade]?.topics?.[topic.id];
                return (
                  <div key={topic.id} className="text-center">
                    <div className="text-white font-medium text-sm truncate">{topic.name}</div>
                    <div className="text-white/60 text-xs">{topicProgress?.completed || 0}题</div>
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

import { Link } from 'react-router-dom';
import { Star, Trophy, BookOpen, Target, Zap, Rocket, Gamepad2, BookMarked, AlertCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const { userProgress } = useGameStore();

  const features = [
    {
      icon: Gamepad2,
      title: '闯关学习',
      description: '像玩游戏一样学习奥数，每一关都是新挑战',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      link: '/grade',
    },
    {
      icon: BookOpen,
      title: '海量题库',
      description: '1-6年级1800+道精选奥数题，从简单到极难',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      link: '/grade',
    },
    {
      icon: Trophy,
      title: '历年真题',
      description: '希望杯、YMO、迎春杯等竞赛真题练习',
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      link: '/exam-questions',
    },
    {
      icon: Target,
      title: '模拟考试',
      description: '智能生成试卷，检验学习成果',
      color: 'bg-gradient-to-br from-green-500 to-teal-500',
      link: '/exam',
    },
    {
      icon: Rocket,
      title: '快速练习',
      description: '随机题目挑战，提升解题能力',
      color: 'bg-gradient-to-br from-orange-500 to-red-500',
      link: '/practice',
    },
    {
      icon: BookMarked,
      title: '学习导航',
      description: '推荐优质奥数学习平台',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      link: '/platforms',
    },
    {
      icon: AlertCircle,
      title: '错题库',
      description: '巩固错题，连续答对3次自动出库',
      color: 'bg-gradient-to-br from-red-500 to-pink-500',
      link: '/wrong-questions',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">奥数闯关王</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">欢迎回来，{userProgress.userName}</span>
            <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm">{userProgress.totalStars}</span>
            </div>
            <div className="text-white/80 text-sm bg-white/10 px-3 py-1.5 rounded-full">
              {userProgress.rank}
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              开启你的
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                {' '}奥数之旅{' '}
              </span>
              吧！
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              专为1-6年级小学生设计的趣味奥数学习平台，让数学学习变得像游戏一样有趣！
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4, 5, 6].map((grade) => {
              const gradeProgress = userProgress.progress[grade];
              const chapters = gradeProgress?.chapters || {};
              const completedChapters = Object.values(chapters).filter(c => c.passed).length;
              const totalChapters = 10;
              
              return (
                <Link
                  key={grade}
                  to={`/grade/${grade}`}
                  className="p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{grade}年级</div>
                    <div className="flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= Math.min(completedChapters * 0.5, 5) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                        />
                      ))}
                    </div>
                    <div className="text-white/60 text-xs mt-2">
                      {completedChapters}/{totalChapters} 章节
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">学习成就</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{userProgress.totalStars}</div>
                <div className="text-white/60 text-sm">获得星星</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {Object.values(userProgress.progress).reduce((sum, grade) => {
                    return sum + Object.values(grade.chapters || {}).filter(c => c.passed).length;
                  }, 0)}
                </div>
                <div className="text-white/60 text-sm">通关章节</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {userProgress.examHistory.length}
                </div>
                <div className="text-white/60 text-sm">参加考试</div>
              </div>
              <Link to="/wrong-questions" className="text-center hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-red-400">
                  {(userProgress.wrongQuestions || []).length}
                </div>
                <div className="text-white/60 text-sm">错题数量</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

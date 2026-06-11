import { Link } from 'react-router-dom';
import { Star, ExternalLink, GraduationCap, BookOpen, Search, Lightbulb, Video, School, Bookmark, Award, Users, Zap } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { platforms } from '@/data/questions';

const iconMap: Record<string, any> = {
  GraduationCap,
  BookOpen,
  Search,
  Lightbulb,
  Video,
  School,
};

export default function Platforms() {
  const { userProgress } = useGameStore();

  const learningResources = [
    {
      icon: Bookmark,
      title: '奥数题库',
      description: '海量精选奥数题目，覆盖各年级各难度',
      link: '/grade',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Award,
      title: '模拟考试',
      description: '智能生成试卷，检验学习成果',
      link: '/exam',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Users,
      title: '学习社区',
      description: '与小伙伴一起学习，共同进步',
      link: '/',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-white hover:text-yellow-400 transition-colors">
          <span className="text-xl font-bold">奥数闯关王</span>
        </Link>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-white">{userProgress.totalStars}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">学习导航</h1>
          <p className="text-white/60">发现更多优质奥数学习平台</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {learningResources.map((resource, index) => (
            <Link
              key={index}
              to={resource.link}
              className="group p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${resource.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <resource.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
              <p className="text-white/60 text-sm">{resource.description}</p>
            </Link>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden mb-8">
          <div className="p-4 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">推荐奥数学习平台</h2>
            <p className="text-white/60 text-sm">以下是一些优质的奥数学习平台，供你参考学习</p>
          </div>
          
          <div className="divide-y divide-white/10">
            {platforms.map((platform, index) => {
              const Icon = iconMap[platform.icon] || BookOpen;
              return (
                <a
                  key={index}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold group-hover:text-yellow-400 transition-colors">
                        {platform.name}
                      </div>
                      <div className="text-white/60 text-sm">{platform.description}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">学习小贴士</h3>
              <ul className="text-white/80 space-y-2 text-sm">
                <li>• 每天坚持练习10-20分钟，效果更好</li>
                <li>• 遇到难题不要放弃，仔细阅读解析</li>
                <li>• 多做举一反三的练习，加深理解</li>
                <li>• 定期参加模拟考试，检验学习成果</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

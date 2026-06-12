import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, BookOpen, Lightbulb, Target, Play, ChevronLeft, CheckCircle, XCircle, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getTopicById } from '@/data/knowledge';
import { getQuestionsByTopic } from '@/data/questions';
import { sound, isMuted, toggleMute } from '@/utils/sound';
import { difficultyLabels } from '@/data/knowledge';
import { getTopicTeaching, getFallbackTeaching } from '@/data/teaching/topicTeaching';

const DIFFICULTY_EMOJIS = ['🌱', '🌿', '🔥', '💎'];

export default function LearnTopic() {
  const { grade: gradeParam, topicId: topicIdParam } = useParams<{ grade: string; topicId: string }>();
  const grade = gradeParam ? parseInt(gradeParam) : 1;
  const topicId = topicIdParam ? parseInt(topicIdParam) : 1;
  const navigate = useNavigate();
  const { userProgress } = useGameStore();
  const [muted, setMuted] = useState(() => isMuted());
  const [currentStep, setCurrentStep] = useState(0); // 0=概念, 1=方法, 2=例题, 3=口诀, 4=开始练习

  const topic = getTopicById(grade, topicId);
  const questions = getQuestionsByTopic(grade, topicId);
  const firstWithTeaching = questions.find(q => q.teaching);

  // 获取完整的教学内容（优先级：题目数据 > 教学数据库 > 兜底生成）
  const teaching = useMemo(() => {
    const topicName = topic?.name || '';
    const desc = topic?.description || '';
    // 优先用题目内嵌的teaching数据
    if (firstWithTeaching?.teaching) return firstWithTeaching.teaching;
    // 其次用教学数据库
    const dbTeaching = getTopicTeaching(grade, topicId);
    if (dbTeaching) return dbTeaching;
    // 最后用兜底生成
    return getFallbackTeaching(topicName, desc);
  }, [grade, topicId, topic, firstWithTeaching]);

  const handleMuteToggle = () => {
    setMuted(toggleMute());
  };

  // 学习步骤
  const steps = [
    {
      icon: '📖',
      title: '概念讲解',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: '🧠',
      title: '解题方法',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: '📝',
      title: '例题示范',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: '🎵',
      title: '记忆口诀',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: '🚀',
      title: '开始练习',
      color: 'from-red-400 to-pink-500',
    },
  ];

  const difficultyColor = topic?.difficulty === 1 ? 'text-green-400' :
    topic?.difficulty === 2 ? 'text-blue-400' :
    topic?.difficulty === 3 ? 'text-orange-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 导航栏 */}
      <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <Link to={`/learn/${grade}`} className="text-white/80 hover:text-yellow-400 transition-colors font-bold flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          返回学习中心
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={handleMuteToggle} className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
            {muted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
          </button>
          <div className="flex items-center gap-1.5 bg-yellow-400/20 px-3 py-1.5 rounded-full border border-yellow-400/30">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{userProgress.totalStars}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
        {/* 知识点头部 */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl bg-gradient-to-br ${steps[0].color}`}>
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              {topic?.name || '知识点学习'}
              <span className={difficultyColor}>{DIFFICULTY_EMOJIS[(topic?.difficulty || 1) - 1]} {difficultyLabels[topic?.difficulty || 1]}</span>
            </h1>
            <p className="text-white/50 text-sm">{topic?.description}</p>
          </div>
        </div>

        {/* 学习进度条 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`flex-1 flex items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                  idx === currentStep
                    ? 'bg-white/15 border-yellow-400/50 scale-[1.02]'
                    : idx < currentStep
                    ? 'bg-green-500/10 border-green-400/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-lg">{step.icon}</span>
                <span className={`text-xs font-bold ${
                  idx === currentStep ? 'text-white' : idx < currentStep ? 'text-green-400' : 'text-white/40'
                }`}>{step.title}</span>
                {idx < currentStep && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* 学习卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 overflow-hidden mb-6 min-h-[300px]">
          {/* 步骤0: 概念讲解 */}
          {currentStep === 0 && (
            <div className="p-6 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">📖 概念讲解</h2>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 mb-4">
                <p className="text-white/80 text-lg leading-relaxed">
                  {teaching.concept}
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-white/40 text-xs mb-2">💡 核心要点</div>
                <p className="text-white/60 text-sm">
                  {topic?.description || '认真理解概念，你会掌握这个知识点的！'}
                </p>
              </div>
              <button
                onClick={() => { sound.navigate(); setCurrentStep(1); }}
                className="mt-4 w-full py-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                下一步：解题方法 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 步骤1: 解题方法 */}
          {currentStep === 1 && (
            <div className="p-6 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">🧠 解题方法</h2>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5 mb-4">
                <p className="text-white/80 text-lg leading-relaxed font-bold">
                  {teaching.method}
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-white/40 text-xs mb-2">📝 关键方法</div>
                <p className="text-white/50 text-sm">掌握上面的方法，你就能解决这类问题啦！</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(0); }}
                  className="flex-1 py-3 bg-white/10 rounded-2xl text-white font-bold hover:bg-white/20 transition-colors"
                >
                  ← 上一步
                </button>
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(2); }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  下一步：例题示范 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 步骤2: 例题示范 */}
          {currentStep === 2 && (
            <div className="p-6 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">📝 例题示范</h2>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 mb-4">
                  <div className="text-white/40 text-xs mb-2">📐 例题</div>
                  <p className="text-white/80 text-lg mb-4">{teaching.example}</p>
                  {teaching.steps && teaching.steps.length > 0 && (
                    <div>
                      <div className="text-white/40 text-xs mb-2">📋 分步解析</div>
                      <div className="space-y-2">
                        {teaching.steps.map((step: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-white/70 text-sm bg-white/5 p-2 rounded-xl">
                            <span className="text-green-400 font-bold flex-shrink-0">{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(1); }}
                  className="flex-1 py-3 bg-white/10 rounded-2xl text-white font-bold hover:bg-white/20 transition-colors"
                >
                  ← 上一步
                </button>
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(3); }}
                  className="flex-1 py-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  下一步：记忆口诀 <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 步骤3: 记忆口诀 */}
          {currentStep === 3 && (
            <div className="p-6 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <h2 className="text-xl font-bold text-white">🎵 记忆口诀</h2>
              </div>
              <div className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-2xl p-6 mb-4 text-center">
                <div className="text-6xl mb-3">🎶</div>
                <p className="text-white font-bold text-xl leading-relaxed">
                  {teaching.memory}
                </p>
              </div>
              <p className="text-white/40 text-sm text-center mb-4">大声读三遍这个口诀，做题的时候就不会忘记啦！</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(2); }}
                  className="flex-1 py-3 bg-white/10 rounded-2xl text-white font-bold hover:bg-white/20 transition-colors"
                >
                  ← 上一步
                </button>
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(4); }}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  开始练习！ <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 步骤4: 开始练习 */}
          {currentStep === 4 && (
            <div className="p-6 animate-[fadeIn_0.3s_ease] text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-extrabold text-white mb-2">学完了，来练练手吧！</h2>
              <p className="text-white/50 mb-6">你已经了解了知识点、解题方法和记忆口诀，现在去实战吧！</p>
              <div className="flex gap-3 justify-center">
                <Link
                  to={`/topic/${grade}/${topicId}`}
                  onClick={() => sound.navigate()}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl text-white font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5" />
                  🚀 开始练习
                </Link>
              </div>
              <button
                onClick={() => { sound.navigate(); setCurrentStep(0); }}
                className="mt-4 text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                ← 重新学习
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

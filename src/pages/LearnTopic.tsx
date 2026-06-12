import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Star, BookOpen, Lightbulb, Target, Play, ChevronLeft, CheckCircle, XCircle, Volume2, VolumeX, ArrowRight, Square } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getTopicById, difficultyLabels } from '@/data/knowledge';
import { getQuestionsByTopic } from '@/data/questions';
import { sound, isMuted, toggleMute, speak, speakStop } from '@/utils/sound';
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
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const topic = getTopicById(grade, topicId);
  const questions = getQuestionsByTopic(grade, topicId);
  const firstWithTeaching = questions.find(q => q.teaching);

  // 获取完整的教学内容（优先级：题目数据 > 教学数据库 > 兜底生成）
  const teaching = useMemo(() => {
    const topicName = topic?.name || '';
    if (firstWithTeaching?.teaching) return firstWithTeaching.teaching;
    const dbTeaching = getTopicTeaching(grade, topicId);
    if (dbTeaching) return dbTeaching;
    return getFallbackTeaching(topicName, topic?.description || '');
  }, [grade, topicId, topic, firstWithTeaching]);

  const handleMuteToggle = () => {
    setMuted(toggleMute());
  };

  // 播放指定文本的语音
  const handleSpeak = (key: string, text: string) => {
    sound.click();
    if (speakingKey === key) {
      speakStop();
      setSpeakingKey(null);
    } else {
      speak(text, { onEnd: () => setSpeakingKey(null) });
      setSpeakingKey(key);
    }
  };

  // 切换步骤时停止朗读
  useEffect(() => {
    speakStop();
    setSpeakingKey(null);
  }, [currentStep]);

  useEffect(() => {
    return () => speakStop();
  }, []);

  const isSpeak = (key: string) => speakingKey === key;

  // 朗读按钮组件
  const SpeakButton = ({ textKey, text, label = '朗读' }: { textKey: string; text: string; label?: string }) => {
    const playing = isSpeak(textKey);
    return (
      <button
        onClick={(e) => { e.stopPropagation(); handleSpeak(textKey, text); }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-extrabold transition-all border-2 ${
          playing
            ? 'bg-yellow-400 text-slate-900 border-yellow-400 animate-pulse shadow-lg shadow-yellow-400/30'
            : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/15 hover:border-yellow-400/40 hover:text-yellow-400'
        }`}
      >
        {playing ? (
          <><Square className="w-5 h-5 fill-current" /> 停止</>
        ) : (
          <><Volume2 className="w-5 h-5" /> {label}</>
        )}
      </button>
    );
  };

  const difficultyColor = topic?.difficulty === 1 ? 'text-green-400' :
    topic?.difficulty === 2 ? 'text-blue-400' :
    topic?.difficulty === 3 ? 'text-orange-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-x-hidden">
      {/* 简化的背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* 导航栏 */}
      <nav className="max-w-4xl mx-auto px-5 py-5 flex items-center justify-between relative z-10">
        <Link to={`/learn/${grade}`} className="text-white/80 hover:text-yellow-400 transition-colors font-extrabold flex items-center gap-2 text-lg">
          <ChevronLeft className="w-6 h-6" />
          返回学习中心
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={handleMuteToggle} className="w-11 h-11 bg-white/10 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center">
            {muted ? <VolumeX className="w-6 h-6 text-white/50" /> : <Volume2 className="w-6 h-6 text-yellow-400" />}
          </button>
          <div className="flex items-center gap-2 bg-yellow-400/20 px-4 py-2.5 rounded-2xl border border-yellow-400/30">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-extrabold text-lg">{userProgress.totalStars}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-4 relative z-10">
        {/* 知识点头部 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{topic?.name.includes('计算') ? '🔢' : topic?.name.includes('图形') ? '📐' : topic?.name.includes('应用') ? '📝' : topic?.name.includes('逻辑') ? '🧠' : '📖'}</div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            {topic?.name || '知识点学习'}
          </h1>
          <div className={`text-lg font-bold ${difficultyColor} mb-2`}>
            {DIFFICULTY_EMOJIS[(topic?.difficulty || 1) - 1]} {difficultyLabels[topic?.difficulty || 1]}
          </div>
          <p className="text-white/60 text-base max-w-2xl mx-auto">{topic?.description}</p>
        </div>

        {/* 学习进度条 - 大按钮 */}
        <div className="mb-7 bg-white/5 rounded-3xl p-4 border-2 border-white/10">
          <div className="grid grid-cols-5 gap-3">
            {[
              { icon: '📖', title: '概念' },
              { icon: '🧠', title: '方法' },
              { icon: '📝', title: '例题' },
              { icon: '🎵', title: '口诀' },
              { icon: '🚀', title: '练习' },
            ].map((step, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-1 ${
                  idx === currentStep
                    ? 'bg-white/15 border-yellow-400/50 shadow-lg shadow-yellow-500/10 scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:scale-[1.03]'
                }`}
              >
                <span className="text-2xl md:text-3xl">{step.icon}</span>
                <span className={`text-sm md:text-base font-extrabold ${idx === currentStep ? 'text-yellow-400' : 'text-white/70'}`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 学习内容卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 overflow-hidden mb-8 min-h-[400px]">
          {/* 步骤0: 概念讲解 */}
          {currentStep === 0 && (
            <div className="p-7 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📖</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">概念讲解</h2>
                <div className="ml-auto">
                  <SpeakButton textKey="concept" text={`概念讲解。${teaching.concept}`} label="朗读" />
                </div>
              </div>
              <div className={`rounded-3xl p-6 mb-5 border-2 transition-colors ${isSpeak('concept') ? 'bg-blue-500/20 border-yellow-400/50' : 'bg-blue-500/10 border-blue-500/30'}`}>
                <p className="text-white/90 text-xl leading-relaxed">
                  {teaching.concept}
                </p>
              </div>
              <button
                onClick={() => { sound.navigate(); setCurrentStep(1); }}
                className="w-full py-5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl text-white text-lg font-extrabold hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                下一步：解题方法 <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* 步骤1: 解题方法 */}
          {currentStep === 1 && (
            <div className="p-7 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🧠</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">解题方法</h2>
                <div className="ml-auto">
                  <SpeakButton textKey="method" text={`解题方法。${teaching.method}`} label="读方法" />
                </div>
              </div>
              <div className={`rounded-3xl p-6 mb-5 border-2 transition-colors ${isSpeak('method') ? 'bg-purple-500/20 border-yellow-400/50' : 'bg-purple-500/10 border-purple-500/30'}`}>
                <p className="text-white/90 text-xl leading-relaxed font-bold">
                  {teaching.method}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(0); }}
                  className="flex-1 py-5 bg-white/10 rounded-3xl text-white text-lg font-extrabold hover:bg-white/20 transition-colors"
                >
                  ← 上一步
                </button>
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(2); }}
                  className="flex-1 py-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl text-white text-lg font-extrabold hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  下一步：例题 <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* 步骤2: 例题示范 */}
          {currentStep === 2 && (
            <div className="p-7 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📝</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">例题示范</h2>
                <div className="ml-auto">
                  <SpeakButton textKey="example-all" text={`例题。${teaching.example}。${teaching.steps ? teaching.steps.map((s: string, i: number) => `第${i + 1}步，${s}`).join('，') : ''}`} label="读全部" />
                </div>
              </div>

              {/* 例题内容 */}
              <div className="rounded-3xl p-6 mb-4 border-2 border-green-500/30 bg-green-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">📐</span>
                  <span className="text-xl font-extrabold text-white">例题</span>
                  <div className="ml-auto">
                    <SpeakButton textKey="example-q" text={`例题题目。${teaching.example}`} label="读题目" />
                  </div>
                </div>
                <p className="text-white/90 text-xl mb-2 leading-relaxed">{teaching.example}</p>
              </div>

              {/* 分步解析 */}
              {teaching.steps && teaching.steps.length > 0 && (
                <div className="rounded-3xl p-6 mb-5 border-2 border-white/20 bg-white/5">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl">💡</span>
                    <span className="text-xl font-extrabold text-white">分步解析</span>
                    <div className="ml-auto">
                      <SpeakButton textKey="example-steps" text={`分步解析。${teaching.steps.map((s: string, i: number) => `第${i + 1}步，${s}`).join('。')}`} label="读解析" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {teaching.steps.map((step: string, idx: number) => (
                      <div key={idx} className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-colors ${isSpeak(`step-${idx}`) ? 'bg-yellow-400/15 border-yellow-400/50' : 'bg-white/5 border-white/10'}`}>
                        <div className="text-3xl font-extrabold text-yellow-400 flex-shrink-0 w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <p className="text-white/90 text-lg leading-relaxed flex-1">{step}</p>
                        <SpeakButton textKey={`step-${idx}`} text={`第${idx + 1}步，${step}`} label="读" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(1); }}
                  className="flex-1 py-5 bg-white/10 rounded-3xl text-white text-lg font-extrabold hover:bg-white/20 transition-colors"
                >
                  ← 上一步
                </button>
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(3); }}
                  className="flex-1 py-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl text-white text-lg font-extrabold hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  下一步：口诀 <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* 步骤3: 记忆口诀 */}
          {currentStep === 3 && (
            <div className="p-7 animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🎵</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">记忆口诀</h2>
                <div className="ml-auto">
                  <SpeakButton textKey="memory" text={`记忆口诀。${teaching.memory}`} label="读口诀" />
                </div>
              </div>
              <div className={`rounded-3xl p-10 mb-5 text-center border-2 transition-colors ${isSpeak('memory') ? 'bg-gradient-to-br from-yellow-400/25 to-orange-500/25 border-yellow-400/60' : 'bg-gradient-to-br from-yellow-400/15 to-orange-500/15 border-yellow-400/30'}`}>
                <div className={`text-7xl mb-4 transition-transform ${isSpeak('memory') ? 'animate-bounce' : ''}`}>🎶</div>
                <p className="text-white/90 text-2xl font-extrabold leading-relaxed">
                  {teaching.memory}
                </p>
              </div>
              <p className="text-center text-white/60 text-lg mb-5">跟着一起念三遍，做题的时候就不会忘啦！</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(2); }}
                  className="flex-1 py-5 bg-white/10 rounded-3xl text-white text-lg font-extrabold hover:bg-white/20 transition-colors"
                >
                  ← 上一步
                </button>
                <button
                  onClick={() => { sound.navigate(); setCurrentStep(4); }}
                  className="flex-1 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl text-white text-lg font-extrabold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  开始练习！ <Play className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* 步骤4: 开始练习 */}
          {currentStep === 4 && (
            <div className="p-7 animate-[fadeIn_0.3s_ease] text-center">
              <div className="text-8xl mb-6">🚀</div>
              <h2 className="text-3xl font-extrabold text-white mb-3">学完了，来练练手吧！</h2>
              <p className="text-white/60 text-lg mb-8">你已经了解了知识点、解题方法和记忆口诀，现在去实战吧！</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={`/topic/${grade}/${topicId}`}
                  onClick={() => sound.navigate()}
                  className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl text-white text-xl font-extrabold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Play className="w-7 h-7" />
                  🚀 开始练习
                </Link>
              </div>
              <button
                onClick={() => { sound.navigate(); setCurrentStep(0); }}
                className="mt-6 text-white/40 hover:text-yellow-400 text-base font-bold transition-colors"
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

/**
 * 关卡教学引入 —— 用故事对话+动画把知识点先讲清楚
 * 孩子在理解概念后，才有信心进入练习环节
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import type { AdventureStage, AdventureWorld } from '@/data/adventure/types';
import type { Question } from '@/data/questions/types';

interface Props {
  world: AdventureWorld;
  stage: AdventureStage;
  questions: Question[];
  onStart: () => void;
}

// 每个世界的角色对话风格
const WORLD_CHARACTERS: Record<string, { name: string; emoji: string; speakStyle: string }> = {
  world_1:  { name: '跳跳兔', emoji: '🐰', speakStyle: '蹦蹦跳跳' },
  world_2:  { name: '巧巧狸', emoji: '🦊', speakStyle: '笑眯眯' },
  world_3:  { name: '闹闹钟', emoji: '⏰', speakStyle: '滴滴答答' },
  world_4:  { name: '量量熊', emoji: '🐻', speakStyle: '仔细' },
  world_5:  { name: '拼拼猫', emoji: '🐱', speakStyle: '歪着头' },
  world_6:  { name: '谜谜龟', emoji: '🐢', speakStyle: '慢悠悠' },
  world_7:  { name: '飞飞鹰', emoji: '🦅', speakStyle: '展翅' },
  world_8:  { name: '智智狐', emoji: '🦉', speakStyle: '眨眨眼' },
  world_9:  { name: '量量尺', emoji: '📐', speakStyle: '精准' },
  world_10: { name: '买买熊', emoji: '🧸', speakStyle: '掂着钱包' },
  world_11: { name: '冲冲鹅', emoji: '🦆', speakStyle: '兴冲冲' },
  world_12: { name: '算算星', emoji: '⭐', speakStyle: '闪光' },
  world_13: { name: '衡衡象', emoji: '⚖️', speakStyle: '稳稳' },
  world_14: { name: '图图鹦', emoji: '🦜', speakStyle: '叽叽喳喳' },
  world_15: { name: '终极龙', emoji: '🐲', speakStyle: '威严' },
};

// 教学步骤
interface TeachStep {
  id: number;
  type: 'greeting' | 'concept' | 'example' | 'tip' | 'go';
  content: string;
}

export default function StageTeaching({ world, stage, questions, onStart }: Props) {
  const [step, setStep] = useState(0);
  const char = WORLD_CHARACTERS[world.id] || { name: '向导', emoji: '🧚', speakStyle: '笑眯眯' };

  // 从第一道题的教学内容中提取
  const firstTeaching = questions[0]?.teaching;
  const isBoss = stage.type === 'boss';

  const steps: TeachStep[] = useMemo(() => {
    const s: TeachStep[] = [];

    if (isBoss) {
      // Boss关：战前动员
      s.push({
        id: 0, type: 'greeting',
        content: stage.enemyName || 'Boss',
      });
      s.push({
        id: 1, type: 'concept',
        content: `勇敢的冒险者！${stage.enemyName} 就在前方，准备好用你学过的所有知识来挑战它了吗？`,
      });
      s.push({
        id: 2, type: 'tip',
        content: stage.tip || '回想之前学过的技巧，每道题都是你的武器！',
      });
      s.push({ id: 3, type: 'go', content: '' });
    } else {
      // 普通关：故事教学
      s.push({
        id: 0, type: 'greeting',
        content: `欢迎来到「${stage.name}」！我是${char.name}～`,
      });

      if (firstTeaching?.point) {
        s.push({
          id: 1, type: 'concept',
          content: firstTeaching.point,
        });
      } else {
        s.push({
          id: 1, type: 'concept',
          content: stage.description,
        });
      }

      if (firstTeaching?.method) {
        s.push({
          id: 2, type: 'example',
          content: firstTeaching.method,
        });
      }

      if (firstTeaching?.memory) {
        s.push({
          id: 3, type: 'tip',
          content: `记住这个小口诀：${firstTeaching.memory}`,
        });
      } else if (stage.tip) {
        s.push({
          id: 3, type: 'tip',
          content: `小技巧：${stage.tip}`,
        });
      }

      s.push({ id: s.length, type: 'go', content: '' });
    }

    return s;
  }, [stage, firstTeaching, isBoss, char]);

  const current = steps[step];
  if (!current) return null;

  const stepTypeConfig = {
    greeting: {
      icon: world.emoji || char.emoji,
      bgColor: `rgba(15,23,42,0.85)`,
      borderColor: `${world.themeColor}80`,
      title: isBoss ? '⚠️ Boss 挑战' : `📖 ${stage.name}`,
    },
    concept: {
      icon: '📖',
      bgColor: 'rgba(15,23,42,0.85)',
      borderColor: 'rgba(59,130,246,0.6)',
      title: '💡 今天学什么？',
    },
    example: {
      icon: '✏️',
      bgColor: 'rgba(15,23,42,0.85)',
      borderColor: 'rgba(34,197,94,0.6)',
      title: '🎯 怎么解题？',
    },
    tip: {
      icon: '💎',
      bgColor: 'rgba(15,23,42,0.85)',
      borderColor: 'rgba(251,191,36,0.6)',
      title: '✨ 记住诀窍！',
    },
    go: {
      icon: '⚔️',
      bgColor: 'rgba(15,23,42,0.85)',
      borderColor: 'rgba(239,68,68,0.6)',
      title: isBoss ? '⚔️ 准备战斗！' : '🚀 准备好了吗？',
    },
  };

  const config = stepTypeConfig[current.type];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-950"
      style={{ background: `linear-gradient(180deg, #0f172a 0%, ${world.themeColor}15 30%, #0f172a 100%)` }}
    >
      {/* 标题 */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-3">{world.emoji}</div>
        <h1 className="text-3xl font-black text-white mb-1">{world.name}</h1>
        <p className="text-white/70 text-sm">{world.subtitle}</p>
      </motion.div>

      {/* 进度步骤指示器 */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ scale: 0.8 }}
            animate={{
              scale: i === step ? 1.2 : 0.8,
              opacity: i === step ? 1 : i < step ? 0.5 : 0.25,
            }}
            className={`w-2.5 h-2.5 rounded-full ${
              i <= step ? 'bg-amber-400' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* 教学卡片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ x: 80, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full max-w-md"
        >
          {/* 步骤标签 */}
          <div className="text-center mb-3">
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: `rgba(15,23,42,0.7)`, color: '#fff', border: `2px solid ${world.themeColor}80` }}
            >
              {config.title}
            </span>
          </div>

          <div
            className="rounded-3xl p-6 border backdrop-blur-xl"
            style={{ backgroundColor: config.bgColor, borderColor: config.borderColor }}
          >
            {current.type === 'go' ? (
              /* 出发按钮 */
              <div className="text-center py-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  {char.emoji}
                </motion.div>
                <p className="text-white text-xl font-extrabold mb-4">
                  {isBoss
                    ? `准备好了就去击败 ${stage.enemyName} 吧！`
                    : '准备好去闯关了吗？'}
                </p>
                <p className="text-white/60 text-sm mb-6">
                  {isBoss ? '5道综合挑战等着你！' : '5道小测验，轻松搞定～'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onStart}
                  className="px-10 py-4 rounded-2xl font-black text-lg shadow-2xl flex items-center gap-2 mx-auto"
                  style={{
                    background: `linear-gradient(135deg, ${world.themeColor}, ${world.lightColor})`,
                    color: '#fff',
                  }}
                >
                  {isBoss ? '⚔️ 开战！' : '🎮 开始闯关！'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              /* 对话卡片 */
              <div>
                {/* 角色对话 */}
                {current.type === 'greeting' && (
                  <div className="flex items-start gap-3 mb-4">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl flex-shrink-0"
                    >
                      {char.emoji}
                    </motion.div>
                    <div
                      className="flex-1 rounded-2xl p-4 relative"
                      style={{ backgroundColor: `rgba(15,23,42,0.7)`, border: `1px solid ${world.themeColor}40` }}
                    >
                      <div
                        className="absolute left-[-6px] top-4 w-3 h-3 rotate-45"
                        style={{ backgroundColor: `rgba(15,23,42,0.7)`, borderLeft: `1px solid ${world.themeColor}40`, borderBottom: `1px solid ${world.themeColor}40` }}
                      />
                      <p className="text-white font-bold text-base leading-relaxed">
                        {char.speakStyle}地说：<span className="font-bold text-yellow-300">{config.title.replace('📖 ', '')}</span>！
                      </p>
                    </div>
                  </div>
                )}

                {/* 教学内容 */}
                <div className="text-white text-lg leading-relaxed font-bold">
                  {current.content}
                </div>

                {/* 知识图标 */}
                {current.type !== 'greeting' && (
                  <div className="flex justify-center mt-4">
                    <motion.span
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl"
                    >
                      {config.icon}
                    </motion.span>
                  </div>
                )}

                {/* 继续按钮 */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(prev => prev + 1)}
                  className="w-full mt-5 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: `${world.themeColor}50`,
                    color: '#fff',
                    border: `2px solid ${world.themeColor}80`,
                  }}
                >
                  {step < steps.length - 2 ? '知道了，继续 →' : '准备好啦！'}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 跳过按钮 */}
      {current.type !== 'go' && (
        <button
          onClick={onStart}
          className="mt-6 text-white/50 hover:text-white/80 text-xs transition-colors font-bold"
        >
          跳过教学，直接答题 →
        </button>
      )}
    </div>
  );
}

/**
 * 冒险关卡页面 —— 真正的游戏化学习体验
 * 
 * 流程：教学引入 → 答题练习 → 宝箱结算 → 结果展示
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Star, Zap, CheckCircle, XCircle,
  Lightbulb, Swords, Gem, Home, Trophy, Timer, Sparkles, Shield
} from 'lucide-react';
import { getQuestionById } from '@/data/questions';
import { getStageById, getWorldById } from '@/data/adventure/adventureData';
import type { Question } from '@/data/questions/types';
import { useAdventureStore } from '@/store/adventureStore';
import { useGameStore } from '@/store/gameStore';
import ConfettiEffect from '@/components/ConfettiEffect';
import RankUpModal from '@/components/RankUpModal';
import TreasureChest from '@/components/adventure/TreasureChest';
import StageTeaching from '@/components/adventure/StageTeaching';
import ItemBar from '@/components/adventure/ItemBar';
import { CHEER_CORRECT, CHEER_WRONG, COMBO_MSGS, getComboEffect } from '@/data/adventure/items';

export default function AdventureStage() {
  const { stageId } = useParams<{ stageId: string }>();
  const { progress, completeStage, isStageCompleted, useItem, getItemCount } = useAdventureStore();
  const { updateQuestionProgress, addWrongQuestion, recordAnswer, rankJustChanged, clearRankChanged, userProgress } = useGameStore();

  const stage = useMemo(() => stageId ? getStageById(stageId) : undefined, [stageId]);
  const world = useMemo(() => stage ? getWorldById(stage.worldId) : undefined, [stage]);

  // 游戏状态
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTeaching, setShowTeaching] = useState(false);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [stageComplete, setStageComplete] = useState(false);
  const [stageFailed, setStageFailed] = useState(false);
  const [encourageMsg, setEncourageMsg] = useState('');
  const [startTime] = useState(Date.now());
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);
  const [enemyHP, setEnemyHP] = useState(100);
  // 🆕 结算分两阶段：先宝箱 → 再最终面板
  const [treasureOpened, setTreasureOpened] = useState(false);
  const [finalGems, setFinalGems] = useState(0);
  const [finalStars, setFinalStars] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  // 🆕 道具状态
  const [shieldActive, setShieldActive] = useState(false);       // 守护盾
  const [starActive, setStarActive] = useState(false);            // 智慧星
  const [crystalUsed, setCrystalUsed] = useState<string[]>([]);   // 预知水晶消除的选项
  const [retryActive, setRetryActive] = useState(false);          // 重生羽毛-可重答
  const [showItemFeedback, setShowItemFeedback] = useState('');   // 道具使用反馈

  // 🆕 关卡阶段：先教学，再练习
  const [phase, setPhase] = useState<'teaching' | 'practice'>('teaching');

  const isBoss = stage?.type === 'boss';
  const currentQuestion = questions[currentIdx];

  // 加载题目
  useEffect(() => {
    if (!stage) return;
    const qs = stage.questionIds
      .map(id => getQuestionById(id))
      .filter((q): q is Question => q !== undefined);
    setQuestions(qs);
  }, [stage]);

  // 段位升级监听
  useEffect(() => {
    if (rankJustChanged) setShowRankUp(true);
  }, [rankJustChanged]);

  // 敌人血量
  useEffect(() => {
    if (!isBoss) return;
    const total = questions.length;
    if (total === 0) return;
    const hp = Math.max(0, 100 - Math.round((correctCount / total) * 100));
    setEnemyHP(hp);
  }, [correctCount, questions.length, isBoss]);

  // 🆕 道具使用处理
  const handleItemUse = useCallback((itemId: string): boolean => {
    if (itemId === 'item_shield') {
      if (shieldActive) return false;
      const ok = useItem(itemId);
      if (ok) { setShieldActive(true); setShowItemFeedback('🛡️ 守护盾已激活！下次答错不扣命'); }
      return ok;
    }
    if (itemId === 'item_star') {
      if (starActive) return false;
      const ok = useItem(itemId);
      if (ok) { setStarActive(true); setShowTeaching(true); setShowItemFeedback('💡 智慧星已点亮！'); }
      return ok;
    }
    if (itemId === 'item_crystal') {
      if (crystalUsed.length > 0 || !currentQuestion || currentQuestion.type !== 'choice') return false;
      const ok = useItem(itemId);
      if (ok && currentQuestion.options && currentQuestion.answer) {
        // 排除2个错误选项
        const correctLetter = currentQuestion.answer.toUpperCase();
        const allLetters = currentQuestion.options.map((_, i) => String.fromCharCode(65 + i));
        const wrongLetters = allLetters.filter(l => l !== correctLetter);
        // 随机选2个排除
        const toHide = wrongLetters.sort(() => Math.random() - 0.5).slice(0, Math.min(2, wrongLetters.length));
        setCrystalUsed(toHide);
        setShowItemFeedback('🔮 迷雾散开！');
      }
      return ok;
    }
    if (itemId === 'item_retry') {
      if (retryActive) return false;
      const ok = useItem(itemId);
      if (ok) { setRetryActive(true); setShowItemFeedback('🪶 重生羽毛已准备！答错可以重来'); }
      return ok;
    }
    return false;
  }, [useItem, shieldActive, starActive, crystalUsed, retryActive, currentQuestion]);

  // 答题提交
  const handleSubmit = useCallback(() => {
    if (!currentQuestion || showResult) return;

    let correct = false;
    if (currentQuestion.type === 'choice') {
      correct = userAnswer.toUpperCase() === currentQuestion.answer.toUpperCase();
    } else {
      correct = userAnswer.trim() === currentQuestion.answer.trim();
    }

    setIsCorrect(correct);
    setShowResult(true);
    // 清除道具反馈
    setShowItemFeedback('');

    if (correct) {
      setCorrectCount(prev => prev + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setEncourageMsg(CHEER_CORRECT[Math.floor(Math.random() * CHEER_CORRECT.length)]);
      updateQuestionProgress(currentQuestion.id, true);
      recordAnswer(true);
      setShowConfetti(true);

      // 🆕 连击特殊效果显示
      const comboEff = getComboEffect(newCombo);
      if (comboEff) {
        setEncourageMsg(`${comboEff.emoji} ${COMBO_MSGS[newCombo] || `${newCombo}连击！`}`);
      }
    } else {
      // 🆕 守护盾保护
      if (shieldActive) {
        setShieldActive(false);
        setEncourageMsg('🛡️ 守护盾保护了你！');
        // 不扣命，但也不算对
        setCombo(0);
        updateQuestionProgress(currentQuestion.id, false);
        recordAnswer(false);
        addWrongQuestion({
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          options: currentQuestion.options,
          answer: currentQuestion.answer,
          explanation: currentQuestion.teaching?.point || '',
          type: currentQuestion.type,
          grade: currentQuestion.grade,
          chapter: currentQuestion.chapter,
          difficulty: currentQuestion.difficulty,
          topicId: currentQuestion.topicId,
          topicName: currentQuestion.topicName,
          source: 'practice',
          teaching: currentQuestion.teaching,
        });
        return; // 不继续扣命逻辑
      }

      // 🆕 重生羽毛：可重答
      if (retryActive) {
        setRetryActive(false);
        setEncourageMsg('🪶 重生羽毛发动！再试一次吧');
        setShowResult(false);
        setUserAnswer('');
        setIsCorrect(false);
        return;
      }

      setCombo(0);
      const newLives = lives - 1;
      setLives(newLives);
      setEncourageMsg(CHEER_WRONG[Math.floor(Math.random() * CHEER_WRONG.length)]);
      updateQuestionProgress(currentQuestion.id, false);
      recordAnswer(false);

      addWrongQuestion({
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        options: currentQuestion.options,
        answer: currentQuestion.answer,
        explanation: currentQuestion.teaching?.point || '',
        type: currentQuestion.type,
        grade: currentQuestion.grade,
        chapter: currentQuestion.chapter,
        difficulty: currentQuestion.difficulty,
        topicId: currentQuestion.topicId,
        topicName: currentQuestion.topicName,
        source: 'practice',
        teaching: currentQuestion.teaching,
      });

      if (newLives <= 0) {
        setTimeout(() => setStageFailed(true), 800);
        return;
      }
    }
  }, [currentQuestion, userAnswer, showResult, combo, lives, shieldActive, retryActive]);

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setStageComplete(true);
      return;
    }

    setCurrentIdx(prev => prev + 1);
    setUserAnswer('');
    setShowResult(false);
    setShowTeaching(false);
    setIsCorrect(false);
    setCrystalUsed([]);
    setStarActive(false);
  };

  const handleTreasureDone = () => {
    const stars = correctCount >= 5 ? 3 : correctCount >= 4 ? 2 : correctCount >= 3 ? 1 : 0;
    const gemsEarned = stage ? stage.rewardGems + (stars === 3 ? 10 : 0) : 0;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    setFinalStars(stars);
    setFinalGems(gemsEarned);
    setFinalTime(timeSpent);

    completeStage({
      stageId: stageId || '',
      correct: correctCount,
      total: questions.length,
      stars,
      gemsEarned,
      timeSpent,
    });

    setTreasureOpened(true);
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setUserAnswer('');
    setShowResult(false);
    setShowTeaching(false);
    setIsCorrect(false);
    setLives(3);
    setCombo(0);
    setCorrectCount(0);
    setStageComplete(false);
    setStageFailed(false);
    setEnemyHP(100);
    setShieldActive(false);
    setStarActive(false);
    setCrystalUsed([]);
    setRetryActive(false);
    setPhase('teaching');
  };

  // ====== 加载中 ======
  if (!stage || !world || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          🗺️
        </motion.div>
        <span className="text-white/60 ml-3">正在打开冒险关卡...</span>
      </div>
    );
  }

  // ====== 教学引入阶段 ======
  if (phase === 'teaching') {
    return (
      <StageTeaching
        world={world}
        stage={stage}
        questions={questions}
        onStart={() => setPhase('practice')}
      />
    );
  }

  // ====== 关卡失败画面 ======
  if (stageFailed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 via-slate-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center px-6"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            {isBoss ? stage.enemyEmoji : '😵'}
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-2">
            {isBoss ? `${stage.enemyName} 太强大了！` : '别灰心，勇士！'}
          </h2>
          <p className="text-white/60 mb-2">
            答对了 {correctCount}/{questions.length} 题
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-xl hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              🔄 再来一次
            </button>
            <Link
              to="/adventure"
              className="px-8 py-3 rounded-2xl bg-white/10 text-white/80 font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              返回地图
            </Link>
          </div>
          {/* 提示使用道具 */}
          {getItemCount('item_shield') > 0 && (
            <p className="text-amber-400/70 text-sm mt-4">
              💡 背包里有 🛡️守护盾，下次记得用哦！
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  // ====== 宝箱结算 + 最终画面 ======
  if (stageComplete) {
    if (!treasureOpened) {
      // 第一阶段：开宝箱动画
      const stars = correctCount >= 5 ? 3 : correctCount >= 4 ? 2 : correctCount >= 3 ? 1 : 0;
      const gemsEarned = stage.rewardGems + (stars === 3 ? 10 : 0);
      const isFirstClear = !isStageCompleted(stage.id);

      return (
        <div
          className="min-h-screen flex items-center justify-center px-4"
          style={{ background: `linear-gradient(135deg, ${world.themeColor}20, ${world.themeColor}40, #0f172a)` }}
        >
          <TreasureChest
            stars={stars}
            gems={gemsEarned}
            isFirstClear={isFirstClear}
            items={stars === 3 ? ['🎉', '💎'] : undefined}
            onOpen={handleTreasureDone}
          />
        </div>
      );
    }

    // 第二阶段：结算面板
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: `linear-gradient(135deg, ${world.themeColor}20, ${world.themeColor}40, #0f172a)` }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-sm w-full text-center border border-white/20 shadow-2xl"
        >
          {/* 星星展示 */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <motion.div
                key={s}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: s * 0.2, type: 'spring' }}
              >
                <Star
                  className={`w-12 h-12 ${s <= finalStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                />
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-black text-white mb-1">
            {finalStars === 3 ? '🎉 完美通关！' : finalStars >= 2 ? '✨ 顺利通关！' : '✅ 勉强过关'}
          </h2>

          {/* 统计 */}
          <div className="grid grid-cols-3 gap-3 my-5">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">✅</div>
              <div className="text-lg font-bold text-white">{correctCount}/{questions.length}</div>
              <div className="text-[10px] text-white/50">答对</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">💎</div>
              <div className="text-lg font-bold text-cyan-300">+{finalGems}</div>
              <div className="text-[10px] text-white/50">宝石</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-lg font-bold text-white">{finalTime}s</div>
              <div className="text-[10px] text-white/50">用时</div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 justify-center">
            <Link
              to="/adventure"
              className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all"
            >
              返回地图
            </Link>
            <button
              onClick={handleRetry}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              再玩一次
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ====== 答题界面 ======
  if (!currentQuestion) return null;

  const progressPct = questions.length > 0 ? ((currentIdx) / questions.length) * 100 : 0;
  const comboEffect = getComboEffect(combo);

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-950"
      style={{ background: `linear-gradient(180deg, #0f172a 0%, ${world.themeColor}12 35%, #0f172a 100%)` }}
    >
      {/* 粒子 + 段位 */}
      {showConfetti && <ConfettiEffect count={25} onDone={() => setShowConfetti(false)} />}
      {showRankUp && rankJustChanged && (
        <RankUpModal newRank={rankJustChanged} totalStars={userProgress.totalStars}
          onClose={() => { setShowRankUp(false); clearRankChanged(); }} />
      )}

      {/* 顶部 HUD */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link to="/adventure" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* 关卡信息 */}
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-lg">{world.emoji}</span>
              <span className="text-xs font-bold text-white/80">{world.name}</span>
            </div>
            <div className="text-[10px] text-white/50">{stage.name}</div>
          </div>

          {/* 右侧：道具+生命 */}
          <div className="flex items-center gap-2">
            {/* 🆕 道具背包 */}
            <ItemBar onUseItem={handleItemUse} isChoice={currentQuestion.type === 'choice'} />

            {/* 生命 */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map(h => {
                const filled = h <= lives;
                return (
                  <motion.div
                    key={h}
                    animate={filled ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`w-5 h-5 ${filled ? 'text-red-400 fill-red-400' : 'text-gray-600'}`}
                    />
                  </motion.div>
                );
              })}
              {/* 🆕 护盾指示器 */}
              {shieldActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-1"
                >
                  <Shield className="w-5 h-5 text-cyan-400" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 敌方区域（Boss战） */}
      {isBoss && (
        <div className="max-w-2xl mx-auto w-full px-4 pt-4">
          <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/30">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ y: [0, -5, 0], scale: combo >= 3 ? [1, 1.1, 1] : [1, 1, 1] }}
                transition={{ duration: combo >= 3 ? 0.4 : 2, repeat: Infinity }}
                className="text-5xl"
              >
                {stage.enemyEmoji || '👾'}
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">{stage.enemyName || 'Boss'}</span>
                  <span className="text-xs font-bold text-red-300">{enemyHP}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                    animate={{ width: `${enemyHP}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <motion.div
                animate={combo >= 2 ? { rotate: [0, -15, 15, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Swords className="w-6 h-6 text-amber-400" />
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 连击/道具反馈 */}
      <AnimatePresence>
        {(combo >= 2 || showItemFeedback) && (
          <div className="max-w-2xl mx-auto w-full px-4 pt-2">
            <motion.div
              key={combo >= 2 ? 'combo' : 'item'}
              initial={{ scale: 0.5, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center"
            >
              {showItemFeedback ? (
                <span className="text-sm font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full">
                  {showItemFeedback}
                </span>
              ) : comboEffect && (
                <motion.span
                  animate={{ scale: [1, comboEffect.scale, 1] }}
                  transition={{ duration: 0.4 }}
                  className="inline-block text-lg font-black"
                  style={{ color: comboEffect.color }}
                >
                  {comboEffect.emoji} {COMBO_MSGS[combo] || `${combo}连击！`} {comboEffect.emoji}
                </motion.span>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 题目区域 */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4 overflow-y-auto">
        {/* 进度条 */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50 font-bold">
            第 {currentIdx + 1}/{questions.length} 题
          </span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: world.themeColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-white/50">✅ {correctCount}</span>
        </div>

        {/* 🆕 智慧星提示（道具激活时显示） */}
        {starActive && stage.tip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-amber-500/20 rounded-2xl p-3 border border-amber-400/30"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <span className="text-amber-300 text-sm font-bold">{stage.tip}</span>
            </div>
          </motion.div>
        )}

        {/* 题目卡片 */}
        <motion.div
          key={currentIdx}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/90 backdrop-blur-md rounded-3xl p-6 border border-slate-600/30 shadow-2xl"
        >
          {/* 题目类型标签 */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              currentQuestion.type === 'choice' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
            }`}>
              {currentQuestion.type === 'choice' ? '选择题' : '填空题'}
            </span>
          </div>

          {/* 题目文本 */}
          <div className="text-white text-lg leading-relaxed font-bold mb-4">
            {currentQuestion.question}
          </div>

          {/* 图片 */}
          {currentQuestion.image && (
            <div className="mb-4 flex justify-center">
              <img
                src={currentQuestion.image}
                alt="题目图片"
                className="max-w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* 选择题选项 */}
          {currentQuestion.type === 'choice' && currentQuestion.options && (
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                // 🆕 预知水晶：隐藏错误选项
                if (crystalUsed.includes(letter)) return null;

                const isSelected = userAnswer.toUpperCase() === letter;
                const isCorrectAnswer = currentQuestion.answer.toUpperCase() === letter;

                let bgClass = 'bg-slate-700/60 hover:bg-slate-600/70 border-slate-500/30';
                if (showResult) {
                  if (isCorrectAnswer) bgClass = 'bg-green-500/30 border-green-400 text-green-100';
                  else if (isSelected && !isCorrectAnswer) bgClass = 'bg-red-500/30 border-red-400 text-red-100';
                } else if (isSelected) {
                  bgClass = 'ring-2 ring-amber-400 bg-amber-500/20 border-amber-400 text-amber-50';
                }

                return (
                  <motion.button
                    key={letter}
                    disabled={showResult}
                    onClick={() => setUserAnswer(letter)}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all font-medium ${bgClass} ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      showResult && isCorrectAnswer
                        ? 'bg-green-500/40 text-green-100'
                        : showResult && isSelected && !isCorrectAnswer
                          ? 'bg-red-500/40 text-red-100'
                          : isSelected
                            ? 'bg-amber-400/40 text-amber-100'
                            : 'bg-slate-600/80 text-slate-200'
                    }`}>
                      {letter}
                    </span>
                    <span className={`text-base ${showResult && isCorrectAnswer ? 'text-green-100' : showResult && isSelected && !isCorrectAnswer ? 'text-red-100' : isSelected ? 'text-amber-50' : 'text-slate-100'}`}>{opt}</span>
                    {showResult && isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
                    {showResult && isSelected && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-400 ml-auto" />}
                  </motion.button>
                );
              })}
              {/* 🆕 预知水晶反馈 */}
              {crystalUsed.length > 0 && !showResult && (
                <div className="text-[10px] text-purple-300/70 text-center mt-1">
                  🔮 预知水晶排除了 {crystalUsed.length} 个错误选项
                </div>
              )}
            </div>
          )}

          {/* 填空题输入 */}
          {(currentQuestion.type === 'blank' || currentQuestion.type === 'answer') && (
            <div className="space-y-3">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showResult}
                placeholder="在这里输入答案..."
                className="w-full p-3.5 rounded-2xl bg-slate-700/70 border border-slate-500/30 text-white placeholder-slate-400
                  focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                  disabled:opacity-50 text-lg text-center font-bold"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !showResult && userAnswer.trim()) handleSubmit();
                }}
              />
              {showResult && (
                <div className={`p-3 rounded-2xl text-sm font-medium ${
                  isCorrect ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-red-500/20 text-red-300 border border-red-400/30'
                }`}>
                  {isCorrect ? '✅ 正确！' : `❌ 正确答案：${currentQuestion.answer}`}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* 教学解析 */}
        {showResult && !stageComplete && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <button
              onClick={() => setShowTeaching(!showTeaching)}
              className="w-full flex items-center justify-center gap-2 py-2 text-amber-400/70 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              {showTeaching ? '收起解析' : '查看解析'}
            </button>

            {showTeaching && currentQuestion.teaching && (
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/30 space-y-3 mb-4">
                {currentQuestion.teaching.point && (
                  <div>
                    <span className="text-amber-400 text-xs font-bold">📖 知识点</span>
                    <p className="text-white/70 text-sm mt-1">{currentQuestion.teaching.point}</p>
                  </div>
                )}
                {currentQuestion.teaching.method && (
                  <div>
                    <span className="text-cyan-400 text-xs font-bold">🧠 解题思路</span>
                    <p className="text-white/70 text-sm mt-1">{currentQuestion.teaching.method}</p>
                  </div>
                )}
                {currentQuestion.teaching.steps && currentQuestion.teaching.steps.length > 0 && (
                  <div>
                    <span className="text-green-400 text-xs font-bold">📝 分步解析</span>
                    <ol className="list-decimal list-inside text-white/70 text-sm mt-1 space-y-1">
                      {currentQuestion.teaching.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {currentQuestion.teaching.memory && (
                  <div>
                    <span className="text-pink-400 text-xs font-bold">🎵 记忆口诀</span>
                    <p className="text-white/70 text-sm mt-1">{currentQuestion.teaching.memory}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 底部操作栏 */}
      <footer className="sticky bottom-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto">
          {!showResult ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={!userAnswer.trim()}
              onClick={handleSubmit}
              className={`w-full py-3.5 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                userAnswer.trim()
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isBoss ? '⚔️ 攻击！' : '✨ 提交答案'}
            </motion.button>
          ) : (
            <div className="space-y-2">
              {/* 答题反馈 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center py-2 rounded-xl font-bold text-lg ${
                  isCorrect ? 'text-green-400' : shieldActive ? 'text-cyan-400' : 'text-red-400'
                }`}
              >
                {encourageMsg}
              </motion.div>

              {/* 继续按钮 */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="w-full py-3 rounded-2xl font-bold text-lg text-white shadow-xl transition-all"
                style={{ background: `linear-gradient(135deg, ${world.themeColor}, ${world.lightColor})` }}
              >
                {currentIdx + 1 >= questions.length ? '🏁 完成关卡' : '▶ 下一题'}
              </motion.button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

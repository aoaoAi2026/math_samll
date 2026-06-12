/**
 * 道具快捷栏 —— 关卡中悬浮可用的道具
 * 
 * 让孩子感觉「我有秘密武器」，而不是只能被动答题。
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Backpack, Shield, Lightbulb, Sparkles } from 'lucide-react';
import { ITEMS, getItemById } from '@/data/adventure/items';
import { useAdventureStore } from '@/store/adventureStore';

interface ItemBarProps {
  /** 使用道具的回调 */
  onUseItem: (itemId: string) => boolean; // 返回是否使用成功
  /** 当前题目类型是否选择题 */
  isChoice: boolean;
}

export default function ItemBar({ onUseItem, isChoice }: ItemBarProps) {
  const { getItemCount } = useAdventureStore();
  const [open, setOpen] = useState(false);
  const [justUsed, setJustUsed] = useState<string | null>(null);

  // 筛选可在关卡中使用的道具
  const usableItems = ITEMS.filter(item => {
    if (!item.usableInStage) return false;
    if (item.id === 'item_crystal' && !isChoice) return false; // 预知水晶仅选择题
    const count = getItemCount(item.id);
    return count > 0;
  });

  const handleUse = (itemId: string) => {
    const ok = onUseItem(itemId);
    if (ok) {
      setJustUsed(itemId);
      setTimeout(() => setJustUsed(null), 1200);
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            text-lg shadow-lg transition-all
            ${open
              ? 'bg-amber-500 text-white'
              : 'bg-white/15 text-white/80 hover:bg-white/25 border border-white/20'
            }
          `}
        >
          🎒
        </motion.button>
        {/* 小红点提示：有可用道具 */}
        {usableItems.length > 0 && !open && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
        )}
      </div>

      {/* 道具面板 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-2xl min-w-[200px]"
          >
            <div className="text-[10px] text-white/50 mb-2 px-1 flex items-center gap-1">
              <Backpack className="w-3 h-3" />
              背包道具
            </div>

            {usableItems.length === 0 ? (
              <p className="text-xs text-white/30 py-2 px-1">
                还没有道具，去每日转盘获得吧！
              </p>
            ) : (
              <div className="space-y-1.5">
                {ITEMS.filter(i => i.usableInStage).map(item => {
                  const count = getItemCount(item.id);
                  if (count <= 0) return null;
                  const disabled = item.id === 'item_crystal' && !isChoice;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={!disabled ? { scale: 1.03 } : {}}
                      whileTap={!disabled ? { scale: 0.97 } : {}}
                      onClick={() => !disabled && handleUse(item.id)}
                      disabled={disabled}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                        justUsed === item.id
                          ? 'bg-green-500/30'
                          : disabled
                            ? 'bg-white/5 opacity-40 cursor-not-allowed'
                            : 'bg-white/10 hover:bg-white/15 cursor-pointer'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">
                        {justUsed === item.id ? '✅' : item.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-white/50 truncate">{item.effect}</div>
                      </div>
                      <span className={`
                        text-xs font-black px-1.5 py-0.5 rounded-full
                        ${justUsed === item.id
                          ? 'bg-green-500/50 text-green-200'
                          : 'bg-white/20 text-white/60'
                        }
                      `}>
                        {justUsed === item.id ? '已使用' : `x${count}`}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

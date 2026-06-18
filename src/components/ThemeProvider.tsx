import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useGameStore((state) => state.themeMode);

  useEffect(() => {
    // 应用主题到 document root
    const root = document.documentElement;
    
    // 移除所有主题类
    root.classList.remove('light', 'dark', 'night');
    
    // 添加当前主题类
    root.classList.add(themeMode);
  }, [themeMode]);

  return <>{children}</>;
}

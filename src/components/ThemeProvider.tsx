import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDarkMode = useGameStore((state) => state.isDarkMode);

  useEffect(() => {
    // 应用主题到 document root
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <>{children}</>;
}

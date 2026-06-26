import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';

export interface ThemeStyles {
  bg: string;
  card: string;
  border: string;
  text: string;
  heading: string;
  subtext: string;
  hoverBg: string;
  panel: string;
  inputBg: string;
}

export interface AccentStyles {
  text: string;
  bg: string;
  border: string;
  glow: string;
  gradient: string;
  colorCode: string;
}

interface ThemeContextProps {
  theme: ThemeMode;
  accent: AccentColor;
  toggleTheme: () => void;
  setAccent: (accent: AccentColor) => void;
  themeStyles: ThemeStyles;
  accentStyles: AccentStyles;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('user-theme');
    return (saved as ThemeMode) || 'dark';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('user-accent');
    return (saved as AccentColor) || 'cyan';
  });

  useEffect(() => {
    localStorage.setItem('user-theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('user-accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
  };

  // Build the styles based on current values
  const themeStyles: ThemeStyles = theme === 'dark' ? {
    bg: 'bg-[#08080a]',
    card: 'bg-[#12121a]/90 backdrop-blur-md',
    border: 'border-white/10',
    text: 'text-slate-400',
    heading: 'text-white',
    subtext: 'text-slate-500',
    hoverBg: 'hover:bg-white/5',
    panel: 'bg-[#0d0d11]',
    inputBg: 'bg-[#08080a]'
  } : {
    bg: 'bg-[#f8fafc]',
    card: 'bg-white/95 backdrop-blur-md',
    border: 'border-slate-200',
    text: 'text-slate-600',
    heading: 'text-slate-900',
    subtext: 'text-slate-400',
    hoverBg: 'hover:bg-slate-100',
    panel: 'bg-slate-50',
    inputBg: 'bg-slate-50'
  };

  const accentStyles: AccentStyles = {
    cyan: {
      text: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
      bg: 'bg-cyan-500',
      border: theme === 'dark' ? 'border-cyan-500/25' : 'border-cyan-500/35',
      glow: theme === 'dark' ? 'shadow-[0_0_15px_rgba(34,211,238,0.25)]' : 'shadow-[0_0_12px_rgba(6,182,212,0.15)]',
      gradient: 'from-cyan-400 to-purple-500',
      colorCode: '#06b6d4'
    },
    purple: {
      text: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
      bg: 'bg-purple-500',
      border: theme === 'dark' ? 'border-purple-500/25' : 'border-purple-500/35',
      glow: theme === 'dark' ? 'shadow-[0_0_15px_rgba(168,85,247,0.25)]' : 'shadow-[0_0_12px_rgba(147,51,234,0.15)]',
      gradient: 'from-purple-400 to-cyan-500',
      colorCode: '#a855f7'
    },
    emerald: {
      text: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
      bg: 'bg-emerald-500',
      border: theme === 'dark' ? 'border-emerald-500/25' : 'border-emerald-500/35',
      glow: theme === 'dark' ? 'shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'shadow-[0_0_12px_rgba(5,150,105,0.15)]',
      gradient: 'from-emerald-400 to-cyan-500',
      colorCode: '#10b981'
    },
    amber: {
      text: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
      bg: 'bg-amber-500',
      border: theme === 'dark' ? 'border-amber-500/25' : 'border-amber-500/35',
      glow: theme === 'dark' ? 'shadow-[0_0_15px_rgba(245,158,11,0.25)]' : 'shadow-[0_0_12px_rgba(217,119,6,0.15)]',
      gradient: 'from-amber-400 to-rose-500',
      colorCode: '#f59e0b'
    },
    rose: {
      text: theme === 'dark' ? 'text-rose-400' : 'text-rose-600',
      bg: 'bg-rose-500',
      border: theme === 'dark' ? 'border-rose-500/25' : 'border-rose-500/35',
      glow: theme === 'dark' ? 'shadow-[0_0_15px_rgba(244,63,94,0.25)]' : 'shadow-[0_0_12px_rgba(225,29,72,0.15)]',
      gradient: 'from-rose-400 to-amber-500',
      colorCode: '#f43f5e'
    }
  }[accent];

  return (
    <ThemeContext.Provider value={{ theme, accent, toggleTheme, setAccent, themeStyles, accentStyles }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

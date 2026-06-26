import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Menu, X, Sun, Moon, Palette, Check, Sparkles } from 'lucide-react';
import ThreeBackground from './components/ThreeBackground';
import HomeView from './components/HomeView';
import LabView from './components/LabView';
import TerminalView from './components/TerminalView';
import ProductsView from './components/ProductsView';
import ContactView from './components/ContactView';
import DashboardView from './components/DashboardView';
import Footer from './components/Footer';
import { useTheme, AccentColor } from './context/ThemeContext';

type ViewTab = 'HOME' | 'THE LAB' | 'THE TERMINAL' | 'CONTACT' | 'PRODUCTS' | 'DASHBOARD';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('HOME');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const [showAdminDashboardTab, setShowAdminDashboardTab] = useState(false);

  useEffect(() => {
    const checkUrlForAdmin = () => {
      const params = new URLSearchParams(window.location.search);
      const hasSecretParam = params.get('admin') === 'prajin007' || params.get('developer') === 'true' || params.get('access') === 'database';
      const hasSecretHash = window.location.hash === '#prajin-ledger' || window.location.hash === '#developer-portal' || window.location.hash === '#admin-ledger';
      
      if (hasSecretParam || hasSecretHash) {
        setShowAdminDashboardTab(true);
      }
    };

    checkUrlForAdmin();
    window.addEventListener('hashchange', checkUrlForAdmin);
    return () => window.removeEventListener('hashchange', checkUrlForAdmin);
  }, []);
  
  const { theme, accent, toggleTheme, setAccent, themeStyles, accentStyles } = useTheme();

  // High-tech synthesizer click/beep sound
  const playTabSound = (frequencyMultiplier = 1) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Determine frequency based on selected accent
      let baseFreq = 800;
      if (accent === 'cyan') baseFreq = 1000;
      if (accent === 'purple') baseFreq = 1200;
      if (accent === 'emerald') baseFreq = 900;
      if (accent === 'amber') baseFreq = 1100;
      if (accent === 'rose') baseFreq = 1300;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * frequencyMultiplier, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5 * frequencyMultiplier, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio context might be restricted or blocked by browser gesture policies
    }
  };

  const handleTabChange = (tab: ViewTab) => {
    setActiveTab(tab);
    playTabSound(1);
    setIsMobileMenuOpen(false);
    // Smooth scroll to top on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccentChange = (color: AccentColor) => {
    setAccent(color);
    setTimeout(() => playTabSound(1.2), 50);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setTimeout(() => playTabSound(0.8), 50);
  };

  const navItems: { tab: ViewTab; label: string; desc: string }[] = [
    { tab: 'HOME', label: 'IDENTITY', desc: 'Core Coordinates' },
    { tab: 'THE LAB', label: 'PORTFOLIO', desc: 'Digital Experiments' },
    { tab: 'THE TERMINAL', label: 'EXPERTISE', desc: 'Technical Dossier' },
    { tab: 'CONTACT', label: 'INITIATE', desc: 'Secure Uplink' },
    { tab: 'PRODUCTS', label: 'PRODUCTS', desc: 'Academic Tools' },
    ...(showAdminDashboardTab ? [{ tab: 'DASHBOARD' as ViewTab, label: 'DASHBOARD', desc: 'Secure Analytics' }] : [])
  ];

  const accents: { id: AccentColor; name: string; colorClass: string; hex: string }[] = [
    { id: 'cyan', name: 'Cyber Cyan', colorClass: 'bg-cyan-400', hex: '#22d3ee' },
    { id: 'purple', name: 'Neon Purple', colorClass: 'bg-purple-500', hex: '#a855f7' },
    { id: 'emerald', name: 'Emerald Green', colorClass: 'bg-emerald-500', hex: '#10b981' },
    { id: 'amber', name: 'Electric Orange', colorClass: 'bg-amber-500', hex: '#f59e0b' },
    { id: 'rose', name: 'Crimson Rose', colorClass: 'bg-rose-500', hex: '#f43f5e' }
  ];

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-white font-sans transition-colors duration-500`}>
      
      {/* Background 3D Star & Grid Field */}
      <ThreeBackground />

      {/* Ambient Grid Overlay (supports light/dark custom styles) */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-30 opacity-[0.06] dark:opacity-[0.14] transition-opacity duration-500"
        style={{
          background: 'linear-gradient(rgba(8, 8, 10, 0) 50%, rgba(0, 0, 0, 0.35) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Dynamic radial glow adapting to current accent color */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none z-10 transition-all duration-700 opacity-20 dark:opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${accentStyles.colorCode}1a, transparent 70%)`
        }}
      />

      {/* Top Header Navigation */}
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl border ${themeStyles.border} ${theme === 'dark' ? 'bg-[#08080a]/75' : 'bg-white/75'} backdrop-blur-md shadow-lg transition-all duration-300`}>
        <nav className="flex justify-between items-center w-full px-6 py-3">
          
          {/* Creative Interactive Logo */}
          <div 
            onClick={() => handleTabChange('HOME')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <motion.div 
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${accentStyles.gradient} flex items-center justify-center font-bold text-white shadow-md text-sm`}
            >
              SP
            </motion.div>
            <div className="flex flex-col">
              <span className={`font-bold tracking-tight text-sm uppercase ${themeStyles.heading} group-hover:text-cyan-400 transition-colors duration-300`}>
                SHANMUGA PRAJIN
              </span>
              <span className="font-mono text-[8px] text-slate-500 tracking-widest uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping inline-block"></span>
                LIVE_NODE_OK
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Super Creative Floating Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 border border-white/5 bg-black/5 dark:bg-white/5 rounded-xl relative">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleTabChange(item.tab)}
                  className={`font-sans text-[11px] font-bold tracking-wider relative py-2 px-4.5 rounded-lg cursor-pointer transition-all duration-300 z-10 uppercase ${
                    isActive 
                      ? 'text-white' 
                      : `${themeStyles.text} hover:text-slate-900 dark:hover:text-white`
                  }`}
                >
                  {/* Sliding Pill Behind Text */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-lg bg-gradient-to-r ${accentStyles.gradient} -z-10`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      style={{ boxShadow: `0 4px 14px ${accentStyles.colorCode}40` }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Actions Cluster (Audio, Theme Picker, Customiser) */}
          <div className="flex items-center gap-2">
            
            {/* Quick theme toggler */}
            <button
              onClick={handleThemeToggle}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 border ${themeStyles.border} ${themeStyles.hoverBg} rounded-xl active:scale-90 transition-all cursor-pointer ${themeStyles.heading}`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Customiser trigger */}
            <div className="relative">
              <button
                onClick={() => setIsThemePanelOpen(!isThemePanelOpen)}
                title="Customize Core Accent Colors"
                className={`p-2 border ${themeStyles.border} ${themeStyles.hoverBg} rounded-xl active:scale-90 transition-all cursor-pointer ${
                  isThemePanelOpen ? accentStyles.text : themeStyles.heading
                }`}
              >
                <Palette className="w-4 h-4" />
              </button>

              {/* Accent Palette Dropdown */}
              <AnimatePresence>
                {isThemePanelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-3 w-48 border ${themeStyles.border} ${theme === 'dark' ? 'bg-[#12121a] text-white' : 'bg-white text-slate-800'} p-4 rounded-2xl shadow-xl z-50 space-y-3`}
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        CORE_COUPLE
                      </span>
                      <Sparkles className={`w-3 h-3 ${accentStyles.text} animate-pulse`} />
                    </div>
                    
                    <div className="space-y-2">
                      {accents.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => handleAccentChange(acc.id)}
                          className="flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${acc.colorClass}`} />
                            <span className="font-sans font-medium">{acc.name}</span>
                          </div>
                          {accent === acc.id && <Check className={`w-3 h-3 ${accentStyles.text}`} />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sound Toggler */}
            <button
              onClick={() => {
                setSoundEnabled(p => !p);
                playTabSound(1.1);
              }}
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
              className={`p-2 border ${themeStyles.border} ${themeStyles.hoverBg} rounded-xl active:scale-90 transition-all cursor-pointer ${
                soundEnabled ? `${accentStyles.text} ${accentStyles.border}` : 'text-slate-500'
              }`}
            >
              <Radio className="w-4 h-4" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(o => !o)}
              className={`lg:hidden p-2 border ${themeStyles.border} rounded-xl hover:bg-white/5 cursor-pointer ${themeStyles.heading}`}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`lg:hidden ${theme === 'dark' ? 'bg-[#0d0d11]' : 'bg-slate-50'} border-t ${themeStyles.border} rounded-b-2xl px-6 py-6 space-y-4 overflow-hidden shadow-inner`}
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleTabChange(item.tab)}
                    className={`block w-full text-left font-sans text-xs font-semibold py-2.5 tracking-widest uppercase transition-colors ${
                      isActive 
                        ? `${accentStyles.text} border-l-2 ${accentStyles.border.split(' ')[0]} pl-3 font-bold` 
                        : `${themeStyles.text} hover:text-cyan-400 pl-3`
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Primary Container (supports scrolling with generous padding) */}
      <main className="relative z-20 flex-grow flex flex-col justify-start px-6 md:px-16 pt-32 pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {activeTab === 'HOME' && <HomeView onNavigate={handleTabChange} />}
            {activeTab === 'THE LAB' && <LabView />}
            {activeTab === 'THE TERMINAL' && <TerminalView />}
            {activeTab === 'CONTACT' && <ContactView />}
            {activeTab === 'PRODUCTS' && <ProductsView />}
            {activeTab === 'DASHBOARD' && <DashboardView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Cybernetic Footer */}
      <Footer />
    </div>
  );
}

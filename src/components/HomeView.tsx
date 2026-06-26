import React from 'react';
import { motion } from 'motion/react';
import { Terminal, ShieldCheck, Activity, ArrowRight, FileUser, Cpu, Sparkles, Code2, Globe, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HomeViewProps {
  onNavigate: (tab: 'HOME' | 'THE LAB' | 'THE TERMINAL' | 'CONTACT' | 'PRODUCTS') => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const { theme, themeStyles, accentStyles } = useTheme();

  // Animation constants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const bentoItems = [
    {
      icon: <Code2 className={`w-5 h-5 ${accentStyles.text}`} />,
      title: 'Full Stack Systems',
      desc: 'Developing high-performance, responsive React frameworks coupled with secure Firestore servers.',
      tag: 'ARCHITECTURE'
    },
    {
      icon: <Laptop className={`w-5 h-5 ${accentStyles.text}`} />,
      title: 'UI/UX & Media Design',
      desc: 'Designing professional, user-centric interfaces and editing high-fidelity cinematic video productions.',
      tag: 'CREATIVE'
    },
    {
      icon: <Sparkles className={`w-5 h-5 ${accentStyles.text}`} />,
      title: 'Generative AI Pipelines',
      desc: 'Orchestrating robust LLMs, vector database schemas, and intelligent agent interactions.',
      tag: 'INTELLIGENCE'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto space-y-24 py-8"
    >
      {/* Top HUD Telemetry Info */}
      <motion.div variants={itemVariants} className="w-full">
        <div className="font-mono text-[10px] tracking-widest text-slate-500 flex flex-wrap items-center gap-x-6 gap-y-2 uppercase">
          <span className={accentStyles.text}>SYSTEM_UPLINK: 0x7E49-SP</span>
          <span className={`hidden md:inline h-[1px] w-12 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`}></span>
          <span>COORDS: 12.9716° N, 77.5946° E (BANGALORE HUB)</span>
          <span className={`hidden md:inline h-[1px] w-12 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`}></span>
          <span className="text-purple-400">STATUS: INTERACTIVE_MODE</span>
        </div>
      </motion.div>

      {/* Main Hero Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Name and Pitch */}
        <div className="lg:col-span-7 space-y-8 relative">
          <div className={`absolute -left-6 top-12 w-[3px] h-48 bg-gradient-to-b ${accentStyles.gradient} to-transparent hidden md:block`}></div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`inline-flex items-center gap-2 px-4 py-2 ${themeStyles.card} border ${themeStyles.border} rounded-xl shadow-md`}
          >
            <span className={`w-2 h-2 rounded-full ${accentStyles.bg} ${accentStyles.glow} animate-pulse`}></span>
            <span className={`font-sans text-[10px] font-bold uppercase tracking-wider ${themeStyles.heading}`}>
              Creative Technologist // React & AI Developer
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              variants={itemVariants}
              className={`font-sans text-[48px] sm:text-[72px] lg:text-[84px] font-black leading-[0.95] tracking-tight ${themeStyles.heading}`}
            >
              DIGITAL <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentStyles.gradient} drop-shadow-[0_0_20px_rgba(34,211,238,0.15)]`}>
                ARCHITECT
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className={`font-sans text-base sm:text-lg ${themeStyles.text} leading-relaxed max-w-xl`}
            >
              Engineering immersive digital applications, robust full-stack platforms, and seamless intelligent agent solutions. A multidisciplinary developer connecting raw user experiences to top-tier AI pipelines.
            </motion.p>
          </div>

          {/* Action Links */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => onNavigate('THE LAB')}
              className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r ${accentStyles.gradient} text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer ${accentStyles.glow} hover:-translate-y-0.5 active:translate-y-0`}
            >
              Explore Portfolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('THE TERMINAL')}
              className={`inline-flex items-center justify-center gap-3 px-8 py-4 border ${themeStyles.border} ${themeStyles.hoverBg} ${themeStyles.heading} font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer`}
            >
              Review Dossier
              <FileUser className={`w-4 h-4 ${accentStyles.text}`} />
            </button>
          </motion.div>
        </div>

        {/* Right Side: Creative Interactive Status Bento */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Capabilites Panel */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={`${themeStyles.card} border ${themeStyles.border} rounded-2xl p-6 relative overflow-hidden group`}
          >
            <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500">SYS_COUPLE_01</div>
            <div className={`absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r ${accentStyles.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
            
            <h3 className={`font-sans text-xs font-bold ${accentStyles.text} mb-4 flex items-center gap-2 tracking-widest uppercase`}>
              <Terminal className="w-4 h-4" /> CORE_CAPABILITY_STACK
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {['REACT.JS', 'TYPESCRIPT', 'GENERATIVE AI', 'UI/UX DESIGN', 'DAVINCI RESOLVE', 'CAPCUT'].map((tech) => (
                <span
                  key={tech}
                  className={`px-3 py-1.5 ${theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'} border font-sans font-medium text-[10px] rounded-xl`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* System Uptime Monitor Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={`${themeStyles.card} border ${themeStyles.border} rounded-2xl p-6 relative overflow-hidden group`}
          >
            <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500">SYS_COUPLE_02</div>
            <div className={`absolute bottom-0 left-0 w-full h-[3px] bg-purple-500 opacity-60 group-hover:opacity-100 transition-opacity`}></div>

            <div className="w-full">
              <div className="flex justify-between items-end">
                <div>
                  <p className={`text-4xl font-black ${themeStyles.heading} tracking-tight leading-none`}>99.98%</p>
                  <p className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase mt-2 flex items-center gap-1.5 tracking-wider`}>
                    <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    CREATIVE_ENGINE_FIDELITY
                  </p>
                </div>

                {/* Equalizer column lines */}
                <div className="flex gap-1.5 items-end pb-1 h-12">
                  <span className={`w-1.5 ${accentStyles.bg} opacity-40 rounded-t-sm h-[30%] animate-pulse`}></span>
                  <span className={`w-1.5 ${accentStyles.bg} opacity-60 rounded-t-sm h-[60%] animate-pulse`}></span>
                  <span className={`w-1.5 ${accentStyles.bg} opacity-40 rounded-t-sm h-[45%] animate-pulse`}></span>
                  <span className="w-1.5 bg-purple-500 opacity-80 rounded-t-sm h-[90%] animate-pulse"></span>
                  <span className="w-1.5 bg-purple-500 rounded-t-sm h-[75%] animate-pulse"></span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Node */}
          <motion.div 
            variants={itemVariants}
            className={`${themeStyles.card} border ${themeStyles.border} rounded-xl px-6 py-4 flex items-center justify-between shadow-inner`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className={`font-sans text-[10px] font-bold ${themeStyles.text} tracking-wider uppercase`}>
                SECURED COMPILER PORT OK
              </span>
            </div>
            <span className="font-sans text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              TLS_V1.3
            </span>
          </motion.div>
        </div>

      </div>

      {/* ADDITIONAL SCROLLABLE SECTION: Interactive Bento Matrix */}
      <section className="space-y-12 pt-12">
        <motion.div 
          variants={itemVariants}
          className="text-center space-y-3"
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1 border ${themeStyles.border} bg-black/5 dark:bg-white/5 font-sans text-[9px] font-bold ${accentStyles.text} uppercase tracking-widest rounded-full`}>
            <Globe className="w-3 h-3 animate-spin" /> THE_SPECTRUM_OF_CAPABILITIES
          </div>
          <h2 className={`font-sans text-3xl md:text-5xl font-black ${themeStyles.heading} tracking-tight uppercase`}>
            ENGINEERING METICULOUS SOLUTIONS
          </h2>
          <p className={`font-sans text-sm ${themeStyles.text} max-w-2xl mx-auto leading-relaxed`}>
            Bridging state-of-the-art web interfaces, robust server architectures, generative artificial intelligence pipelines, and cinematic media workflows.
          </p>
        </motion.div>

        {/* 3 Columns Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bentoItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`p-8 border ${themeStyles.border} ${themeStyles.card} rounded-2xl shadow-md relative overflow-hidden group space-y-4`}
            >
              <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500">0{index + 1}</div>
              <div className={`w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border ${themeStyles.border} flex items-center justify-center transition-transform group-hover:scale-110`}>
                {item.icon}
              </div>
              <div className="space-y-2">
                <h4 className={`font-sans text-base font-bold ${themeStyles.heading} uppercase tracking-wide`}>
                  {item.title}
                </h4>
                <p className={`font-sans text-xs ${themeStyles.text} leading-relaxed`}>
                  {item.desc}
                </p>
              </div>
              <div className="pt-2">
                <span className={`font-sans text-[9px] font-black ${accentStyles.text} uppercase tracking-widest bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-md`}>
                  {item.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ADDITIONAL SCROLLABLE SECTION: Quick Navigation Hub */}
      <motion.section 
        variants={itemVariants}
        className={`border ${themeStyles.border} ${themeStyles.card} p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-lg`}
      >
        <div className="absolute top-0 right-0 w-2/3 h-full bg-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-xl space-y-6 relative z-10">
          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">
            /NODE_COUPLING_PORT
          </span>
          <h3 className={`font-sans text-2xl md:text-4xl font-black ${themeStyles.heading} uppercase leading-tight`}>
            READY TO COLLABORATE <br />
            ON YOUR NEXT VENTURE?
          </h3>
          <p className={`font-sans text-xs sm:text-sm ${themeStyles.text} leading-relaxed`}>
            Get a tailored dynamic digital application, register for the customizable Student Planner, or commission high-fidelity media assets. Click below to establish contact.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('CONTACT')}
              className={`inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-black hover:opacity-90 font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer`}
            >
              Initiate Secure Uplink <Laptop className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Continuous Dynamic Data Ticker Strip */}
      <motion.div variants={itemVariants} className="py-4 border-y border-white/5 overflow-hidden relative">
        <div className="whitespace-nowrap flex animate-marquee font-mono text-[9px] tracking-widest text-slate-500 uppercase gap-12">
          <span>&lt;&lt; DEPLOYING SCALABLE CORE SYSTEMS // SYNCHRONIZING MULTI-MODAL AI MODELS // VIDEO COMPOSITING WORKFLOWS // CREATIVE SOFTWARE DEPLOYMENT HUB // 0xAF9B3C &gt;&gt;</span>
          <span>&lt;&lt; DEPLOYING SCALABLE CORE SYSTEMS // SYNCHRONIZING MULTI-MODAL AI MODELS // VIDEO COMPOSITING WORKFLOWS // CREATIVE SOFTWARE DEPLOYMENT HUB // 0xAF9B3C &gt;&gt;</span>
        </div>
      </motion.div>

    </motion.div>
  );
}

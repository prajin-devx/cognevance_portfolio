import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, BookOpen, Plane, Terminal, FolderKanban, BarChart3, AppWindow, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';

export default function LabView() {
  const { theme, themeStyles, accentStyles } = useTheme();
  const [terminalOutput, setTerminalOutput] = useState<string>('');
  const [typingIndex, setTypingIndex] = useState<number>(0);

  const projects: Project[] = [
    {
      id: 'ecommerce',
      ref: 'REF-LAB-01',
      title: 'Enterprise E-Commerce Engine',
      description: 'A scalable headless commerce platform engineered with React and modern microservice architecture. Features rapid checkout integrations, automated inventory synchronization, and custom checkout flows tailored for low-latency transaction handling.',
      tags: ['REACT.JS', 'STRIPE', 'POSTGRESQL'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_DvxXjML2rC1NIgZtuW0iGk_cvLA865v4DdiORIdbVKFEvmpar__Rti1MURNtY48F0wfjNdZleErPpb9Gw8c4fDMhHYivhBtdWunwFr0B4OHDgUIO-ZQ_EwDroXirZtPHoFENe7Qs54aoEMLKXG8IGtDCDgFE3Kx1GcEAKZAPovaexTMv74UC8ExpXI0GHk1_ICrquWxMk3U7WYZCSbSnC8AvhZUN7zbDaiBKufgjls9npiUmOGpotxSbYNUTKcGPLIKQZoy7UQeB'
    },
    {
      id: 'student-planner',
      ref: 'REF-LAB-02',
      title: 'AI-Driven Student Planner',
      description: 'A mobile application integrated with advanced conversational AI models to dynamically generate schedules, track task completion metrics, and provide adaptive study recommendations based on academic performance.',
      tags: ['REACT NATIVE', 'GEMINI API', 'REDIS'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFmnHr46iiL8VoL1NKDflbScHhcLdMNYLDvrG8uZ-G3HQLuA8YvNGV4q2oEKu_qafaBfJ0sXO3EP9ZO96XPhNlVM4pQVwYpI7KEa58_28Aq_T3jigjs9nMVg87uRIPQqtIubGsYjMYJadrgoVQd_SX4IRl6OOvt2Cv8qBWLrV85a1WSA3ZK__X-OdCGlvQhLdIqRBJYsOyU1ERxdWT0DzfwX7YErWil37Vv-spM02pqlKWHdW7X0gNyYHphRmA7w1wR3YUy_dONY-R'
    },
    {
      id: 'travels',
      ref: 'REF-LAB-03',
      title: 'Voyage Hub - Travels Portal',
      description: 'An optimized travel exploration and booking web platform utilizing geolocation APIs and custom itinerary generators. Engineered to deliver high-speed search capabilities and rich, visually engaging maps.',
      tags: ['REACT.JS', 'TAILWIND CSS', 'GEOLOCATION'],
      image: ''
    }
  ];

  const shellCommand = 'fetch --profile "Shanmuga Prajin" --analysis';
  const fullOutput = `[INFO] INITIALIZING COMPONENT ANALYSIS...
[INFO] STACK DETECTED: TYPESCRIPT, REACT, DAVINCI RESOLVE, CAPCUT, GENERATIVE AI, UI/UX DESIGN
[INFO] SPECIALIZATION: IMMERSIVE 3D WEB EXPERIENCES & DYNAMIC CODESPACES
[SUCCESS] ALL SYSTEMS SECURELY COUPLED. STACK SYNCHRONIZED. READY TO BUILD.`;

  useEffect(() => {
    if (typingIndex < shellCommand.length) {
      const timeout = setTimeout(() => {
        setTerminalOutput((prev) => prev + shellCommand.charAt(typingIndex));
        setTypingIndex((prev) => prev + 1);
      }, 35);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-7xl mx-auto space-y-12 py-6"
    >
      {/* Title Header */}
      <section className="flex flex-col gap-4">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 border ${themeStyles.border} ${themeStyles.panel} rounded-full w-fit`}>
          <span className={`w-1.5 h-1.5 ${accentStyles.bg} rounded-full animate-pulse ${accentStyles.glow}`}></span>
          <span className={`font-sans text-[9px] font-bold ${accentStyles.text} uppercase tracking-widest`}>
            Repository Status: 4 Nodes Online
          </span>
        </div>
        <h1 className={`font-sans text-[36px] md:text-[58px] font-black ${themeStyles.heading} tracking-tight leading-none uppercase`}>
          THE_LAB: <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentStyles.gradient} drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]`}>CREATIVE GRID</span>
        </h1>
        <p className={`font-sans text-xs sm:text-sm ${themeStyles.text} max-w-2xl leading-relaxed`}>
          Explore Shanmuga Prajin's portfolio of production-ready digital architectures, where high-performance engineering converges with state-of-the-art AI orchestration and cinematic digital assets.
        </p>
      </section>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Project 1: E-Commerce Platform (8-Col) */}
        <div className={`lg:col-span-8 group relative border ${themeStyles.border} hover:border-cyan-500/30 ${themeStyles.card} p-8 rounded-3xl shadow-lg transition-all duration-300 h-[480px] flex flex-col justify-between overflow-hidden`}>
          <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500">{projects[0].ref}</div>
          <div className={`absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r ${accentStyles.gradient} opacity-50 group-hover:opacity-100 transition-opacity`}></div>

          {/* Glowing orbital background mockup image */}
          <div className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-[0.03] dark:opacity-[0.12] group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
            <img 
              src={projects[0].image} 
              alt="Globe Commerce grid" 
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 animate-[spin_65s_linear_infinite]"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <div className="flex flex-wrap gap-2">
              {projects[0].tags.map(tag => (
                <span key={tag} className={`px-2.5 py-1.5 border ${accentStyles.border} bg-cyan-500/5 ${accentStyles.text} font-sans text-[9px] font-bold tracking-wider uppercase rounded-xl`}>
                  {tag}
                </span>
              ))}
            </div>

            <h3 className={`text-2xl font-black ${themeStyles.heading} flex items-center gap-2 uppercase tracking-tight`}>
              <Globe className={`w-5 h-5 ${accentStyles.text}`} />
              {projects[0].title}
            </h3>

            <p className={`text-sm ${themeStyles.text} leading-relaxed`}>
              {projects[0].description}
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <button className={`px-6 py-3.5 bg-gradient-to-r ${accentStyles.gradient} text-white font-sans text-xs font-bold tracking-wider uppercase flex items-center gap-2 rounded-xl active:scale-95 transition-all duration-150 cursor-pointer ${accentStyles.glow}`}>
              Launch Project <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project 2: Student Planner (4-Col) */}
        <div className={`lg:col-span-4 group relative border ${themeStyles.border} hover:border-purple-500/30 ${themeStyles.card} p-8 rounded-3xl shadow-lg transition-all duration-300 h-[480px] flex flex-col justify-between overflow-hidden`}>
          <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500">{projects[1].ref}</div>
          <div className="absolute top-0 left-0 w-full h-[4px] bg-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>

          {/* Glowing AI brain background mockup image */}
          <div className="absolute left-0 top-0 w-full h-[180px] opacity-[0.03] dark:opacity-[0.14] group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
            <img 
              src={projects[1].image} 
              alt="AI Matrix brain network" 
              className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 mt-auto space-y-4">
            <div className="flex flex-wrap gap-2">
              {projects[1].tags.map(tag => (
                <span key={tag} className="px-2.5 py-1.5 border border-purple-500/20 bg-purple-500/5 text-purple-400 font-sans text-[9px] font-bold tracking-wider uppercase rounded-xl">
                  {tag}
                </span>
              ))}
            </div>

            <h3 className={`text-xl font-black ${themeStyles.heading} flex items-center gap-2 uppercase tracking-tight`}>
              <BookOpen className="w-5 h-5 text-purple-400" />
              {projects[1].title}
            </h3>

            <p className={`text-xs ${themeStyles.text} leading-relaxed`}>
              {projects[1].description}
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <button className="w-full px-4 py-3.5 border border-purple-500/30 text-purple-500 hover:bg-purple-500/5 font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 rounded-xl active:scale-95 transition-all duration-150 cursor-pointer">
              Review Architecture <FolderKanban className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project 3: Travels Portal (5-Col) */}
        <div className={`lg:col-span-5 group relative border ${themeStyles.border} hover:border-emerald-500/30 ${themeStyles.card} p-8 rounded-3xl shadow-lg transition-all duration-300 h-[400px] flex flex-col justify-between overflow-hidden`}>
          <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500">{projects[2].ref}</div>
          <div className="absolute top-0 left-0 w-full h-[4px] bg-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {projects[2].tags.map(tag => (
                <span key={tag} className="px-2.5 py-1.5 border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 font-sans text-[9px] font-bold tracking-wider uppercase rounded-xl">
                  {tag}
                </span>
              ))}
            </div>

            <h3 className={`text-xl font-black ${themeStyles.heading} flex items-center gap-2 uppercase tracking-tight`}>
              <Plane className="w-5 h-5 text-emerald-400" />
              {projects[2].title}
            </h3>

            <p className={`text-xs ${themeStyles.text} leading-relaxed`}>
              {projects[2].description}
            </p>
          </div>

          <div className="pt-4">
            <a 
              href="#"
              onClick={(e) => e.preventDefault()}
              className={`inline-flex items-center gap-2 ${accentStyles.text} font-sans text-xs font-bold hover:underline uppercase tracking-wider cursor-pointer`}
            >
              Launch Gateway Navigation &rarr;
            </a>
          </div>
        </div>

        {/* Dynamic Project 4: Immersive Portfolio Statistics (7-Col) */}
        <div className={`lg:col-span-7 border ${themeStyles.border} ${themeStyles.card} p-8 rounded-3xl shadow-lg h-[400px] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group`}>
          <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500">REF-LAB-04</div>
          <div className={`absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r ${accentStyles.gradient} opacity-50`}></div>

          {/* Left stats column */}
          <div className="space-y-6 w-full md:w-1/2">
            <div>
              <h3 className={`text-xl font-black ${themeStyles.heading} flex items-center gap-2 mb-2 uppercase tracking-tight`}>
                <AppWindow className={`w-5 h-5 ${accentStyles.text}`} />
                Modern Portfolio
              </h3>
              <p className={`text-xs ${themeStyles.text} leading-relaxed`}>
                The current high-fidelity digital showcase. Hand-crafted with absolute precision in React and Tailwind, running real-time 3D WebGL meshes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`border-l-2 ${accentStyles.border.split(' ')[0]} pl-3`}>
                <div className="font-sans text-[9px] font-bold text-slate-500 uppercase">TOTAL_MODULES</div>
                <div className={`text-2xl font-black ${themeStyles.heading}`}>14</div>
              </div>
              <div className={`border-l-2 ${accentStyles.border.split(' ')[0]} pl-3`}>
                <div className="font-sans text-[9px] font-bold text-slate-500 uppercase">COMPILATION_PASS</div>
                <div className="text-2xl font-black text-emerald-500">100%</div>
              </div>
            </div>
          </div>

          {/* Interactive animated SVG Chart */}
          <div className={`w-full md:w-1/2 h-[180px] ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'} border ${themeStyles.border} rounded-2xl relative p-4 flex flex-col justify-between overflow-hidden shadow-inner`}>
            <div className={`font-mono text-[8px] ${accentStyles.text} uppercase tracking-wider flex items-center gap-1`}>
              <BarChart3 className="w-3 h-3" /> System_Capacity_Metrics
            </div>

            {/* Dynamic pulsating SVG bars */}
            <svg className="w-full h-[110px]" viewBox="0 0 160 100">
              <g fill={accentStyles.colorCode} opacity="0.8">
                <rect x="10" y="40" width="12" height="60" className="animate-pulse" style={{ animationDuration: '1.2s' }} />
                <rect x="30" y="20" width="12" height="80" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
                <rect x="50" y="50" width="12" height="50" className="animate-pulse" style={{ animationDuration: '1.8s' }} />
                <rect x="70" y="10" width="12" height="90" className="animate-pulse" style={{ animationDuration: '3.0s' }} />
                <rect x="90" y="30" width="12" height="70" className="animate-pulse" style={{ animationDuration: '1.5s' }} />
                <rect x="110" y="45" width="12" height="55" className="animate-pulse" style={{ animationDuration: '2.2s' }} />
                <rect x="130" y="5" width="12" height="95" className="animate-pulse" style={{ animationDuration: '2.8s' }} />
              </g>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={`font-sans text-[9px] font-bold ${accentStyles.text} tracking-widest ${theme === 'dark' ? 'bg-[#12121a]/95' : 'bg-white/95'} border ${accentStyles.border} px-3 py-1.5 rounded-xl shadow-md animate-pulse uppercase`}>
                METRICS_OPTIMAL
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Retro CLI terminal report */}
      <section>
        <div className={`border ${themeStyles.border} ${themeStyles.card} rounded-2xl overflow-hidden shadow-lg`}>
          {/* Header */}
          <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/40"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/40"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/40"></span>
            </div>
            <div className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">shanmuga_prajin -- stack_analysis.sh</div>
            <div className="w-8"></div>
          </div>
          
          {/* Shell output */}
          <div className={`p-6 font-mono text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} leading-relaxed space-y-4`}>
            <div className="flex gap-2">
              <span className={accentStyles.text}>$</span>
              <span>{terminalOutput}</span>
              {typingIndex < shellCommand.length && (
                <span className={`w-1.5 h-4 ${accentStyles.bg} animate-pulse`}></span>
              )}
            </div>

            {typingIndex >= shellCommand.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-1"
              >
                {fullOutput.split('\n').map((line, idx) => (
                  <p 
                    key={idx} 
                    className={line.includes('[SUCCESS]') ? 'text-emerald-500 font-semibold' : `${themeStyles.text}`}
                  >
                    {line}
                  </p>
                ))}
                
                <div className="flex gap-2 pt-4">
                  <span className={accentStyles.text}>$</span>
                  <span className={`w-1.5 h-4 ${accentStyles.bg} animate-pulse`}></span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

    </motion.div>
  );
}

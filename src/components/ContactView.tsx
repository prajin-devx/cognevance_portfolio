import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, RefreshCw, Github, Linkedin, MessageSquare, Youtube, Twitter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { db, collection, addDoc, handleFirestoreError, OperationType } from '../lib/firebase';

export default function ContactView() {
  const { theme, themeStyles, accentStyles } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Form submission state
  const [formState, setFormState] = useState({ name: '', email: '', subject: 'GENERAL_QUERY', message: '' });
  const [status, setStatus] = useState<'idle' | 'uplinking' | 'transmitted'>('idle');
  
  // Matrix rain canvas code
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1);

    const charStream = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';

    const draw = () => {
      // Trail opacity matching dynamic background theme
      ctx.fillStyle = theme === 'dark' ? 'rgba(8, 8, 10, 0.08)' : 'rgba(248, 250, 252, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Character color matches chosen accent color
      ctx.fillStyle = accentStyles.colorCode || '#22d3ee';
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charStream.charAt(Math.floor(Math.random() * charStream.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    window.addEventListener('resize', handleResize);
    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, accentStyles.colorCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setStatus('uplinking');

    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: formState.name,
        email: formState.email,
        subject: formState.subject,
        message: formState.message,
        createdAt: new Date().toISOString(),
        status: 'NEW_TRANSMISSION'
      });
      setStatus('transmitted');
      setTimeout(() => {
        setStatus('idle');
        setFormState({ name: '', email: '', subject: 'GENERAL_QUERY', message: '' });
      }, 4000);
    } catch (err) {
      console.error('Failed to submit contact message to database:', err);
      handleFirestoreError(err, OperationType.CREATE, 'contact_messages');
    }
  };

  const socialLinks = [
    { name: 'GIT_HUB', icon: <Github className="w-5 h-5" />, href: 'https://github.com', color: 'hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.45)]' },
    { name: 'LINKED_IN', icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com', color: 'hover:border-purple-400 hover:text-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.45)]' },
    { name: 'DISCORD', icon: <MessageSquare className="w-5 h-5" />, href: 'https://discord.gg', color: 'hover:border-indigo-400 hover:text-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.45)]' },
    { name: 'YOUTUBE', icon: <Youtube className="w-5 h-5" />, href: 'https://youtube.com', color: 'hover:border-rose-500 hover:text-rose-500 hover:shadow-[0_0_15px_rgba(244,63,94,0.45)]' },
    { name: 'TWITTER', icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com', color: 'hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.45)]' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto space-y-12 relative py-6"
    >
      {/* Grid Overlay Matrix rain box */}
      <div className={`absolute inset-0 z-0 opacity-[0.06] dark:opacity-[0.16] pointer-events-none rounded-3xl overflow-hidden border ${themeStyles.border}`}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-12">
        {/* Title Block */}
        <div className="text-center space-y-4">
          <span className={`inline-block px-4 py-1.5 border ${themeStyles.border} ${themeStyles.panel} font-sans text-[9px] font-bold ${accentStyles.text} uppercase tracking-widest rounded-full`}>
            INITIALIZATION_PHASE: READY
          </span>
          <h1 className={`font-sans text-[32px] md:text-[54px] font-black ${themeStyles.heading} tracking-tight uppercase leading-none`}>
            THE PORTAL
          </h1>
          <p className={`font-sans text-xs sm:text-sm ${themeStyles.text} max-w-md mx-auto`}>
            Establish a secure encrypted uplink with Shanmuga Prajin. Digital packet transfers are logged in database structures.
          </p>
        </div>

        {/* Form Container */}
        <div className={`border ${themeStyles.border} ${themeStyles.card} backdrop-blur-md p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-xl`}>
          <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500">REF-8839-X</div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase tracking-wider block`}>
                  IDENTIFIER_NAME
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleInputChange}
                  disabled={status !== 'idle'}
                  className={`w-full ${theme === 'dark' ? 'bg-[#08080a]' : 'bg-slate-50'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 px-4 py-3.5 text-white dark:text-slate-200 font-sans text-sm rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300`}
                  placeholder="GUEST_USER"
                />
              </div>

              <div className="space-y-2">
                <label className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase tracking-wider block`}>
                  UPLINK_EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                  disabled={status !== 'idle'}
                  className={`w-full ${theme === 'dark' ? 'bg-[#08080a]' : 'bg-slate-50'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 px-4 py-3.5 text-white dark:text-slate-200 font-sans text-sm rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300`}
                  placeholder="USER@NET.CORE"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase tracking-wider block`}>
                PACKET_SUBJECT
              </label>
              <select
                name="subject"
                value={formState.subject}
                onChange={handleInputChange}
                disabled={status !== 'idle'}
                className={`w-full ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-slate-50 text-slate-800'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 px-4 py-3.5 text-sm rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300 appearance-none`}
              >
                <option value="GENERAL_QUERY">GENERAL_QUERY // INFORMATIONAL</option>
                <option value="PROJECT_COMMISSION">PROJECT_COMMISSION // PROPOSAL</option>
                <option value="AI_CONSULTATION">AI_CONSULTATION // AUTOMATION</option>
                <option value="CYBER_MEDIA_EDIT">CYBER_MEDIA_EDIT // POST-PRODUCTION</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase tracking-wider block`}>
                TRANSMISSION_DATA
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={formState.message}
                onChange={handleInputChange}
                disabled={status !== 'idle'}
                className={`w-full ${theme === 'dark' ? 'bg-[#08080a]' : 'bg-slate-50'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 px-4 py-3.5 text-white dark:text-slate-200 font-sans text-sm rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300 resize-none`}
                placeholder="ENTER PACKET_PAYLOAD_STRING..."
              />
            </div>

            <div className="pt-2">
              {status === 'idle' && (
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r ${accentStyles.gradient} hover:opacity-95 text-white font-sans text-xs font-bold uppercase tracking-wider py-4 rounded-xl transition-all duration-300 ${accentStyles.glow} active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <Send className="w-4 h-4" /> Transmit Packet Uplink
                </button>
              )}

              {status === 'uplinking' && (
                <button
                  type="button"
                  disabled
                  className="w-full bg-white/5 border border-white/5 text-slate-400 font-sans text-xs font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 animate-spin ${accentStyles.text}`} /> Uplinking Payload...
                </button>
              )}

              {status === 'transmitted' && (
                <button
                  type="button"
                  disabled
                  className="w-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-sans text-xs font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle2 className="w-4 h-4" /> Payload Transmitted [200_OK]
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 3D-Look Social Connections Footer */}
        <div className="flex flex-col items-center gap-6 mt-12">
          <div className="h-[1px] w-32 bg-white/5"></div>
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`group flex flex-col items-center gap-2 cursor-pointer`}
              >
                <div className={`w-12 h-12 flex items-center justify-center border ${themeStyles.border} rounded-full ${theme === 'dark' ? 'bg-black/40' : 'bg-slate-50'} backdrop-blur-sm transition-all duration-300 ${item.color}`}>
                  {item.icon}
                </div>
                <span className="font-sans text-[9px] font-bold text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-white transition-colors tracking-widest">
                  {item.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

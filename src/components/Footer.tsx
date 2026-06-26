import { useState, useEffect } from 'react';
import { Wifi, ShieldAlert, Linkedin, Instagram, Github, Mail, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme, themeStyles, accentStyles } = useTheme();
  const [latency, setLatency] = useState<number>(14);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight network jitter
      setLatency(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 5 ? 5 : next > 45 ? 45 : next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    { 
      name: 'LinkedIn', 
      icon: <Linkedin className="w-3.5 h-3.5" />, 
      href: 'https://linkedin.com', 
      color: 'hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
    },
    { 
      name: 'Instagram', 
      icon: <Instagram className="w-3.5 h-3.5" />, 
      href: 'https://instagram.com', 
      color: 'hover:text-purple-400 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]' 
    },
    { 
      name: 'Discord', 
      icon: <MessageSquare className="w-3.5 h-3.5" />, 
      href: 'https://discord.com', 
      color: 'hover:text-indigo-400 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
    },
    { 
      name: 'Gmail', 
      icon: <Mail className="w-3.5 h-3.5" />, 
      href: 'mailto:prajinmothi007@gmail.com', 
      color: 'hover:text-rose-400 hover:shadow-[0_0_10px_rgba(244,63,94,0.5)]' 
    },
    { 
      name: 'GitHub', 
      icon: <Github className="w-3.5 h-3.5" />, 
      href: 'https://github.com', 
      color: 'hover:text-slate-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
    }
  ];

  return (
    <footer className={`relative z-20 w-full px-6 md:px-16 py-8 border-t ${themeStyles.border} ${theme === 'dark' ? 'bg-[#08080a]' : 'bg-slate-50'} flex flex-col md:flex-row justify-between items-center gap-6 mt-auto`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <span className={`font-sans text-[10px] tracking-widest ${accentStyles.text} font-bold uppercase`}>
          &copy; 2026 SHANMUGA_PRAJIN // ALL RIGHTS RESERVED
        </span>

        {/* Social Links Divider */}
        <span className={`hidden md:inline h-4 w-[1px] ${themeStyles.border}`}></span>

        {/* Social Link Icons */}
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
              className={`w-8 h-8 rounded-lg border ${themeStyles.border} ${theme === 'dark' ? 'bg-[#12121a]' : 'bg-white'} flex items-center justify-center text-slate-400 transition-all duration-300 ${link.color}`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8 font-mono text-[10px]">
        <span className={`text-slate-500 hover:${accentStyles.text} transition-all duration-300 select-all cursor-help`}>
          SHA_HASH: 0x98A1F3C_ACTIVE
        </span>
        
        <div className="flex items-center gap-2 text-emerald-500 animate-pulse">
          <Wifi className="w-3.5 h-3.5" />
          <span>LATENCY: {latency}ms</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-slate-500">
          <ShieldAlert className={`w-3.5 h-3.5 ${accentStyles.text}`} />
          <span>CYBER_COMPASS: SECURE_CORE</span>
        </div>
      </div>
    </footer>
  );
}

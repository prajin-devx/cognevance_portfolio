import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Cpu, Wrench, Lightbulb, Award, Terminal as TerminalIcon, 
  Heart, Target, ShieldCheck, Binary, Compass, Code, Figma, Sparkles, Zap, Brain
} from 'lucide-react';
import ThreeSkillSphere from './ThreeSkillSphere';
import { useTheme } from '../context/ThemeContext';
import profilePhoto from '../assets/images/prajin ppose.jpeg';

export default function TerminalView() {
  const { theme, themeStyles, accentStyles } = useTheme();

  // Skills Categories
  const skillsCategories = [
    {
      title: 'Programming Languages',
      icon: <Binary className={`w-4 h-4 ${accentStyles.text}`} />,
      skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Python (Beginner)', 'C Programming']
    },
    {
      title: 'Front-End Development',
      icon: <Code className={`w-4 h-4 ${accentStyles.text}`} />,
      skills: ['Responsive Web Design', 'Modern UI Development', 'Flexbox & CSS Grid', 'Interactive User Interfaces', 'Basic React (Learning)']
    },
    {
      title: 'Back-End Development',
      icon: <Cpu className={`w-4 h-4 ${accentStyles.text}`} />,
      skills: ['Node.js', 'Express.js', 'REST APIs', 'Authentication Basics', 'MongoDB (Learning)']
    },
    {
      title: 'Design & Creative Tools',
      icon: <Figma className={`w-4 h-4 ${accentStyles.text}`} />,
      skills: ['Figma', 'Canva', 'Adobe Express', 'DaVinci Resolve', 'CapCut', 'Adobe Creative Tools']
    },
    {
      title: 'Artificial Intelligence Tools',
      icon: <Sparkles className={`w-4 h-4 ${accentStyles.text}`} />,
      skills: [
        'ChatGPT', 'Google Gemini', 'Cursor AI', 'Stitch AI', 
        'Antigravity', 'GitHub Copilot', 'AI Website Builders', 'AI Coding Workflows'
      ]
    },
    {
      title: 'Development Tools',
      icon: <Wrench className={`w-4 h-4 ${accentStyles.text}`} />,
      skills: ['VS Code', 'Git', 'GitHub', 'npm', 'Postman', 'Chrome DevTools']
    }
  ];

  const areasOfInterest = [
    'Full Stack Web Development', 'Artificial Intelligence', 'UI/UX Design', 
    'Software Engineering', 'Electronics', 'Automation', 
    'Startup Development', 'Product Design', 'Digital Branding', 'Technology Innovation'
  ];

  const softSkills = [
    'Problem Solving', 'Leadership', 'Team Collaboration', 'Creative Thinking', 
    'Adaptability', 'Communication', 'Time Management', 'Continuous Learning', 
    'Attention to Detail', 'Project Management'
  ];

  const hobbies = [
    'Building creative web applications', 'Designing modern user interfaces', 
    'Video editing and cinematic storytelling', 'Poster and graphic design', 
    'Exploring the latest AI tools', 'Learning new technologies', 
    'Reading about startups and entrepreneurship', 'Watching technology and innovation content', 
    'Personal branding and content creation', 'Solving logical and mathematical problems', 
    'Participating in creative communities', 'Continuous self-improvement'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-7xl mx-auto space-y-20 py-6"
    >
      {/* Title Header */}
      <section className="space-y-4">
        <div className={`inline-block px-4 py-1.5 border ${themeStyles.border} ${themeStyles.panel} font-sans text-[9px] font-bold ${accentStyles.text} uppercase tracking-widest rounded-xl`}>
          SYSTEM_ID: PRJ-992-PORTFOLIO // BIO_DOSSIER
        </div>
        <h1 className={`font-sans text-[36px] md:text-[58px] font-black ${themeStyles.heading} tracking-tight leading-none uppercase`}>
          THE EXPERTISE <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentStyles.gradient} drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]`}>PORTAL</span>
        </h1>
        <p className="font-mono text-xs text-slate-500">
          UPLINK STABILIZED. PARSING PERSONAL INTEL & ACADEMIC DATASTREAM... _
        </p>
      </section>

      {/* Biography and Headshot Bento Grid - High Impact & Beautiful */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Professional Profile Photo with Cyber overlay & Telemetry */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className={`w-full border ${themeStyles.border} ${themeStyles.card} p-6 rounded-3xl relative overflow-hidden group shadow-lg flex flex-col items-center`}>
            {/* Corner Bracket Accents for a High-Tech Feel */}
            <div className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 ${accentStyles.border.split(' ')[0]} opacity-60`}></div>
            <div className={`absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 ${accentStyles.border.split(' ')[0]} opacity-60`}></div>
            <div className={`absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 ${accentStyles.border.split(' ')[0]} opacity-60`}></div>
            <div className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 ${accentStyles.border.split(' ')[0]} opacity-60`}></div>
            
            <div className="absolute top-4 left-10 font-mono text-[9px] text-slate-400">ID_BIO_IMAGE_PASS</div>
            
            <div className={`relative w-full aspect-[3/4] overflow-hidden border ${themeStyles.border} max-w-[340px] rounded-2xl shadow-md mt-6 transition-transform duration-500 hover:scale-[1.02]`}>
              {/* Profile Image with absolute referrer policy */}
              <img 
                src={profilePhoto} 
                alt="Shanmuga Prajin Portrait"
                className="w-full h-full object-cover filter brightness-100 dark:brightness-95 contrast-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
            </div>

            <div className={`w-full p-4 font-mono text-[9px] font-bold text-center tracking-[0.25em] ${accentStyles.text} mt-4`}>
              SHANMUGA_PRAJIN // CORE_NODE
            </div>
          </div>
        </div>

        {/* Right Side: Primary Bio Card (The provided narrative text) */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`border ${themeStyles.border} ${themeStyles.card} p-8 md:p-10 rounded-3xl shadow-lg relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-500 to-purple-600"></div>
            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block mb-4">
              /BIOGRAPHY_DOSSIER_CORE
            </span>
            <h2 className={`font-sans text-2xl md:text-3xl font-black ${themeStyles.heading} uppercase tracking-tight mb-6`}>
              Hi, I'm Shanmuga Prajin
            </h2>

            <div className={`space-y-5 font-sans text-sm ${themeStyles.text} leading-relaxed`}>
              <p>
                I am a passionate and ambitious technology enthusiast, creative designer, and engineer with a strong interest in building innovative digital experiences. I believe that technology is not just about writing code—it's about solving real-world problems, creating meaningful user experiences, and continuously learning to stay ahead in an ever-evolving digital landscape.
              </p>
              <p>
                I actively invest my time in mastering full-stack web development, modern cloud architectures, artificial intelligence orchestration, and high-fidelity media post-production. My approach bridges absolute performance engineering with immersive visual design.
              </p>
              <p>
                I enjoy transforming ideas into fully functional applications and visually appealing designs. Whether it is designing professional websites, developing cloud-native databases, creating engaging visual assets, or exploring the latest generative AI technologies, I am always excited to take on new challenges that expand my technical and creative boundaries.
              </p>
              <p>
                My goal is to combine engineering precision with cutting-edge software development to build impactful systems and products that make a difference.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: Technical Arsenal (Interactive Category Grid) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Award className={`w-5 h-5 ${accentStyles.text}`} />
          <h3 className={`font-sans text-lg font-bold uppercase tracking-widest ${themeStyles.heading}`}>
            Technical Arsenal
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsCategories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`border ${themeStyles.border} ${themeStyles.card} p-6 rounded-2xl shadow-md space-y-4 relative overflow-hidden`}
            >
              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className={`w-8 h-8 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} flex items-center justify-center`}>
                  {category.icon}
                </div>
                <h4 className={`font-sans text-xs font-bold ${themeStyles.heading} uppercase tracking-wider`}>
                  {category.title}
                </h4>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {category.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-sans font-medium border ${theme === 'dark' ? 'bg-black/30 border-white/5 text-slate-300 hover:border-cyan-500/20' : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-cyan-500/30'} transition-all`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Areas of Interest & Soft Skills (Side-by-side Bento layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Areas of Interest */}
        <section className={`border ${themeStyles.border} ${themeStyles.card} p-8 rounded-3xl shadow-lg relative overflow-hidden space-y-6`}>
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Compass className={`w-5 h-5 ${accentStyles.text}`} />
            <h3 className={`font-sans text-sm font-bold uppercase tracking-widest ${themeStyles.heading}`}>
              Areas of Interest
            </h3>
          </div>
          <p className={`font-sans text-xs ${themeStyles.text} leading-relaxed`}>
            I enjoy working across multiple physical and logical domains of modern technology, specializing in the following sectors:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {areasOfInterest.map((interest, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider border ${theme === 'dark' ? 'bg-[#08080a] border-white/5 text-cyan-400' : 'bg-slate-50 border-slate-200 text-cyan-600'} shadow-sm`}
              >
                {interest}
              </span>
            ))}
          </div>
        </section>

        {/* Soft Skills */}
        <section className={`border ${themeStyles.border} ${themeStyles.card} p-8 rounded-3xl shadow-lg relative overflow-hidden space-y-6`}>
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Brain className={`w-5 h-5 ${accentStyles.text}`} />
            <h3 className={`font-sans text-sm font-bold uppercase tracking-widest ${themeStyles.heading}`}>
              Soft Skills
            </h3>
          </div>
          <p className={`font-sans text-xs ${themeStyles.text} leading-relaxed`}>
            Core interpersonal synergies that empower seamless communication, dynamic team operations, and reliable project management:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {softSkills.map((skill, idx) => (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider border ${theme === 'dark' ? 'bg-[#08080a] border-white/5 text-purple-400' : 'bg-slate-50 border-slate-200 text-purple-600'} shadow-sm`}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

      </div>

      {/* SECTION 4: Hobbies & Interests - Scrollable Card Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart className={`w-5 h-5 ${accentStyles.text}`} />
          <h3 className={`font-sans text-lg font-bold uppercase tracking-widest ${themeStyles.heading}`}>
            Hobbies & Interests
          </h3>
        </div>

        <div className={`border ${themeStyles.border} ${themeStyles.card} p-8 rounded-3xl shadow-lg space-y-4`}>
          <p className={`font-sans text-xs ${themeStyles.text} leading-relaxed max-w-xl`}>
            Beyond core academics and hardware technology, I actively explore activities that fuel my inner creativity, logical reasoning, and aesthetic curiosity:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {hobbies.map((hobby, idx) => (
              <div 
                key={idx}
                className={`flex items-start gap-3 p-4 rounded-xl ${themeStyles.panel} border ${themeStyles.border} hover:border-cyan-500/20 transition-all duration-300`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${accentStyles.bg} ${accentStyles.glow} mt-1.5 flex-shrink-0`} />
                <span className={`font-sans text-xs font-semibold ${themeStyles.heading}`}>
                  {hobby}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: My Vision Quote Box (The WOW Factor!) */}
      <section className="pt-6">
        <div className={`relative border ${themeStyles.border} bg-gradient-to-r ${theme === 'dark' ? 'from-[#12121a] to-[#1a1a2e]' : 'from-slate-50 to-indigo-50/50'} p-12 rounded-3xl overflow-hidden shadow-2xl text-center flex flex-col items-center justify-center space-y-6`}>
          <div className="absolute inset-0 bg-radial from-transparent via-black/5 to-transparent pointer-events-none" />
          <Target className="w-10 h-10 text-purple-500 animate-pulse" />
          
          <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest block">
            /THE_VISION_STATEMENT
          </span>
          
          <h3 className={`font-sans text-xl md:text-3xl font-black ${themeStyles.heading} uppercase tracking-tight max-w-3xl leading-snug`}>
            "Driven by curiosity, powered by creativity, and committed to building technology that creates lasting impact."
          </h3>
          
          <p className={`font-sans text-xs ${themeStyles.text} max-w-2xl leading-relaxed`}>
            I aspire to become a globally recognized technology professional who creates innovative digital products that make a real impact. My long-term goal is to combine engineering, software development, artificial intelligence, and creative design to build scalable solutions, contribute to meaningful projects, and eventually establish successful technology ventures.
          </p>

          <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-black/10 dark:bg-white/5 rounded-xl border ${themeStyles.border}`}>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-sans text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              CONSISTENCY. CURIOSITY. GROWTH.
            </span>
          </div>
        </div>
      </section>

      {/* Interactive 3D Orbit Skill Constellation */}
      <section className={`border ${themeStyles.border} ${themeStyles.card} p-8 rounded-3xl shadow-lg`}>
        <div className="text-center space-y-2 mb-6">
          <h3 className={`font-sans text-sm font-bold ${accentStyles.text} uppercase tracking-widest`}>
            Interactive 3D Skill Constellation
          </h3>
          <p className={`font-sans text-xs ${themeStyles.text} max-w-md mx-auto leading-relaxed`}>
            Rotate, click, and inspect the responsive 3D quantum mesh model below to analyze how Shanmuga's technological parameters combine.
          </p>
        </div>
        <ThreeSkillSphere />
      </section>

    </motion.div>
  );
}

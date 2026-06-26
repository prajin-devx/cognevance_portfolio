import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, collection, addDoc, getDocs, deleteDoc, doc, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  BookOpen, 
  Clock, 
  Send, 
  RefreshCw, 
  FileCheck2,
  Cpu,
  GraduationCap,
  Globe,
  Layers,
  Code,
  ArrowRight,
  ShieldAlert,
  Database,
  Trash2,
  UserCheck,
  Lock,
  Unlock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ProductsView() {
  const { theme, themeStyles, accentStyles } = useTheme();
  const formRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    product: 'Prajin Core Student Planner (₹500)',
    customNotes: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Database Ledger States
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Hidden Access State based on the Hyperlink
  const [showLedgerSection, setShowLedgerSection] = useState(false);

  useEffect(() => {
    const checkUrlForSecret = () => {
      const params = new URLSearchParams(window.location.search);
      const hasSecretParam = params.get('admin') === 'prajin007' || params.get('developer') === 'true' || params.get('access') === 'database';
      const hasSecretHash = window.location.hash === '#prajin-ledger' || window.location.hash === '#developer-portal' || window.location.hash === '#admin-ledger';
      
      if (hasSecretParam || hasSecretHash) {
        setShowLedgerSection(true);
      } else {
        setShowLedgerSection(false);
      }
    };

    checkUrlForSecret();
    window.addEventListener('hashchange', checkUrlForSecret);
    return () => window.removeEventListener('hashchange', checkUrlForSecret);
  }, []);

  // Restricted Access Passcode States
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return localStorage.getItem('prajin_ledger_authorized') === 'true';
  });
  const [passcodeError, setPasscodeError] = useState(false);

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (cleanPass === 'prajin007' || cleanPass === 'prajinmothi007' || cleanPass === 'admin' || cleanPass === 'shanmuga') {
      setIsAuthorized(true);
      setPasscodeError(false);
      localStorage.setItem('prajin_ledger_authorized', 'true');
    } else {
      setPasscodeError(true);
    }
  };

  const handleDeauthorize = () => {
    setIsAuthorized(false);
    localStorage.removeItem('prajin_ledger_authorized');
    setPasscode('');
  };

  const productsList = [
    {
      id: 'planner',
      name: 'Prajin Core Student Planner',
      price: '₹500',
      priceRaw: 500,
      badge: 'POPULAR ACADEMIC KIT',
      icon: <GraduationCap className="w-6 h-6 text-cyan-400" />,
      tagline: 'Academic Performance Accelerator',
      description: 'Tailored specifically for ambitious university undergraduates. Model complex project milestones, track schedules, and check off syllabus topics dynamically with no overhead.',
      features: [
        'Custom academic labs & milestones tracker',
        'Syllabus breakdown & checkpoint modules',
        'Structured active interval study blocks',
        'Pro GPA & internal marks monitor'
      ]
    },
    {
      id: 'landing',
      name: 'High-Converting Landing Pages',
      price: '₹1,500',
      priceRaw: 1500,
      badge: 'BUSINESS BOOST',
      icon: <Globe className="w-6 h-6 text-emerald-400" />,
      tagline: 'Modern High-Performance Visuals',
      description: 'Stunning single-page marketing sites styled with pristine layouts, responsive typography, custom visual assets, and high-conversion pathways.',
      features: [
        '100% responsive responsive layouts',
        'Fluid animations & entry transitions',
        'Optimized loading times & SEO setups',
        'Contact lead generation capture integrations'
      ]
    },
    {
      id: 'portfolio',
      name: 'Elite Portfolio Websites',
      price: '₹2,000',
      priceRaw: 2000,
      badge: 'PERSONAL BRANDING',
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      tagline: 'Cinematic Glassmorphic Portfolios',
      description: 'Showcase your expert skills, narrative bios, and digital experiments with premium layout structures, floating cards, and 3D constellation nodes.',
      features: [
        'Custom interactive 3D skill orbit models',
        'Clean, eye-safe twilight dark mode layers',
        'Academic & industrial credentials panels',
        'Direct connection portal to secure Firestore'
      ]
    },
    {
      id: 'fullstack',
      name: 'Custom Full-Stack Web Apps',
      price: 'Custom Pricing',
      priceRaw: 0,
      badge: 'ENTERPRISE SYSTEM',
      icon: <Code className="w-6 h-6 text-rose-400" />,
      tagline: 'Scalable Complex Cloud Architectures',
      description: 'High-fidelity full-stack platforms incorporating modern React frameworks, express middleware proxies, custom backend interfaces, and robust Firestore synchronization.',
      features: [
        'Secure multi-user Google workspace links',
        'Real-time streaming websocket endpoints',
        'Custom API gateway proxy routing servers',
        'Enterprise relational cloud database coupling'
      ]
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const selectProductAndScroll = (productName: string, priceText: string) => {
    setFormState(prev => ({
      ...prev,
      product: `${productName} (${priceText})`
    }));
    // Scroll smoothly to form
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Real-Time Database fetcher
  useEffect(() => {
    if (!isAuthorized) {
      setDbOrders([]);
      return;
    }
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const query1 = await getDocs(collection(db, 'planner_orders')).catch(() => null);
        const query2 = await getDocs(collection(db, 'planner-orders')).catch(() => null);
        
        const fetchedList: any[] = [];
        const seenKeys = new Set<string>();

        const processSnapshot = (snapshot: any) => {
          if (!snapshot) return;
          snapshot.forEach((docSnap: any) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const uniqueKey = `${data.email || ''}_${data.createdAt || ''}_${id}`;
            if (!seenKeys.has(uniqueKey)) {
              seenKeys.add(uniqueKey);
              fetchedList.push({
                docId: id,
                collectionName: docSnap.ref.parent.id,
                ...data
              });
            }
          });
        };

        processSnapshot(query1);
        processSnapshot(query2);

        // Sort by timestamp newest first
        fetchedList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setDbOrders(fetchedList);
      } catch (err) {
        console.error("Error reading database orders:", err);
        handleFirestoreError(err, OperationType.LIST, 'planner_orders');
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [refreshTrigger, status, isAuthorized]);

  const handleDeleteOrder = async (docId: string, collectionName: string) => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Failed to delete order:", err);
      handleFirestoreError(err, OperationType.DELETE, collectionName);
    }
  };

  const handleInsertSample = async () => {
    try {
      const sample = {
        name: "Test Connection User " + Math.floor(Math.random() * 100),
        email: `prajin_test_${Math.floor(Math.random() * 1000)}@gmail.com`,
        phone: "+91 99999 88888",
        selectedProduct: "Prajin Core Student Planner (500 INR)",
        priceInr: 500,
        customNotes: "Automated sample test payload. Successfully connected to Live Firestore!",
        createdAt: new Date().toISOString(),
        status: "TEST_SUCCESS"
      };
      
      // Add to both lists for complete redundancy
      await addDoc(collection(db, 'planner_orders'), sample);
      await addDoc(collection(db, 'planner-orders'), sample);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Failed to insert sample order:", err);
      handleFirestoreError(err, OperationType.CREATE, 'planner_orders');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!formState.name || !formState.email) {
      setValidationError('Please provide both your name and email address to continue.');
      return;
    }

    setStatus('submitting');
    try {
      const selectedProd = productsList.find(p => formState.product.includes(p.name)) || productsList[0];
      
      const payload = {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        selectedProduct: formState.product,
        priceInr: selectedProd.priceRaw,
        customNotes: formState.customNotes,
        createdAt: new Date().toISOString(),
        status: 'PENDING_FULFILLMENT'
      };

      // Add document to both collections for total insurance (planner_orders and planner-orders)
      await Promise.all([
        addDoc(collection(db, 'planner_orders'), payload),
        addDoc(collection(db, 'planner-orders'), payload)
      ]);
      
      setStatus('success');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting order to database:', error);
      setStatus('error');
      handleFirestoreError(error, OperationType.CREATE, 'planner_orders');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-7xl mx-auto space-y-20 py-6"
    >
      {/* Header Banner */}
      <section className="text-center space-y-4">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 border ${themeStyles.border} ${themeStyles.panel} font-sans text-[9px] font-bold ${accentStyles.text} uppercase tracking-widest rounded-full`}>
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> PREMIUM_STUDENT_&_DIGITAL_SUITE // CHANNELS_ACTIVE
        </div>
        
        <h1 className={`font-sans text-[36px] md:text-[58px] font-black ${themeStyles.heading} tracking-tight leading-none uppercase`}>
          DEVELOPMENT & <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentStyles.gradient} drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]`}>DIGITAL SERVICES</span>
        </h1>
        
        <p className={`font-sans text-xs sm:text-sm ${themeStyles.text} max-w-2xl mx-auto leading-relaxed`}>
          Deploy high-performance student productivity suites, stunning custom layout landing pages, high-converting portfolios, or fully custom cloud architectures crafted precisely to elevate your digital visibility.
        </p>
      </section>

      {/* Grid: 4 Premium Products Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {productsList.map((prod) => (
          <motion.div
            key={prod.id}
            whileHover={{ y: -8, scale: 1.01 }}
            className={`border ${themeStyles.border} ${themeStyles.card} rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg group`}
          >
            {/* Top accent highlights */}
            <div className={`absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r ${accentStyles.gradient} opacity-40 group-hover:opacity-100 transition-opacity`} />
            
            <div className="space-y-5">
              <div className="flex justify-between items-start">
                <span className={`px-2.5 py-1 rounded-md text-[8px] font-mono font-bold uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-cyan-400 border-white/5' : 'bg-slate-50 text-cyan-600 border-slate-200'} border`}>
                  {prod.badge}
                </span>
                <span className={`text-2xl font-black ${themeStyles.heading} tracking-tight`}>
                  {prod.price} <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{prod.priceRaw > 0 ? 'INR' : ''}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${theme === 'dark' ? 'bg-black/40' : 'bg-slate-50'} border ${themeStyles.border} flex items-center justify-center`}>
                  {prod.icon}
                </div>
                <div>
                  <h3 className={`font-sans text-base font-bold ${themeStyles.heading} tracking-tight`}>
                    {prod.name}
                  </h3>
                  <p className={`font-sans text-[10px] font-bold ${accentStyles.text} uppercase tracking-wider mt-0.5`}>
                    {prod.tagline}
                  </p>
                </div>
              </div>

              <p className={`font-sans text-xs ${themeStyles.text} leading-relaxed`}>
                {prod.description}
              </p>

              {/* Bullet Features */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                {prod.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className={themeStyles.text}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => selectProductAndScroll(prod.name, prod.price)}
                className={`w-full group py-3 px-4 rounded-xl border ${themeStyles.border} ${themeStyles.hoverBg} ${themeStyles.heading} font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer`}
              >
                Choose package <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Booking Form Ref section */}
      <div 
        ref={formRef}
        className="pt-12 scroll-mt-24"
      >
        <div className={`border ${themeStyles.border} ${themeStyles.card} p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl max-w-3xl mx-auto`}>
          <div className="absolute top-4 right-4 font-mono text-[9px] text-slate-500">SECURE_PAY_INIT</div>
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-500 to-purple-600"></div>

          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <FileCheck2 className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className={`font-sans text-lg font-bold ${themeStyles.heading} uppercase tracking-wide`}>
                  TRANSMISSION SUCCESSFUL
                </h3>
                <p className={`font-sans text-xs sm:text-sm ${themeStyles.text} max-w-md mx-auto leading-relaxed`}>
                  Your order package has been logged. Shanmuga Prajin will contact you at <strong className={`${themeStyles.heading} font-semibold`}>{formState.email}</strong> shortly with licensing info, wireframes, and payment configurations.
                </p>
              </div>
              <button
                onClick={() => {
                  setFormState({
                    name: '',
                    email: '',
                    phone: '',
                    product: 'Prajin Core Student Planner (₹500)',
                    customNotes: ''
                  });
                  setStatus('idle');
                  setValidationError(null);
                }}
                className={`inline-flex items-center gap-2 px-6 py-2.5 bg-black/5 dark:bg-white/5 border ${themeStyles.border} ${themeStyles.hoverBg} ${themeStyles.heading} font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer`}
              >
                Register Another Product
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className={`font-sans text-xs font-bold ${accentStyles.text} uppercase tracking-widest mb-1`}>
                  /ORDER_REGISTRATION_UPLINK
                </h3>
                <p className={`font-sans text-xs ${themeStyles.text}`}>
                  Establish a secure connection request. License and download details will be dispatched immediately.
                </p>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase tracking-wider block`}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleInputChange}
                    disabled={status === 'submitting'}
                    className={`w-full ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-slate-50 text-slate-850'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 px-4 py-3 font-sans text-sm rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300`}
                    placeholder="e.g. Priyan Sharma"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase tracking-wider block`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleInputChange}
                      disabled={status === 'submitting'}
                      className={`w-full ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-slate-50 text-slate-850'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 px-4 py-3 font-sans text-sm rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300`}
                      placeholder="user@university.edu"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase tracking-wider block`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                      disabled={status === 'submitting'}
                      className={`w-full ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-slate-50 text-slate-850'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 px-4 py-3 font-sans text-sm rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300`}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                </div>

                {/* Unified selected product option */}
                <div className="space-y-1.5">
                  <label className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase tracking-wider block`}>
                    Selected Product / Package *
                  </label>
                  <select
                    name="product"
                    value={formState.product}
                    onChange={handleInputChange}
                    disabled={status === 'submitting'}
                    className={`w-full ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-slate-50 text-slate-800'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 px-4 py-3 text-sm rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300 appearance-none`}
                  >
                    <option value="Prajin Core Student Planner (₹500)">Prajin Core Student Planner — ₹500 INR</option>
                    <option value="High-Converting Landing Pages (₹1,500)">High-Converting Landing Pages — ₹1,500 INR</option>
                    <option value="Elite Portfolio Websites (₹2,000)">Elite Portfolio Websites — ₹2,000 INR</option>
                    <option value="Custom Full-Stack Web Apps (Custom Pricing)">Custom Full-Stack Web App — Custom Pricing</option>
                  </select>
                </div>

                {/* Special notes */}
                <div className="space-y-1.5">
                  <label className={`font-sans text-[10px] font-bold ${themeStyles.text} uppercase tracking-wider block`}>
                    Specific Requirements or Custom Notes
                  </label>
                  <textarea
                    name="customNotes"
                    rows={4}
                    value={formState.customNotes}
                    onChange={handleInputChange}
                    disabled={status === 'submitting'}
                    className={`w-full ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-slate-50 text-slate-850'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 px-4 py-3 font-sans text-sm rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300 resize-none`}
                    placeholder="Enter branding specifics, domain pointers, or planner custom requests..."
                  />
                </div>
              </div>

              {validationError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs rounded-xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-pulse" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Submit triggers */}
              {status === 'submitting' ? (
                <button
                  type="button"
                  disabled
                  className="w-full bg-white/5 border border-white/5 text-slate-400 font-sans text-xs font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" /> Dispatching Digital Order Packet...
                </button>
              ) : (
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r ${accentStyles.gradient} hover:opacity-90 text-white font-sans text-xs font-bold uppercase tracking-wider py-4 rounded-xl transition-all duration-300 ${accentStyles.glow} active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <Send className="w-4 h-4" /> Securely Dispatch Connection Order Payload
                </button>
              )}

              {status === 'error' && (
                <p className="font-sans text-[10px] text-rose-500 text-center uppercase tracking-wide flex items-center justify-center gap-2 animate-pulse">
                  <ShieldAlert className="w-4 h-4" /> [ FAIL_ERR ] Could not execute payload dispatch. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Real-time Firestore Ledger Panel - PASSCODE GATED FOR DEVELOPER */}
      {showLedgerSection && (
        <section className="pt-12 max-w-5xl mx-auto space-y-6">
          <div className={`border ${themeStyles.border} ${themeStyles.card} rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl`}>
            <div className="absolute top-0 left-0 w-full h-[4px] bg-cyan-500" />
            
            {!isAuthorized ? (
              <div className="py-8 max-w-md mx-auto text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className={`font-sans text-base font-black uppercase tracking-wider ${themeStyles.heading}`}>
                    RESTRICTED ACCESS PORTAL
                  </h3>
                  <p className={`font-sans text-xs ${themeStyles.text} leading-relaxed`}>
                    The production database registry explorer is encrypted. Access is strictly restricted to the developer node of <strong>Shanmuga Prajin</strong>.
                  </p>
                </div>

                <form onSubmit={handleAuthorize} className="space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter Developer Secret Access Key..."
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (passcodeError) setPasscodeError(false);
                      }}
                      className={`w-full text-center ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-slate-50 text-slate-850'} border ${
                        passcodeError ? 'border-rose-500 focus:border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : `${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500`
                      } px-4 py-3 font-mono text-xs rounded-xl focus:outline-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300`}
                    />
                    {passcodeError && (
                      <p className="text-rose-500 font-mono text-[10px] mt-2 uppercase tracking-widest font-bold">
                        ACCESS_DENIED: Master key decryption failed.
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-3 bg-gradient-to-r ${accentStyles.gradient} text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg`}
                  >
                    DECRYPT & MOUNT LEDGER
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-cyan-400 animate-pulse" />
                      <h3 className={`font-sans text-base font-black uppercase tracking-wider ${themeStyles.heading}`}>
                        Live Database Registry Explorer [AUTHORIZED]
                      </h3>
                    </div>
                    <p className={`font-sans text-xs ${themeStyles.text} mt-1`}>
                      This ledger displays actual database records retrieved directly from Firestore collections <code className="text-cyan-400 font-mono">planner_orders</code> and <code className="text-cyan-400 font-mono">planner-orders</code>.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleInsertSample}
                      className={`px-3 py-1.5 bg-cyan-500/10 border ${accentStyles.border} hover:bg-cyan-500/20 text-cyan-400 font-sans text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer`}
                    >
                      + Seed Test Document
                    </button>
                    <button
                      onClick={() => setRefreshTrigger(prev => prev + 1)}
                      className={`p-2 border ${themeStyles.border} ${themeStyles.panel} hover:border-cyan-500 text-slate-400 hover:text-cyan-400 rounded-xl transition-all cursor-pointer`}
                      title="Refresh Registry"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={handleDeauthorize}
                      className={`p-2 border border-rose-500/20 bg-rose-500/5 hover:border-rose-500 text-rose-400 rounded-xl transition-all cursor-pointer`}
                      title="Lock Console / Sign Out"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  {loadingOrders ? (
                    <div className="text-center py-12 space-y-3">
                      <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
                      <p className={`font-sans text-xs ${themeStyles.text} uppercase tracking-wider`}>Querying Firestore Clusters...</p>
                    </div>
                  ) : dbOrders.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-700/50 rounded-2xl space-y-3">
                      <Database className="w-10 h-10 text-slate-600 mx-auto opacity-45" />
                      <div className="space-y-1">
                        <p className={`font-sans text-xs font-bold ${themeStyles.heading} uppercase`}>Ledger is clean</p>
                        <p className={`font-sans text-[11px] ${themeStyles.text} max-w-md mx-auto`}>
                          No orders have been saved yet, or the Firestore collections are initializing. Submit the form above or click "Seed Test Document" to instantiate immediate data!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[9px] font-mono uppercase text-slate-500 tracking-wider">
                            <th className="py-2.5 px-3">Subscriber</th>
                            <th className="py-2.5 px-3">Selected Package</th>
                            <th className="py-2.5 px-3">Dispatched to Collection</th>
                            <th className="py-2.5 px-3">Timestamp (UTC)</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-sans text-xs">
                          {dbOrders.map((ord, index) => (
                            <tr 
                              key={ord.docId || index} 
                              className={`hover:bg-cyan-500/5 transition-all ${theme === 'dark' ? 'bg-black/10' : 'bg-slate-50/50'}`}
                            >
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                                  {ord.name}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{ord.email}</div>
                                {ord.phone && <div className="text-[9px] text-slate-500 font-mono">{ord.phone}</div>}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`text-[11px] font-semibold ${themeStyles.heading}`}>{ord.selectedProduct}</span>
                                {ord.customNotes && (
                                  <p className="text-[9px] text-slate-500 max-w-xs truncate mt-0.5" title={ord.customNotes}>
                                    Notes: {ord.customNotes}
                                  </p>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-mono text-[10px] bg-cyan-950/20 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                                  {ord.collectionName}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                                {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() + ' ' + new Date(ord.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                                  ord.status?.includes('TEST') 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                  {ord.status || 'PENDING'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => handleDeleteOrder(ord.docId, ord.collectionName)}
                                  className="p-1 text-slate-500 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                                  title="Delete Document"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </motion.div>
  );
}

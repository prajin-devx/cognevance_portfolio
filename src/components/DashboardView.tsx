import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, collection, getDocs, deleteDoc, doc, addDoc, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  Database, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MessageSquare, 
  Trash2, 
  RefreshCw, 
  Search, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  ArrowUpRight,
  Filter,
  Layers,
  Inbox
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface OrderItem {
  docId: string;
  collectionName: string;
  name: string;
  email: string;
  phone?: string;
  selectedProduct: string;
  priceInr: number;
  customNotes?: string;
  createdAt: string;
  status: string;
}

interface InquiryItem {
  docId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: string;
}

export default function DashboardView() {
  const { theme, themeStyles, accentStyles } = useTheme();

  // Authorization states
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return localStorage.getItem('prajin_ledger_authorized') === 'true';
  });
  const [passcodeError, setPasscodeError] = useState(false);

  // Data states
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Search and Filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [inquirySearch, setInquirySearch] = useState('');

  // Active sub-tab inside Dashboard
  const [activeSubTab, setActiveSubTab] = useState<'METRICS' | 'ORDERS' | 'INQUIRIES'>('METRICS');

  // Load all records from Firestore
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Orders from both collections (to merge)
        const q1 = await getDocs(collection(db, 'planner_orders')).catch(() => null);
        const q2 = await getDocs(collection(db, 'planner-orders')).catch(() => null);
        
        const mergedOrders: OrderItem[] = [];
        const seenOrderKeys = new Set<string>();

        const processOrders = (snapshot: any) => {
          if (!snapshot) return;
          snapshot.forEach((docSnap: any) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const uniqueKey = `${data.email || ''}_${data.createdAt || ''}_${id}`;
            if (!seenOrderKeys.has(uniqueKey)) {
              seenOrderKeys.add(uniqueKey);
              mergedOrders.push({
                docId: id,
                collectionName: docSnap.ref.parent.id,
                name: data.name || 'Anonymous',
                email: data.email || '',
                phone: data.phone || '',
                selectedProduct: data.selectedProduct || 'Prajin Core Student Planner (₹500)',
                priceInr: Number(data.priceInr) || 0,
                customNotes: data.customNotes || '',
                createdAt: data.createdAt || new Date().toISOString(),
                status: data.status || 'PENDING_FULFILLMENT'
              });
            }
          });
        };

        processOrders(q1);
        processOrders(q2);

        // Sort orders newest first
        mergedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(mergedOrders);

        // 2. Fetch Inquiries/Contact messages
        const qInquiries = await getDocs(collection(db, 'contact_messages')).catch(() => null);
        const fetchedInquiries: InquiryItem[] = [];
        
        if (qInquiries) {
          qInquiries.forEach((docSnap: any) => {
            const data = docSnap.data();
            fetchedInquiries.push({
              docId: docSnap.id,
              name: data.name || 'Anonymous',
              email: data.email || '',
              subject: data.subject || 'GENERAL_QUERY',
              message: data.message || '',
              createdAt: data.createdAt || new Date().toISOString(),
              status: data.status || 'NEW_TRANSMISSION'
            });
          });
        }

        // Sort inquiries newest first
        fetchedInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInquiries(fetchedInquiries);

      } catch (err) {
        console.error('Error fetching dashboard records:', err);
        handleFirestoreError(err, OperationType.LIST, 'planner_orders');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthorized, refreshTrigger]);

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'prajin007' || passcode.toLowerCase() === 'shanmuga' || passcode === 'prajinmothi007') {
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

  // Actions
  const handleDeleteOrder = async (docId: string, colName: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this order record?')) return;
    try {
      await deleteDoc(doc(db, colName, docId));
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to delete order:', err);
      handleFirestoreError(err, OperationType.DELETE, colName);
    }
  };

  const handleDeleteInquiry = async (docId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry message?')) return;
    try {
      await deleteDoc(doc(db, 'contact_messages', docId));
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
      handleFirestoreError(err, OperationType.DELETE, 'contact_messages');
    }
  };

  const handleSeedSampleSales = async () => {
    try {
      const sample = {
        name: "Seed Customer " + Math.floor(Math.random() * 100),
        email: `client_${Math.floor(Math.random() * 900) + 100}@corporation.net`,
        phone: "+91 " + (Math.floor(Math.random() * 90000) + 10000) + " " + (Math.floor(Math.random() * 90000) + 10000),
        selectedProduct: "Elite Portfolio Websites (₹2,000)",
        priceInr: 2000,
        customNotes: "Automated test sale injected to test dashboard visualizations.",
        createdAt: new Date().toISOString(),
        status: "COMPLETED"
      };
      await addDoc(collection(db, 'planner_orders'), sample);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.CREATE, 'planner_orders');
    }
  };

  // Math metrics
  const totalSalesCount = orders.length;
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.priceInr || 0), 0);
  const pendingFulfillments = orders.filter(o => o.status === 'PENDING_FULFILLMENT').length;
  const completedSales = orders.filter(o => o.status === 'COMPLETED' || o.status === 'TEST_SUCCESS').length;
  const totalInquiries = inquiries.length;
  const avgOrderValue = totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0;

  // Filter records
  const filteredOrders = orders.filter(ord => {
    const matchesSearch = 
      ord.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.selectedProduct.toLowerCase().includes(orderSearch.toLowerCase());
    
    if (orderFilter === 'ALL') return matchesSearch;
    return matchesSearch && ord.status === orderFilter;
  });

  const filteredInquiries = inquiries.filter(inq => {
    return (
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.message.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.subject.toLowerCase().includes(inquirySearch.toLowerCase())
    );
  });

  // Product aggregations for charts
  const productSummary = orders.reduce((acc: {[key: string]: {count: number, revenue: number}}, ord) => {
    let cleanName = 'Other Packages';
    if (ord.selectedProduct.includes('Planner')) cleanName = 'Student Planner';
    else if (ord.selectedProduct.includes('Landing')) cleanName = 'Landing Pages';
    else if (ord.selectedProduct.includes('Portfolio')) cleanName = 'Portfolio Sites';
    else if (ord.selectedProduct.includes('Full-Stack')) cleanName = 'Full-Stack Apps';

    if (!acc[cleanName]) acc[cleanName] = { count: 0, revenue: 0 };
    acc[cleanName].count += 1;
    acc[cleanName].revenue += ord.priceInr;
    return acc;
  }, {} as {[key: string]: {count: number, revenue: number}});

  const maxProductRevenue = (Object.values(productSummary) as {count: number, revenue: number}[]).reduce((max, val) => Math.max(max, val.revenue), 1);

  if (!isAuthorized) {
    return (
      <div className="py-12 max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className={`font-sans text-lg font-black uppercase tracking-wider ${themeStyles.heading}`}>
            SECURE LEDGER DECIPHER
          </h2>
          <p className={`font-sans text-xs ${themeStyles.text} leading-relaxed`}>
            Authorized access node. Please enter the master decryption protocol key for <strong>Shanmuga Prajin</strong>.
          </p>
        </div>

        <form onSubmit={handleAuthorize} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter Master Decryption Protocol..."
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
                DECRYPTION_FAILED: INSUFFICIENT PRIVILEGES.
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full py-3.5 bg-gradient-to-r ${accentStyles.gradient} text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg`}
          >
            DECIPHER & ESTABLISH LINK
          </button>
        </form>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Header telemetry banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h1 className={`font-sans text-2xl md:text-3xl font-black ${themeStyles.heading} uppercase tracking-tight`}>
              Central Ledger Dashboard
            </h1>
          </div>
          <p className={`font-sans text-xs ${themeStyles.text} mt-1`}>
            Real-time analytics engine tracking premium suite sales, student planner order pipelines, and incoming secure client transmissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSeedSampleSales}
            className={`px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-400 font-sans text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer`}
          >
            + Seed Test Sale
          </button>
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className={`p-2 border ${themeStyles.border} ${themeStyles.panel} hover:border-cyan-500 text-slate-400 hover:text-cyan-400 rounded-xl transition-all cursor-pointer`}
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleDeauthorize}
            className={`p-2 border border-rose-500/20 bg-rose-500/5 hover:border-rose-500 text-rose-400 rounded-xl transition-all cursor-pointer`}
            title="Lock Ledger Console"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Internal Navigation Subtabs */}
      <div className="flex border-b border-white/5 pb-px gap-2">
        <button
          onClick={() => setActiveSubTab('METRICS')}
          className={`px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeSubTab === 'METRICS' 
              ? `${accentStyles.border.split(' ')[0]} ${themeStyles.heading}` 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Metrics & Breakdown
        </button>
        <button
          onClick={() => setActiveSubTab('ORDERS')}
          className={`px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'ORDERS' 
              ? `${accentStyles.border.split(' ')[0]} ${themeStyles.heading}` 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Sales Registry 
          <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded-full font-mono font-bold">
            {totalSalesCount}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('INQUIRIES')}
          className={`px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'INQUIRIES' 
              ? `${accentStyles.border.split(' ')[0]} ${themeStyles.heading}` 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Inquiry Uplinks
          <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full font-mono font-bold">
            {totalInquiries}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: Metrics & Breakdown */}
      {activeSubTab === 'METRICS' && (
        <div className="space-y-8">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-6 border ${themeStyles.border} ${themeStyles.card} rounded-2xl relative overflow-hidden shadow-lg`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none" />
              <div className="space-y-1.5">
                <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  /GROSS_SALES_VOLUME
                </span>
                <h4 className={`text-3xl font-black ${themeStyles.heading} tracking-tight font-mono`}>
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Gross Registered Income</span>
                </div>
              </div>
            </div>

            <div className={`p-6 border ${themeStyles.border} ${themeStyles.card} rounded-2xl relative overflow-hidden shadow-lg`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
              <div className="space-y-1.5">
                <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  /SALES_TRANSMISSIONS
                </span>
                <h4 className={`text-3xl font-black ${themeStyles.heading} tracking-tight font-mono`}>
                  {totalSalesCount}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>{completedSales} Completed // {pendingFulfillments} Pending</span>
                </div>
              </div>
            </div>

            <div className={`p-6 border ${themeStyles.border} ${themeStyles.card} rounded-2xl relative overflow-hidden shadow-lg`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />
              <div className="space-y-1.5">
                <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  /CLIENT_INQUIRIES
                </span>
                <h4 className={`text-3xl font-black ${themeStyles.heading} tracking-tight font-mono`}>
                  {totalInquiries}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-purple-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Uplink submissions logged</span>
                </div>
              </div>
            </div>

            <div className={`p-6 border ${themeStyles.border} ${themeStyles.card} rounded-2xl relative overflow-hidden shadow-lg`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
              <div className="space-y-1.5">
                <span className="font-sans text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  /AVERAGE_ORDER_VALUE
                </span>
                <h4 className={`text-3xl font-black ${themeStyles.heading} tracking-tight font-mono`}>
                  ₹{avgOrderValue.toLocaleString('en-IN')}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>Calculated ticket size</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphic analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales breakdown by package */}
            <div className={`lg:col-span-2 border ${themeStyles.border} ${themeStyles.card} rounded-2xl p-6 shadow-lg space-y-6`}>
              <div>
                <h3 className={`font-sans text-sm font-bold uppercase tracking-wider ${themeStyles.heading}`}>
                  Revenue & Sales Distribution By Package
                </h3>
                <p className={`font-sans text-xs ${themeStyles.text}`}>
                  Aggregated performance values of listed premium catalog products.
                </p>
              </div>

              <div className="space-y-4">
                {(Object.entries(productSummary) as [string, {count: number, revenue: number}][]).map(([prodName, stats]) => {
                  const percentage = Math.round((stats.revenue / maxProductRevenue) * 100) || 5;
                  return (
                    <div key={prodName} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-sans">
                        <span className={`font-bold ${themeStyles.heading}`}>{prodName}</span>
                        <span className="font-mono text-slate-500">
                          {stats.count} sold // <strong className="text-cyan-400">₹{stats.revenue.toLocaleString('en-IN')}</strong>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-950/30 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {Object.keys(productSummary).length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-xs font-mono uppercase">
                    NO_SALES_AGGREGATED: Registry database is currently clean.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Status Gauge */}
            <div className={`border ${themeStyles.border} ${themeStyles.card} rounded-2xl p-6 shadow-lg flex flex-col justify-between`}>
              <div className="space-y-1.5">
                <h3 className={`font-sans text-sm font-bold uppercase tracking-wider ${themeStyles.heading}`}>
                  Fulfillment Status Tracker
                </h3>
                <p className={`font-sans text-xs ${themeStyles.text}`}>
                  Process status of client contracts and student study suite licenses.
                </p>
              </div>

              <div className="py-6 flex items-center justify-center relative">
                {/* Custom minimalist SVG Ring chart */}
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="55"
                    className="stroke-slate-900/40"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="55"
                    className="stroke-cyan-400"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={345}
                    strokeDashoffset={345 - (345 * (completedSales / Math.max(totalSalesCount, 1)))}
                  />
                </svg>
                <div className="absolute text-center space-y-0.5">
                  <span className={`text-2xl font-black font-mono ${themeStyles.heading}`}>
                    {totalSalesCount > 0 ? Math.round((completedSales / totalSalesCount) * 100) : 0}%
                  </span>
                  <span className="block text-[8px] text-slate-500 font-mono uppercase tracking-widest">FULFILLED</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-4 border-t border-white/5">
                <div className="p-2 bg-black/10 rounded-xl">
                  <span className="block text-[10px] text-slate-500">PENDING</span>
                  <span className={`font-bold ${themeStyles.heading}`}>{pendingFulfillments}</span>
                </div>
                <div className="p-2 bg-black/10 rounded-xl">
                  <span className="block text-[10px] text-slate-500">COMPLETE</span>
                  <span className={`font-bold ${themeStyles.heading}`}>{completedSales}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Sales Registry */}
      {activeSubTab === 'ORDERS' && (
        <div className={`border ${themeStyles.border} ${themeStyles.card} rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client or product..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-slate-50 text-slate-850'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 text-xs rounded-xl focus:outline-none transition-all`}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <button
                onClick={() => setOrderFilter('ALL')}
                className={`px-3 py-1 font-sans text-[10px] font-bold uppercase rounded-lg border transition-all ${
                  orderFilter === 'ALL' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : `${themeStyles.border} text-slate-500`
                }`}
              >
                All States
              </button>
              <button
                onClick={() => setOrderFilter('PENDING_FULFILLMENT')}
                className={`px-3 py-1 font-sans text-[10px] font-bold uppercase rounded-lg border transition-all ${
                  orderFilter === 'PENDING_FULFILLMENT' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : `${themeStyles.border} text-slate-500`
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setOrderFilter('COMPLETED')}
                className={`px-3 py-1 font-sans text-[10px] font-bold uppercase rounded-lg border transition-all ${
                  orderFilter === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : `${themeStyles.border} text-slate-500`
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5 text-[9px] font-mono uppercase text-slate-500 tracking-wider bg-black/10">
                  <th className="py-3 px-4">Purchaser / Client</th>
                  <th className="py-3 px-4">Product Catalog Selected</th>
                  <th className="py-3 px-4">Price Captured</th>
                  <th className="py-3 px-4">Creation Timestamp</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans text-xs">
                {filteredOrders.map((ord, index) => (
                  <tr 
                    key={ord.docId || index} 
                    className={`hover:bg-cyan-500/5 transition-all ${theme === 'dark' ? 'bg-[#0c0c11]' : 'bg-slate-50/40'}`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-200">
                        {ord.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{ord.email}</div>
                      {ord.phone && <div className="text-[9px] text-slate-500 font-mono mt-0.5">{ord.phone}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-semibold ${themeStyles.heading}`}>{ord.selectedProduct}</span>
                      {ord.customNotes && (
                        <p className="text-[10px] text-slate-500 max-w-sm truncate mt-0.5" title={ord.customNotes}>
                          Notes: {ord.customNotes}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      ₹{ord.priceInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        ord.status === 'COMPLETED' || ord.status === 'TEST_SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteOrder(ord.docId, ord.collectionName)}
                        className="p-1.5 text-slate-500 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Delete order document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-sans text-xs">
                      No order records found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Inquiry Uplinks */}
      {activeSubTab === 'INQUIRIES' && (
        <div className={`border ${themeStyles.border} ${themeStyles.card} rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6`}>
          <div className="flex justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by sender name, subject, payload message..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-slate-50 text-slate-850'} border ${themeStyles.border} hover:border-cyan-500/35 focus:border-cyan-500 text-xs rounded-xl focus:outline-none transition-all`}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredInquiries.map((inq) => (
              <div 
                key={inq.docId}
                className={`border ${themeStyles.border} p-5 rounded-2xl relative ${theme === 'dark' ? 'bg-[#0b0b0f] hover:bg-[#0e0e14]' : 'bg-slate-50/50 hover:bg-slate-50'} transition-all shadow-md group`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-white/5 pb-3">
                  <div>
                    <h4 className={`font-sans text-sm font-black ${themeStyles.heading} uppercase tracking-wide flex items-center gap-2`}>
                      {inq.name}
                      <span className="text-[9px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded">
                        {inq.subject}
                      </span>
                    </h4>
                    <span className="font-mono text-[10px] text-slate-500">{inq.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                    <span>{new Date(inq.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    <button
                      onClick={() => handleDeleteInquiry(inq.docId)}
                      className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete transmission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <p className={`font-sans text-xs ${themeStyles.text} whitespace-pre-wrap leading-relaxed`}>
                    {inq.message}
                  </p>
                </div>
              </div>
            ))}

            {filteredInquiries.length === 0 && (
              <div className="text-center py-16 border border-dashed border-slate-700/40 rounded-2xl space-y-3">
                <Inbox className="w-10 h-10 text-slate-600 mx-auto opacity-45" />
                <p className={`font-sans text-xs font-bold uppercase ${themeStyles.text}`}>No inquiry transmissions logged.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

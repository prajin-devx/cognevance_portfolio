import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Tag, 
  AlertCircle,
  Database,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { db, collection, addDoc, getDocs } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

interface LabEvent {
  id: string;
  title: string;
  type: 'Lab' | 'Milestone' | 'Review' | 'Personal';
  date: string; // YYYY-MM-DD
  time: string;
  priority: 'High' | 'Medium' | 'Low';
  notes?: string;
  completed: boolean;
}

const DEFAULT_EVENTS: LabEvent[] = [
  {
    id: 'def-1',
    title: 'Analog Electronics Simulation Milestone',
    type: 'Milestone',
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:00',
    priority: 'High',
    notes: 'Verify amplifier frequency response curves and input impedance specs.',
    completed: false
  },
  {
    id: 'def-2',
    title: 'Advanced React Full-Stack Architecture Review',
    type: 'Review',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // In 2 days
    time: '10:30',
    priority: 'Medium',
    notes: 'Check Firestore security triggers and bundle file limits.',
    completed: false
  },
  {
    id: 'def-3',
    title: 'UI/UX Visual Asset Design Completion',
    type: 'Personal',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    time: '11:00',
    priority: 'Low',
    notes: 'Crop and compress custom avatar elements and background layers.',
    completed: true
  },
  {
    id: 'def-4',
    title: 'Microcontroller Physical Sandbox Prototyping',
    type: 'Lab',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // In 5 days
    time: '15:15',
    priority: 'High',
    notes: 'Program digital signal registers and compile binary binaries.',
    completed: false
  }
];

export default function LabCalendar() {
  const { theme, themeStyles, accentStyles } = useTheme();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<LabEvent[]>([]);
  const [loadingSync, setLoadingSync] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>('idle');

  // Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<'Lab' | 'Milestone' | 'Review' | 'Personal'>('Lab');
  const [newTime, setNewTime] = useState<string>('12:00');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newNotes, setNewNotes] = useState<string>('');

  // Load events from LocalStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem('prajin_lab_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        setEvents(DEFAULT_EVENTS);
      }
    } else {
      setEvents(DEFAULT_EVENTS);
      localStorage.setItem('prajin_lab_events', JSON.stringify(DEFAULT_EVENTS));
    }
  }, []);

  const saveEvents = (newEvents: LabEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem('prajin_lab_events', JSON.stringify(newEvents));
  };

  // Helper Calendar Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dayNum: number, currentMonth = true, offset = 0) => {
    let targetDate = new Date(year, month, dayNum);
    if (!currentMonth) {
      targetDate = new Date(year, month + offset, dayNum);
    }
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    setSelectedDateStr(`${yyyy}-${mm}-${dd}`);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvent: LabEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      type: newType,
      date: selectedDateStr,
      time: newTime,
      priority: newPriority,
      notes: newNotes,
      completed: false
    };

    const updated = [...events, newEvent];
    saveEvents(updated);

    // Reset Form
    setNewTitle('');
    setNewNotes('');
    setNewTime('12:00');
    setNewPriority('Medium');
    setNewType('Lab');
    setShowAddForm(false);
  };

  const handleToggleComplete = (id: string) => {
    const updated = events.map(evt => {
      if (evt.id === id) {
        return { ...evt, completed: !evt.completed };
      }
      return evt;
    });
    saveEvents(updated);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(evt => evt.id !== id);
    saveEvents(updated);
  };

  // Synchronize Events to Firestore for persistent backup!
  const syncToFirebase = async () => {
    setLoadingSync(true);
    setSyncStatus('syncing');
    try {
      // Backup all current events to Firestore collection 'planner_events'
      for (const evt of events) {
        await addDoc(collection(db, 'planner_events'), {
          ...evt,
          synchronizedAt: new Date().toISOString(),
          ownerEmail: 'prajinmothi007@gmail.com'
        });
      }
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 4000);
    } finally {
      setLoadingSync(false);
    }
  };

  // Filter events for the currently selected day
  const selectedDayEvents = events.filter(evt => evt.date === selectedDateStr);

  // Render Calendar Grid Cells
  const renderCalendarDays = () => {
    const cells = [];

    // Prev Month Days (Padding)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const d = new Date(year, month - 1, dayNum);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayEvents = events.filter(evt => evt.date === dateStr);
      const isSelected = selectedDateStr === dateStr;

      cells.push(
        <button
          key={`prev-${dayNum}`}
          onClick={() => handleDayClick(dayNum, false, -1)}
          className={`h-11 sm:h-14 border ${themeStyles.border} p-1 text-left relative flex flex-col justify-between text-slate-400 opacity-40 hover:opacity-75 transition-all text-[10px] sm:text-xs font-mono`}
        >
          <span>{dayNum}</span>
          {dayEvents.length > 0 && (
            <div className="flex gap-0.5 justify-end w-full">
              {dayEvents.slice(0, 3).map((_, idx) => (
                <span key={idx} className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
              ))}
            </div>
          )}
        </button>
      );
    }

    // Current Month Days
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const d = new Date(year, month, dayNum);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayEvents = events.filter(evt => evt.date === dateStr);
      const isSelected = selectedDateStr === dateStr;
      const isToday = new Date().toDateString() === d.toDateString();

      cells.push(
        <button
          key={`curr-${dayNum}`}
          onClick={() => handleDayClick(dayNum, true, 0)}
          className={`h-11 sm:h-14 border ${isSelected ? `border-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.25)] z-10` : `${themeStyles.border}`} p-1.5 text-left relative flex flex-col justify-between transition-all text-[10px] sm:text-xs font-mono ${
            isToday ? `${theme === 'dark' ? 'bg-cyan-950/20' : 'bg-cyan-50'} border-cyan-400/50 font-bold` : ''
          } ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
        >
          <div className="flex justify-between items-center w-full">
            <span className={isToday ? 'text-cyan-500 font-black' : isSelected ? 'text-cyan-400' : themeStyles.heading}>
              {dayNum}
            </span>
            {isToday && <span className="text-[7px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-1 rounded">TODAY</span>}
          </div>
          {dayEvents.length > 0 && (
            <div className="flex gap-1 justify-end w-full overflow-hidden">
              {dayEvents.slice(0, 3).map((evt, idx) => {
                let colorClass = 'bg-cyan-400';
                if (evt.type === 'Milestone') colorClass = 'bg-purple-400';
                if (evt.type === 'Review') colorClass = 'bg-amber-400';
                if (evt.completed) colorClass = 'bg-emerald-500';
                return (
                  <span 
                    key={idx} 
                    className={`w-1.5 h-1.5 rounded-full ${colorClass} ${evt.priority === 'High' && !evt.completed ? 'animate-ping' : ''}`}
                    title={evt.title}
                  ></span>
                );
              })}
            </div>
          )}
        </button>
      );
    }

    return cells;
  };

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case 'High': return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
      case 'Medium': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      default: return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Milestone': return 'text-purple-400 border-purple-500/20 bg-purple-500/10';
      case 'Review': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      case 'Lab': return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10';
      default: return 'text-slate-400 border-slate-500/20 bg-slate-500/10';
    }
  };

  return (
    <div className={`border ${themeStyles.border} ${themeStyles.card} p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl space-y-6`}>
      <div className={`absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r ${accentStyles.gradient}`} />
      
      {/* Header section with month navigator & Cloud sync */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className={`w-5 h-5 ${accentStyles.text}`} />
            <h3 className={`font-sans text-lg font-black uppercase tracking-wider ${themeStyles.heading}`}>
              LAB & STUDY CALENDAR
            </h3>
          </div>
          <p className={`font-sans text-xs ${themeStyles.text} mt-1`}>
            Track active deliverables, project milestones, and live sandbox check-ins cleanly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Firestore Cloud Sync Button */}
          <button
            onClick={syncToFirebase}
            disabled={loadingSync || events.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 border ${themeStyles.border} ${themeStyles.panel} hover:border-cyan-500 rounded-xl font-mono text-[10px] font-bold ${themeStyles.heading} transition-all uppercase cursor-pointer disabled:opacity-40`}
          >
            {loadingSync ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            ) : (
              <Database className="w-3.5 h-3.5 text-cyan-400" />
            )}
            {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'success' ? 'Synchronized ✓' : 'Cloud Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Calendar Month View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`font-sans text-sm font-bold ${accentStyles.text} tracking-wider`}>
              {monthNames[month]} {year}
            </h4>
            <div className="flex gap-1">
              <button
                onClick={handlePrevMonth}
                className={`p-1.5 border ${themeStyles.border} rounded-lg hover:border-cyan-500 transition-all ${themeStyles.heading} cursor-pointer`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className={`p-1.5 border ${themeStyles.border} rounded-lg hover:border-cyan-500 transition-all ${themeStyles.heading} cursor-pointer`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid Weekdays */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-bold text-slate-500 pb-1 uppercase">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Right Side: Day Details & Action Logs */}
        <div className="lg:col-span-5 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className={`font-mono text-xs font-bold ${themeStyles.heading}`}>
                  {new Date(selectedDateStr).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`flex items-center gap-1 text-[10px] font-bold font-sans ${accentStyles.text} uppercase bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg border ${accentStyles.border} transition-all cursor-pointer`}
              >
                <Plus className="w-3.5 h-3.5" /> ADD EVENT
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showAddForm ? (
                <motion.form
                  key="add-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleAddEvent}
                  className={`p-4 border ${themeStyles.border} ${themeStyles.panel} rounded-2xl space-y-3.5`}
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Event Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg border ${themeStyles.border} ${theme === 'dark' ? 'bg-[#08080a]' : 'bg-white'} ${themeStyles.heading} text-xs focus:outline-none focus:border-cyan-500`}
                      placeholder="e.g. Logic Analyzer Demo Setup"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className={`w-full px-2 py-1.5 rounded-lg border ${themeStyles.border} ${theme === 'dark' ? 'bg-[#08080a] text-white' : 'bg-white text-slate-800'} text-xs focus:outline-none`}
                      >
                        <option value="Lab">Lab Project</option>
                        <option value="Milestone">Milestone</option>
                        <option value="Review">Tech Review</option>
                        <option value="Personal">Personal/Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Time</label>
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className={`w-full px-2 py-1.5 rounded-lg border ${themeStyles.border} ${theme === 'dark' ? 'bg-[#08080a]' : 'bg-white'} ${themeStyles.heading} text-xs focus:outline-none`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 col-span-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Priority</label>
                      <div className="flex gap-2">
                        {['Low', 'Medium', 'High'].map((prio) => (
                          <button
                            type="button"
                            key={prio}
                            onClick={() => setNewPriority(prio as any)}
                            className={`flex-1 py-1 px-2.5 text-[10px] font-bold font-sans border rounded-lg transition-all ${
                              newPriority === prio 
                                ? prio === 'High' ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : prio === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                                : `border-transparent ${theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'}`
                            }`}
                          >
                            {prio}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Description / Notes</label>
                    <textarea
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      rows={2}
                      className={`w-full px-3 py-1.5 rounded-lg border ${themeStyles.border} ${theme === 'dark' ? 'bg-[#08080a]' : 'bg-white'} ${themeStyles.heading} text-xs focus:outline-none focus:border-cyan-500 resize-none`}
                      placeholder="Optional notes or details..."
                    />
                  </div>

                  <div className="flex gap-2 pt-1.5">
                    <button
                      type="submit"
                      className={`flex-1 py-1.5 px-3 bg-gradient-to-r ${accentStyles.gradient} text-white font-sans text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-md hover:opacity-90 cursor-pointer`}
                    >
                      Save Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className={`py-1.5 px-3 bg-white/5 border ${themeStyles.border} ${themeStyles.heading} font-sans text-[10px] font-bold rounded-lg uppercase tracking-wider cursor-pointer`}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="task-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1"
                >
                  {selectedDayEvents.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <FolderOpen className="w-8 h-8 text-slate-600 mx-auto opacity-40 animate-pulse" />
                      <p className={`font-sans text-xs ${themeStyles.text}`}>No active events logged for this date.</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className={`text-[9px] font-bold font-sans ${accentStyles.text} underline uppercase tracking-wider cursor-pointer`}
                      >
                        Create a scheduled event
                      </button>
                    </div>
                  ) : (
                    selectedDayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className={`border ${themeStyles.border} ${theme === 'dark' ? 'bg-[#0e0e12]' : 'bg-white'} p-3.5 rounded-2xl flex items-start gap-3 relative overflow-hidden transition-all hover:translate-x-0.5`}
                      >
                        {/* Status Checker */}
                        <button
                          onClick={() => handleToggleComplete(evt.id)}
                          className={`w-4 h-4 rounded-full border ${evt.completed ? 'bg-emerald-500 border-emerald-500 text-white' : `${themeStyles.border} hover:border-cyan-500`} flex items-center justify-center mt-0.5 transition-all cursor-pointer`}
                        >
                          {evt.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className={`font-sans text-xs font-bold leading-tight ${evt.completed ? 'line-through text-slate-500' : themeStyles.heading}`}>
                              {evt.title}
                            </span>
                            <button
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Info tags row */}
                          <div className="flex flex-wrap gap-1.5 text-[8px] font-mono font-bold uppercase tracking-wider">
                            <span className={`px-1.5 py-0.5 rounded border ${getTypeColor(evt.type)}`}>
                              {evt.type}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded border ${getPriorityColor(evt.priority)}`}>
                              {evt.priority}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded border border-white/5 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'} text-slate-500`}>
                              {evt.time}
                            </span>
                          </div>

                          {evt.notes && (
                            <p className="font-sans text-[10px] text-slate-500 leading-normal pt-1 border-t border-white/5">
                              {evt.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase">
            <span>Logged Events: {events.length}</span>
            <span>Completed: {events.filter(e => e.completed).length}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

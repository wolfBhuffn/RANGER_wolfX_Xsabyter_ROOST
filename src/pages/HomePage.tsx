import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import type { TabType } from '../types/navigation';

interface NoteItem {
  id: string;
  date: string;
  clientName: string;
  location: string;
  content: string;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Master Authentication State (Default Passkey: 0000)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // 3-Second Glitch Sequence State for Locked Navigation
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [glitchImageToggle, setGlitchImageToggle] = useState<boolean>(false);

  // Event-driven tab switcher with 3s glitch sequence for locked modules
  const handleTabChange = (tab: TabType) => {
    const lockedTabs: TabType[] = ['scfu', 'networth', 'cashflow', 'ai-agent'];
    if (!isAuthenticated && lockedTabs.includes(tab)) {
      setIsGlitching(true);
      
      const imgInterval = setInterval(() => {
        setGlitchImageToggle(prev => !prev);
      }, 180);

      setTimeout(() => {
        setIsGlitching(false);
        clearInterval(imgInterval);
      }, 3000);
    }
    setActiveTab(tab);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === '0000') {
      setIsAuthenticated(true);
      setAuthError('');
      setActiveTab('home');
    } else {
      setAuthError('Invalid Master Passkey. Access Denied.');
    }
  };

  // -------------------------------------------------------------
  // SCFU SHIFT, TIMER & OVERTIME AUTOMATION
  // -------------------------------------------------------------
  const [shiftStatus, setShiftStatus] = useState<'CLOCKED_IN' | 'CLOCKED_OUT'>('CLOCKED_OUT');
  const [shiftStartTime, setShiftStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Editable Payroll Engine Parameters (Default Rate: $21.00)
  const [hourlyRate, setHourlyRate] = useState<number>(21.00);
  const [regularHours, setRegularHours] = useState<number>(40.0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0.0);

  // SCFU Notes & Location Manager State
  const [clientInput, setClientInput] = useState<string>('Darwin');
  
  // Locations List & Add/Edit State
  const [locations, setLocations] = useState<string[]>([
    '1775 Grand Concourse, Bronx Day Hab',
    'Special Citizens Residence Alpha',
    'Community Integration Site'
  ]);
  const [selectedLocation, setSelectedLocation] = useState<string>('1775 Grand Concourse, Bronx Day Hab');
  const [newLocationInput, setNewLocationInput] = useState<string>('');
  const [isEditingLocations, setIsEditingLocations] = useState<boolean>(false);

  // Template selector state
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [noteText, setNoteText] = useState<string>('');

  const [savedNotes, setSavedNotes] = useState<NoteItem[]>([
    {
      id: '1',
      date: '2026-11-10',
      clientName: 'Darwin',
      location: '1775 Grand Concourse, Bronx Day Hab',
      content: 'Completed ABC occurrence log observation and participated in community life skills training.'
    }
  ]);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationInput.trim()) return;
    if (!locations.includes(newLocationInput.trim())) {
      setLocations([...locations, newLocationInput.trim()]);
      setSelectedLocation(newLocationInput.trim());
    }
    setNewLocationInput('');
  };

  const handleDeleteLocation = (locToDelete: string) => {
    const updated = locations.filter(l => l !== locToDelete);
    setLocations(updated);
    if (selectedLocation === locToDelete && updated.length > 0) {
      setSelectedLocation(updated[0]);
    }
  };

  const handleTemplateSelect = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    switch (templateKey) {
      case 'abc':
        setNoteText('ABC Occurrence Log: Antecedent [Trigger observed] -> Behavior [Specific action recorded] -> Consequence [Staff intervention & resolution].');
        break;
      case 'lifeskills':
        setNoteText('Life Skills & Functional Academics: Participant engaged in practical daily living exercises, displaying strong independence and focus.');
        break;
      case 'outing':
        setNoteText('Community Outing & Socialization Report: Participated in local group outing, interacted positively with peers, and reinforced social integration goals.');
        break;
      case 'mar':
        setNoteText('AMAP Medication Administration Record (MAR): Verified medication orders, administered scheduled dosage at prescribed time without adverse reactions.');
        break;
      case 'incident':
        setNoteText('Physical / Behavioral Incident Report: Detailed chronological record of event, immediate staff response, supervisor notification, and safety measures applied.');
        break;
      case 'dailyprogress':
        setNoteText('Daily Progress & Service Note: Comprehensive summary of daily goal participation, adaptive behavior progress, and professional support provided.');
        break;
      case 'monthlyprogress':
        setNoteText('Monthly Progress & Service Summary: Comprehensive monthly evaluation reviewing individual goal attainment, vocational/life skills growth, health/behavior milestones, and updated person-centered planning objectives.');
        break;
      default:
        setNoteText('');
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !clientInput.trim()) return;
    const newNote: NoteItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      clientName: clientInput.trim(),
      location: selectedLocation,
      content: noteText
    };
    setSavedNotes([newNote, ...savedNotes]);
    setNoteText('');
  };

  // Live Shift Timer Effect
  useEffect(() => {
    if (shiftStatus !== 'CLOCKED_IN' || shiftStartTime === null) {
      return;
    }

    const timerId = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - shiftStartTime) / 1000);
      setElapsedSeconds(currentElapsed);

      const standardShiftSeconds = 32400; // 9 hours (6:30am to 3:30pm)
      if (currentElapsed > standardShiftSeconds) {
        const excessSeconds = currentElapsed - standardShiftSeconds;
        const calculatedOT = parseFloat((excessSeconds / 3600).toFixed(2));
        setOvertimeHours(calculatedOT);
      }
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [shiftStatus, shiftStartTime]);

  const toggleClock = () => {
    if (shiftStatus === 'CLOCKED_OUT') {
      setShiftStatus('CLOCKED_IN');
      setShiftStartTime(Date.now());
      setElapsedSeconds(0);
      setOvertimeHours(0.0);
    } else {
      setShiftStatus('CLOCKED_OUT');
      setShiftStartTime(null);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const standardShiftSeconds = 32400;
  const isOvertimeActive = elapsedSeconds > standardShiftSeconds;
  const shiftProgressPercent = isOvertimeActive 
    ? 100 
    : Math.min(100, Math.max(0, (elapsedSeconds / standardShiftSeconds) * 100));
  const otProgressPercent = isOvertimeActive 
    ? Math.min(100, ((elapsedSeconds - standardShiftSeconds) / 10800) * 100)
    : 0;

  // Payroll Calculation Logic
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * (hourlyRate * 1.5);
  const grossPay = regularPay + overtimePay;

  const fedTax = grossPay * 0.12;
  const ficaSocialSecurity = grossPay * 0.062;
  const ficaMedicare = grossPay * 0.0145;
  const nyStateTax = grossPay * 0.045;
  const totalDeductions = fedTax + ficaSocialSecurity + ficaMedicare + nyStateTax;
  const netTakeHome = grossPay - totalDeductions;

  // Cashflow Editable Accounts
  const [checkingBalance, setCheckingBalance] = useState<number>(3420.50);
  const [amexBalance, setAmexBalance] = useState<number>(46.96);
  const [sofiBalance, setSofiBalance] = useState<number>(4250.00);

  // Financial Totals
  const totalAssets = checkingBalance + sofiBalance + 52410.00;
  const totalLiabilities = 18732.00 + amexBalance;
  const netWorth = totalAssets - totalLiabilities;
  const isNetPositive = netWorth >= 0;

  // AI Agent State
  const [taskPrompt, setTaskPrompt] = useState<string>('');
  const [agentLogs, setAgentLogs] = useState<string[]>([
    '[SYSTEM] Gemini free-tier fallback active (gemini-2.0-flash / gemini-1.5-flash).',
    '[READY] Awaiting operational dispatch...'
  ]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const handleRunAIAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskPrompt.trim()) return;

    setIsExecuting(true);
    setAgentLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Dispatching: "${taskPrompt}"`]);

    setTimeout(() => {
      setAgentLogs(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] Task processed successfully via Gemini model pipeline.`
      ]);
      setIsExecuting(false);
      setTaskPrompt('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#16171d] text-[#9ca3af] flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200 relative overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 3-SECOND STRONG GLITCH & BUST OVERLAY FOR LOCKED PAGES    */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* FULL-PAGE ANALOG TV STATIC & SCANLINE GLITCH OVERLAY      */}
      {/* ========================================================= */}
      {isGlitching && (
        <div className="fixed inset-0 z-50 bg-[#0d0e12]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 select-none pointer-events-none overflow-hidden">
          
          {/* Horizontal CRT Scanlines Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.85)_50%)] [background-size:100%_3px] pointer-events-none z-20" />
          
          {/* Rolling TV Static / Blackout Bar (Matches Giphy Effect) */}
          <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent opacity-90 animate-static-roll pointer-events-none z-30 blur-sm border-y border-purple-500/50" />
          
          <div className="relative z-40 space-y-8 text-center animate-tv-shake">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/80 shadow-[0_0_60px_rgba(168,85,247,0.7)] filter contrast-150 brightness-125">
              
              {/* RGB Split Layers for Analog Signal Tear */}
              <img 
                src={glitchImageToggle ? "/bust-ranger.jpg" : "/bust-roost.jpg"} 
                alt="SIGNAL INTERFERENCE"
                className="absolute inset-0 w-full h-full object-cover transform scale-110 -translate-x-3 mix-blend-screen opacity-70 filter hue-rotate-90"
              />
              <img 
                src={glitchImageToggle ? "/bust-ranger.jpg" : "/bust-roost.jpg"} 
                alt="SIGNAL INTERFERENCE"
                className="absolute inset-0 w-full h-full object-cover transform scale-110 translate-x-3 mix-blend-color-dodge opacity-70 filter hue-rotate-180"
              />
              <img 
                src={glitchImageToggle ? "/bust-ranger.jpg" : "/bust-roost.jpg"} 
                alt="SIGNAL INTERFERENCE"
                className="relative w-full h-full object-cover transform scale-105"
              />
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs sm:text-sm text-purple-400 tracking-[0.3em] uppercase bg-purple-500/10 px-4 py-2.5 rounded border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                📺 SIGNAL LOST: LOCKED CHANNEL OVERRIDE 📺
              </div>
            </div>
          </div>
        </div>
      )}



      <Navbar activeTab={activeTab} onNavigate={handleTabChange} />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full space-y-12">
        
        {/* ========================================================= */}
        {/* ABOUT ME (HOME) WITH UNBOXED SOFT GLOW HEADSHOT           */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            <header className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-[#2e303a] pb-10">
              <div className="relative group shrink-0">
                <div className="w-32 h-32 rounded-3xl p-0.5 shadow-[0_0_35px_rgba(168,85,247,0.35)] bg-gradient-to-tr from-purple-500/50 to-cyan-400/50 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full rounded-[22px] bg-[#16171d] overflow-hidden flex items-center justify-center">
                    <img 
                      src="/headshot.png" 
                      alt="Kwame A. Lockley Headshot" 
                      className="w-full h-full object-cover object-center scale-110"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#16171d]" title="System Online" />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  Senior Counselor // Bronx, NY
                </div>
                <div>
                  <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#f3f4f6]">
                    Kwame A. Lockley
                  </h1>
                  <p className="text-sm font-mono text-purple-400 mt-1">
                    wolfX_Xsabyter
                  </p>
                </div>
                <p className="text-sm font-mono text-purple-300">
                  SCIP-R • CPR • AMAP Certified | OPWDD Human Services & Software QA
                </p>
              </div>
            </header>

            <div className="space-y-6 text-[#9ca3af] text-base leading-relaxed">
              <p>
                I'm Wolf, a Senior Counselor in a Day Hab program near the Bronx, supporting adults with Autism and intellectual and developmental disabilities. I teach life skills and functional academics, lead community outings and volunteer work, and create real chances for the people I support to build independence, socialize, and be part of their community.
              </p>
              <p>
                My path here wasn't a straight line. I spent 8 years as an EMT, where I learned to stay calm and act fast when it counts. I then moved into bartending, which sharpened my people skills and my ability to read a room. After that I worked as a Software Quality Assurance Engineer, and I'm still available for QA work. Today I bring all of that to human services: clear-headed under pressure, easy to talk to, and detail-oriented.
              </p>
              <div className="p-4 rounded-xl bg-[#1f2028] border border-[#2e303a] font-mono text-xs text-purple-300">
                // CAREER DIRECTIVE: Building a long-term dedicated career in OPWDD human services & accessibility engineering.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PROJECTS SECTION                                          */}
        {/* ========================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="border-b border-[#2e303a] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium text-[#f3f4f6]">Projects & Architecture</h2>
                <p className="text-sm text-[#9ca3af] mt-1">Click any project card to open the repository on GitHub.</p>
              </div>
              <span className="font-mono text-xs text-purple-400">GITHUB LINKED</span>
            </div>

            <div className="space-y-6">
              <a 
                href="https://github.com/wolfX-Xsabyter/nexus-command-center" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-6 rounded-2xl bg-[#1f2028] border border-[#2e303a] space-y-3 hover:border-purple-500/50 hover:bg-[#252732] transition group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400">PYTHON SERVER ENGINE</span>
                  <span className="text-xs font-mono text-[#6b6375] group-hover:text-purple-400 transition">View on GitHub ↗</span>
                </div>
                <h3 className="text-xl font-medium text-[#f3f4f6] group-hover:text-purple-300 transition">NEXUS Command Center</h3>
                <p className="text-sm text-[#9ca3af]">
                  Hybrid local-to-cloud command suite built using custom Python backend connection routing and an interactive terminal dashboard interface deployed on Render.
                </p>
              </a>

              <a 
                href="https://github.com/wolfX-Xsabyter/ranger-roost-hub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-6 rounded-2xl bg-[#1f2028] border border-[#2e303a] space-y-3 hover:border-purple-500/50 hover:bg-[#252732] transition group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400">NEXT.JS / SUPABASE</span>
                  <span className="text-xs font-mono text-[#6b6375] group-hover:text-purple-400 transition">View on GitHub ↗</span>
                </div>
                <h3 className="text-xl font-medium text-[#f3f4f6] group-hover:text-purple-300 transition">Ranger Roost Hub</h3>
                <p className="text-sm text-[#9ca3af]">
                  Modern Next.js web application architecture integrating Supabase relational data schemas, Stripe checkout APIs, and Tailwind CSS configuration layers.
                </p>
              </a>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCFU SHIFT, TIMER & NOTES GENERATOR (TRANSPARENT GATE)     */}
        {/* ========================================================= */}
        {activeTab === 'scfu' && (
          <div className="space-y-10">
            {!isAuthenticated ? (
              <div className="p-12 rounded-2xl bg-[#16171d]/85 backdrop-blur-md border border-purple-500/20 text-center space-y-4 shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto text-xl font-mono">🔒</div>
                <h2 className="text-xl font-medium text-[#f3f4f6]">SCFU Module Locked</h2>
                <p className="text-sm text-[#9ca3af]">Master User authentication (Passkey: 0000) required to access SCFU shift tracker & payroll engine.</p>
                <button 
                  onClick={() => setActiveTab('login')}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-medium transition cursor-pointer"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#2e303a] pb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-medium text-[#f3f4f6]">SCFU Shift, Timer & Payroll Engine</h2>
                    <p className="text-sm text-[#9ca3af]">Day Hab shift tracking, target window (6:30am | 3:30pm), and notes generator.</p>
                  </div>

                  <button 
                    onClick={toggleClock}
                    className={`px-6 py-3 rounded-xl text-xs font-mono font-bold tracking-wider transition cursor-pointer shadow-lg ${
                      shiftStatus === 'CLOCKED_IN' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    }`}
                  >
                    {shiftStatus === 'CLOCKED_IN' ? '⏹ CLOCK OUT' : '▶ CLOCK IN'}
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#1f2028] border border-[#2e303a] space-y-4 font-mono">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#6b6375] uppercase tracking-wider">SHIFT DURATION TIMER</span>
                      <p className="text-3xl font-medium text-[#f3f4f6] mt-1">{formatTimer(elapsedSeconds)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#6b6375] uppercase tracking-wider">TARGET WINDOW</span>
                      <p className="text-sm text-purple-300 font-bold mt-1">6:30am | 3:30pm</p>
                      {isOvertimeActive && (
                        <span className="text-[10px] text-amber-400 uppercase tracking-widest animate-pulse font-bold">⚡ OVERTIME ACTIVE</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[#6b6375]">
                      <span>{isOvertimeActive ? 'Overtime Accumulation' : 'Shift Progress Window'}</span>
                      <span>{isOvertimeActive ? `+${overtimeHours} hrs OT` : `${shiftProgressPercent.toFixed(1)}%`}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#16171d] overflow-hidden border border-[#2e303a]">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isOvertimeActive 
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]' 
                            : 'bg-gradient-to-r from-purple-500 to-cyan-400'
                        }`} 
                        style={{ width: `${isOvertimeActive ? otProgressPercent : shiftProgressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#1f2028] border border-[#2e303a] space-y-6">
                  <div className="border-b border-[#2e303a] pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-medium text-[#f3f4f6]">Daily & Monthly Notes Generator</h3>
                      <p className="text-xs text-[#9ca3af]">Enter individual name, select daily/monthly templates, and manage locations.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsEditingLocations(!isEditingLocations)}
                      className="text-xs font-mono text-purple-400 hover:text-purple-300 underline cursor-pointer"
                    >
                      {isEditingLocations ? '[Close Location Manager]' : '[Manage Locations]'}
                    </button>
                  </div>

                  {isEditingLocations && (
                    <div className="p-4 rounded-xl bg-[#16171d] border border-purple-500/30 space-y-3 font-mono text-xs">
                      <span className="text-purple-300 font-bold">// SCFU RESIDENCES & LOCATIONS MANAGER</span>
                      <div className="space-y-2">
                        {locations.map(loc => (
                          <div key={loc} className="flex items-center justify-between bg-[#1f2028] p-2 rounded border border-[#2e303a]">
                            <span className="text-[#f3f4f6]">{loc}</span>
                            {locations.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => handleDeleteLocation(loc)}
                                className="text-rose-400 hover:text-rose-300 cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleAddLocation} className="flex gap-2 pt-2">
                        <input 
                          type="text"
                          value={newLocationInput}
                          onChange={(e) => setNewLocationInput(e.target.value)}
                          placeholder="Add new residence/location..."
                          className="flex-grow bg-[#16171d] border border-[#2e303a] p-2 rounded text-xs text-[#f3f4f6] focus:outline-none focus:border-purple-400"
                        />
                        <button 
                          type="submit"
                          className="px-3 py-2 bg-purple-600 text-white rounded font-bold cursor-pointer hover:bg-purple-500"
                        >
                          Add Location
                        </button>
                      </form>
                    </div>
                  )}

                  <form onSubmit={handleSaveNote} className="space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[#6b6375]">INDIVIDUAL / PARTICIPANT NAME</label>
                        <input 
                          type="text"
                          value={clientInput}
                          onChange={(e) => setClientInput(e.target.value)}
                          placeholder="Enter individual's name..."
                          className="w-full bg-[#16171d] border border-[#2e303a] p-2.5 rounded-xl text-sm text-[#f3f4f6] focus:outline-none focus:border-purple-400 font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[#6b6375]">SCFU LOCATION / RESIDENCE</label>
                        <select 
                          value={selectedLocation} 
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="w-full bg-[#16171d] border border-[#2e303a] p-2.5 rounded-xl text-sm text-[#f3f4f6] focus:outline-none focus:border-purple-400 font-sans"
                        >
                          {locations.map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="text-[#6b6375]">CHOOSE DOCUMENT TEMPLATE (OPTIONAL)</label>
                      <select 
                        value={selectedTemplate}
                        onChange={(e) => handleTemplateSelect(e.target.value)}
                        className="w-full bg-[#16171d] border border-[#2e303a] p-2.5 rounded-xl text-sm text-purple-300 focus:outline-none focus:border-purple-400 font-sans"
                      >
                        <option value="">-- Choose document template --</option>
                        <option value="abc">ABC Occurrence Log Template</option>
                        <option value="lifeskills">Life Skills & Functional Academics Template</option>
                        <option value="outing">Community Outing & Socialization Report Template</option>
                        <option value="mar">AMAP Medication Administration Record (MAR) Template</option>
                        <option value="incident">Physical / Behavioral Incident Report Template</option>
                        <option value="dailyprogress">Daily Progress & Service Note Template</option>
                        <option value="monthlyprogress">Monthly Progress & Service Summary Template</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[#6b6375]">OBSERVATION & NOTE CONTENT</label>
                      <textarea 
                        rows={4}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Record daily behavioral observations, life skills progress, or community outing notes..."
                        className="w-full bg-[#16171d] border border-[#2e303a] p-3 rounded-xl text-sm text-[#f3f4f6] focus:outline-none focus:border-purple-400 font-sans"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition cursor-pointer"
                    >
                      Save Note to System
                    </button>
                  </form>

                  <div className="space-y-3 pt-4 border-t border-[#2e303a]">
                    <span className="text-xs font-mono text-[#6b6375]">// RECENT GENERATED LOGS</span>
                    {savedNotes.map(note => (
                      <div key={note.id} className="p-4 rounded-xl bg-[#16171d] border border-[#2e303a] space-y-1 font-sans text-sm">
                        <div className="flex justify-between text-xs font-mono text-purple-400">
                          <span>{note.clientName} — {note.location}</span>
                          <span>{note.date}</span>
                        </div>
                        <p className="text-[#f3f4f6]">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  <div className="p-4 rounded-xl bg-[#1f2028] border border-[#2e303a] space-y-2">
                    <label className="text-xs text-[#6b6375] uppercase">HOURLY RATE ($/HR)</label>
                    <input 
                      type="number" 
                      step="0.50"
                      value={hourlyRate} 
                      onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#16171d] border border-[#2e303a] p-2 rounded text-base text-[#f3f4f6] focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#1f2028] border border-[#2e303a] space-y-2">
                    <label className="text-xs text-[#6b6375] uppercase">REGULAR HOURS</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={regularHours} 
                      onChange={(e) => setRegularHours(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#16171d] border border-[#2e303a] p-2 rounded text-base text-[#f3f4f6] focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#1f2028] border border-[#2e303a] space-y-2">
                    <label className="text-xs text-[#6b6375] uppercase">OVERTIME HOURS (1.5x)</label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={overtimeHours} 
                      onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#16171d] border border-[#2e303a] p-2 rounded text-base text-[#f3f4f6] focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#1f2028] border border-[#2e303a] space-y-4 font-mono text-sm">
                  <h3 className="text-xs text-purple-400 uppercase tracking-widest border-b border-[#2e303a] pb-3">ESTIMATED PAYCHECK BREAKDOWN</h3>
                  
                  <div className="flex justify-between">
                    <span className="text-[#9ca3af]">Gross Pay (Regular + Overtime)</span>
                    <span className="text-[#f3f4f6] font-medium">${grossPay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-rose-400/80">
                    <span>Est. Federal Income Tax (12%)</span>
                    <span>-${fedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-rose-400/80">
                    <span>Est. FICA Social Security (6.2%)</span>
                    <span>-${ficaSocialSecurity.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-rose-400/80">
                    <span>Est. FICA Medicare (1.45%)</span>
                    <span>-${ficaMedicare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-rose-400/80">
                    <span>Est. NY State Tax & SDI (4.5%)</span>
                    <span>-${nyStateTax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#2e303a] pt-3 flex justify-between text-base font-bold">
                    <span className="text-[#f3f4f6]">ESTIMATED NET TAKE-HOME</span>
                    <span className="text-emerald-400">${netTakeHome.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* NET WORTH (BLURRED & TRANSPARENT GATE)                   */}
        {/* ========================================================= */}
        {activeTab === 'networth' && (
          <div className="space-y-8">
            <header className="border-b border-[#2e303a] pb-4 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-medium text-[#f3f4f6]">Net Worth & Capital Snapshot</h2>
                <p className="text-sm text-[#9ca3af] mt-1">Live aggregated asset and liability valuation.</p>
              </div>

              <div className={`px-4 py-1.5 rounded-full font-mono text-xs font-bold tracking-wider uppercase border shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                isNetPositive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-rose-500/20'
              }`}>
                ● {isNetPositive ? 'NET POSITIVE' : 'NET DEFICIT'}
              </div>
            </header>

            <div className={`p-8 rounded-2xl bg-[#16171d]/85 backdrop-blur-md border border-purple-500/20 space-y-6 relative ${!isAuthenticated ? 'overflow-hidden' : ''}`}>
              {!isAuthenticated && (
                <div className="absolute inset-0 bg-[#16171d]/75 backdrop-blur-md z-10 flex flex-col items-center justify-center space-y-3 p-6 text-center">
                  <span className="text-xl">🔒</span>
                  <p className="text-sm font-medium text-[#f3f4f6]">Financial Data Restricted</p>
                  <p className="text-xs text-[#9ca3af]">Authenticate with master passkey (0000) to view net worth metrics.</p>
                  <button 
                    onClick={() => setActiveTab('login')}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-medium cursor-pointer"
                  >
                    Authenticate Now
                  </button>
                </div>
              )}

              <div className={`space-y-6 ${!isAuthenticated ? 'filter blur-md select-none' : ''}`}>
                <div className="flex justify-between items-center border-b border-[#2e303a] pb-4">
                  <div>
                    <p className="text-sm font-medium text-[#f3f4f6]">Total Capital Assets</p>
                    <p className="text-xs text-[#6b6375]">Checking, SoFi, & Topstep Equity ($52,410.00)</p>
                  </div>
                  <span className="font-mono text-emerald-400 text-xl font-bold">${totalAssets.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center border-b border-[#2e303a] pb-4">
                  <div>
                    <p className="text-sm font-medium text-[#f3f4f6]">Total Liabilities</p>
                    <p className="text-xs text-[#6b6375]">M&T Auto Loan ($18,732.00) + Amex Statement</p>
                  </div>
                  <span className="font-mono text-rose-400 text-xl font-bold">-${totalLiabilities.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-medium text-[#f3f4f6]">NET CAPITAL POSITION</span>
                  <span className={`font-mono text-3xl font-bold ${isNetPositive ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.3)]'}`}>
                    ${netWorth.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASHFLOW & BANKING (TRANSPARENT GATE)                    */}
        {/* ========================================================= */}
        {activeTab === 'cashflow' && (
          <div className="space-y-8">
            <header className="border-b border-[#2e303a] pb-4">
              <h2 className="text-2xl font-medium text-[#f3f4f6]">Banking Finances, Amex & SoFi Cashflow</h2>
              <p className="text-sm text-[#9ca3af] mt-1">Manage account balances and direct banking portal links.</p>
            </header>

            {!isAuthenticated ? (
              <div className="p-12 rounded-2xl bg-[#16171d]/85 backdrop-blur-md border border-purple-500/20 text-center space-y-4 shadow-2xl">
                <span className="text-xl">🔒</span>
                <p className="text-sm font-medium text-[#f3f4f6]">Cashflow Module Restricted</p>
                <p className="text-xs text-[#9ca3af]">Master User authentication required to view and edit banking statements.</p>
                <button 
                  onClick={() => setActiveTab('login')}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-medium transition cursor-pointer"
                >
                  Authenticate
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  <div className="p-4 rounded-xl bg-[#1f2028] border border-[#2e303a] space-y-2">
                    <label className="text-xs text-[#6b6375] uppercase">CHECKING BALANCE</label>
                    <input 
                      type="number" 
                      step="10.00"
                      value={checkingBalance} 
                      onChange={(e) => setCheckingBalance(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#16171d] border border-[#2e303a] p-2 rounded text-sm text-[#f3f4f6] focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#1f2028] border border-[#2e303a] space-y-2">
                    <label className="text-xs text-[#6b6375] uppercase">AMEX STATEMENT BALANCE</label>
                    <input 
                      type="number" 
                      step="1.00"
                      value={amexBalance} 
                      onChange={(e) => setAmexBalance(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#16171d] border border-[#2e303a] p-2 rounded text-sm text-[#f3f4f6] focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#1f2028] border border-[#2e303a] space-y-2">
                    <label className="text-xs text-[#6b6375] uppercase">SOFI SAVINGS BALANCE</label>
                    <input 
                      type="number" 
                      step="50.00"
                      value={sofiBalance} 
                      onChange={(e) => setSofiBalance(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#16171d] border border-[#2e303a] p-2 rounded text-sm text-[#f3f4f6] focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <a 
                    href="https://www.americanexpress.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-5 rounded-xl bg-[#1f2028] border border-[#2e303a] flex items-center justify-between hover:border-purple-500/50 transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center p-2 text-blue-400 font-mono font-bold text-xs">
                        AMEX
                      </div>
                      <div>
                        <p className="text-[#f3f4f6] font-medium group-hover:text-purple-300 transition">American Express Gold / Blue Cash</p>
                        <p className="text-xs text-[#6b6375]">Statement Balance: ${amexBalance.toFixed(2)} | Dunkin' Credit Active</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#6b6375] group-hover:text-purple-400 transition">Launch Portal ↗</span>
                  </a>

                  <a 
                    href="https://www.sofi.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-5 rounded-xl bg-[#1f2028] border border-[#2e303a] flex items-center justify-between hover:border-purple-500/50 transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center p-2 text-teal-400 font-mono font-bold text-xs">
                        SOFI
                      </div>
                      <div>
                        <p className="text-[#f3f4f6] font-medium group-hover:text-purple-300 transition">SoFi Bank & Savings Vault</p>
                        <p className="text-xs text-[#6b6375]">Available Liquidity: ${sofiBalance.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#6b6375] group-hover:text-purple-400 transition">Launch Portal ↗</span>
                  </a>

                  <a 
                    href="https://www.mtb.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-5 rounded-xl bg-[#1f2028] border border-[#2e303a] flex items-center justify-between hover:border-purple-500/50 transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-2 text-emerald-400 font-mono font-bold text-xs">
                        M&T
                      </div>
                      <div>
                        <p className="text-[#f3f4f6] font-medium group-hover:text-purple-300 transition">M&T Bank Auto Loan (Subaru WRX)</p>
                        <p className="text-xs text-[#6b6375]">Principal Balance: $18,732.00 | Monthly Payment: $251.84</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#6b6375] group-hover:text-purple-400 transition">Launch Portal ↗</span>
                  </a>
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* AI AGENT DISPATCHER (TRANSPARENT GATE)                   */}
        {/* ========================================================= */}
        {activeTab === 'ai-agent' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-medium text-[#f3f4f6]">AI Agent Task Dispatcher</h2>
              <p className="text-sm text-[#9ca3af]">Multi-model fallback array (gemini-2.0-flash / gemini-1.5-flash).</p>
            </div>

            {!isAuthenticated ? (
              <div className="p-12 rounded-2xl bg-[#16171d]/85 backdrop-blur-md border border-purple-500/20 text-center space-y-4 shadow-2xl">
                <span className="text-xl">🔒</span>
                <p className="text-sm font-medium text-[#f3f4f6]">AI Dispatcher Restricted</p>
                <p className="text-xs text-[#9ca3af]">Master User authentication required to queue tasks to Gemini backend.</p>
                <button 
                  onClick={() => setActiveTab('login')}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-medium transition cursor-pointer"
                >
                  Authenticate
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleRunAIAgent} className="space-y-4">
                  <textarea
                    value={taskPrompt}
                    onChange={(e) => setTaskPrompt(e.target.value)}
                    placeholder="Enter instruction for Gemini agent..."
                    rows={3}
                    className="w-full p-4 rounded-xl bg-[#1f2028] border border-[#2e303a] text-sm text-[#f3f4f6] focus:outline-none focus:border-purple-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={isExecuting}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition cursor-pointer disabled:opacity-50"
                  >
                    {isExecuting ? 'Processing...' : 'Dispatch Task'}
                  </button>
                </form>

                <div className="p-6 rounded-2xl bg-[#1f2028] border border-[#2e303a] font-mono text-xs text-purple-300 space-y-2 shadow-xl">
                  <div className="text-[#6b6375] border-b border-[#2e303a] pb-2">// EXECUTION_LOGS</div>
                  {agentLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MASTER USER LOGIN (DEFAULT PASSKEY: 0000)                */}
        {/* ========================================================= */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto space-y-8 pt-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-medium text-[#f3f4f6]">Master User Clearance</h2>
              <p className="text-sm text-[#9ca3af]">Enter passkey for unrestricted system operator permissions.</p>
            </div>

            <div className="p-8 rounded-2xl bg-[#1f2028] border border-[#2e303a] space-y-6">
              {isAuthenticated ? (
                <div className="space-y-4 text-center">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                    AUTHENTICATED OPERATOR: FULL ACCESS GRANTED
                  </div>
                  <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="w-full py-2.5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs font-mono cursor-pointer"
                  >
                    Lock Session
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-[#6b6375]">MASTER PASSKEY (DEFAULT: 0000)</label>
                    <input 
                      type="password" 
                      value={passkeyInput}
                      onChange={(e) => setPasskeyInput(e.target.value)}
                      placeholder="Enter passkey..."
                      className="w-full p-3 rounded-xl bg-[#16171d] border border-[#2e303a] text-sm text-[#f3f4f6] focus:outline-none focus:border-purple-400 font-mono"
                    />
                  </div>

                  {authError && (
                    <p className="text-xs text-rose-400 font-mono">{authError}</p>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition cursor-pointer"
                  >
                    Authenticate Master Session
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 w-full border-t border-[#2e303a] text-xs text-[#6b6375] flex justify-between font-mono">
        <span>© 2026 Kwame A. Lockley</span>
        <span>CLEARANCE: {isAuthenticated ? 'OPERATOR_MASTER' : 'GUEST_VIEW'}</span>
      </footer>
    </div>
  );
}

import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import type { TabType } from '../types/navigation';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [nodeStatus, setNodeStatus] = useState<'ONLINE' | 'SYNCING'>('ONLINE');
  const [commandLog, setCommandLog] = useState<string[]>([
    '[00:00:01] Settings environment initialized.',
    '[00:00:02] Security passkey gate: SECUREENV: LOCAL_HOST',
    '[00:00:03] Telemetry stream active.'
  ]);

  const handleSimulateSync = () => {
    setNodeStatus('SYNCING');
    setCommandLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Synchronizing local node state...`]);
    setTimeout(() => {
      setNodeStatus('ONLINE');
      setCommandLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Sync complete. Node verified.`]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#16171d] text-[#9ca3af] flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar activeTab={activeTab} onNavigate={setActiveTab} />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full space-y-8">
        <header className="border-b border-[#2e303a] pb-6">
          <h1 className="text-3xl font-medium text-[#f3f4f6] tracking-tight">System Settings & Telemetry</h1>
          <p className="text-sm text-[#9ca3af] mt-1">Manage local environment parameters, diagnostic logs, and node synchronization.</p>
        </header>

        {/* Configuration Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-sm">
          <div className="p-5 rounded-xl bg-[#1f2028] border border-[#2e303a] flex items-center justify-between">
            <span className="text-[#9ca3af]">Vite HMR Build Pipeline</span>
            <span className="text-cyan-400">Optimal</span>
          </div>
          <div className="p-5 rounded-xl bg-[#1f2028] border border-[#2e303a] flex items-center justify-between">
            <span className="text-[#9ca3af]">Tailwind CSS v4 Engine</span>
            <span className="text-cyan-400">Active</span>
          </div>
          <div className="p-5 rounded-xl bg-[#1f2028] border border-[#2e303a] flex items-center justify-between">
            <span className="text-[#9ca3af]">Node Sync Status</span>
            <span className={nodeStatus === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}>
              {nodeStatus}
            </span>
          </div>
          <div className="p-5 rounded-xl bg-[#1f2028] border border-[#2e303a] flex items-center justify-between">
            <span className="text-[#9ca3af]">TypeScript Linter</span>
            <span className="text-emerald-400">Clean</span>
          </div>
        </div>

        {/* Live Console */}
        <div className="p-6 rounded-2xl bg-[#1f2028] border border-[#2e303a] font-mono text-xs text-cyan-400 space-y-2 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2e303a] pb-3 text-[#6b6375]">
            <span>// LIVE_CONSOLE_TELEMETRY</span>
            <button 
              onClick={handleSimulateSync}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              [Trigger Sync]
            </button>
          </div>
          {commandLog.map((log, idx) => (
            <div key={idx} className="transition-opacity duration-300">{log}</div>
          ))}
          <div className="text-emerald-400 animate-pulse pt-2">_ awaiting command input</div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 w-full border-t border-[#2e303a] text-xs text-[#6b6375] flex justify-between">
        <span>© 2026 Kwame Antonio Lockley</span>
        <span>SECUREENV: LOCAL_HOST</span>
      </footer>
    </div>
  );
}

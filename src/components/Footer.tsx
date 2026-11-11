import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          <span>SYSTEM BUILD // 2026.11</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-cyan-400 cursor-pointer transition">SECURITY_PASSKEY: SECURE</span>
          <span className="hover:text-cyan-400 cursor-pointer transition">ENV: LOCAL_HOST</span>
        </div>
      </div>
    </footer>
  );
};
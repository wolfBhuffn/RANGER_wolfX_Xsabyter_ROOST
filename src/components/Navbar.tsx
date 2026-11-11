import React from 'react';
import type { TabType } from '../types/navigation';

interface NavbarProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate }) => {
  const navItems: { id: TabType; label: string }[] = [
    { id: 'home', label: 'About Me' },
    { id: 'projects', label: 'Projects' },
    { id: 'scfu', label: 'SCFU' },
    { id: 'networth', label: 'Net Worth' },
    { id: 'cashflow', label: 'Cashflow' },
    { id: 'ai-agent', label: 'AI Agent' },
    { id: 'login', label: 'Login' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#16171d]/90 border-b border-[#2e303a]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('home')} 
          className="cursor-pointer font-mono font-medium text-sm text-[#f3f4f6] tracking-wider"
        >
          KWAME_LOCKLEY
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`transition-colors cursor-pointer ${
                activeTab === item.id 
                  ? 'text-[#f3f4f6] font-medium border-b-2 border-purple-400 pb-1' 
                  : 'text-[#9ca3af] hover:text-[#f3f4f6]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

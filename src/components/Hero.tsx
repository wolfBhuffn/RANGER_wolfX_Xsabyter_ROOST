import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  title = "Next-Generation Interface Architecture",
  subtitle = "Engineered with strict TypeScript typing, modular React components, and high-performance reactive state management.",
  onPrimaryAction,
  onSecondaryAction
}) => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32 border-b border-slate-800/60">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
        {/* Status Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-cyan-400 font-mono text-xs shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          WORKSPACE INITIALIZED • TSX / REACT / TAILWIND
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={onPrimaryAction}
            className="w-full sm:w-auto px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl text-sm transition shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
          >
            Initialize Workspace
          </button>
          <button 
            onClick={onSecondaryAction}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-800 text-sm transition"
          >
            View Documentation
          </button>
        </div>
      </div>
    </section>
  );
};

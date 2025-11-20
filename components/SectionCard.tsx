import React from 'react';

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  borderColor?: string;
  glowColor?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  icon, 
  children, 
  borderColor = 'border-white/10',
  glowColor = 'shadow-cyan-500/5'
}) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-white/5 backdrop-blur-xl 
      rounded-3xl border ${borderColor} 
      p-6 shadow-2xl ${glowColor}
      transition-transform duration-300 ease-out
    `}>
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/5 rounded-xl border border-white/5 shadow-inner">
          {icon}
        </div>
        <h2 className="text-xs font-bold text-slate-200 uppercase tracking-[0.15em]">
          {title}
        </h2>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

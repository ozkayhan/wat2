import React from 'react';

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  borderColor?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  icon, 
  children, 
  borderColor = 'border-slate-800' 
}) => {
  return (
    <div className={`bg-slate-900/50 rounded-xl border ${borderColor} p-5 shadow-xl backdrop-blur-sm`}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/50">
        {icon && <div>{icon}</div>}
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
};

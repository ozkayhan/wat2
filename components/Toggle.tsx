import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  subLabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, subLabel }) => {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">{label}</span>
        {subLabel && <span className="text-[10px] text-slate-500 font-medium">{subLabel}</span>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none
          ${checked ? 'bg-cyan-500 shadow-lg shadow-cyan-500/30' : 'bg-slate-800 border border-white/10'}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

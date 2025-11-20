import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  subLabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, subLabel }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        {subLabel && <span className="text-[10px] text-slate-500">{subLabel}</span>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50
          ${checked ? 'bg-cyan-600' : 'bg-slate-700'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition duration-200
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};
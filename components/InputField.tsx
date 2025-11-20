import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({ label, subLabel, icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <div className="flex justify-between items-baseline px-1">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider transition-colors group-focus-within:text-cyan-400">
          {label}
        </label>
        {subLabel && <span className="text-[9px] text-slate-500 font-medium">{subLabel}</span>}
      </div>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors duration-300 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-slate-950/30 border border-white/10 rounded-2xl 
            text-slate-100 placeholder-slate-700 font-mono text-sm
            focus:outline-none focus:bg-slate-900/50 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10
            transition-all duration-300 py-3.5
            shadow-inner
            ${icon ? 'pl-11 pr-4' : 'px-4'}
            ${props.type === 'date' ? '[color-scheme:dark]' : ''}
            ${className}
          `}
          step="any"
          {...props}
        />
      </div>
    </div>
  );
};

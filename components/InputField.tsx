import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({ label, subLabel, icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-baseline">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
        {subLabel && <span className="text-[10px] text-slate-500">{subLabel}</span>}
      </div>
      
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-slate-900 border border-slate-700 rounded-lg 
            text-slate-100 placeholder-slate-600 font-mono text-sm
            focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500
            transition-all duration-200 py-2.5
            ${icon ? 'pl-9 pr-3' : 'px-3'}
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

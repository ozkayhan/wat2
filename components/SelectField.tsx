import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
  options: SelectOption[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ 
  label, 
  subLabel, 
  icon, 
  options, 
  className = '', 
  ...props 
}) => {
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
        
        <select
          className={`
            w-full bg-slate-950/30 border border-white/10 rounded-2xl 
            text-slate-100 font-mono text-sm appearance-none
            focus:outline-none focus:bg-slate-900/50 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10
            transition-all duration-300 py-3.5
            shadow-inner cursor-pointer
            ${icon ? 'pl-11 pr-10' : 'px-4 pr-10'}
            ${className}
          `}
          {...props}
        >
          <option value="" disabled className="bg-slate-900 text-slate-500">Select a state...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
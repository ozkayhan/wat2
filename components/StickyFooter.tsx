import React from 'react';
import { CalculatedResults } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StickyFooterProps {
  results: CalculatedResults;
}

const formatCurrency = (val: number) => {
  const isNeg = val < 0;
  const absVal = Math.abs(val);
  return `${isNeg ? '-' : ''}$${absVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const StickyFooter: React.FC<StickyFooterProps> = ({ results }) => {
  const { 
    isValid, 
    weeklyNetProfit, 
    monthlyNetProfit, 
    totalSeasonProfit, 
    totalAfterSplurge, 
    grossWeeklyIncome, 
    netWeeklyIncome,
    totalSeasonTax 
  } = results;

  // Determine styles based on profit
  const isProfit = totalSeasonProfit >= 0;
  const profitColor = isProfit ? 'text-emerald-400' : 'text-rose-400';
  const bgColor = isProfit ? 'from-emerald-500/10 to-slate-900' : 'from-rose-500/10 to-slate-900';
  const borderColor = isProfit ? 'border-emerald-500/30' : 'border-rose-500/30';
  
  const isFinalProfit = totalAfterSplurge >= 0;
  const finalProfitColor = isFinalProfit ? 'text-emerald-400' : 'text-rose-400';

  if (!isValid) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-6 pb-8 backdrop-blur-lg z-50">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2 text-slate-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Enter dates to see projection</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t ${bgColor} border-t ${borderColor} backdrop-blur-xl z-50 transition-all duration-500`}>
      <div className="max-w-md mx-auto p-4 pb-8">
        
        {/* Tax Info Banner */}
        <div className="flex justify-between items-center px-2 mb-3 text-[10px] text-slate-500 border-b border-slate-800/50 pb-2">
          <span>Total Est. Taxes: <span className="text-rose-400">-{formatCurrency(totalSeasonTax)}</span></span>
          <span>Weekly Gross: {formatCurrency(grossWeeklyIncome)}</span>
        </div>

        {/* Weekly / Monthly Stats */}
        <div className="flex justify-between mb-4 px-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Weekly Net Profit</span>
            <span className={`text-lg font-mono font-bold ${weeklyNetProfit >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
              {formatCurrency(weeklyNetProfit)}
            </span>
            <span className="text-[9px] text-slate-600">(Income - Expense)</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Monthly Net Profit</span>
            <span className={`text-lg font-mono font-bold ${monthlyNetProfit >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
              {formatCurrency(monthlyNetProfit)}
            </span>
             <span className="text-[9px] text-slate-600">(Weekly × 4)</span>
          </div>
        </div>

        <div className="space-y-3">
            {/* Main Stat: Total Season KASA */}
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/50 flex justify-between items-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
            <div className="pl-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-0.5">
                Total Season Kasa (Net)
                </span>
                <div className="flex items-center gap-2">
                    {isProfit ? <TrendingUp className="w-4 h-4 text-emerald-500"/> : <TrendingDown className="w-4 h-4 text-rose-500"/>}
                    <span className={`text-2xl sm:text-3xl font-black tracking-tighter font-mono ${profitColor}`}>
                    {formatCurrency(totalSeasonProfit)}
                    </span>
                </div>
            </div>
            </div>

            {/* Final Stat: After Travel & Purchases */}
             <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/50 flex justify-between items-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50"></div>
             <div className="pl-2 w-full">
                <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                    After Travel & Purchases
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                    {isFinalProfit ? <CheckCircle2 className="w-4 h-4 text-emerald-500"/> : <AlertCircle className="w-4 h-4 text-rose-500"/>}
                    <span className={`text-2xl sm:text-3xl font-black tracking-tighter font-mono ${finalProfitColor}`}>
                    {formatCurrency(totalAfterSplurge)}
                    </span>
                </div>
            </div>
            </div>
        </div>
        
      </div>
    </div>
  );
};
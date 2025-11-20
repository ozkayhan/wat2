import React, { useState } from 'react';
import { CalculatedResults } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Instagram, Wallet, Receipt, ChevronDown, ChevronUp } from 'lucide-react';

interface StickyFooterProps {
  results: CalculatedResults;
  upfrontCost?: number; // Passed for the breakdown view
  travelCost?: number; // Passed for the breakdown view
}

const formatCurrency = (val: number) => {
  const isNeg = val < 0;
  const absVal = Math.abs(val);
  return `${isNeg ? '-' : ''}$${absVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const StickyFooter: React.FC<StickyFooterProps> = ({ results, upfrontCost = 0, travelCost = 0 }) => {
  const [showBreakdown, setShowBreakdown] = useState(true);
  
  const { 
    isValid, 
    weeklyNetProfit, 
    monthlyNetProfit, 
    totalSeasonProfit, 
    totalAfterSplurge, 
    grossWeeklyIncome, 
    netWeeklyIncome,
    totalSeasonTax,
    totalSeasonGross,
    totalLivingCost,
  } = results;

  // Recalculate Operational Profit (Cash Flow) for the breakdown
  // Operational Profit = Total Gross - Tax - Living. (Before Upfront Deduction)
  const totalOperationalProfit = totalSeasonGross - totalSeasonTax - totalLivingCost;

  const isProfit = totalSeasonProfit >= 0;
  const profitColor = isProfit ? 'text-emerald-400' : 'text-rose-400';
  const finalProfitColor = totalAfterSplurge >= 0 ? 'text-emerald-400' : 'text-rose-400';

  if (!isValid) {
    return (
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
        <div className="inline-flex p-4 bg-slate-900/50 rounded-full mb-4 border border-white/5">
           <AlertCircle className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Ready to Calculate?</h3>
        <p className="text-sm text-slate-400">Enter your program dates to unlock the financial projection dashboard.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      
      {/* Header / Summary Strip */}
      <div className="bg-slate-950/30 border-b border-white/5 p-5">
        <div className="flex justify-between items-end mb-1">
           <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Overview</span>
           <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">Net Income</span>
        </div>
        <div className="flex justify-between items-center">
           <div>
             <div className="text-2xl font-mono font-bold text-white">{formatCurrency(netWeeklyIncome)}</div>
             <div className="text-[10px] text-slate-500 mt-0.5">Gross: {formatCurrency(grossWeeklyIncome)}</div>
           </div>
           <div className="text-right">
             <div className="text-sm font-mono font-medium text-rose-400">-{formatCurrency(Math.abs(totalSeasonTax))}</div>
             <div className="text-[10px] text-slate-500 mt-0.5">Est. Season Tax</div>
           </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        
        {/* Stats Grid - Cash Flow (Operating Profit) */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Weekly Cash</span>
              <span className={`text-lg font-mono font-bold ${weeklyNetProfit >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
                {formatCurrency(weeklyNetProfit)}
              </span>
           </div>
           <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Monthly Cash</span>
              <span className={`text-lg font-mono font-bold ${monthlyNetProfit >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
                {formatCurrency(monthlyNetProfit)}
              </span>
           </div>
        </div>

        {/* Main Results */}
        <div className="space-y-4">
           
           {/* Total Season */}
           <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 p-5 group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Wallet className="w-12 h-12 text-cyan-400" />
              </div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em] mb-1 block">
                Total Season Profit
              </span>
              <div className="flex items-center gap-3">
                 <span className={`text-4xl font-black tracking-tighter font-mono ${profitColor}`}>
                    {formatCurrency(totalSeasonProfit)}
                 </span>
                 {isProfit ? <TrendingUp className="w-5 h-5 text-emerald-500"/> : <TrendingDown className="w-5 h-5 text-rose-500"/>}
              </div>
              <div className="text-[10px] text-slate-500 mt-2 font-medium">
                *After deducting Upfront Cost
              </div>
           </div>

           {/* After Splurge */}
           <div className="relative overflow-hidden rounded-2xl bg-slate-950/50 border border-white/5 p-5">
               <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em] mb-1 block">
                  Post-Travel Balance
               </span>
               <div className="flex items-center gap-3">
                 <span className={`text-3xl font-bold tracking-tight font-mono ${finalProfitColor}`}>
                    {formatCurrency(totalAfterSplurge)}
                 </span>
                 {totalAfterSplurge >= 0 ? <CheckCircle2 className="w-5 h-5 text-emerald-500"/> : <AlertCircle className="w-5 h-5 text-rose-500"/>}
              </div>
              <div className="mt-2 w-full bg-slate-800/50 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${totalAfterSplurge >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} transition-all duration-1000`} 
                    style={{ width: '100%' }}
                  />
              </div>
           </div>

        </div>

        {/* DETAILED BREAKDOWN (Receipt Style) */}
        <div className="mt-6 pt-6 border-t border-dashed border-white/10">
          <button 
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors mb-4"
          >
            <span>Financial Breakdown</span>
            {showBreakdown ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
          </button>

          {showBreakdown && (
            <div className="space-y-2 text-[11px] font-mono text-slate-500 leading-relaxed">
              
              <div className="flex justify-between">
                <span>Total Gross Income</span>
                <span className="text-slate-300">{formatCurrency(totalSeasonGross)}</span>
              </div>
              
              <div className="flex justify-between text-rose-400/80">
                <span>Total Taxes</span>
                <span>- {formatCurrency(totalSeasonTax)}</span>
              </div>

              <div className="flex justify-between text-rose-400/80 border-b border-white/5 pb-2">
                 <span>Living Expenses</span>
                 <span>- {formatCurrency(totalLivingCost)}</span>
              </div>

              <div className="flex justify-between py-1 text-slate-300 font-bold">
                 <span>Operational Cash</span>
                 <span>{formatCurrency(totalOperationalProfit)}</span>
              </div>

              <div className="flex justify-between text-rose-400/80 border-b border-white/5 pb-2">
                 <span>Upfront Cost (Paid Back)</span>
                 <span>- {formatCurrency(upfrontCost)}</span>
              </div>

              <div className="flex justify-between py-1 text-cyan-400 font-bold">
                 <span>Net Profit</span>
                 <span>{formatCurrency(totalSeasonProfit)}</span>
              </div>

              <div className="flex justify-between text-amber-500/80 border-b border-white/5 pb-2">
                 <span>Travel & Shopping</span>
                 <span>- {formatCurrency(travelCost)}</span>
              </div>

               <div className="flex justify-between pt-1 text-emerald-400 font-black text-xs">
                 <span>FINAL BALANCE</span>
                 <span>{formatCurrency(totalAfterSplurge)}</span>
              </div>

            </div>
          )}
        </div>

        {/* Footer Link */}
        <a 
          href="https://www.instagram.com/ouz.k.a/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-2 pt-4 border-t border-white/5 group cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 group-hover:text-cyan-400 transition-colors">
            Made by Oguz Ayhan
          </span>
          <Instagram className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-500 transition-colors duration-300" />
        </a>

      </div>
    </div>
  );
};
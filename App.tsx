import React, { useState, useMemo } from 'react';
import { RefreshCw, Plane, Briefcase, DollarSign, Home, Calendar, Utensils, ShoppingBag, FileText } from 'lucide-react';
import { SectionCard } from './components/SectionCard';
import { InputField } from './components/InputField';
import { StickyFooter } from './components/StickyFooter';
import { Toggle } from './components/Toggle';
import { AppState, CalculatedResults } from './types';

const DEFAULT_STATE: AppState = {
  startDate: '2025-06-17',
  endDate: '2025-09-20',
  upfrontCost: '4000',
  housingCost: '100',
  weeklyLivingCost: '100',
  travelCost: '1000',
  purchaseCost: '',
  stateTaxRate: '3.5',
  isFicaExempt: true,
  includeOvertime: true,
  job1: {
    wage: '15',
    hours: '40',
  },
  job2: {
    wage: '',
    hours: '',
  },
};

export default function App() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);

  // Reset Handler
  const handleReset = () => {
    if (window.confirm('Reset all fields to default?')) {
      setState(DEFAULT_STATE);
    }
  };

  // Input Handlers
  const updateState = (key: keyof AppState, value: string | boolean) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const updateJob = (job: 'job1' | 'job2', field: 'wage' | 'hours', value: string) => {
    setState((prev) => ({
      ...prev,
      [job]: { ...prev[job], [field]: value },
    }));
  };

  // Calculation Logic
  const results: CalculatedResults = useMemo(() => {
    const { 
      startDate, endDate, upfrontCost, housingCost, weeklyLivingCost, 
      job1, job2, travelCost, purchaseCost, 
      stateTaxRate, isFicaExempt, includeOvertime 
    } = state;

    // 1. Validate Dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const isValidDates = startDate !== '' && endDate !== '' && !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;

    if (!isValidDates) {
      return {
        isValid: false,
        totalWeeks: 0,
        weeklyProgramCost: 0,
        grossWeeklyIncome: 0,
        netWeeklyIncome: 0,
        weeklyTax: 0,
        totalSeasonGross: 0,
        totalSeasonTax: 0,
        totalWeeklyExpense: 0,
        weeklyNetProfit: 0,
        monthlyNetProfit: 0,
        totalSeasonProfit: 0,
        totalAfterSplurge: 0,
      };
    }

    // 2. Duration
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const totalWeeks = diffDays / 7;

    // 3. Expenses (Recurring)
    const costUpfront = parseFloat(upfrontCost) || 0;
    const costHousing = parseFloat(housingCost) || 0;
    const costLiving = parseFloat(weeklyLivingCost) || 0;
    
    // Amortized cost
    const weeklyProgramCost = totalWeeks > 0 ? costUpfront / totalWeeks : 0;
    const totalWeeklyExpense = costHousing + costLiving + weeklyProgramCost;

    // 4. Gross Income Calculation (with Overtime)
    const calculateJobIncome = (wageStr: string, hoursStr: string) => {
      const wage = parseFloat(wageStr) || 0;
      const hours = parseFloat(hoursStr) || 0;
      
      if (includeOvertime && hours > 40) {
        const regularPay = 40 * wage;
        const overtimePay = (hours - 40) * (wage * 1.5);
        return regularPay + overtimePay;
      }
      return wage * hours;
    };

    const gross1 = calculateJobIncome(job1.wage, job1.hours);
    const gross2 = calculateJobIncome(job2.wage, job2.hours);
    const grossWeeklyIncome = gross1 + gross2;
    const totalSeasonGross = grossWeeklyIncome * totalWeeks;

    // 5. Tax Logic (J-1 / Non-Resident Alien)
    // Federal Tax (2024 Brackets for Single)
    // 10% on income between $0 and $11,600
    // 12% on income between $11,600 and $47,150
    let federalTaxTotal = 0;
    if (totalSeasonGross <= 11600) {
      federalTaxTotal = totalSeasonGross * 0.10;
    } else {
      federalTaxTotal = (11600 * 0.10) + ((totalSeasonGross - 11600) * 0.12);
    }

    // State Tax (Flat estimate based on user input)
    const stateRate = parseFloat(stateTaxRate) || 0;
    const stateTaxTotal = totalSeasonGross * (stateRate / 100);

    // FICA (Social Security + Medicare = 7.65%)
    // J-1 Students are typically exempt for the first 5 calendar years.
    const ficaTaxTotal = isFicaExempt ? 0 : totalSeasonGross * 0.0765;

    const totalSeasonTax = federalTaxTotal + stateTaxTotal + ficaTaxTotal;
    const weeklyTax = totalSeasonTax / totalWeeks;

    // 6. Net Income
    const netWeeklyIncome = grossWeeklyIncome - weeklyTax;

    // 7. Profit (Pocket Money)
    const weeklyNetProfit = netWeeklyIncome - totalWeeklyExpense;
    const monthlyNetProfit = weeklyNetProfit * 4;
    const totalSeasonProfit = weeklyNetProfit * totalWeeks;

    // 8. Post-Season Splurges
    const costTravel = parseFloat(travelCost) || 0;
    const costPurchase = parseFloat(purchaseCost) || 0;
    const totalAfterSplurge = totalSeasonProfit - costTravel - costPurchase;

    return {
      isValid: true,
      totalWeeks,
      weeklyProgramCost,
      grossWeeklyIncome,
      netWeeklyIncome,
      weeklyTax,
      totalSeasonGross,
      totalSeasonTax,
      totalWeeklyExpense,
      weeklyNetProfit,
      monthlyNetProfit,
      totalSeasonProfit,
      totalAfterSplurge,
    };
  }, [state]);

  return (
    <div className="min-h-screen bg-slate-950 pb-96 md:pb-80 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-500 p-2 rounded-lg shadow-cyan-500/20 shadow-lg">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">
            Work & Travel <span className="text-cyan-400">Calc</span>
          </h1>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Section A: Global Parameters */}
        <SectionCard title="The Logistics" icon={<Calendar className="w-4 h-4 text-cyan-400"/>}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Start Date"
              type="date"
              value={state.startDate}
              onChange={(e) => updateState('startDate', e.target.value)}
            />
            <InputField
              label="End Date"
              type="date"
              value={state.endDate}
              onChange={(e) => updateState('endDate', e.target.value)}
            />
          </div>
          
          <InputField
            label="Total Upfront Cost"
            subLabel="Program + Flight + Visa"
            type="number"
            icon={<DollarSign className="w-4 h-4"/>}
            value={state.upfrontCost}
            placeholder="3000"
            onChange={(e) => updateState('upfrontCost', e.target.value)}
          />
          
          {results.isValid && (
             <div className="mt-3 p-2 bg-slate-800/50 rounded border border-slate-700/50 flex justify-between text-xs text-slate-400">
               <span>Duration: <span className="text-slate-200">{results.totalWeeks.toFixed(1)} weeks</span></span>
               <span>Depreciation: <span className="text-rose-400">-${results.weeklyProgramCost.toFixed(0)}/wk</span></span>
             </div>
          )}
        </SectionCard>

        {/* Section B: Job 1 */}
        <SectionCard title="Job 1: The Grind" icon={<Briefcase className="w-4 h-4 text-emerald-400"/>} borderColor="border-emerald-500/20">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Hourly Wage"
              type="number"
              icon={<DollarSign className="w-4 h-4"/>}
              value={state.job1.wage}
              onChange={(e) => updateJob('job1', 'wage', e.target.value)}
            />
            <InputField
              label="Hours / Week"
              type="number"
              value={state.job1.hours}
              onChange={(e) => updateJob('job1', 'hours', e.target.value)}
            />
          </div>
        </SectionCard>

        {/* Section C: Job 2 */}
        <SectionCard title="Job 2: The Hustle" icon={<Briefcase className="w-4 h-4 text-violet-400"/>} borderColor="border-violet-500/20">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Hourly Wage"
              type="number"
              placeholder="Optional"
              icon={<DollarSign className="w-4 h-4"/>}
              value={state.job2.wage}
              onChange={(e) => updateJob('job2', 'wage', e.target.value)}
            />
            <InputField
              label="Hours / Week"
              type="number"
              placeholder="Optional"
              value={state.job2.hours}
              onChange={(e) => updateJob('job2', 'hours', e.target.value)}
            />
          </div>
        </SectionCard>

        {/* NEW Section: Taxes */}
        <SectionCard title="Taxes & Deductions" icon={<FileText className="w-4 h-4 text-blue-400"/>} borderColor="border-blue-500/20">
          <div className="space-y-3">
            <InputField
                label="Est. State Tax Rate (%)"
                subLabel="Usually 3% - 6%"
                type="number"
                value={state.stateTaxRate}
                onChange={(e) => updateState('stateTaxRate', e.target.value)}
            />
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <Toggle 
                label="J-1 FICA Exempt" 
                subLabel="No Social Security/Medicare (7.65%)"
                checked={state.isFicaExempt} 
                onChange={(val) => updateState('isFicaExempt', val)} 
              />
              <Toggle 
                label="Calculate Overtime" 
                subLabel="1.5x Wage for hours > 40"
                checked={state.includeOvertime} 
                onChange={(val) => updateState('includeOvertime', val)} 
              />
            </div>
          </div>
        </SectionCard>

        {/* Section D: Living Expenses */}
        <SectionCard title="Living Expenses" icon={<Home className="w-4 h-4 text-rose-400"/>} borderColor="border-rose-500/20">
          <div className="space-y-4">
             <InputField
              label="Weekly Rent"
              type="number"
              icon={<DollarSign className="w-4 h-4"/>}
              value={state.housingCost}
              onChange={(e) => updateState('housingCost', e.target.value)}
            />
            
            <div>
              <InputField
                label="Weekly Lifestyle"
                subLabel="Food, Uber, Entertainment"
                type="number"
                icon={<Utensils className="w-4 h-4"/>}
                value={state.weeklyLivingCost}
                onChange={(e) => updateState('weeklyLivingCost', e.target.value)}
              />
              <p className="text-[10px] text-slate-500 mt-1.5 italic">
                * Don't forget to include daily meal costs at work!
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Section E: End of Season Splurges */}
        <SectionCard title="End of Season Plans" icon={<ShoppingBag className="w-4 h-4 text-amber-400"/>} borderColor="border-amber-500/20">
           <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Travel Budget"
              subLabel="End of summer trip"
              type="number"
              placeholder="0"
              icon={<Plane className="w-4 h-4"/>}
              value={state.travelCost}
              onChange={(e) => updateState('travelCost', e.target.value)}
            />
            <InputField
              label="Tech & Shopping"
              subLabel="iPhone, Gifts, etc."
              type="number"
              placeholder="0"
              icon={<DollarSign className="w-4 h-4"/>}
              value={state.purchaseCost}
              onChange={(e) => updateState('purchaseCost', e.target.value)}
            />
          </div>
           <p className="text-[10px] text-slate-500 mt-3 text-center">
             These costs are deducted from your final total, not weekly profit.
          </p>
        </SectionCard>

        <div className="text-center text-slate-600 text-xs pt-4">
            <p>Calculated with 2024 Federal Tax Brackets (Single/NRA).</p>
            <p>Keep hustling.</p>
        </div>

      </main>

      {/* Sticky Footer */}
      <StickyFooter results={results} />
    </div>
  );
}
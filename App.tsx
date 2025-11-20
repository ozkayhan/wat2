import React, { useState, useMemo } from 'react';
import { RefreshCw, Plane, Briefcase, DollarSign, Home, Calendar, Utensils, ShoppingBag, FileText, MapPin } from 'lucide-react';
import { SectionCard } from './components/SectionCard';
import { InputField } from './components/InputField';
import { SelectField } from './components/SelectField';
import { StickyFooter } from './components/StickyFooter'; 
import { Toggle } from './components/Toggle';
import { AppState, CalculatedResults } from './types';
import { US_STATES } from './constants';

const DEFAULT_STATE: AppState = {
  startDate: '2025-06-17',
  endDate: '2025-09-20',
  upfrontCost: '4000',
  housingCost: '100',
  weeklyLivingCost: '100',
  travelCost: '1000',
  purchaseCost: '',
  selectedState: '',
  stateTaxRate: '0',
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

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const stateData = US_STATES.find(s => s.name === selectedName);
    
    setState(prev => ({
      ...prev,
      selectedState: selectedName,
      stateTaxRate: stateData ? stateData.rate.toString() : '0'
    }));
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
        totalLivingCost: 0,
        weeklyNetProfit: 0,
        monthlyNetProfit: 0,
        totalSeasonProfit: 0,
        totalAfterSplurge: 0,
      };
    }

    // 1. Time Calculation
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const totalWeeks = diffDays / 7;

    // 2. Expense Parsing
    const costUpfront = parseFloat(upfrontCost) || 0;
    const costHousing = parseFloat(housingCost) || 0;
    const costLiving = parseFloat(weeklyLivingCost) || 0;
    const costTravel = parseFloat(travelCost) || 0;
    const costPurchase = parseFloat(purchaseCost) || 0;
    
    // Only for informational display (Amortization)
    const weeklyProgramCost = totalWeeks > 0 ? costUpfront / totalWeeks : 0;
    
    // Operational Expenses (Rent + Food only)
    const weeklyOperationalExpense = costHousing + costLiving;
    const totalWeeklyExpense = weeklyOperationalExpense; 
    const totalLivingCost = weeklyOperationalExpense * totalWeeks;

    // 3. Income Calculation
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

    // 4. Tax Calculation (Waterfall)
    // Federal: 2024 Bracket estimation (10% first 11600, 12% remainder)
    let federalTaxTotal = 0;
    if (totalSeasonGross <= 11600) {
      federalTaxTotal = totalSeasonGross * 0.10;
    } else {
      federalTaxTotal = (11600 * 0.10) + ((totalSeasonGross - 11600) * 0.12);
    }

    // State: Flat rate on Gross
    const stateRate = parseFloat(stateTaxRate) || 0;
    const stateTaxTotal = totalSeasonGross * (stateRate / 100);
    
    // FICA: Flat rate on Gross
    const ficaTaxTotal = isFicaExempt ? 0 : totalSeasonGross * 0.0765;

    const totalSeasonTax = federalTaxTotal + stateTaxTotal + ficaTaxTotal;
    const weeklyTax = totalSeasonTax / totalWeeks;

    // 5. Net Income & Cash Flow Logic
    const netWeeklyIncome = grossWeeklyIncome - weeklyTax; // Paycheck amount
    
    // Weekly Net Profit = Paycheck - Living Expenses
    // This represents "Weekly Savings Potential" (Cash Flow)
    // Does NOT subtract Upfront Cost, so user sees actual cash accumulation.
    const weeklyNetProfit = netWeeklyIncome - weeklyOperationalExpense;
    
    const monthlyNetProfit = weeklyNetProfit * 4;
    
    // 6. Season Profit (ROI)
    // Accumulated Savings - Initial Investment (Upfront Cost)
    // This represents "Did I make money overall after paying my parents back?"
    const totalOperationalSavings = weeklyNetProfit * totalWeeks;
    const totalSeasonProfit = totalOperationalSavings - costUpfront;

    // 7. Final Balance Logic
    // This represents "Cash in Pocket" to take home
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
      totalLivingCost,
      weeklyNetProfit,
      monthlyNetProfit,
      totalSeasonProfit,
      totalAfterSplurge,
    };
  }, [state]);

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      
      {/* Liquid Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none opacity-60 animate-pulse" />
      <div className="fixed bottom-[10%] right-[-5%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[128px] pointer-events-none opacity-50" />
      <div className="fixed top-[40%] left-[30%] w-[30vw] h-[30vw] bg-rose-600/10 rounded-full blur-[96px] pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-12">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-2xl shadow-lg shadow-cyan-500/20">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Work & Travel
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Profit Calculator</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 backdrop-blur-md"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:rotate-180 transition-all duration-500" />
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white">Reset</span>
          </button>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Inputs (Spans 7/12 on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section A: Logistics */}
            <SectionCard title="The Logistics" icon={<Calendar className="w-4 h-4 text-cyan-400"/>}>
              <div className="grid grid-cols-2 gap-5 mb-5">
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
                <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Duration</span>
                  <span className="text-slate-200 font-mono bg-slate-950/50 px-2 py-1 rounded-lg border border-white/5">
                    {results.totalWeeks.toFixed(1)} weeks
                  </span>
                </div>
              )}
            </SectionCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section B: Job 1 */}
              <SectionCard title="Job 1" icon={<Briefcase className="w-4 h-4 text-emerald-400"/>} borderColor="border-emerald-500/20" glowColor="shadow-emerald-500/10">
                <div className="space-y-4">
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
              <SectionCard title="Job 2" icon={<Briefcase className="w-4 h-4 text-violet-400"/>} borderColor="border-violet-500/20" glowColor="shadow-violet-500/10">
                <div className="space-y-4">
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
            </div>

            {/* NEW Section: Taxes */}
            <SectionCard title="Taxes & Deductions" icon={<FileText className="w-4 h-4 text-blue-400"/>} borderColor="border-blue-500/20" glowColor="shadow-blue-500/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <SelectField 
                    label="Work State"
                    subLabel={`Tax: ${state.stateTaxRate}%`}
                    icon={<MapPin className="w-4 h-4"/>}
                    value={state.selectedState}
                    onChange={handleStateChange}
                    options={US_STATES.map(s => ({ label: s.name, value: s.name }))}
                  />
                  <div className="text-[10px] text-slate-500 leading-relaxed">
                    * Federal tax is calculated automatically based on 2024 NRA brackets.
                  </div>
                </div>
                <div className="space-y-2 bg-slate-950/30 p-4 rounded-2xl border border-white/5">
                  <Toggle 
                    label="J-1 FICA Exempt" 
                    subLabel="No SS/Medicare (7.65%)"
                    checked={state.isFicaExempt} 
                    onChange={(val) => updateState('isFicaExempt', val)} 
                  />
                  <div className="h-px bg-white/5 my-1" />
                  <Toggle 
                    label="Calculate Overtime" 
                    subLabel="1.5x Wage > 40hrs"
                    checked={state.includeOvertime} 
                    onChange={(val) => updateState('includeOvertime', val)} 
                  />
                </div>
              </div>
            </SectionCard>

            {/* Section D: Living Expenses */}
            <SectionCard title="Living Expenses" icon={<Home className="w-4 h-4 text-rose-400"/>} borderColor="border-rose-500/20" glowColor="shadow-rose-500/10">
              <div className="grid grid-cols-2 gap-5">
                 <InputField
                  label="Weekly Rent"
                  type="number"
                  icon={<DollarSign className="w-4 h-4"/>}
                  value={state.housingCost}
                  onChange={(e) => updateState('housingCost', e.target.value)}
                />
                <InputField
                  label="Weekly Lifestyle"
                  subLabel="Food, Uber, Fun"
                  type="number"
                  icon={<Utensils className="w-4 h-4"/>}
                  value={state.weeklyLivingCost}
                  onChange={(e) => updateState('weeklyLivingCost', e.target.value)}
                />
              </div>
            </SectionCard>

            {/* Section E: End of Season Splurges */}
            <SectionCard title="End of Season" icon={<ShoppingBag className="w-4 h-4 text-amber-400"/>} borderColor="border-amber-500/20" glowColor="shadow-amber-500/10">
               <div className="grid grid-cols-2 gap-5">
                <InputField
                  label="Travel Budget"
                  subLabel="Trip Cost"
                  type="number"
                  placeholder="0"
                  icon={<Plane className="w-4 h-4"/>}
                  value={state.travelCost}
                  onChange={(e) => updateState('travelCost', e.target.value)}
                />
                <InputField
                  label="Tech & Shopping"
                  subLabel="iPhone, etc."
                  type="number"
                  placeholder="0"
                  icon={<DollarSign className="w-4 h-4"/>}
                  value={state.purchaseCost}
                  onChange={(e) => updateState('purchaseCost', e.target.value)}
                />
              </div>
            </SectionCard>
          </div>

          {/* RIGHT COLUMN: Results Dashboard (Sticky on Desktop) */}
          <div className="lg:col-span-5 relative">
             <div className="lg:sticky lg:top-8 space-y-6">
                
                {/* The Logic Component (StickyFooter) is now a Card */}
                <StickyFooter 
                  results={results} 
                  upfrontCost={parseFloat(state.upfrontCost) || 0}
                  travelCost={(parseFloat(state.travelCost) || 0) + (parseFloat(state.purchaseCost) || 0)}
                />

                <div className="text-center">
                  <p className="text-[10px] text-slate-600 font-medium uppercase tracking-widest opacity-50">
                    2024-2025 Calculation Engine
                  </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
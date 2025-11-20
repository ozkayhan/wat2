export interface JobData {
  wage: string;
  hours: string;
}

export interface AppState {
  startDate: string;
  endDate: string;
  upfrontCost: string;
  housingCost: string;
  weeklyLivingCost: string;
  travelCost: string;
  purchaseCost: string;
  stateTaxRate: string;
  isFicaExempt: boolean;
  includeOvertime: boolean;
  job1: JobData;
  job2: JobData;
}

export interface CalculatedResults {
  isValid: boolean;
  totalWeeks: number;
  weeklyProgramCost: number;
  
  // Income & Tax
  grossWeeklyIncome: number;
  netWeeklyIncome: number;
  weeklyTax: number;
  totalSeasonGross: number;
  totalSeasonTax: number;
  
  // Expenses
  totalWeeklyExpense: number;
  
  // Profit
  weeklyNetProfit: number; // (Net Income - Expenses)
  monthlyNetProfit: number;
  totalSeasonProfit: number;
  totalAfterSplurge: number;
}
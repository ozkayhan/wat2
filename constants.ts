export interface StateTaxData {
  name: string;
  rate: number;
}

// For ranges (e.g., 2.00 - 4.00), we are using a safe average or the specific value provided.
export const US_STATES: StateTaxData[] = [
  { name: 'Alabama', rate: 5.00 },
  { name: 'Alaska', rate: 0.00 },
  { name: 'Arizona', rate: 2.50 },
  { name: 'Arkansas', rate: 4.90 },
  { name: 'California', rate: 3.00 }, // Avg of 2.00 - 4.00
  { name: 'Colorado', rate: 4.40 },
  { name: 'Connecticut', rate: 5.00 },
  { name: 'Delaware', rate: 4.80 },
  { name: 'District of Columbia', rate: 6.00 },
  { name: 'Florida', rate: 0.00 },
  { name: 'Georgia', rate: 5.49 },
  { name: 'Hawaii', rate: 7.20 },
  { name: 'Idaho', rate: 5.80 },
  { name: 'Illinois', rate: 4.95 },
  { name: 'Indiana', rate: 3.05 },
  { name: 'Iowa', rate: 4.40 },
  { name: 'Kansas', rate: 5.25 },
  { name: 'Kentucky', rate: 4.00 },
  { name: 'Louisiana', rate: 4.25 },
  { name: 'Maine', rate: 5.80 },
  { name: 'Maryland', rate: 4.75 },
  { name: 'Massachusetts', rate: 5.00 },
  { name: 'Michigan', rate: 4.25 },
  { name: 'Minnesota', rate: 5.35 },
  { name: 'Mississippi', rate: 4.70 },
  { name: 'Missouri', rate: 4.95 },
  { name: 'Montana', rate: 4.70 },
  { name: 'Nebraska', rate: 5.01 },
  { name: 'Nevada', rate: 0.00 },
  { name: 'New Hampshire', rate: 0.00 },
  { name: 'New Jersey', rate: 1.75 },
  { name: 'New Mexico', rate: 4.90 },
  { name: 'New York', rate: 4.25 }, // Avg of 4.00 - 4.50
  { name: 'North Carolina', rate: 4.50 },
  { name: 'North Dakota', rate: 1.50 }, // Avg of 1.10 - 1.95
  { name: 'Ohio', rate: 2.75 },
  { name: 'Oklahoma', rate: 4.75 },
  { name: 'Oregon', rate: 8.75 },
  { name: 'Pennsylvania', rate: 3.07 },
  { name: 'Rhode Island', rate: 3.75 },
  { name: 'South Carolina', rate: 6.40 },
  { name: 'South Dakota', rate: 0.00 },
  { name: 'Tennessee', rate: 0.00 },
  { name: 'Texas', rate: 0.00 },
  { name: 'Utah', rate: 4.55 },
  { name: 'Vermont', rate: 3.35 },
  { name: 'Virginia', rate: 5.75 },
  { name: 'Washington', rate: 0.00 },
  { name: 'West Virginia', rate: 4.00 },
  { name: 'Wisconsin', rate: 4.65 },
  { name: 'Wyoming', rate: 0.00 }
];
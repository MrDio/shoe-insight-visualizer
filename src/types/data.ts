export type ToolData = {
  id: string;
  tool: string;
  category: 'IWC' | 'EWC' | 'IWR' | 'EWR';
  prices: {
    [key: string]: { // Jahr
      [key: string]: number; // Monat: Preis
    };
  };
};

export type Category = 'IWC' | 'EWC' | 'IWR' | 'EWR';
export type Year = '2023' | '2024' | '2025';
export type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
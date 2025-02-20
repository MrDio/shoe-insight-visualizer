
export type CloudProvider = 'azure' | 'onPremisesCloud';
export type CloudType = 'paas' | 'caas';
export type DyPValue = 'Yes' | 'No';

export type ApplicationData = {
  type: 'Application';
  name: string;
  appId: string;
  cloudProvider: CloudProvider;
  cloudType: CloudType[];
  dyp: DyPValue;
  ecosystem: string;
};

export type ToolData = {
  id: string;
  tool: string;
  category: 'IWC' | 'EWC' | 'IWR' | 'EWR';
  prices: {
    [key: string]: {
      [key: string]: number;
    };
  };
};

export type Category = 'IWC' | 'EWC' | 'IWR' | 'EWR';
export type Year = '2023' | '2024' | '2025';
export type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';


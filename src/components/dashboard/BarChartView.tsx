import { useState, useMemo } from 'react';
import { ToolData } from '@/types/data';
import { YearSelector } from './YearSelector';
import { SingleBarChart } from './SingleBarChart';
import { processChartData } from '@/utils/chartDataProcessing';

interface BarChartViewProps {
  data: ToolData[];
}

const sampleData: ToolData[] = [
  {
    id: "tool-1",
    tool: "GitHub Enterprise",
    category: "IWC",
    prices: {
      "2023": {
        "01": 150, "02": 155, "03": 160, "04": 158, "05": 165, "06": 170,
        "07": 175, "08": 180, "09": 185, "10": 190, "11": 195, "12": 200
      },
      "2024": {
        "01": 205, "02": 210, "03": 215, "04": 220, "05": 225, "06": 230
      }
    }
  },
  {
    id: "tool-2",
    tool: "Jira Software",
    category: "EWC",
    prices: {
      "2023": {
        "01": 80, "02": 82, "03": 85, "04": 87, "05": 90, "06": 92,
        "07": 95, "08": 97, "09": 100, "10": 102, "11": 105, "12": 108
      },
      "2024": {
        "01": 110, "02": 112, "03": 115, "04": 117, "05": 120, "06": 122
      }
    }
  },
  {
    id: "tool-3",
    tool: "GitHub Enterprise Revenue",
    category: "IWR",
    prices: {
      "2023": {
        "01": 180, "02": 185, "03": 190, "04": 188, "05": 195, "06": 200,
        "07": 205, "08": 210, "09": 215, "10": 220, "11": 225, "12": 230
      },
      "2024": {
        "01": 235, "02": 240, "03": 245, "04": 250, "05": 255, "06": 260
      }
    }
  },
  {
    id: "tool-4",
    tool: "Jira Software Revenue",
    category: "EWR",
    prices: {
      "2023": {
        "01": 100, "02": 102, "03": 105, "04": 107, "05": 110, "06": 112,
        "07": 115, "08": 117, "09": 120, "10": 122, "11": 125, "12": 128
      },
      "2024": {
        "01": 130, "02": 132, "03": 135, "04": 137, "05": 140, "06": 142
      }
    }
  }
];

export const BarChartView = ({ data }: BarChartViewProps) => {
  const [selectedYear, setSelectedYear] = useState('2023');

  const combinedData = useMemo(() => {
    return [...sampleData, ...data];
  }, [data]);

  const processedData = useMemo(() => {
    return processChartData(combinedData, selectedYear);
  }, [combinedData, selectedYear]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Ausgaben und Einnahmen nach Monat</h3>
      
      <YearSelector 
        selectedYear={selectedYear} 
        onYearChange={setSelectedYear} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {processedData.map(({ toolName, data }) => (
          <SingleBarChart 
            key={toolName} 
            data={data} 
            toolName={toolName} 
          />
        ))}
      </div>
    </div>
  );
};

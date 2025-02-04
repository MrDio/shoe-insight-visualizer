
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolData } from '@/types/data';
import { useState, useMemo } from 'react';

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
        "01": 150,
        "02": 155,
        "03": 160,
        "04": 158,
        "05": 165,
        "06": 170,
        "07": 175,
        "08": 180,
        "09": 185,
        "10": 190,
        "11": 195,
        "12": 200
      },
      "2024": {
        "01": 205,
        "02": 210,
        "03": 215,
        "04": 220,
        "05": 225,
        "06": 230
      }
    }
  },
  {
    id: "tool-2",
    tool: "Jira Software",
    category: "EWC",
    prices: {
      "2023": {
        "01": 80,
        "02": 82,
        "03": 85,
        "04": 87,
        "05": 90,
        "06": 92,
        "07": 95,
        "08": 97,
        "09": 100,
        "10": 102,
        "11": 105,
        "12": 108
      },
      "2024": {
        "01": 110,
        "02": 112,
        "03": 115,
        "04": 117,
        "05": 120,
        "06": 122
      }
    }
  },
  {
    id: "tool-3",
    tool: "GitHub Enterprise Revenue",
    category: "IWR",
    prices: {
      "2023": {
        "01": 180,
        "02": 185,
        "03": 190,
        "04": 188,
        "05": 195,
        "06": 200,
        "07": 205,
        "08": 210,
        "09": 215,
        "10": 220,
        "11": 225,
        "12": 230
      },
      "2024": {
        "01": 235,
        "02": 240,
        "03": 245,
        "04": 250,
        "05": 255,
        "06": 260
      }
    }
  },
  {
    id: "tool-4",
    tool: "Jira Software Revenue",
    category: "EWR",
    prices: {
      "2023": {
        "01": 100,
        "02": 102,
        "03": 105,
        "04": 107,
        "05": 110,
        "06": 112,
        "07": 115,
        "08": 117,
        "09": 120,
        "10": 122,
        "11": 125,
        "12": 128
      },
      "2024": {
        "01": 130,
        "02": 132,
        "03": 135,
        "04": 137,
        "05": 140,
        "06": 142
      }
    }
  }
];

export const BarChartView = ({ data }: BarChartViewProps) => {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedTool, setSelectedTool] = useState('all');

  const combinedData = useMemo(() => {
    return [...sampleData, ...data];
  }, [data]);

  const tools = useMemo(() => {
    return Array.from(new Set(combinedData.map(item => item.tool)));
  }, [combinedData]);

  const chartData = useMemo(() => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0');
      
      let expenses = 0;
      let revenue = 0;

      if (selectedTool === 'all') {
        // Wenn "Alle Tools" ausgewählt ist, zeige die Summe aller Tools
        expenses = combinedData
          .filter(item => item.category.endsWith('C'))
          .reduce((sum, item) => sum + (item.prices[selectedYear]?.[month] || 0), 0);

        revenue = combinedData
          .filter(item => item.category.endsWith('R'))
          .reduce((sum, item) => sum + (item.prices[selectedYear]?.[month] || 0), 0);
      } else {
        // Wenn ein Tool ausgewählt ist, zeige nur die Daten dieses Tools
        const toolData = combinedData.find(item => item.tool === selectedTool);
        if (toolData) {
          if (toolData.category.endsWith('C')) {
            expenses = toolData.prices[selectedYear]?.[month] || 0;
          } else if (toolData.category.endsWith('R')) {
            revenue = toolData.prices[selectedYear]?.[month] || 0;
          }
        }
      }

      return {
        month: new Date(2023, i).toLocaleString('de-DE', { month: 'short' }),
        expenses,
        revenue
      };
    });

    return monthlyData;
  }, [combinedData, selectedYear, selectedTool]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Ausgaben und Einnahmen nach Monat</h3>
      
      <div className="flex gap-4">
        <div className="w-[200px]">
          <Select value={selectedTool} onValueChange={setSelectedTool}>
            <SelectTrigger>
              <SelectValue placeholder="Tool auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Tools</SelectItem>
              {tools.map((tool) => (
                <SelectItem key={tool} value={tool}>
                  {tool}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Jahr auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" name="Ausgaben" fill="#ef4444" />
            <Bar dataKey="revenue" name="Einnahmen" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};



import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolData } from '@/types/data';
import { useState, useMemo } from 'react';

interface BarChartViewProps {
  data: ToolData[];
}

// Beispieldaten für die Visualisierung
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
  }
];

export const BarChartView = ({ data }: BarChartViewProps) => {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedTool, setSelectedTool] = useState('');

  // Kombiniere die übergebenen Daten mit den Beispieldaten
  const combinedData = useMemo(() => {
    return [...sampleData, ...data];
  }, [data]);

  const tools = useMemo(() => {
    return Array.from(new Set(combinedData.map(item => item.tool)));
  }, [combinedData]);

  const chartData = useMemo(() => {
    if (!selectedTool) return [];

    const toolData = combinedData.find(item => item.tool === selectedTool);
    if (!toolData || !toolData.prices[selectedYear]) return [];

    return Object.entries(toolData.prices[selectedYear]).map(([month, price]) => ({
      month: new Date(2023, parseInt(month) - 1).toLocaleString('de-DE', { month: 'short' }),
      price: price
    }));
  }, [combinedData, selectedYear, selectedTool]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Preisentwicklung nach Monat</h3>
      
      <div className="flex gap-4">
        <div className="w-[200px]">
          <Select value={selectedTool} onValueChange={setSelectedTool}>
            <SelectTrigger>
              <SelectValue placeholder="Tool auswählen" />
            </SelectTrigger>
            <SelectContent>
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
            <Bar dataKey="price" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

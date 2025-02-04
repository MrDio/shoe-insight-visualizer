
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolData } from '@/types/data';
import { useState, useMemo } from 'react';

interface BarChartViewProps {
  data: ToolData[];
}

export const BarChartView = ({ data }: BarChartViewProps) => {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedTool, setSelectedTool] = useState('');

  const tools = useMemo(() => {
    return Array.from(new Set(data.map(item => item.tool)));
  }, [data]);

  const chartData = useMemo(() => {
    if (!selectedTool) return [];

    const toolData = data.find(item => item.tool === selectedTool);
    if (!toolData || !toolData.prices[selectedYear]) return [];

    return Object.entries(toolData.prices[selectedYear]).map(([month, price]) => ({
      month: new Date(2023, parseInt(month) - 1).toLocaleString('de-DE', { month: 'short' }),
      price: price
    }));
  }, [data, selectedYear, selectedTool]);

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

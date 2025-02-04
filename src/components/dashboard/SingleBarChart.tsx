
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  month: string;
  expenses: number;
  revenue: number;
  toolName: string;
}

interface SingleBarChartProps {
  data: ChartData[];
  toolName: string;
}

export const SingleBarChart = ({ data, toolName }: SingleBarChartProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="text-md font-medium mb-4">{toolName}</h4>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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


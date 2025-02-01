import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartViewProps {
  data: Array<{
    category: string;
    avgPrice: number;
  }>;
}

export const BarChartView = ({ data }: BarChartViewProps) => (
  <>
    <h3 className="text-lg font-semibold mb-4">Durchschnittspreis nach Kategorie</h3>
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgPrice" fill="#1e40af" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </>
);
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ShoeData = {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  availability: number;
  country_code: string;
  currency: string;
  date: string;
};

interface DashboardProps {
  data: ShoeData[];
}

export const Dashboard = ({ data }: DashboardProps) => {
  // Berechne Durchschnittspreise pro Kategorie
  const averagePricesByCategory = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { total: 0, count: 0 };
    }
    acc[item.category].total += item.price;
    acc[item.category].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const chartData = Object.entries(averagePricesByCategory).map(([category, values]) => ({
    category,
    avgPrice: Math.round(values.total / values.count),
  }));

  // Berechne Gesamtstatistiken
  const totalProducts = data.length;
  const availableProducts = data.filter(item => item.availability === 1).length;
  const averagePrice = data.length > 0
    ? Math.round(data.reduce((sum, item) => sum + item.price, 0) / data.length)
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Produkte Gesamt</h3>
          <p className="text-3xl font-bold text-primary">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Verfügbare Produkte</h3>
          <p className="text-3xl font-bold text-green-600">{availableProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Durchschnittspreis</h3>
          <p className="text-3xl font-bold text-blue-600">€{averagePrice}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Durchschnittspreis nach Kategorie</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgPrice" fill="#1e40af" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
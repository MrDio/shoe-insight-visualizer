import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ResponsiveSankey } from '@nivo/sankey';
import { ResponsiveChord } from '@nivo/chord';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Mock data for initial display
const mockData: ShoeData[] = [
  {
    id: "mock-1",
    name: "Nike Air Max",
    category: "Sneaker",
    size: "42",
    price: 129.99,
    availability: 1,
    country_code: "DE",
    currency: "EUR",
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: "mock-2",
    name: "Adidas Superstar",
    category: "Lifestyle",
    size: "41",
    price: 99.99,
    availability: 1,
    country_code: "DE",
    currency: "EUR",
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: "mock-3",
    name: "Puma RS-X",
    category: "Sport",
    size: "43",
    price: 89.99,
    availability: 1,
    country_code: "DE",
    currency: "EUR",
    date: new Date().toISOString().split('T')[0],
  }
];

export const Dashboard = ({ data }: DashboardProps) => {
  // Use mock data if no real data is present
  const displayData = data.length > 0 ? data : mockData;

  // Calculate averages for the current display data
  const averagePricesByCategory = displayData.reduce((acc, item) => {
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

  // Calculate total statistics
  const totalProducts = displayData.length;
  const availableProducts = displayData.filter(item => item.availability === 1).length;
  const averagePrice = Math.round(displayData.reduce((sum, item) => sum + item.price, 0) / displayData.length);

  // Prepare Sankey data
  const categories = [...new Set(displayData.map(d => d.category))];
  const sizes = [...new Set(displayData.map(d => d.size))];
  
  const sankeyData = {
    nodes: [
      ...categories.map(id => ({ id })),
      ...sizes.map(id => ({ id }))
    ],
    links: displayData.reduce((acc, item) => {
      const existingLink = acc.find(l => 
        l.source === item.category && l.target === item.size
      );
      
      if (existingLink) {
        existingLink.value += 1;
      } else {
        acc.push({
          source: item.category,
          target: item.size,
          value: 1
        });
      }
      return acc;
    }, [] as { source: string; target: string; value: number }[])
  };

  // Prepare Chord data
  const chordData = categories.map(cat1 => 
    categories.map(cat2 => {
      if (cat1 === cat2) return 0;
      const price1 = displayData
        .filter(d => d.category === cat1)
        .reduce((sum, d) => sum + d.price, 0);
      const price2 = displayData
        .filter(d => d.category === cat2)
        .reduce((sum, d) => sum + d.price, 0);
      return Math.round((price1 + price2) / 2);
    })
  );

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
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Bar-Chart</TabsTrigger>
            <TabsTrigger value="sankey">Sankey</TabsTrigger>
            <TabsTrigger value="chord">Chord</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="mt-6">
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
          </TabsContent>

          <TabsContent value="sankey" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Kategorie-Größen Beziehungen</h3>
            <div className="h-[500px]">
              <ResponsiveSankey
                data={sankeyData}
                margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
                align="justify"
                colors={{ scheme: 'category10' }}
                nodeOpacity={1}
                nodeThickness={18}
                nodeInnerPadding={3}
                nodeSpacing={24}
                nodeBorderWidth={0}
                linkOpacity={0.5}
                enableLinkGradient={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="chord" className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Preisbeziehungen zwischen Kategorien</h3>
            <div className="h-[500px]">
              <ResponsiveChord
                data={chordData}
                keys={categories}
                margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
                padAngle={0.02}
                innerRadiusRatio={0.96}
                innerRadiusOffset={0.02}
                arcOpacity={1}
                arcBorderWidth={1}
                arcBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                ribbonOpacity={0.5}
                ribbonBorderWidth={1}
                ribbonBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                enableLabel={true}
                label="id"
                labelOffset={12}
                labelRotation={-90}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
                colors={{ scheme: 'nivo' }}
                motionConfig="gentle"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
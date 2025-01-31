import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ResponsiveSankey } from '@nivo/sankey';
import { ResponsiveChord } from '@nivo/chord';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolData } from '../types/data';

interface DashboardProps {
  data: ToolData[];
}

// Mock data for initial display
const mockData: ToolData[] = [
  {
    id: "mock-1",
    tool: "Tool A",
    category: "IWC",
    prices: {
      '2023': {
        '01': 100,
        '02': 110,
        '03': 120
      },
      '2024': {
        '01': 130,
        '02': 140,
        '03': 150
      }
    }
  },
  {
    id: "mock-2",
    tool: "Tool B",
    category: "EWC",
    prices: {
      '2023': {
        '01': 90,
        '02': 95,
        '03': 100
      },
      '2024': {
        '01': 105,
        '02': 110,
        '03': 115
      }
    }
  },
  {
    id: "mock-3",
    tool: "Tool C",
    category: "IWR",
    prices: {
      '2023': {
        '01': 80,
        '02': 85,
        '03': 90
      },
      '2024': {
        '01': 95,
        '02': 100,
        '03': 105
      }
    }
  }
];

export const Dashboard = ({ data }: DashboardProps) => {
  // Use mock data if no real data is present
  const displayData = data.length > 0 ? data : mockData;

  // Calculate average prices by category for the current year
  const currentYear = new Date().getFullYear().toString();
  const averagePricesByCategory = displayData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { total: 0, count: 0 };
    }
    
    const yearPrices = item.prices[currentYear];
    if (yearPrices) {
      const yearAvg = Object.values(yearPrices).reduce((sum, price) => sum + price, 0) / Object.values(yearPrices).length;
      acc[item.category].total += yearAvg;
      acc[item.category].count += 1;
    }
    
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const chartData = Object.entries(averagePricesByCategory).map(([category, values]) => ({
    category,
    avgPrice: Math.round(values.total / values.count),
  }));

  // Calculate total statistics
  const totalTools = displayData.length;
  const totalCategories = new Set(displayData.map(item => item.category)).size;
  const averagePrice = Math.round(
    displayData.reduce((sum, item) => {
      const yearPrices = item.prices[currentYear];
      if (yearPrices) {
        return sum + (Object.values(yearPrices).reduce((s, p) => s + p, 0) / Object.values(yearPrices).length);
      }
      return sum;
    }, 0) / displayData.length
  );

  // Prepare Sankey data
  const categories = [...new Set(displayData.map(d => d.category))];
  const years = ['2023', '2024', '2025'];
  
  const sankeyData = {
    nodes: [
      ...categories.map(id => ({ id })),
      ...years.map(id => ({ id }))
    ],
    links: displayData.reduce((acc, item) => {
      years.forEach(year => {
        if (item.prices[year]) {
          const yearAvg = Object.values(item.prices[year]).reduce((sum, price) => sum + price, 0) / 
                         Object.values(item.prices[year]).length;
          
          const existingLink = acc.find(l => 
            l.source === item.category && l.target === year
          );
          
          if (existingLink) {
            existingLink.value += yearAvg;
          } else {
            acc.push({
              source: item.category,
              target: year,
              value: yearAvg
            });
          }
        }
      });
      return acc;
    }, [] as { source: string; target: string; value: number }[])
  };

  // Prepare Chord data
  const chordData = categories.map(cat1 => 
    categories.map(cat2 => {
      if (cat1 === cat2) return 0;
      const price1 = displayData
        .filter(d => d.category === cat1)
        .reduce((sum, d) => {
          const yearPrices = d.prices[currentYear];
          if (yearPrices) {
            return sum + Object.values(yearPrices).reduce((s, p) => s + p, 0);
          }
          return sum;
        }, 0);
      
      const price2 = displayData
        .filter(d => d.category === cat2)
        .reduce((sum, d) => {
          const yearPrices = d.prices[currentYear];
          if (yearPrices) {
            return sum + Object.values(yearPrices).reduce((s, p) => s + p, 0);
          }
          return sum;
        }, 0);
      
      return Math.round((price1 + price2) / 2);
    })
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Tools Gesamt</h3>
          <p className="text-3xl font-bold text-primary">{totalTools}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Kategorien</h3>
          <p className="text-3xl font-bold text-green-600">{totalCategories}</p>
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
            <h3 className="text-lg font-semibold mb-4">Kategorie-Jahr Beziehungen</h3>
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
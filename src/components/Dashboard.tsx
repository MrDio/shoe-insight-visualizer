import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolData } from '../types/data';
import { StatCard } from './dashboard/StatCard';
import { BarChartView } from './dashboard/BarChartView';
import { SankeyView } from './dashboard/SankeyView';
import { ChordView } from './dashboard/ChordView';

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
  const displayData = data.length > 0 ? data : mockData;
  const currentYear = new Date().getFullYear().toString();

  // Calculate average prices by category
  const averagePricesByCategory = displayData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { total: 0, count: 0 };
    }
    
    const yearPrices = item.prices[currentYear];
    if (yearPrices) {
      const yearAvg = Object.values(yearPrices).reduce((sum, price) => sum + price, 0) / 
                     Object.values(yearPrices).length;
      acc[item.category].total += yearAvg;
      acc[item.category].count += 1;
    }
    
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const chartData = Object.entries(averagePricesByCategory).map(([category, values]) => ({
    category,
    avgPrice: Math.round(values.total / values.count),
  }));

  // Calculate statistics
  const totalTools = displayData.length;
  const totalCategories = new Set(displayData.map(item => item.category)).size;
  const averagePrice = Math.round(
    displayData.reduce((sum, item) => {
      const yearPrices = item.prices[currentYear];
      if (yearPrices) {
        return sum + (Object.values(yearPrices).reduce((s, p) => s + p, 0) / 
                     Object.values(yearPrices).length);
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
        <StatCard title="Tools Gesamt" value={totalTools} />
        <StatCard title="Kategorien" value={totalCategories} className="text-green-600" />
        <StatCard title="Durchschnittspreis" value={`€${averagePrice}`} className="text-blue-600" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bar">Bar-Chart</TabsTrigger>
            <TabsTrigger value="sankey">Sankey</TabsTrigger>
            <TabsTrigger value="chord">Chord</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="mt-6">
            <BarChartView data={chartData} />
          </TabsContent>

          <TabsContent value="sankey" className="mt-6">
            <SankeyView data={sankeyData} />
          </TabsContent>

          <TabsContent value="chord" className="mt-6">
            <ChordView data={chordData} keys={categories} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

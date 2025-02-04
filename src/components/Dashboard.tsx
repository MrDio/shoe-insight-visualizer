
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolData } from '../types/data';
import { StatCard } from './dashboard/StatCard';
import { BarChartView } from './dashboard/BarChartView';
import { SankeyView } from './dashboard/SankeyView';
import { ChordView } from './dashboard/ChordView';

interface DashboardProps {
  data: ToolData[];
}

export const Dashboard = ({ data }: DashboardProps) => {
  const currentYear = new Date().getFullYear().toString();

  // Calculate statistics
  const totalTools = data.length;
  const totalCategories = new Set(data.map(item => item.category)).size;
  const averagePrice = Math.round(
    data.reduce((sum, item) => {
      const yearPrices = item.prices[currentYear];
      if (yearPrices) {
        return sum + (Object.values(yearPrices).reduce((s, p) => s + p, 0) / 
                     Object.values(yearPrices).length);
      }
      return sum;
    }, 0) / (data.length || 1)
  );

  // Prepare Sankey data
  const categories = [...new Set(data.map(d => d.category))];
  const years = ['2023', '2024', '2025'];
  
  const sankeyData = {
    nodes: [
      ...categories.map(id => ({ id })),
      ...years.map(id => ({ id }))
    ],
    links: data.reduce((acc, item) => {
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
      const price1 = data
        .filter(d => d.category === cat1)
        .reduce((sum, d) => {
          const yearPrices = d.prices[currentYear];
          if (yearPrices) {
            return sum + Object.values(yearPrices).reduce((s, p) => s + p, 0);
          }
          return sum;
        }, 0);
      
      const price2 = data
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
            <BarChartView data={data} />
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

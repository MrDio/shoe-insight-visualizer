
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationData } from '../types/data';
import { StatCard } from './dashboard/StatCard';
import { BarChartView } from './dashboard/BarChartView';
import { SankeyView } from './dashboard/SankeyView';
import { ChordView } from './dashboard/ChordView';

interface DashboardProps {
  data: ApplicationData[];
}

export const Dashboard = ({ data }: DashboardProps) => {
  // Calculate statistics
  const totalApps = data.length;
  const uniqueCloudProviders = new Set(data.map(item => item.cloudProvider)).size;
  const uniqueCloudTypes = new Set(data.flatMap(item => item.cloudType)).size;

  // Prepare Sankey data
  const cloudProviders = [...new Set(data.map(d => d.cloudProvider))];
  const cloudTypes = [...new Set(data.flatMap(d => d.cloudType))];
  
  const sankeyData = {
    nodes: [
      ...cloudProviders.map(id => ({ id })),
      ...cloudTypes.map(id => ({ id }))
    ],
    links: data.reduce((acc, item) => {
      item.cloudType.forEach(type => {
        const existingLink = acc.find(l => 
          l.source === item.cloudProvider && l.target === type
        );
        
        if (existingLink) {
          existingLink.value += 1;
        } else {
          acc.push({
            source: item.cloudProvider,
            target: type,
            value: 1
          });
        }
      });
      return acc;
    }, [] as { source: string; target: string; value: number }[])
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Anwendungen Gesamt" value={totalApps} />
        <StatCard title="Cloud Provider" value={uniqueCloudProviders} className="text-green-600" />
        <StatCard title="Cloud Typen" value={uniqueCloudTypes} className="text-blue-600" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Tabs defaultValue="sankey" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="sankey">Sankey</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sankey" className="mt-6">
            <SankeyView data={sankeyData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

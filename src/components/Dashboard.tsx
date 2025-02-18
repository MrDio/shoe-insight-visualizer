
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

  // Prepare Sankey data for DyP distribution
  const dypApps = data.filter(d => d.dyp === 'Yes').map(d => d.name);
  const nonDypApps = data.filter(d => d.dyp === 'No').map(d => d.name);

  const sankeyData = {
    nodes: [
      { id: "Applications" },
      { id: "DyP" },
      { id: "Non-DyP" },
      ...dypApps.map(name => ({ id: name })),
      ...nonDypApps.map(name => ({ id: name }))
    ],
    links: [
      // Link from Applications to DyP and Non-DyP
      ...dypApps.map(name => ({
        source: "Applications",
        target: "DyP",
        value: 1
      })),
      ...nonDypApps.map(name => ({
        source: "Applications",
        target: "Non-DyP",
        value: 1
      })),
      // Links from DyP/Non-DyP to individual applications
      ...dypApps.map(name => ({
        source: "DyP",
        target: name,
        value: 1
      })),
      ...nonDypApps.map(name => ({
        source: "Non-DyP",
        target: name,
        value: 1
      }))
    ]
  };

  // Only render if we have valid data
  const hasValidSankeyData = sankeyData.nodes.length > 0 && sankeyData.links.length > 0;

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
            <TabsTrigger value="sankey">DyP Verteilung</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sankey" className="mt-6">
            {hasValidSankeyData ? (
              <SankeyView data={sankeyData} />
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <p className="text-gray-500">Keine Daten für das Sankey-Diagramm verfügbar</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};


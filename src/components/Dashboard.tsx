
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

  const sankeyDypData = {
    nodes: [
      { id: "Applications" },
      { id: "DyP" },
      { id: "Non-DyP" },
      ...dypApps.map(name => ({ id: name })),
      ...nonDypApps.map(name => ({ id: name }))
    ],
    links: [
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

  // Prepare Sankey data for Cloud Type distribution
  const paasApps = data.filter(d => d.cloudType.includes('paas')).map(d => d.name);
  const caasApps = data.filter(d => d.cloudType.includes('caas')).map(d => d.name);

  const sankeyCloudTypeData = {
    nodes: [
      { id: "Applications" },
      { id: "PaaS" },
      { id: "CaaS" },
      ...paasApps.map(name => ({ id: name })),
      ...caasApps.map(name => ({ id: name }))
    ],
    links: [
      ...paasApps.map(name => ({
        source: "Applications",
        target: "PaaS",
        value: 1
      })),
      ...caasApps.map(name => ({
        source: "Applications",
        target: "CaaS",
        value: 1
      })),
      ...paasApps.map(name => ({
        source: "PaaS",
        target: name,
        value: 1
      })),
      ...caasApps.map(name => ({
        source: "CaaS",
        target: name,
        value: 1
      }))
    ]
  };

  // Only render if we have valid data
  const hasValidDypData = sankeyDypData.nodes.length > 0 && sankeyDypData.links.length > 0;
  const hasValidCloudTypeData = sankeyCloudTypeData.nodes.length > 0 && sankeyCloudTypeData.links.length > 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Anwendungen Gesamt" value={totalApps} />
        <StatCard title="Cloud Provider" value={uniqueCloudProviders} className="text-green-600" />
        <StatCard title="Cloud Typen" value={uniqueCloudTypes} className="text-blue-600" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Tabs defaultValue="dyp" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dyp">DyP Verteilung</TabsTrigger>
            <TabsTrigger value="cloudtype">Cloud Type Verteilung</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dyp" className="mt-6">
            {hasValidDypData ? (
              <SankeyView data={sankeyDypData} />
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <p className="text-gray-500">Keine Daten für das DyP-Diagramm verfügbar</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cloudtype" className="mt-6">
            {hasValidCloudTypeData ? (
              <SankeyView data={sankeyCloudTypeData} />
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <p className="text-gray-500">Keine Daten für das Cloud-Type-Diagramm verfügbar</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

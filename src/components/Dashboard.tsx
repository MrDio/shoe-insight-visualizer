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
  const dypApps = data.filter(item => item.dyp === 'Yes').length;
  const nonDypApps = data.filter(item => item.dyp === 'No').length;

  // Prepare Sankey data with 4 levels
  const sankeyData = {
    nodes: [
      { id: "Applications" },
      { id: "DyP" },
      { id: "Non-DyP" },
      { id: "PaaS" },
      { id: "CaaS" },
      ...data.map(app => ({ id: app.name }))
    ],
    links: [
      // Level 1 to 2: Applications to DyP/Non-DyP
      ...data.filter(d => d.dyp === 'Yes').map(d => ({
        source: "Applications",
        target: "DyP",
        value: 1
      })),
      ...data.filter(d => d.dyp === 'No').map(d => ({
        source: "Applications",
        target: "Non-DyP",
        value: 1
      })),

      // Level 2 to 3: DyP/Non-DyP to PaaS/CaaS
      ...data.filter(d => d.dyp === 'Yes' && d.cloudType.includes('paas')).map(d => ({
        source: "DyP",
        target: "PaaS",
        value: 1
      })),
      ...data.filter(d => d.dyp === 'Yes' && d.cloudType.includes('caas')).map(d => ({
        source: "DyP",
        target: "CaaS",
        value: 1
      })),
      ...data.filter(d => d.dyp === 'No' && d.cloudType.includes('paas')).map(d => ({
        source: "Non-DyP",
        target: "PaaS",
        value: 1
      })),
      ...data.filter(d => d.dyp === 'No' && d.cloudType.includes('caas')).map(d => ({
        source: "Non-DyP",
        target: "CaaS",
        value: 1
      })),

      // Level 3 to 4: PaaS/CaaS to Application Names
      ...data.filter(d => d.cloudType.includes('paas')).map(d => ({
        source: "PaaS",
        target: d.name,
        value: 1
      })),
      ...data.filter(d => d.cloudType.includes('caas')).map(d => ({
        source: "CaaS",
        target: d.name,
        value: 1
      }))
    ]
  };

  // Only render if we have valid data
  const hasValidSankeyData = sankeyData.nodes.length > 0 && sankeyData.links.length > 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="All Applications" value={totalApps} />
        <StatCard title="DyP" value={dypApps} className="text-green-600" />
        <StatCard title="Non-DyP" value={nonDypApps} className="text-blue-600" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Tabs defaultValue="sankey" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="sankey">Anwendungsverteilung</TabsTrigger>
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

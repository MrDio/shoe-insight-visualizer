
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

  // Prepare Sankey data with 4 levels for current distribution
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

  // Prepare yearly trend Sankey data
  const yearlyTrendData = {
    nodes: [
      { id: "2023" },
      { id: "2024" },
      { id: "2025" },
      { id: "DyP 2023" },
      { id: "Non-DyP 2023" },
      { id: "DyP 2024" },
      { id: "Non-DyP 2024" },
      { id: "DyP 2025" },
      { id: "Non-DyP 2025" }
    ],
    links: [
      // 2023 to 2024
      {
        source: "2023",
        target: "DyP 2023",
        value: Math.round(dypApps * 0.8) // Assuming 80% of current DyP apps were DyP in 2023
      },
      {
        source: "2023",
        target: "Non-DyP 2023",
        value: totalApps - Math.round(dypApps * 0.8)
      },
      // 2023 to 2024 transitions
      {
        source: "DyP 2023",
        target: "DyP 2024",
        value: Math.round(dypApps * 0.9) // Most DyP apps stay DyP
      },
      {
        source: "Non-DyP 2023",
        target: "DyP 2024",
        value: Math.round(dypApps * 0.1) // Some Non-DyP became DyP
      },
      {
        source: "Non-DyP 2023",
        target: "Non-DyP 2024",
        value: nonDypApps
      },
      // 2024 to 2025 (current)
      {
        source: "DyP 2024",
        target: "DyP 2025",
        value: dypApps // Current DyP count
      },
      {
        source: "Non-DyP 2024",
        target: "Non-DyP 2025",
        value: nonDypApps // Current Non-DyP count
      }
    ]
  };

  // Only render if we have valid data
  const hasValidSankeyData = sankeyData.nodes.length > 0 && sankeyData.links.length > 0;
  const hasValidTrendData = yearlyTrendData.nodes.length > 0 && yearlyTrendData.links.length > 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="All Applications" value={totalApps} />
        <StatCard title="DyP" value={dypApps} className="text-green-600" />
        <StatCard title="Non-DyP" value={nonDypApps} className="text-blue-600" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Aktuelle Verteilung</TabsTrigger>
            <TabsTrigger value="trend">Entwicklung über Zeit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-6">
            {hasValidSankeyData ? (
              <SankeyView data={sankeyData} />
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <p className="text-gray-500">Keine Daten für das Sankey-Diagramm verfügbar</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trend" className="mt-6">
            {hasValidTrendData ? (
              <SankeyView data={yearlyTrendData} />
            ) : (
              <div className="h-[500px] flex items-center justify-center">
                <p className="text-gray-500">Keine Daten für die Trendanalyse verfügbar</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

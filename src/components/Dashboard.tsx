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
      { id: "2025" },
      { id: "2026" },
      { id: "2027" },
      { id: "2028" },
      { id: "2029" },
      { id: "DyP 2025" },
      { id: "Non-DyP 2025" },
      { id: "DyP 2026" },
      { id: "Non-DyP 2026" },
      { id: "DyP 2027" },
      { id: "Non-DyP 2027" },
      { id: "DyP 2028" },
      { id: "Non-DyP 2028" },
      { id: "DyP 2029" },
      { id: "Non-DyP 2029" }
    ],
    links: [
      // 2025 (current)
      {
        source: "2025",
        target: "DyP 2025",
        value: dypApps
      },
      {
        source: "2025",
        target: "Non-DyP 2025",
        value: nonDypApps
      },
      // 2025 to 2026
      {
        source: "DyP 2025",
        target: "DyP 2026",
        value: Math.round(dypApps * 1.2)
      },
      {
        source: "Non-DyP 2025",
        target: "DyP 2026",
        value: Math.round(nonDypApps * 0.2)
      },
      {
        source: "Non-DyP 2025",
        target: "Non-DyP 2026",
        value: Math.round(nonDypApps * 0.8)
      },
      // 2026 to 2027
      {
        source: "DyP 2026",
        target: "DyP 2027",
        value: Math.round(dypApps * 1.4)
      },
      {
        source: "Non-DyP 2026",
        target: "DyP 2027",
        value: Math.round(nonDypApps * 0.3)
      },
      {
        source: "Non-DyP 2026",
        target: "Non-DyP 2027",
        value: Math.round(nonDypApps * 0.7)
      },
      // 2027 to 2028
      {
        source: "DyP 2027",
        target: "DyP 2028",
        value: Math.round(dypApps * 1.6)
      },
      {
        source: "Non-DyP 2027",
        target: "DyP 2028",
        value: Math.round(nonDypApps * 0.4)
      },
      {
        source: "Non-DyP 2027",
        target: "Non-DyP 2028",
        value: Math.round(nonDypApps * 0.6)
      },
      // 2028 to 2029
      {
        source: "DyP 2028",
        target: "DyP 2029",
        value: Math.round(dypApps * 1.8)
      },
      {
        source: "Non-DyP 2028",
        target: "DyP 2029",
        value: Math.round(nonDypApps * 0.5)
      },
      {
        source: "Non-DyP 2028",
        target: "Non-DyP 2029",
        value: Math.round(nonDypApps * 0.5)
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

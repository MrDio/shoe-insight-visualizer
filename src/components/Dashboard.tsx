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

  // Prepare quarterly trend Sankey data
  const yearlyTrendData = {
    nodes: [
      // Years
      { id: "2025" },
      { id: "2026" },
      { id: "2027" },
      { id: "2028" },
      // 2025 Quarters
      { id: "Q1 2025" },
      { id: "Q2 2025" },
      { id: "Q3 2025" },
      { id: "Q4 2025" },
      // 2026 Quarters
      { id: "Q1 2026" },
      { id: "Q2 2026" },
      { id: "Q3 2026" },
      { id: "Q4 2026" },
      // 2027 Quarters
      { id: "Q1 2027" },
      { id: "Q2 2027" },
      { id: "Q3 2027" },
      { id: "Q4 2027" },
      // 2028 Quarters
      { id: "Q1 2028" },
      { id: "Q2 2028" },
      { id: "Q3 2028" },
      { id: "Q4 2028" },
    ],
    links: [
      // 2025 Quarters
      {
        source: "2025",
        target: "Q1 2025",
        value: dypApps
      },
      {
        source: "2025",
        target: "Q2 2025",
        value: Math.round(dypApps * 1.1)
      },
      {
        source: "2025",
        target: "Q3 2025",
        value: Math.round(dypApps * 1.2)
      },
      {
        source: "2025",
        target: "Q4 2025",
        value: Math.round(dypApps * 1.3)
      },
      // 2026 Quarters
      {
        source: "2026",
        target: "Q1 2026",
        value: Math.round(dypApps * 1.4)
      },
      {
        source: "2026",
        target: "Q2 2026",
        value: Math.round(dypApps * 1.5)
      },
      {
        source: "2026",
        target: "Q3 2026",
        value: Math.round(dypApps * 1.6)
      },
      {
        source: "2026",
        target: "Q4 2026",
        value: Math.round(dypApps * 1.7)
      },
      // 2027 Quarters
      {
        source: "2027",
        target: "Q1 2027",
        value: Math.round(dypApps * 1.8)
      },
      {
        source: "2027",
        target: "Q2 2027",
        value: Math.round(dypApps * 1.9)
      },
      {
        source: "2027",
        target: "Q3 2027",
        value: Math.round(dypApps * 2.0)
      },
      {
        source: "2027",
        target: "Q4 2027",
        value: Math.round(dypApps * 2.1)
      },
      // 2028 Quarters
      {
        source: "2028",
        target: "Q1 2028",
        value: Math.round(dypApps * 2.2)
      },
      {
        source: "2028",
        target: "Q2 2028",
        value: Math.round(dypApps * 2.3)
      },
      {
        source: "2028",
        target: "Q3 2028",
        value: Math.round(dypApps * 2.4)
      },
      {
        source: "2028",
        target: "Q4 2028",
        value: Math.round(dypApps * 2.5)
      },
      // Connections between quarters (showing flow)
      ...Array.from({ length: 15 }, (_, i) => ({
        source: `Q${(i % 4) + 1} ${Math.floor(i / 4) + 2025}`,
        target: `Q${((i + 1) % 4) + 1} ${Math.floor((i + 1) / 4) + 2025}`,
        value: Math.round(dypApps * (1 + (i * 0.1)))
      }))
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


import { ApplicationData } from '@/types/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SankeyView } from './SankeyView';
import { createCurrentDistributionData, createYearlyTrendData } from './SankeyData';

interface SankeyTabsProps {
  data: ApplicationData[];
}

export const SankeyTabs = ({ data }: SankeyTabsProps) => {
  const dypApps = data.filter(item => item.dyp === 'Yes').length;
  const nonDypApps = data.filter(item => item.dyp === 'No').length;

  const sankeyData = createCurrentDistributionData(dypApps, nonDypApps);
  const yearlyTrendData = createYearlyTrendData(dypApps, nonDypApps);

  const hasValidSankeyData = sankeyData.nodes.length > 0 && sankeyData.links.length > 0;
  const hasValidTrendData = yearlyTrendData.nodes.length > 0 && yearlyTrendData.links.length > 0;

  return (
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
  );
};

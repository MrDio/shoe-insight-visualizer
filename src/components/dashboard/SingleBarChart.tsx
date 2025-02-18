
import { ResponsiveSankey } from '@nivo/sankey';

interface ChartData {
  month: string;
  expenses: number;
  revenue: number;
  toolName: string;
}

interface SingleBarChartProps {
  data: ChartData[];
  toolName: string;
}

export const SingleBarChart = ({ data, toolName }: SingleBarChartProps) => {
  // Transform bar chart data into Sankey diagram format
  const sankeyData = {
    nodes: [
      { id: toolName },
      { id: 'Ausgaben' },
      { id: 'Einnahmen' },
      ...data.map(d => ({ id: d.month }))
    ],
    links: [
      // Links from tool to expense/revenue
      ...data.map(d => ({
        source: toolName,
        target: 'Ausgaben',
        value: d.expenses
      })),
      ...data.map(d => ({
        source: toolName,
        target: 'Einnahmen',
        value: d.revenue
      })),
      // Links from expense/revenue to months
      ...data.map(d => ({
        source: 'Ausgaben',
        target: d.month,
        value: d.expenses
      })),
      ...data.map(d => ({
        source: 'Einnahmen',
        target: d.month,
        value: d.revenue
      }))
    ]
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="text-md font-medium mb-4">{toolName}</h4>
      <div className="h-[300px]">
        <ResponsiveSankey
          data={sankeyData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          align="justify"
          colors={{ scheme: 'category10' }}
          nodeOpacity={1}
          nodeThickness={18}
          nodeInnerPadding={3}
          nodeSpacing={24}
          nodeBorderWidth={0}
          linkOpacity={0.5}
          enableLinkGradient={true}
        />
      </div>
    </div>
  );
};

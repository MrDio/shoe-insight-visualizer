
import { ResponsiveSankey } from '@nivo/sankey';

interface SankeyViewProps {
  data: {
    nodes: Array<{ id: string }>;
    links: Array<{ source: string; target: string; value: number }>;
  };
}

export const SankeyView = ({ data }: SankeyViewProps) => {
  // Ensure we have valid data before rendering
  if (!data.nodes.length || !data.links.length) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <p className="text-gray-500">Keine Daten verfügbar</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Kategorie-Jahr Beziehungen</h3>
      <div className="h-[500px]">
        <ResponsiveSankey
          data={data}
          margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
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
    </>
  );
};

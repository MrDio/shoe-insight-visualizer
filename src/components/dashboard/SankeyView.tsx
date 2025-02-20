
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

  // Group nodes by their position in the flow
  const nodeGroups = {
    applications: data.nodes.filter(n => n.id === "Applications"),
    names: data.nodes.filter(n => !["Applications", "DyP", "Non-DyP", "PaaS", "CaaS"].includes(n.id) && !n.id.startsWith("Ecosystem:")),
    ecosystems: data.nodes.filter(n => n.id.startsWith("Ecosystem:")),
    dyp: data.nodes.filter(n => n.id === "DyP" || n.id === "Non-DyP"),
    cloudTypes: data.nodes.filter(n => n.id === "PaaS" || n.id === "CaaS"),
  };

  const getNodeLabel = (node: { id: string }) => {
    if (node.id.startsWith("Ecosystem: ")) {
      return node.id.replace("Ecosystem: ", "");
    }
    return node.id;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 text-center font-semibold text-sm text-gray-600">
        <div>Applications</div>
        <div>Name</div>
        <div>Ecosystem</div>
        <div>DyP Status</div>
        <div>Cloud Type</div>
      </div>
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
          nodeBorderRadius={2}
          label={getNodeLabel}
          enableLabels={true}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1]]
          }}
        />
      </div>
    </div>
  );
};

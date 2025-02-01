import { ResponsiveChord } from '@nivo/chord';

interface ChordViewProps {
  data: number[][];
  keys: string[];
}

export const ChordView = ({ data, keys }: ChordViewProps) => (
  <>
    <h3 className="text-lg font-semibold mb-4">Preisbeziehungen zwischen Kategorien</h3>
    <div className="h-[500px]">
      <ResponsiveChord
        data={data}
        keys={keys}
        margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
        padAngle={0.02}
        innerRadiusRatio={0.96}
        innerRadiusOffset={0.02}
        arcOpacity={1}
        arcBorderWidth={1}
        arcBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
        ribbonOpacity={0.5}
        ribbonBorderWidth={1}
        ribbonBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
        enableLabel={true}
        label="id"
        labelOffset={12}
        labelRotation={-90}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
        colors={{ scheme: 'nivo' }}
        motionConfig="gentle"
      />
    </div>
  </>
);
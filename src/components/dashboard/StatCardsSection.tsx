
import { ApplicationData } from '@/types/data';
import { StatCard } from './StatCard';

interface StatCardsSectionProps {
  data: ApplicationData[];
}

export const StatCardsSection = ({ data }: StatCardsSectionProps) => {
  const totalApps = data.length;
  const dypApps = data.filter(item => item.dyp === 'Yes').length;
  const nonDypApps = data.filter(item => item.dyp === 'No').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="All Applications" value={totalApps} />
      <StatCard title="DyP" value={dypApps} className="text-green-600" />
      <StatCard title="Non-DyP" value={nonDypApps} className="text-blue-600" />
    </div>
  );
};

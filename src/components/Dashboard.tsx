
import { ApplicationData } from '../types/data';
import { StatCardsSection } from './dashboard/StatCardsSection';
import { SankeyTabs } from './dashboard/SankeyTabs';

interface DashboardProps {
  data: ApplicationData[];
}

export const Dashboard = ({ data }: DashboardProps) => {
  return (
    <div className="space-y-8">
      <StatCardsSection data={data} />
      <SankeyTabs data={data} />
    </div>
  );
};

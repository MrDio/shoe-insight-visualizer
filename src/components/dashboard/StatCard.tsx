interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export const StatCard = ({ title, value, className = "text-primary" }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className={`text-3xl font-bold ${className}`}>{value}</p>
  </div>
);

import { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { ApplicationData } from '../types/data';

// Sample data
const sampleData: ApplicationData[] = [
  {
    type: 'Application',
    name: 'ASDASDASDAS',
    appId: 'APP-29262',
    cloudProvider: 'azure',
    cloudType: ['paas', 'caas'],
    dyp: 'Yes'
  },
  {
    type: 'Application',
    name: 'ASDASDSAA',
    appId: 'APP-23657',
    cloudProvider: 'azure',
    cloudType: ['caas'],
    dyp: 'No'
  },
  {
    type: 'Application',
    name: 'ADSADADA',
    appId: 'APP-32031',
    cloudProvider: 'onPremisesCloud',
    cloudType: ['caas'],
    dyp: 'Yes'
  }
];

interface DataTableProps {
  initialData?: ApplicationData[];
}

export const DataTable = ({ initialData = sampleData }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ApplicationData[]>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.appId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Nach Name oder APP ID suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>APP ID</TableHead>
              <TableHead>Cloud Provider</TableHead>
              <TableHead>Cloud Type</TableHead>
              <TableHead>DyP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.appId}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.appId}</TableCell>
                <TableCell>{item.cloudProvider}</TableCell>
                <TableCell>{item.cloudType.join(';')}</TableCell>
                <TableCell>{item.dyp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

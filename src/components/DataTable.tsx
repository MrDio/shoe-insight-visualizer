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
import { ToolData } from '../types/data';

interface DataTableProps {
  initialData: ToolData[];
}

export const DataTable = ({ initialData }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ToolData[]>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = data.filter(item => 
    item.tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Nach Tool oder ID suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tool</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead>Preise (2023)</TableHead>
              <TableHead>Preise (2024)</TableHead>
              <TableHead>Preise (2025)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.tool}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  {Object.entries(item.prices['2023'] || {})
                    .map(([month, price]) => `${month}: €${price}`)
                    .join(', ')}
                </TableCell>
                <TableCell>
                  {Object.entries(item.prices['2024'] || {})
                    .map(([month, price]) => `${month}: €${price}`)
                    .join(', ')}
                </TableCell>
                <TableCell>
                  {Object.entries(item.prices['2025'] || {})
                    .map(([month, price]) => `${month}: €${price}`)
                    .join(', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
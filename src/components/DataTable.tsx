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

type ShoeData = {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  availability: number;
  country_code: string;
  currency: string;
  date: string;
};

interface DataTableProps {
  initialData: ShoeData[];
}

export const DataTable = ({ initialData }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ShoeData[]>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Nach Name oder ID suchen..."
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
              <TableHead>Name</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead>Größe</TableHead>
              <TableHead>Preis</TableHead>
              <TableHead>Verfügbarkeit</TableHead>
              <TableHead>Land</TableHead>
              <TableHead>Währung</TableHead>
              <TableHead>Datum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.availability ? 'Verfügbar' : 'Nicht verfügbar'}
                  </span>
                </TableCell>
                <TableCell>{item.country_code}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell>{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
import { useState } from 'react';
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

const mockData: ShoeData[] = [
  {
    id: "HP9426",
    name: "Breaknet 2.0 Schuh",
    category: "Sneakers",
    size: "42",
    price: 60.0,
    availability: 1,
    country_code: "DE",
    currency: "EUR",
    date: "2025-01-07"
  },
  {
    id: "HQ4199",
    name: "Ultraboost 1.0 Laufschuh",
    category: "Running",
    size: "44",
    price: 180.0,
    availability: 1,
    country_code: "US",
    currency: "USD",
    date: "2025-06-25"
  }
];

export const DataTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data] = useState<ShoeData[]>(mockData);

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by name or ID..."
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
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Date</TableHead>
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
                    {item.availability ? 'Available' : 'Not Available'}
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
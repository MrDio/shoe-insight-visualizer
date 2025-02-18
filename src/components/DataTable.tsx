
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DataTableProps {
  initialData?: ApplicationData[];
  useSupabase?: boolean;
}

export const DataTable = ({ initialData = [], useSupabase = false }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ApplicationData[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    if (!useSupabase) {
      setData(initialData);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching data from Supabase...');
        const { data: applications, error } = await supabase
          .from('applications')
          .select('*');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Received data from Supabase:', applications);

        // Transform the data to match ApplicationData type
        const transformedData: ApplicationData[] = applications.map(app => ({
          type: app.type as 'Application',
          name: app.name,
          appId: app.app_id,
          cloudProvider: app.cloud_provider as 'azure' | 'onPremisesCloud',
          cloudType: app.cloud_type as ('paas' | 'caas')[],
          dyp: app.dyp as 'Yes' | 'No'
        }));

        console.log('Transformed data:', transformedData);
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Fehler beim Laden der Daten');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [useSupabase]); // Remove initialData from dependencies

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.appId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Current data source:', useSupabase ? 'Supabase' : 'File');
  console.log('Current data:', data);
  console.log('Filtered data:', filteredData);

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Lädt Daten...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Keine Daten gefunden
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.appId}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.appId}</TableCell>
                  <TableCell>{item.cloudProvider}</TableCell>
                  <TableCell>{item.cloudType.join(';')}</TableCell>
                  <TableCell>{item.dyp}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

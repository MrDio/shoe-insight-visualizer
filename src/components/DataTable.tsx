
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

const generateSampleData = (): ApplicationData[] => {
  const ecosystems = ['SWF', 'Standard', 'Legacy', 'Cloud Native', 'Microservices'];
  const cloudProviders: ('azure' | 'onPremisesCloud')[] = ['azure', 'onPremisesCloud'];
  const cloudTypes: ('paas' | 'caas')[][] = [['paas'], ['caas'], ['paas', 'caas']];
  const dypValues: ('Yes' | 'No')[] = ['Yes', 'No'];
  
  return Array.from({ length: 350 }, (_, index) => ({
    type: 'Application',
    name: `App-${String(index + 1).padStart(3, '0')}`,
    appId: `ID${String(index + 1).padStart(5, '0')}`,
    cloudProvider: cloudProviders[Math.floor(Math.random() * cloudProviders.length)],
    cloudType: cloudTypes[Math.floor(Math.random() * cloudTypes.length)],
    dyp: dypValues[Math.floor(Math.random() * dypValues.length)],
    ecosystem: ecosystems[Math.floor(Math.random() * ecosystems.length)]
  }));
};

export const DataTable = ({ initialData = [], useSupabase = false }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ApplicationData[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!useSupabase) {
        // If no initial data is provided, generate sample data
        setData(initialData.length > 0 ? initialData : generateSampleData());
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const { data: applications, error: supabaseError } = await supabase
          .from('applications')
          .select('*');

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          setError(supabaseError.message);
          toast.error('Fehler beim Laden der Daten: ' + supabaseError.message);
          return;
        }

        if (!applications) {
          console.log('No data received from Supabase');
          setData([]);
          return;
        }

        console.log('Received data from Supabase:', applications);

        const transformedData: ApplicationData[] = applications.map(app => ({
          type: app.type as 'Application',
          name: app.name,
          appId: app.app_id,
          cloudProvider: app.cloud_provider as 'azure' | 'onPremisesCloud',
          cloudType: app.cloud_type as ('paas' | 'caas')[],
          dyp: app.dyp as 'Yes' | 'No',
          ecosystem: app.ecosystem
        }));

        console.log('Transformed data:', transformedData);
        setData(transformedData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
        console.error('Error fetching data:', errorMessage);
        setError(errorMessage);
        toast.error('Fehler beim Laden der Daten: ' + errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [useSupabase, initialData]);

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
              <TableHead>Ecosystem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Lädt Daten...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-red-500">
                  Fehler: {error}
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
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
                  <TableCell>{item.cloudType.join(', ')}</TableCell>
                  <TableCell>{item.dyp}</TableCell>
                  <TableCell>{item.ecosystem}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

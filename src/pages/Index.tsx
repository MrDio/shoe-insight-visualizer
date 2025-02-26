
import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataTable } from '@/components/DataTable';
import { Dashboard } from '@/components/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, File } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ApplicationData } from '../types/data';
import { supabase } from "@/integrations/supabase/client";

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

const Index = () => {
  const [data, setData] = useState<ApplicationData[]>([]);
  const [dataSource, setDataSource] = useState<'database' | 'file'>('file');

  useEffect(() => {
    const fetchData = async () => {
      if (dataSource === 'database') {
        const { data: applications, error } = await supabase
          .from('applications')
          .select('*');

        if (error) {
          console.error('Error fetching data:', error);
          return;
        }

        if (applications) {
          const transformedData: ApplicationData[] = applications.map(app => ({
            type: app.type as 'Application',
            name: app.name,
            appId: app.app_id,
            cloudProvider: app.cloud_provider as 'azure' | 'onPremisesCloud',
            cloudType: app.cloud_type as ('paas' | 'caas')[],
            dyp: app.dyp as 'Yes' | 'No',
            ecosystem: app.ecosystem || 'Standard'
          }));
          setData(transformedData);
        }
      } else {
        // Generiere Beispieldaten für den File-Modus
        setData(generateSampleData());
      }
    };

    fetchData();
  }, [dataSource]);

  const handleDataLoaded = (newData: ApplicationData[]) => {
    setData(newData);
    setDataSource('file');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="container py-6">
          <h1 className="text-2xl font-bold text-primary">Application Overview</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8 flex-grow">
        <div className="flex gap-4 items-center">
          <Button
            variant={dataSource === 'database' ? 'default' : 'outline'}
            onClick={() => setDataSource('database')}
          >
            <Database className="mr-2 h-4 w-4" />
            Database
          </Button>
          <Button
            variant={dataSource === 'file' ? 'default' : 'outline'}
            onClick={() => setDataSource('file')}
          >
            <File className="mr-2 h-4 w-4" />
            File
          </Button>
        </div>

        {dataSource === 'file' && <FileUpload onDataLoaded={handleDataLoaded} />}
        
        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table">Data Table</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <DataTable initialData={data} useSupabase={dataSource === 'database'} />
          </TabsContent>
          <TabsContent value="dashboard">
            <Dashboard data={data} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t py-2">
        <div className="container text-right">
          <span className="text-xs text-gray-400">Build: {import.meta.env.VITE_BUILD_NUMBER || '0'}</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;

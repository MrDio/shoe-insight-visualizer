
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataTable } from '@/components/DataTable';
import { Dashboard } from '@/components/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationData } from '../types/data';

const Index = () => {
  const [data, setData] = useState<ApplicationData[]>([]);

  const handleDataLoaded = (newData: ApplicationData[]) => {
    setData(newData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="container py-6">
          <h1 className="text-2xl font-bold text-primary">Application Overview</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8 flex-grow">
        <FileUpload onDataLoaded={handleDataLoaded} />
        
        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table">Data Table</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <DataTable initialData={data} />
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

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataTable } from '@/components/DataTable';
import { Dashboard } from '@/components/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const Index = () => {
  const [data, setData] = useState<ShoeData[]>([]);

  const handleDataLoaded = (newData: ShoeData[]) => {
    setData(newData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container py-6">
          <h1 className="text-2xl font-bold text-primary">Schuh-Daten Analyse</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <FileUpload onDataLoaded={handleDataLoaded} />
        
        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table">Datentabelle</TabsTrigger>
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
    </div>
  );
};

export default Index;
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataTable } from '@/components/DataTable';
import { Dashboard } from '@/components/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container py-6">
          <h1 className="text-2xl font-bold text-primary">Shoe Data Analysis</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <FileUpload />
        
        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table">Data Table</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <DataTable />
          </TabsContent>
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
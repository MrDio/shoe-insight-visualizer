import { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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

interface FileUploadProps {
  onDataLoaded: (data: ShoeData[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.xlsx')) {
        handleFile(file);
      } else {
        toast.error('Bitte laden Sie eine Excel (.xlsx) Datei hoch');
      }
    }
  };

  const isValidRow = (row: any): row is ShoeData => {
    return (
      row.id && 
      row.name && 
      row.category && 
      row.size && 
      typeof row.price === 'number' &&
      (row.availability === 0 || row.availability === 1)
    );
  };

  const handleFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
      
      if (jsonData.length === 0) {
        toast.error('Die Excel-Datei enthält keine Daten');
        return;
      }

      // Filter valid rows
      const validData = jsonData.filter(isValidRow);

      if (validData.length === 0) {
        toast.error('Keine gültigen Daten in der Excel-Datei gefunden');
        return;
      }

      if (validData.length < jsonData.length) {
        toast.warning(`${jsonData.length - validData.length} ungültige Datenreihen wurden übersprungen`);
      }

      onDataLoaded(validData);
      toast.success(`${validData.length} Datenreihen erfolgreich geladen`);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Fehler beim Verarbeiten der Datei');
    }
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Upload className="w-12 h-12 text-primary" />
        <h3 className="text-lg font-semibold">Excel-Datei hier ablegen</h3>
        <p className="text-sm text-gray-500">oder</p>
        <label className="cursor-pointer">
          <span className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors">
            Datei auswählen
          </span>
          <input
            type="file"
            className="hidden"
            accept=".xlsx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
        <p className="text-xs text-gray-400">Unterstützt nur .xlsx Dateien</p>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { ToolData, Category } from '../types/data';
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onDataLoaded: (data: ToolData[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const validateCategory = (category: string): category is Category => {
    return ['IWC', 'EWC', 'IWR', 'EWR'].includes(category);
  };

  const processExcelData = (jsonData: any[]): { data: ToolData[], skippedRows: number } => {
    const toolsMap = new Map<string, ToolData>();
    let skippedRows = 0;
    const totalRows = jsonData.length;
    
    jsonData.forEach((row, index) => {
      try {
        setProgress(Math.round((index / totalRows) * 100));
        
        const tool = row.Tool?.toString() || '';
        const category = row.Category?.toString() || '';
        
        if (!tool || !validateCategory(category)) {
          console.warn(`Zeile ${index + 1}: Ungültige Daten - Tool: ${tool}, Kategorie: ${category}`);
          skippedRows++;
          return;
        }

        let toolData = toolsMap.get(tool) || {
          id: `tool-${index}`,
          tool,
          category: category as Category,
          prices: {
            '2023': {},
            '2024': {},
            '2025': {}
          }
        };

        // Process price columns in format YYYY-MM
        Object.entries(row).forEach(([key, value]) => {
          const match = key.match(/^(\d{4})-(\d{2})$/);
          if (match) {
            const [, year, month] = match;
            if (!toolData.prices[year]) {
              toolData.prices[year] = {};
            }
            
            const price = parseFloat(value as string);
            if (!isNaN(price)) {
              toolData.prices[year][month] = price;
            }
          }
        });

        toolsMap.set(tool, toolData);
      } catch (error) {
        console.warn(`Fehler beim Verarbeiten von Zeile ${index + 1}:`, error);
        skippedRows++;
      }
    });

    return {
      data: Array.from(toolsMap.values()),
      skippedRows
    };
  };

  const handleFile = async (file: File) => {
    try {
      setIsLoading(true);
      setProgress(0);
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            toast.error('Keine Daten gefunden');
            return;
          }
          
          const workbook = XLSX.read(data, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length === 0) {
            toast.warning('Keine Daten in der Excel-Datei gefunden.');
            return;
          }

          const { data: processedData, skippedRows } = processExcelData(jsonData);
          
          if (processedData.length === 0) {
            toast.warning('Keine gültigen Daten gefunden. Alle Zeilen wurden übersprungen.');
          } else {
            onDataLoaded(processedData);
            if (skippedRows > 0) {
              toast.warning(`${processedData.length} Tools geladen, ${skippedRows} fehlerhafte Zeilen übersprungen`);
            } else {
              toast.success(`${processedData.length} Tools erfolgreich geladen`);
            }
          }
          
        } catch (error) {
          console.error('Fehler beim Verarbeiten der Datei:', error);
          toast.error('Die Datei konnte nicht vollständig verarbeitet werden');
        } finally {
          setIsLoading(false);
          setProgress(100);
          setTimeout(() => setProgress(0), 500);
        }
      };

      reader.onerror = () => {
        toast.error('Fehler beim Lesen der Datei');
        setIsLoading(false);
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Fehler beim Verarbeiten der Datei:', error);
      toast.error('Fehler beim Verarbeiten der Datei');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
      {isLoading && (
        <div className="w-full max-w-2xl mx-auto">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-gray-500 mt-2">Datei wird verarbeitet...</p>
        </div>
      )}
    </div>
  );
};
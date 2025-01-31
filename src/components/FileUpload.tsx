import { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { ToolData, Category, Year, Month } from '../types/data';

interface FileUploadProps {
  onDataLoaded: (data: ToolData[]) => void;
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

  const validateCategory = (category: string): category is Category => {
    return ['IWC', 'EWC', 'IWR', 'EWR'].includes(category);
  };

  const processExcelData = (jsonData: any[]): { data: ToolData[], skippedRows: number } => {
    const toolsMap = new Map<string, ToolData>();
    let skippedRows = 0;
    
    jsonData.forEach((row, index) => {
      const tool = row.Tool?.toString();
      const category = row.Category?.toString();
      
      if (!tool || !category) {
        console.warn(`Zeile ${index + 1}: Fehlender Tool-Name oder Kategorie`);
        skippedRows++;
        return;
      }

      if (!validateCategory(category)) {
        console.warn(`Zeile ${index + 1}: Ungültige Kategorie: ${category}`);
        skippedRows++;
        return;
      }

      let toolData = toolsMap.get(tool) || {
        id: `tool-${index}`,
        tool,
        category,
        prices: {}
      };

      // Verarbeite die monatlichen Preise für jedes Jahr
      ['2023', '2024', '2025'].forEach((year) => {
        if (!toolData.prices[year]) {
          toolData.prices[year] = {};
        }

        // Verarbeite jeden Monat
        Array.from({ length: 12 }, (_, i) => {
          const month = `${i + 1}`.padStart(2, '0') as Month;
          const columnName = `${year}_${month}`;
          const price = parseFloat(row[columnName]);
          
          if (!isNaN(price)) {
            toolData.prices[year][month] = price;
          }
        });
      });

      toolsMap.set(tool, toolData);
    });

    return {
      data: Array.from(toolsMap.values()),
      skippedRows
    };
  };

  const handleFile = async (file: File) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            throw new Error('Keine Daten gefunden');
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
            toast.error('Keine gültigen Daten gefunden. Bitte überprüfen Sie das Dateiformat.');
            return;
          }

          onDataLoaded(processedData);
          
          if (skippedRows > 0) {
            toast.warning(`${processedData.length} Tools geladen, ${skippedRows} fehlerhafte Zeilen übersprungen`);
          } else {
            toast.success(`${processedData.length} Tools erfolgreich geladen`);
          }
          
        } catch (error) {
          console.error('Error processing file data:', error);
          toast.error('Fehler beim Verarbeiten der Datei');
        }
      };

      reader.onerror = () => {
        toast.error('Fehler beim Lesen der Datei');
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error handling file:', error);
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
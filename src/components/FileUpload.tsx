
import { useState } from 'react';
import { toast } from 'sonner';
import { ApplicationData } from '../types/data';
import { Progress } from "@/components/ui/progress";
import { DropZone } from './upload/DropZone';
import { processExcelData, readExcelFile } from '../utils/ExcelProcessor';

interface FileUploadProps {
  onDataLoaded: (data: ApplicationData[]) => void;
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

  const handleFile = async (file: File) => {
    try {
      setIsLoading(true);
      setProgress(0);
      
      const jsonData = await readExcelFile(file);
      const { data: processedData, skippedRows } = processExcelData(jsonData, setProgress);
      
      if (processedData.length === 0) {
        toast.warning('Keine gültigen Daten gefunden. Alle Zeilen wurden übersprungen.');
      } else {
        onDataLoaded(processedData);
        if (skippedRows > 0) {
          toast.warning(`${processedData.length} Anwendungen geladen, ${skippedRows} fehlerhafte Zeilen übersprungen`);
        } else {
          toast.success(`${processedData.length} Anwendungen erfolgreich geladen`);
        }
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten der Datei:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler beim Verarbeiten der Datei');
    } finally {
      setIsLoading(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="space-y-4">
      <DropZone
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onFileSelect={handleFile}
      />
      {isLoading && (
        <div className="w-full max-w-2xl mx-auto">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-gray-500 mt-2">Datei wird verarbeitet...</p>
        </div>
      )}
    </div>
  );
};

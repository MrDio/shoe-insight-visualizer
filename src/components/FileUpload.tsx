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

  const processRow = (row: any, index: number): ShoeData => {
    // Generiere eine eindeutige ID falls keine vorhanden
    const uniqueId = row.id?.toString() || `generated-id-${index}`;
    
    // Extrahiere Werte oder setze Standardwerte
    const name = row.name?.toString() || `Produkt ${index + 1}`;
    const category = row.category?.toString() || 'Allgemein';
    const size = row.size?.toString() || 'Universal';
    
    // Versuche den Preis zu parsen, mit Fallback auf 0
    let price = 0;
    if (row.price !== undefined) {
      const parsedPrice = parseFloat(row.price.toString().replace(',', '.'));
      if (!isNaN(parsedPrice)) {
        price = parsedPrice;
      }
    }

    // Setze Verfügbarkeit auf 1 (verfügbar) als Standard
    const availability = row.availability === 0 ? 0 : 1;

    return {
      id: uniqueId,
      name: name,
      category: category,
      size: size,
      price: price,
      availability: availability,
      country_code: row.country_code?.toString() || 'DE',
      currency: row.currency?.toString() || 'EUR',
      date: row.date?.toString() || new Date().toISOString().split('T')[0],
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
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
          
          if (jsonData.length === 0) {
            // Selbst wenn keine Daten gefunden wurden, erstellen wir einen Beispieldatensatz
            const dummyData: ShoeData[] = [{
              id: 'example-1',
              name: 'Beispielprodukt',
              category: 'Allgemein',
              size: 'Universal',
              price: 0,
              availability: 1,
              country_code: 'DE',
              currency: 'EUR',
              date: new Date().toISOString().split('T')[0],
            }];
            onDataLoaded(dummyData);
            toast.warning('Keine Daten in der Excel-Datei gefunden. Ein Beispieldatensatz wurde geladen.');
            return;
          }

          // Verarbeite alle Reihen und setze Standardwerte für fehlende Daten
          const processedData = jsonData.map((row, index) => processRow(row, index));

          onDataLoaded(processedData);
          toast.success(`${processedData.length} Datenreihen erfolgreich geladen`);
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
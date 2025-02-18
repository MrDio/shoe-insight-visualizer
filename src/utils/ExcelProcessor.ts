
import { ApplicationData, CloudProvider, CloudType } from '../types/data';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export const validateCloudProvider = (provider: string): provider is CloudProvider => {
  return ['azure', 'onPremisesCloud'].includes(provider);
};

export const validateCloudType = (type: string): type is CloudType => {
  return ['paas', 'caas'].includes(type);
};

export const processExcelData = (
  jsonData: any[], 
  onProgress: (progress: number) => void
): { data: ApplicationData[]; skippedRows: number } => {
  const applications: ApplicationData[] = [];
  let skippedRows = 0;
  const totalRows = jsonData.length;

  jsonData.forEach((row, index) => {
    try {
      onProgress(Math.round((index / totalRows) * 100));

      const type = row.Type?.toString() || '';
      const name = row.Name?.toString() || '';
      const appId = row['APP ID']?.toString() || '';
      const cloudProvider = row['Cloud Provider']?.toString() || '';
      const cloudTypeStr = row['Cloud Type']?.toString() || '';

      if (!name || !appId || !validateCloudProvider(cloudProvider)) {
        console.warn(`Zeile ${index + 1}: Ungültige Daten`);
        skippedRows++;
        return;
      }

      const cloudTypes = cloudTypeStr.split(';').filter(validateCloudType);

      if (cloudTypes.length === 0) {
        console.warn(`Zeile ${index + 1}: Ungültige Cloud Types`);
        skippedRows++;
        return;
      }

      applications.push({
        type: 'Application',
        name,
        appId,
        cloudProvider,
        cloudType: cloudTypes as CloudType[]
      });
    } catch (error) {
      console.warn(`Fehler beim Verarbeiten von Zeile ${index + 1}:`, error);
      skippedRows++;
    }
  });

  return { data: applications, skippedRows };
};

export const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
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
          throw new Error('Keine Daten in der Excel-Datei gefunden.');
        }

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
    reader.readAsBinaryString(file);
  });
};


import { ToolData } from '@/types/data';

export const processChartData = (combinedData: ToolData[], selectedYear: string) => {
  // Gruppiere Tools nach Namen (ohne "Revenue")
  const toolGroups = combinedData.reduce((acc, item) => {
    const baseName = item.tool.replace(' Revenue', '');
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(item);
    return acc;
  }, {} as Record<string, ToolData[]>);

  // Erstelle für jedes Tool und für "Developer Platforms" die Monatsdaten
  const results = Object.entries(toolGroups).map(([toolName, toolItems]) => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0');
      
      const costs = toolItems.find(item => item.category.endsWith('C'))?.prices[selectedYear]?.[month] || 0;
      const revenue = toolItems.find(item => item.category.endsWith('R'))?.prices[selectedYear]?.[month] || 0;

      return {
        month: new Date(2023, i).toLocaleString('de-DE', { month: 'short' }),
        expenses: costs,
        revenue: revenue,
        toolName
      };
    });

    return {
      toolName,
      data: monthlyData
    };
  });

  // Berechne "Developer Platforms" als Aggregation
  const developerPlatformsData = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    
    const totalExpenses = combinedData
      .filter(item => item.category.endsWith('C'))
      .reduce((sum, item) => sum + (item.prices[selectedYear]?.[month] || 0), 0);

    const totalRevenue = combinedData
      .filter(item => item.category.endsWith('R'))
      .reduce((sum, item) => sum + (item.prices[selectedYear]?.[month] || 0), 0);

    return {
      month: new Date(2023, i).toLocaleString('de-DE', { month: 'short' }),
      expenses: totalExpenses,
      revenue: totalRevenue,
      toolName: 'Developer Platforms'
    };
  });

  results.push({
    toolName: 'Developer Platforms',
    data: developerPlatformsData
  });

  return results;
};


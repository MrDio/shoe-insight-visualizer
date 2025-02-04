
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface YearSelectorProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export const YearSelector = ({ selectedYear, onYearChange }: YearSelectorProps) => {
  return (
    <div className="w-[200px]">
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger>
          <SelectValue placeholder="Jahr auswählen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2025">2025</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};


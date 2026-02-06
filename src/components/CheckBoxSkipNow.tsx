// src/components/CheckBoxSkipNow.tsx


// src/components/CheckBoxSkipNow.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckBoxSkipNowProps {
  isSkipped: boolean;
  setIsSkipped: (value: boolean) => void;
  label?: string;
  description?: string;
  id?: string;
  className?: string;
}

export const CheckBoxSkipNow = ({
  isSkipped,
  setIsSkipped,
  label = 'Fyll i senare',
  id = 'skip-measurements',
  className = '',
}: CheckBoxSkipNowProps) => {
  return (
    <div className={`bg-blue-50 border border-blue-200 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Checkbox
            id={id}
            checked={isSkipped}
            onCheckedChange={(checked) => setIsSkipped(checked === true)}
            className="h-6 w-6 border-2"
          />
        </div>
        
        <div className="flex-1">
          <Label 
            htmlFor={id} 
            className="cursor-pointer text-lg font-semibold text-gray-800 block mb-1"
          >
            {label}
          </Label>
        </div>
      </div>
    </div>
  );
};
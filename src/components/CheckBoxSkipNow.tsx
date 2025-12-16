// src/components/CheckBoxSkipNow.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckBoxSkipNowProps {
  isSkipped: boolean;
  setIsSkipped: (value: boolean) => void;
  label?: string;
  id?: string;
  className?: string;
}

export const CheckBoxSkipNow = ({
  isSkipped,
  setIsSkipped,
  label = 'Fyll i senare under "Mina sidor"',
  id = 'skip-measurements',
  className = '',
}: CheckBoxSkipNowProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Checkbox
        id={id}
        checked={isSkipped}
        onCheckedChange={(checked) => setIsSkipped(checked === true)}
      />
      <Label htmlFor={id} className="cursor-pointer text-muted-foreground">
        {label}
      </Label>
    </div>
  );
};
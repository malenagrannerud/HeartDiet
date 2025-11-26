import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddPlanButtonProps {
  onClick: () => void;
  canAddMorePlans: boolean;
  maxPlans?: number;
}

export const AddPlanButton = ({ 
  onClick, 
  canAddMorePlans, 
  maxPlans = 10 
}: AddPlanButtonProps) => {
  if (!canAddMorePlans) {
    return (
      <p className="text-sm text-muted-foreground mt-4">
        Du har nått max antal planer ({maxPlans})
      </p>
    );
  }

  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-2 mt-6"
      variant="default"
    >
      <Plus size={16} />
      Lägg till plan
    </Button>
  );
};

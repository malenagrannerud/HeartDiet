import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SkipButtonProps {
  onClick: () => void;
}

export const SkipButton = ({ onClick }: SkipButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full"
    >
      Fyll i senare
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ButtonBackForwardProps {
  onBack: () => void;
  onForward: () => void;
  forwardDisabled: boolean;
}

export const ButtonBackForward = ({
  onBack,
  onForward,
  forwardDisabled,
}: ButtonBackForwardProps) => {
  return (
    <>
      <Button
        variant="outline"
        onClick={onBack}
        className="flex-1 h10"
        size="lg"
      >
        <ArrowLeft className="mr-2 h-5 w-2" />
        Tillbaka
      </Button>

      <Button
        onClick={onForward}
        disabled={forwardDisabled}
        className="flex-1 h-10"
        size="lg"
      >
        Nästa
        <ArrowRight className="mr-2 h-5 w-2" />
      </Button>
    </>
  );
};
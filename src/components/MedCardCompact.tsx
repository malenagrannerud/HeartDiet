import { MedicationData, FoodInteraction } from "@/data/medications";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Pill, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedCardCompactProps {
  medication: MedicationData;
  interaction: FoodInteraction;
  className?: string;
}

export const MedCardCompact = ({ medication, interaction, className }: MedCardCompactProps) => {
  // Color based on severity (high contrast)
  const severityColors = {
    high: "border-2 border-black bg-amber-100 hover:bg-amber-200",
    medium: "border-2 border-gray-600 bg-gray-100 hover:bg-gray-200",
    low: "border border-gray-400 bg-gray-50 hover:bg-gray-100"
  };

  const severityTextColors = {
    high: "text-black",
    medium: "text-black",
    low: "text-black"
  };

  const severityIconColors = {
    high: "text-black",
    medium: "text-black",
    low: "text-gray-700"
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "w-full rounded-none border-2 p-3 flex items-center gap-3 text-left transition-colors",
            severityColors[interaction.severity],
            severityTextColors[interaction.severity],
            className
          )}
        >
          <AlertTriangle className={cn("h-4 w-4 flex-shrink-0", severityIconColors[interaction.severity])} />
          <span className="flex-1 font-medium text-sm">
            Observera: Läkemedelsinteraktion med {medication.name}
          </span>
          <ChevronRight className={cn("h-4 w-4 flex-shrink-0", severityIconColors[interaction.severity])} />
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Läkemedelsinteraktion
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Medication name */}
          <div>
            <h3 className="font-semibold text-base mb-1">{medication.name}</h3>
            <p className="text-sm text-muted-foreground">{medication.genericName}</p>
          </div>

          {/* Foods to be careful with */}
          <div>
            <h4 className="font-medium text-sm mb-2">Var försiktig med:</h4>
            <ul className="list-disc list-inside space-y-1">
              {interaction.foods.map((food, index) => (
                <li key={index} className="text-sm">{food}</li>
              ))}
            </ul>
          </div>

          {/* What happens */}
          <div>
            <h4 className="font-medium text-sm mb-2">Vad händer:</h4>
            <p className="text-sm">{interaction.effect}</p>
          </div>

          {/* Evidence-based advice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              💡 Evidensbaserat råd
            </h4>
            <p className="text-sm">{interaction.advice}</p>
          </div>

          {/* Good alternatives */}
          {interaction.alternative && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                ✅ Bra alternativ
              </h4>
              <p className="text-sm">{interaction.alternative}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

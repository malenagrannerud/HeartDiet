import { AlertTriangle, Pill } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FoodInteraction, MedicationData } from "@/data/medListAndFoodInteractions";

interface MedCardProps {
  medication: MedicationData;
  interaction: FoodInteraction;
  className?: string;
}

export const MedCard = ({ medication, interaction, className = "" }: MedCardProps) => {
  // Set background color based on severity
  const severityColors = {
    high: "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800",
    medium: "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800",
    low: "bg-slate-50 dark:bg-slate-900/20 border-slate-300 dark:border-slate-800"
  };

  const severityTextColors = {
    high: "text-amber-800 dark:text-amber-200",
    medium: "text-blue-800 dark:text-blue-200",
    low: "text-slate-800 dark:text-slate-200"
  };

  const severityLabels = {
    high: "Viktig varning",
    medium: "Observera",
    low: "Information"
  };

  return (
    <Card className={`${severityColors[interaction.severity]} ${className} p-4 shadow-md`}>
      <div className="space-y-3">
        {/* Header with icon and severity */}
        <div className="flex items-start gap-2">
          <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${severityTextColors[interaction.severity]}`} />
          <div className="flex-1">
            <h3 className={`font-bold text-base ${severityTextColors[interaction.severity]}`}>
              {severityLabels[interaction.severity]}: Läkemedelsinteraktion
            </h3>
          </div>
        </div>

        {/* Medication name */}
        <div className="flex items-center gap-2 pl-7">
          <Pill className="h-4 w-4 text-foreground/70" />
          <p className="font-semibold text-foreground">
            {medication.name}
          </p>
        </div>

        {/* Food interaction warning */}
        <div className="pl-7 space-y-2">
          <div>
            <p className="text-sm font-medium text-foreground/90">
              Livsmedel att vara försiktig med:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 mt-1">
              {interaction.foods.map((food, index) => (
                <li key={index}>{food}</li>
              ))}
            </ul>
          </div>

          {/* Effect explanation */}
          <div>
            <p className="text-sm font-medium text-foreground/90">
              Vad händer:
            </p>
            <p className="text-sm text-foreground/80">
              {interaction.effect}
            </p>
          </div>

          {/* Advice */}
          <div className="bg-background/40 rounded-md p-3 border border-border/50">
            <p className="text-sm font-medium text-foreground/90 mb-1">
              💡 Evidensbaserat råd:
            </p>
            <p className="text-sm text-foreground/80">
              {interaction.advice}
            </p>
          </div>

          {/* Alternative */}
          <div className="bg-primary/5 rounded-md p-3 border border-primary/20">
            <p className="text-sm font-medium text-primary mb-1">
              ✅ Bra alternativ:
            </p>
            <p className="text-sm text-foreground/80">
              {interaction.alternative}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

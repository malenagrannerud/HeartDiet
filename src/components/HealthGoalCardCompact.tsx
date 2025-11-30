import { useState } from "react";
import { HealthGoalTip } from "@/data/health-goal-tips";
import { Heart, Activity, Droplet, Scale, Zap, Shield, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface HealthGoalCardCompactProps {
  tip: HealthGoalTip;
}

const goalConfig = {
  cholesterol: {
    icon: Heart,
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
    label: "Kolesterol"
  },
  bloodPressure: {
    icon: Activity,
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
    label: "Blodtryck"
  },
  diabetes: {
    icon: Droplet,
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
    label: "Diabetes"
  },
  weight: {
    icon: Scale,
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    label: "Vikt"
  },
  energy: {
    icon: Zap,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    label: "Energi"
  },
  prevention: {
    icon: Shield,
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-800",
    iconColor: "text-teal-600 dark:text-teal-400",
    label: "Prevention"
  }
};

export const HealthGoalCardCompact = ({ tip }: HealthGoalCardCompactProps) => {
  const [open, setOpen] = useState(false);
  const config = goalConfig[tip.goalId as keyof typeof goalConfig];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className={`w-full rounded-none border-2 ${config.borderColor} ${config.bgColor} p-3 flex items-center gap-3 hover:opacity-80 transition-opacity text-left`}
        >
          <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0`} />
          <span className="flex-1 font-medium text-sm">
            Personligt tips: {tip.title}
          </span>
          <ChevronRight className={`h-4 w-4 ${config.iconColor} flex-shrink-0`} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
            <DialogTitle className="text-xl">{tip.title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            {tip.description}
          </p>
          <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-4`}>
            <h4 className="font-semibold mb-3">Viktig information:</h4>
            <ul className="space-y-2">
              {tip.keyPoints.map((point, index) => (
                <li key={index} className="flex gap-2 text-sm">
                  <span className={`${config.iconColor} font-bold`}>•</span>
                  <span className="flex-1">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          {tip.source && (
            <p className="text-xs text-muted-foreground italic">
              Källa: {tip.source}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

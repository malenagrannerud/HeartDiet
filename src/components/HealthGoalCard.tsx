import { HealthGoalTip } from "@/data/health-goal-tips";
import { Heart, Activity, Droplet, Scale, Zap, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface HealthGoalCardProps {
  tip: HealthGoalTip;
}

const goalConfig = {
  cholesterol: {
    icon: Heart,
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400"
  },
  bloodPressure: {
    icon: Activity,
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400"
  },
  diabetes: {
    icon: Droplet,
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400"
  },
  weight: {
    icon: Scale,
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400"
  },
  energy: {
    icon: Zap,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400"
  },
  prevention: {
    icon: Shield,
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-800",
    iconColor: "text-teal-600 dark:text-teal-400"
  }
};

export const HealthGoalCard = ({ tip }: HealthGoalCardProps) => {
  const config = goalConfig[tip.goalId as keyof typeof goalConfig];
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className={`${config.iconColor} mt-1`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{tip.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {tip.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tip.keyPoints.map((point, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className={`${config.iconColor} font-bold`}>•</span>
              <span className="flex-1">{point}</span>
            </li>
          ))}
        </ul>
        {tip.source && (
          <p className="text-xs text-muted-foreground mt-4 italic">
            Källa: {tip.source}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

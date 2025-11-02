import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { pageTitle, cardText, labelText, headerContainer, backButton, secondaryButton, disabledButton, compactCard, pageContainer, pagePadding } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { healthMetricsSchema, completedActivitiesSchema } from "@/lib/schemas";

const HealthMetrics = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  useEffect(() => {
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    if (metrics) {
      setWeight(metrics.weight || "");
      setSystolic(metrics.systolic || "");
      setDiastolic(metrics.diastolic || "");
    }
  }, []);

  const handleSubmit = () => {
    const metrics = { weight, systolic, diastolic, date: new Date().toISOString() };
    setStorageItem('healthMetrics', metrics, healthMetricsSchema);
    localStorage.setItem('healthMetricsCompleted', 'true');
    
    const activities = getStorageItem('completedActivities', completedActivitiesSchema) || [];
    const activitiesArray = Array.isArray(activities) ? activities : [];
    activitiesArray.push({
      id: 'health-metrics',
      title: 'Vikt och blodtryck',
      completedDate: new Date().toISOString(),
      type: 'health-metrics'
    });
    setStorageItem('completedActivities', activitiesArray, completedActivitiesSchema);
    navigate('/app/today');
  };

  const isValid = weight !== "" && systolic !== "" && diastolic !== "";

  return (
    /* STANDARDIZATION: Cards use compactCard (p-5, bg-blue-50, min-h-80px) */
    <div className={`${pageContainer} pb-16`}>
      <header className={headerContainer}>
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" onClick={() => navigate('/app/today')} className={backButton}>
            <ArrowLeft size={24} className="text-foreground" />
          </Button>
          <h1 className={`${pageTitle} text-2xl`}>Vikt och blodtryck</h1>
        </div>
        <p className={`${cardText} text-sm ml-14`}>Fyll i dina startvärden</p>
      </header>

      <div className={`${pagePadding} space-y-6`}>
        <Card className={compactCard}>
          <div className="space-y-3">
            <Label htmlFor="weight" className={labelText}>Vikt (kg)</Label>
            <Input id="weight" type="number" placeholder="T.ex. 75" value={weight} onChange={(e) => setWeight(e.target.value)} className="text-lg" step="0.1" min="0" />
            <p className={`text-sm ${cardText}`}>Ange din nuvarande vikt i kilogram</p>
          </div>
        </Card>

        <Card className={compactCard}>
          <div className="space-y-4">
            <h3 className={labelText}>Blodtryck</h3>
            <div className="space-y-3">
              <Label htmlFor="systolic" className={labelText}>Övertryck (systoliskt)</Label>
              <Input id="systolic" type="number" placeholder="T.ex. 120" value={systolic} onChange={(e) => setSystolic(e.target.value)} className="text-lg" min="0" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="diastolic" className={labelText}>Undertryck (diastoliskt)</Label>
              <Input id="diastolic" type="number" placeholder="T.ex. 80" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} className="text-lg" min="0" />
            </div>
            <p className={`text-sm ${cardText}`}>Blodtryck mäts i mmHg och anges som övertryck/undertryck</p>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-sm bg-blue-50">
          <p className="text-sm text-foreground"><strong>Tips:</strong> Mät ditt blodtryck samma tid varje dag för mest tillförlitliga resultat. Vila några minuter innan mätning.</p>
        </Card>

        <Button onClick={handleSubmit} disabled={!isValid} className={`${secondaryButton} ${!isValid ? disabledButton : ''}`}>
          Spara
        </Button>
      </div>
    </div>
  );
};

export default HealthMetrics;

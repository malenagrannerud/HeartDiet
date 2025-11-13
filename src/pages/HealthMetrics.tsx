import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { sectionHeading, sectionSubheading, cardText, labelText, headerContainer, secondaryButton, disabledButton, compactCard, pageContainer, pagePadding} from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { healthMetricsSchema, completedActivitiesSchema } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { format } from "date-fns";

const HealthMetrics = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [skipBloodPressure, setSkipBloodPressure] = useState(false);

  useEffect(() => {
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    if (metrics) {
      setWeight(metrics.weight || "");
      setHeight(metrics.height || "");
      setSystolic(metrics.systolic || "");
      setDiastolic(metrics.diastolic || "");
      setSkipBloodPressure(metrics.skipBloodPressure || false);
    }
  }, []);

  const handleSubmit = () => {
    // Save to healthMetrics storage
    const metrics = { 
      weight, 
      height, 
      systolic: skipBloodPressure ? "" : systolic, 
      diastolic: skipBloodPressure ? "" : diastolic, 
      skipBloodPressure,
      date: new Date().toISOString() 
    };
    setStorageItem('healthMetrics', metrics, healthMetricsSchema);
    localStorage.setItem('healthMetricsCompleted', 'true');
    
    // ALSO save to dayLogs storage for the calendar
    const today = new Date();
    const dateStr = format(today, 'yyyy-MM-dd');
    
    // Get existing day logs
    const existingDayLogs = JSON.parse(localStorage.getItem('dayLogs') || '[]');
    
    // Find or create today's log
    let todayLog = existingDayLogs.find((log: any) => log.date === dateStr);
    if (!todayLog) {
      todayLog = { date: dateStr, entries: [] };
      existingDayLogs.push(todayLog);
    }
    
    // Remove any existing weight, height and blood pressure entries for today
    todayLog.entries = todayLog.entries.filter((entry: any) => 
      entry.type !== 'weight' && entry.type !== 'height' && entry.type !== 'bloodPressure'
    );
    
    // Add new entries
    if (weight) {
      todayLog.entries.push({
        type: 'weight',
        value: parseFloat(weight)
      });
    }
    
    if (height) {
      todayLog.entries.push({
        type: 'height',
        value: parseFloat(height)
      });
    }
    
    if (!skipBloodPressure && systolic && diastolic) {
      todayLog.entries.push({
        type: 'bloodPressure',
        value: parseInt(systolic),
        value2: parseInt(diastolic)
      });
    }
    
    // Save back to localStorage
    localStorage.setItem('dayLogs', JSON.stringify(existingDayLogs));
    
    // Original completion tracking
    const activities = getStorageItem('completedActivities', completedActivitiesSchema) || [];
    const activitiesArray = Array.isArray(activities) ? activities : [];
    activitiesArray.push({
      id: 'health-metrics',
      title: skipBloodPressure ? 'Vikt och längd' : 'Vikt, längd och blodtryck',
      completedDate: new Date().toISOString(),
      type: 'health-metrics'
    });
    setStorageItem('completedActivities', activitiesArray, completedActivitiesSchema);
    
    // Mark the card as completed
    markCardCompleted('health-metrics');
    
    navigate('/app/today');
  };

  const handleSkipBloodPressure = () => {
    setSkipBloodPressure(true);
    setSystolic("");
    setDiastolic("");
  };

  const isValid = weight !== "" && height !== "" && (skipBloodPressure || (systolic !== "" && diastolic !== ""));

  return (
    <div className={pageContainer}>
      <div className={headerContainer}>
        <BackToTodayButton />
        <h1 className={sectionHeading}>Vikt och blodtryck</h1>
        <p className={sectionSubheading}>Fyll i dina startvärden här. Du kan uppdatera dem senare under "Mina sidor"</p>
      </div>
    
      <div className={`${pagePadding} space-y-6`}>

        <Card className={compactCard}>
          <div className="space-y-4">
            <Label htmlFor="height" className={labelText}>Hur lång är du (cm)?</Label>
            <Input 
              id="height" 
              type="number" 
              placeholder="T.ex. 175" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              className="text-lg" 
              min="0" 
              max="240"
            />
          </div>
        </Card>

        <Card className={compactCard}>
          <div className="space-y-4">
            <Label htmlFor="weight" className={labelText}>Hur mycket väger du (kg)?</Label>
            <Input 
              id="weight" 
              type="number" 
              placeholder="T.ex. 79.3" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              className="text-lg" 
              step="0.1" 
              min="0" 
            />
          </div>
        </Card>

        <Card className={compactCard}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={labelText}>Blodtryck</h3>
              {!skipBloodPressure && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleSkipBloodPressure}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Fyll i senare
                </Button>
              )}
            </div>
            
            {!skipBloodPressure ? (
              <>
                <div className="space-y-3">
                  <Label htmlFor="systolic" className={labelText}>Övertryck (systoliskt)</Label>
                  <Input 
                    id="systolic" 
                    type="number" 
                    placeholder="T.ex. 120" 
                    value={systolic} 
                    onChange={(e) => setSystolic(e.target.value)} 
                    className="text-lg" 
                    min="0" 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="diastolic" className={labelText}>Undertryck (diastoliskt)</Label>
                  <Input 
                    id="diastolic" 
                    type="number" 
                    placeholder="T.ex. 80" 
                    value={diastolic} 
                    onChange={(e) => setDiastolic(e.target.value)} 
                    className="text-lg" 
                    min="0" 
                  />
                </div>
                <p className={`text-sm ${cardText}`}>Blodtryck mäts i mmHg och anges som övertryck/undertryck</p>
              </>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className={`text-sm ${cardText} text-muted-foreground text-center`}>
                  Du kan lägga till blodtryck senare under "Mina sidor" om du vill.
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-sm bg-blue-50">
          <p className="text-sm text-foreground">
            <strong>Tips:</strong> Mät ditt blodtryck samma tid varje dag för mest tillförlitliga resultat. Vila några minuter innan mätning.
          </p>
        </Card>

        <Button 
          onClick={handleSubmit} 
          disabled={!isValid} 
          className={`${secondaryButton} ${!isValid ? disabledButton : ''}`}
        >
          Spara
        </Button>
      </div>
    </div>
  );
};

export default HealthMetrics;
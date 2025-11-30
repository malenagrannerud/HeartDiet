import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { sectionHeading, sectionSubheading, cardText, labelText, headerContainer, secondaryButton, disabledButton, compactCard, pageContainer, pagePadding, placeholderText, bodyTextBald, bodyText, standardSpacing} from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { healthMetricsSchema, completedActivitiesSchema } from "@/lib/schemas";
import { markCardCompleted } from "@/lib/card-completion";
import { format } from "date-fns";

const HealthMetrics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [height, setHeight] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [goalSystolic, setGoalSystolic] = useState("");
  const [goalDiastolic, setGoalDiastolic] = useState("");
  const [skipBloodPressure, setSkipBloodPressure] = useState(false);
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    const metrics = getStorageItem('healthMetrics', healthMetricsSchema);
    if (metrics) {
      setWeight(metrics.weight || "");
      setGoalWeight(metrics.goalWeight || "");
      setHeight(metrics.height || "");
      setSystolic(metrics.systolic || "");
      setDiastolic(metrics.diastolic || "");
      setGoalSystolic(metrics.goalSystolic || "");
      setGoalDiastolic(metrics.goalDiastolic || "");
      setSkipBloodPressure(metrics.skipBloodPressure || false);
      setHasExistingData(true);
    }
  }, []);

  const handleSubmitClick = () => {
    // Always show preview before saving
    setSaveAlertOpen(true);
  };

  const confirmSubmit = () => {
    // Save to healthMetrics storage
    const metrics = { 
      weight, 
      goalWeight,
      height, 
      systolic: skipBloodPressure ? "" : systolic, 
      diastolic: skipBloodPressure ? "" : diastolic,
      goalSystolic: skipBloodPressure ? "" : goalSystolic,
      goalDiastolic: skipBloodPressure ? "" : goalDiastolic,
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
    
    toast({
      title: "Hälsodata sparad",
      description: skipBloodPressure 
        ? "Vikt och längd har sparats" 
        : "Vikt, längd och blodtryck har sparats",
    });
    
    setSaveAlertOpen(false);
    navigate('/app/today');
  };

  const handleSkipBloodPressure = () => {
    setSkipBloodPressure(true);
    setSystolic("");
    setDiastolic("");
    setGoalSystolic("");
    setGoalDiastolic("");
  };

  const isValid = weight !== "" && height !== "" && (skipBloodPressure || (systolic !== "" && diastolic !== ""));

  return (
    <div className={pageContainer}>
      <div className={headerContainer}>
        <BackToTodayButton />
        <h1 className={sectionHeading}>Vikt och blodtryck</h1>
      </div>
    
      <div className={pagePadding}>
        {/* Main content container with proper spacing */}
        <div className={standardSpacing.pageContent}>
          
          {/* Description section */}
          <section className={standardSpacing.sectionContent}>
            <p className={bodyText}>Fyll i dina startvärden här. Uppdatera dem senare under "Mina sidor"</p>
          </section>

          {/* Form sections with card list spacing */}
          <div className={standardSpacing.cardList}>
            <Card className={compactCard}>
              <div className={standardSpacing.formFields}>
                <Label htmlFor="height" className={labelText}>Hur lång är du (cm)?</Label>
                <Input 
                  id="height" 
                  type="number" 
                  placeholder="Ex: 175" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                  className={placeholderText} 
                  min="100" 
                  max="220"
                />
              </div>
            </Card>

            <Card className={compactCard}>
              <div className={standardSpacing.formFields}>
                <Label htmlFor="weight" className={labelText}>Hur mycket väger du (kg)?</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  placeholder="Ex: 103,3" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  className={placeholderText}
                  step="0.1" 
                  min="30"
                  max="300" 
                />
              </div>
            </Card>

            <Card className={compactCard}>
              <div className={standardSpacing.formFields}>
                <Label htmlFor="goalWeight" className={labelText}>Vad är din målvikt (kg)?</Label>
                <Input 
                  id="goalWeight" 
                  type="number" 
                  placeholder="Ex: 85" 
                  value={goalWeight} 
                  onChange={(e) => setGoalWeight(e.target.value)} 
                  className={placeholderText}
                  step="0.1" 
                  min="30"
                  max="300" 
                />
              </div>
            </Card>

            <Card className={compactCard}>
              <div className={standardSpacing.formFields}>
                <div className="flex items-center justify-between">
                  <h3 className={labelText}>Blodtryck</h3>
                  {!skipBloodPressure && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={handleSkipBloodPressure}
                      className={bodyTextBald}
                    >
                      Fyll i senare
                    </Button>
                  )}
                </div>
                
                {!skipBloodPressure ? (
                  <>
                    <div className={standardSpacing.formFields}>
                      <Label htmlFor="systolic" className={bodyText}>Övertryck (systoliskt)</Label>
                      <Input 
                        id="systolic" 
                        type="number" 
                        placeholder="Ex: 120" 
                        value={systolic} 
                        onChange={(e) => setSystolic(e.target.value)} 
                        className={placeholderText}
                        min="70"
                        max="250" 
                      />
                    </div>

                    <div className={standardSpacing.formFields}>
                      <Label htmlFor="diastolic" className={bodyText}>Undertryck (diastoliskt)</Label>
                      <Input 
                        id="diastolic" 
                        type="number" 
                        placeholder="Ex: 80" 
                        value={diastolic} 
                        onChange={(e) => setDiastolic(e.target.value)} 
                        className={placeholderText}
                        min="40"
                        max="150"
                      />
                    </div>

                    <div className={standardSpacing.formFields}>
                      <Label htmlFor="goalSystolic" className={bodyText}>Målvärde övertryck (systoliskt)</Label>
                      <Input 
                        id="goalSystolic" 
                        type="number" 
                        placeholder="Ex: 120" 
                        value={goalSystolic} 
                        onChange={(e) => setGoalSystolic(e.target.value)} 
                        className={placeholderText}
                        min="70"
                        max="250"
                      />
                    </div>

                    <div className={standardSpacing.formFields}>
                      <Label htmlFor="goalDiastolic" className={bodyText}>Målvärde undertryck (diastoliskt)</Label>
                      <Input 
                        id="goalDiastolic" 
                        type="number" 
                        placeholder="Ex: 80" 
                        value={goalDiastolic} 
                        onChange={(e) => setGoalDiastolic(e.target.value)} 
                        className={placeholderText}
                        min="40"
                        max="150"
                      />
                    </div>
                    <p className={`text-sm ${cardText}`}>Blodtryck mäts i mmHg och anges som övertryck/undertryck</p>
                  </>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className={`text-sm ${cardText} text-muted-foreground text-center`}>
                      Lägga till blodtryck senare under "Mina sidor"
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
          </div>

          {/* Save button section */}
          <section className={standardSpacing.sectionContent}>
            <Button 
              onClick={handleSubmitClick} 
              disabled={!isValid} 
              className={`${secondaryButton} ${!isValid ? disabledButton : ''}`}
            >
              Spara
            </Button>
          </section>

        </div>
      </div>

      <AlertDialog open={saveAlertOpen} onOpenChange={setSaveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bekräfta ändringar</AlertDialogTitle>
            <AlertDialogDescription>
              Granska dina värden innan du sparar:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 space-y-3 rounded-lg bg-muted/50 p-4">
            <div className="flex justify-between items-center">
              <span className={bodyText}>Längd:</span>
              <span className={bodyTextBald}>{height} cm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={bodyText}>Vikt:</span>
              <span className={bodyTextBald}>{weight} kg</span>
            </div>
            {goalWeight && (
              <div className="flex justify-between items-center">
                <span className={bodyText}>Målvikt:</span>
                <span className={bodyTextBald}>{goalWeight} kg</span>
              </div>
            )}
            {!skipBloodPressure && systolic && diastolic && (
              <div className="flex justify-between items-center">
                <span className={bodyText}>Blodtryck:</span>
                <span className={bodyTextBald}>{systolic}/{diastolic} mmHg</span>
              </div>
            )}
            {!skipBloodPressure && goalSystolic && goalDiastolic && (
              <div className="flex justify-between items-center">
                <span className={bodyText}>Målblodtryck:</span>
                <span className={bodyTextBald}>{goalSystolic}/{goalDiastolic} mmHg</span>
              </div>
            )}
            {skipBloodPressure && (
              <div className="flex justify-between items-center">
                <span className={bodyText}>Blodtryck:</span>
                <span className={`${bodyText} text-muted-foreground`}>Ej ifyllt</span>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>
              Spara ändringar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HealthMetrics;
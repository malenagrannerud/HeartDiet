import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { standardCard, cardTitle, bodyText, primaryButton, secondaryButton, standardSpacing, pageContainer, headerContainer } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";

interface BMIData {
  height: string;
  weight: string;
  targetWeight: string;
}

const BMI = () => {
  const navigate = useNavigate();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  useEffect(() => {
    const data = getStorageItem<BMIData>('bmiData');
    if (data) {
      setHeight(data.height || "");
      setWeight(data.weight || "");
      setTargetWeight(data.targetWeight || "");
    }
  }, []);

  const handleSave = () => {
    const data: BMIData = { height, weight, targetWeight };
    setStorageItem('bmiData', data);
    navigate('/app/bp');
  };

  const handleLater = () => {
    navigate('/app/bp');
  };

  const isValid = height !== "" && weight !== "" && targetWeight !== "";

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Kroppsmått</h1>
        <div className="w-10" />
      </header>

      <main className={standardSpacing.pageContent}>
        <section className={standardSpacing.sectionContent}>
          <h2 className={cardTitle}>Längd och vikt</h2>
          <p className={bodyText}>Ange dina mått för att beräkna BMI och sätta viktmål.</p>

          <div className={standardSpacing.cardList}>
            <Card className={standardCard}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Längd (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Ex: 175"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Nuvarande vikt (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Ex: 75.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Målvikt (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    placeholder="Ex: 70.0"
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className={standardSpacing.sectionContent}>
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className={primaryButton}
            >
              Spara
            </Button>
            <Button
              onClick={handleLater}
              variant="ghost"
              className={secondaryButton}
            >
              Senare
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BMI;

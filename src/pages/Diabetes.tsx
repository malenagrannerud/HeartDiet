import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { standardCard, cardTitle, bodyText, primaryButton, secondaryButton, standardSpacing, pageContainer, headerContainer } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";

interface DiabetesData {
  hba1c: string;
  fastingGlucose: string;
}

const Diabetes = () => {
  const navigate = useNavigate();
  const [hba1c, setHba1c] = useState("");
  const [fastingGlucose, setFastingGlucose] = useState("");

  useEffect(() => {
    const data = getStorageItem<DiabetesData>('diabetesData');
    if (data) {
      setHba1c(data.hba1c || "");
      setFastingGlucose(data.fastingGlucose || "");
    }
  }, []);

  const handleSave = () => {
    const data: DiabetesData = { hba1c, fastingGlucose };
    setStorageItem('diabetesData', data);
    navigate('/app/today');
  };

  const handleLater = () => {
    navigate('/app/today');
  };

  const hasValue = hba1c !== "" || fastingGlucose !== "";

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
        <h1 className="text-lg font-semibold text-foreground">Diabetes</h1>
        <div className="w-10" />
      </header>

      <main className={standardSpacing.pageContent}>
        <section className={standardSpacing.sectionContent}>
          <h2 className={cardTitle}>Blodsockervärden</h2>
          <p className={bodyText}>Ange dina blodsockervärden. Målvärde för HbA1c är vanligtvis under 52 mmol/mol.</p>

          <div className={standardSpacing.cardList}>
            <Card className={standardCard}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hba1c">HbA1c (mmol/mol eller %)</Label>
                  <Input
                    id="hba1c"
                    type="text"
                    value={hba1c}
                    onChange={(e) => setHba1c(e.target.value)}
                    placeholder="Ex: 48 eller 6.5%"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      eller
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fastingGlucose">Fasteblodsocker (mmol/L)</Label>
                  <Input
                    id="fastingGlucose"
                    type="number"
                    step="0.1"
                    value={fastingGlucose}
                    onChange={(e) => setFastingGlucose(e.target.value)}
                    placeholder="Ex: 5.6"
                  />
                </div>

                <p className={`${bodyText} text-muted-foreground text-sm`}>
                  Fyll i det värde du känner till. Du behöver inte ha båda.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className={standardSpacing.sectionContent}>
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={!hasValue}
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

export default Diabetes;

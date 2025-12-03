import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { standardCard, cardTitle, bodyText, primaryButton, secondaryButton, standardSpacing, pageContainer, headerContainer } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";

interface BPData {
  systolic: string;
  diastolic: string;
}

const BP = () => {
  const navigate = useNavigate();
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  useEffect(() => {
    const data = getStorageItem<BPData>('bpData');
    if (data) {
      setSystolic(data.systolic || "");
      setDiastolic(data.diastolic || "");
    }
  }, []);

  const handleSave = () => {
    const data: BPData = { systolic, diastolic };
    setStorageItem('bpData', data);
    navigate('/app/cholesterol');
  };

  const handleLater = () => {
    navigate('/app/cholesterol');
  };

  const isValid = systolic !== "" && diastolic !== "";

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
        <h1 className="text-lg font-semibold text-foreground">Blodtryck</h1>
        <div className="w-10" />
      </header>

      <main className={standardSpacing.pageContent}>
        <section className={standardSpacing.sectionContent}>
          <h2 className={cardTitle}>Ditt blodtryck</h2>
          <p className={bodyText}>Ange ditt senaste blodtrycksvärde. Hälsosamt mål är under 120/80 mmHg.</p>

          <div className={standardSpacing.cardList}>
            <Card className={standardCard}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systolic">Systoliskt (övre)</Label>
                    <Input
                      id="systolic"
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      placeholder="120"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diastolic">Diastoliskt (nedre)</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      placeholder="80"
                    />
                  </div>
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

export default BP;

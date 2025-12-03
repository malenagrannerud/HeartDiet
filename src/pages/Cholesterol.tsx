import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { standardCard, cardTitle, bodyText, primaryButton, secondaryButton, standardSpacing, pageContainer, headerContainer } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";

interface CholesterolData {
  ldl: string;
  hdl: string;
  triglycerides: string;
}

const Cholesterol = () => {
  const navigate = useNavigate();
  const [ldl, setLdl] = useState("");
  const [hdl, setHdl] = useState("");
  const [triglycerides, setTriglycerides] = useState("");

  useEffect(() => {
    const data = getStorageItem<CholesterolData>('cholesterolData');
    if (data) {
      setLdl(data.ldl || "");
      setHdl(data.hdl || "");
      setTriglycerides(data.triglycerides || "");
    }
  }, []);

  const handleSave = () => {
    const data: CholesterolData = { ldl, hdl, triglycerides };
    setStorageItem('cholesterolData', data);
    navigate('/app/diabetes');
  };

  const handleLater = () => {
    navigate('/app/diabetes');
  };

  const hasValue = ldl !== "" || hdl !== "" || triglycerides !== "";

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
        <h1 className="text-lg font-semibold text-foreground">Blodfetter</h1>
        <div className="w-10" />
      </header>

      <main className={standardSpacing.pageContent}>
        <section className={standardSpacing.sectionContent}>
          <h2 className={cardTitle}>Kolesterolvärden</h2>
          <p className={bodyText}>Ange dina blodfettsvärden. Fyll i de värden du känner till.</p>

          <div className={standardSpacing.cardList}>
            <Card className={standardCard}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ldl">LDL-kolesterol (mmol/L)</Label>
                  <Input
                    id="ldl"
                    type="number"
                    step="0.1"
                    value={ldl}
                    onChange={(e) => setLdl(e.target.value)}
                    placeholder="Ex: 3.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hdl">HDL-kolesterol (mmol/L)</Label>
                  <Input
                    id="hdl"
                    type="number"
                    step="0.1"
                    value={hdl}
                    onChange={(e) => setHdl(e.target.value)}
                    placeholder="Ex: 1.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="triglycerides">Triglycerider (mmol/L)</Label>
                  <Input
                    id="triglycerides"
                    type="number"
                    step="0.1"
                    value={triglycerides}
                    onChange={(e) => setTriglycerides(e.target.value)}
                    placeholder="Ex: 1.7"
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

export default Cholesterol;

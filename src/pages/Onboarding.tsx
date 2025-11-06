import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { pageContainer, pagePadding, pageTitle, sectionHeading, standardSpacing } from "@/lib/design-tokens";
import welcomeIllustration from "@/assets/welcome-illustration.png";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete();
      navigate("/app/today");
    }
  };

  const handleBack = () => setStep(step - 1);

  const features = [
    "Tio evidensbaserade tips för ett starkare hjärta",
    "Välj vilka tips du vill implementera varje vecka",
    "Upplev effekterna av en näringsriktig diet utan orimliga tvång",
    "Få stöd under resan. Om något tips är svårt att implementera hjälper vi dej att anpassa stegen"
  ];

  return (
    <div className={pageContainer}>
      <div className={pagePadding}>
        {step === 1 && (
          <>
            <div className="text-center mb-8">
              <h1 className={pageTitle}>Hjärtkost</h1>
              <p className={sectionHeading}>
                Ditt individanpassade program för en hjärt-vänlig kosthållning
              </p>
            </div>
            <div className={standardSpacing.pageContent}>
              <img 
                src={welcomeIllustration} 
                alt="Welcome illustration" 
                className="w-full h-64 object-contain"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-8">
              <h1 className={pageTitle}>Hjärtkost</h1>
            </div>
            <ul className={standardSpacing.sectionContent}>
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-4 mb-4">
                  <span className={`${sectionHeading} mt-0.5`}>•</span>
                  <span className={sectionHeading}>{feature}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Navigation dots */}
      <div className="flex gap-2 mb-6 justify-center">
        {[1, 2].map((dot) => (
          <button
            key={dot}
            onClick={() => setStep(dot)}
            className={`h-2 rounded-full transition-all ${
              step === dot ? "w-8 bg-primary" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="w-full px-6">
        {step === 1 ? (
          <Button onClick={handleNext} className="w-2/3 h-12 text-base" size="lg">
            Nästa
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1 h-12" size="lg">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Tillbaka
            </Button>
            <Button onClick={handleNext} className="flex-1 h-12 text-base" size="lg">
              Börja nu
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
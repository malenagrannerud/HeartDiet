import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { sectionHeading, backButton, pageContainer, headerContainer, pagePadding, pageTitle, pageSubtitle, bodyText, standardSpacing} from "@/lib/design-tokens";
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

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className={pageContainer}>
      {step === 1 && (
        <> 
          <div className={pagePadding}>
            <h1 className={pageTitle}>Hjärtkost</h1>
              <p className={sectionHeading }>
                Ditt individanpassade program för en hjärt-vänlig kosthållning
              </p>
            <div className={standardSpacing.pageContent}>
              <img 
                src={welcomeIllustration} 
                alt="Welcome illustration" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </>
      )} 

      {step === 2 && (
        <>
          <div className={pagePadding}>
            <h1 className={pageTitle}>Hjärtkost</h1>
            
            <ul className={standardSpacing.sectionContent}>
              <li className="flex gap-6">
                <span className={sectionHeading}>•</span>
                <span className={sectionHeading}>Tio evidensbaserade tips för ett starkare hjärta</span>
              </li>
              <li className="flex gap-3">
                <span className={sectionHeading}>•</span>
                <span className={sectionHeading}>Välj vilka tips du vill implementera varje vecka</span>
              </li>
              <li className="flex gap-3">
                <span className={sectionHeading}>•</span>
                <span className={sectionHeading}>Upplev effekterna av en näringsriktig diet utan orimliga tvång</span>
              </li>
              <li className="flex gap-3">
                <span className={sectionHeading}>•</span>
                <span className={sectionHeading}>Få stöd under resan. Om något tips är svårt att implementera hjälper vi dej att anpassa stegen</span>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Navigation dots */}
      <div className="flex gap-2 mb-6 justify-center w-full">
        {[1, 2].map((dot) => (
          <button
            key={dot}
            onClick={() => setStep(dot)}
            className={`h-2 rounded-full transition-all ${
              step === dot ? "w-8 bg-primary" : "w-2 bg-muted"
            }`}
            aria-label={`Go to step ${dot}`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      {step === 1 ? (
        <div className="w-full flex justify-center">
          <Button 
            onClick={handleNext}
            className="w-2/3 h-12 text-base bg-primary hover:bg-primary/90"
            size="lg"
          >
            Nästa
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="w-full flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 max-w-[45%] h-12"
            size="lg"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Tillbaka
          </Button>
          
          <Button 
            onClick={handleNext}
            className="flex-1 max-w-[45%] h-12 text-base bg-primary hover:bg-primary/90"
            size="lg"
          >
            Börja nu
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
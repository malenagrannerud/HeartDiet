import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, BookOpen, TrendingUp, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import fruitsImage from "@/assets/fruits-illustration.jpg";
import { pageTitle, pageSubtitle, cardTitle, cardText, standardCard, backButton, primaryButton, pageContainer, pagePadding, sectionHeading, sectionSubheading, heading, bodyText, arrowBack, headerContainer, standardSpacing } from "@/lib/design-tokens";

const Tutorial = () => {
  const navigate = useNavigate();

  return (
    /* STANDARDIZATION: Page uses pageContainer for consistent layout */
    <div className={pageContainer}>
      {/* STANDARDIZATION: Header uses headerContainer with white background */}
     <header className={headerContainer}>
    {/* STANDARDIZATION: backButton for icon-only back arrow */}
      <button
        onClick={() => navigate('/app/today')}
        className={arrowBack}
        aria-label="Gå tillbaka"
      >
      <ArrowLeft size={28} />
      </button>
      {/* STANDARDIZATION: Title uses sectionHeading, subtitle uses sectionSubheading */}
      <h1 className={sectionHeading}>Så fungerar appen</h1>
      <p className={sectionSubheading}>En guide för dig</p>
      </header>

      {/* STANDARDIZATION: Content uses pagePadding and standardSpacing */}
      <div className={`${pagePadding} ${standardSpacing.pageContent}`}>
        {/* Introduction */}
        <div className={standardSpacing.sectionContent}>
          <p className={bodyText}>
            Välkommen! Den här appen är skapad för att hjälpa dig ta hand om din hälsa på ett enkelt sätt. 
            Du bestämmer själv tempot - allt går att göra i din egen takt.
          </p>
        </div>

        {/* STANDARDIZATION: Cards use standardCard token */}
        {/* Section 1: Today */}
        <Card className={standardCard}>
          <div className="flex items-start gap-5">
            <div className="bg-green-100 p-4 rounded-full flex-shrink-0">
              <Home className="w-8 h-8 text-green-700" />
            </div>
            <div className={standardSpacing.sectionContent}>
              {/* STANDARDIZATION: Text uses heading and bodyText */}
              <h2 className={heading}>Idag-sidan</h2>
              <p className={bodyText}>
                När du öppnar appen hamnar du på "Idag". Här ser du dina valda hälsotips och kan 
                följa stegen i din egen takt. Du behöver inte göra allt på en gång - ta det lugnt och 
                börja med det som känns rätt för dig.
              </p>
              <div className="bg-[#FCFAF7] p-5 rounded-lg border-2 border-border">
                <p className={bodyText}>
                  💡 Tips: Börja med att välja ett eller två tips att fokusera på denna vecka.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 2: Tips */}
        <Card className={standardCard}>
          <div className="flex items-start gap-5">
            <div className="bg-blue-100 p-4 rounded-full flex-shrink-0">
              <BookOpen className="w-8 h-8 text-blue-700" />
            </div>
            <div className={standardSpacing.sectionContent}>
              <h2 className={heading}>Tips-sidan</h2>
              <p className={bodyText}>
                Under "Tips" hittar du alla hälsoråd. Klicka på ett tips för att läsa mer. 
                När du hittar något som passar dig, tryck på bocken så hamnar tipset under 
                "Mina valda tips" på Idag-sidan.
              </p>
              <p className={bodyText}>
                Du kan välja så många eller så få tips du vill. Det viktiga är att du väljer 
                sådant som känns hanterbart för just dig.
              </p>
            </div>
          </div>
        </Card>

        {/* Section 3: Progress */}
        <Card className={standardCard}>
          <div className="flex items-start gap-5">
            <div className="bg-purple-100 p-4 rounded-full flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-purple-700" />
            </div>
            <div className={standardSpacing.sectionContent}>
              <h2 className={heading}>Framsteg-sidan</h2>
              <p className={bodyText}>
                Här kan du följa din utveckling över tid. Du ser en kalender där du kan 
                klicka på ett datum för att registrera blodtryck och vikt. 
              </p>
              <p className={bodyText}>
                Små färgade rutor visar vilka tips du har följt. Ett litet hjärta ♥ betyder 
                att du har registrerat blodtryck, och en vågsymbol ⚖ betyder att du har registrerat din vikt.
              </p>
              <div className="bg-[#FCFAF7] p-5 rounded-lg border-2 border-border">
                <p className={bodyText}>
                  💡 Tips: Du behöver inte fylla i något varje dag. Gör det när det passar dig.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 4: Help */}
        <Card className={standardCard}>
          <div className="flex items-start gap-5">
            <div className="bg-orange-100 p-4 rounded-full flex-shrink-0">
              <HelpCircle className="w-8 h-8 text-orange-700" />
            </div>
            <div className={standardSpacing.sectionContent}>
              <h2 className={heading}>Hjälp-sidan</h2>
              <p className={bodyText}>
                Om du någonsin undrar över något, finns det en hjälp-sida längst ner i menyn. 
                Där hittar du svar på vanliga frågor.
              </p>
            </div>
          </div>
        </Card>

        {/* Encouragement */}
        <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200">
          <h3 className={heading}>Du klarar det här!</h3>
          <p className={bodyText}>
            Kom ihåg att varje litet steg räknas. Det spelar ingen roll hur långsamt du går, 
            det viktiga är att du har börjat. Ta dig tid, var snäll mot dig själv, och gör 
            så gott du kan.
          </p>
          <p className={bodyText}>
            Appen finns här när du behöver den, och allt du gör är i din egen takt.
          </p>
        </div>

        {/* STANDARDIZATION: Button uses primaryButton token */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={() => {
              localStorage.setItem('tutorialCompleted', 'true');
              
              // Add to completed activities - KEPT THIS CODE
              const completedActivities = JSON.parse(localStorage.getItem('completedActivities') || '[]');
              completedActivities.push({
                id: 'tutorial',
                title: 'Så fungerar appen',
                completedDate: new Date().toISOString(),
                type: 'tutorial'
              });
              localStorage.setItem('completedActivities', JSON.stringify(completedActivities));
              
              navigate('/app/today');
            }}
            className={primaryButton}
            aria-label="Kom igång med appen"
          >
            Kom igång
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, TrendingUp, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { sectionHeading, sectionSubheading, sectionHeading2, cardTitle, cardText, standardCard, primaryButton, pageContainer, standardSpacing, headerContainer, pagePadding, bodyTextBald, bodyText } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { CompleteCardButton } from "@/components/CompleteCardButton";

const Tutorial = () => {
  const navigate = useNavigate();

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <BackToTodayButton/>
          <h1 className={sectionHeading}>Så fungerar appen</h1>
      </header>
     
      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <section className={standardSpacing.sectionContent}>
            <p className={sectionSubheading}>
            Läs om hur du använder appen. Du kan när du vill läsa igen under "Mina sidor - Inställningar"
            </p>
          </section>

          <section className={standardSpacing.sectionContent}>
            <Card className={standardCard}>
              <div className="flex items-start gap-5">
                <div className="bg-green-100 p-4 rounded-full flex-shrink-0">
                  <Home className="w-8 h-8 text-green-700" />
                </div>
                <div className="space-y-4">
                  <h2 className={sectionHeading2}>Idag</h2>
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
          </section>

          <section>
            <Card className={standardCard}>
              <div className="flex items-start gap-5">
                <div className="bg-blue-100 p-4 rounded-full flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-blue-700" />
                </div>
                <div className="space-y-4">
                  <h2 className={sectionHeading2}>Tips-sidan</h2>
                  <p className={bodyText}>
                    Under "Tips" hittar du alla hälsoråd. Klicka på ett tips för att läsa mer. 
                    När du hittar något som passar dig, tryck på bocken så hamnar tipset under 
                    "Mina valda tips" på Idag-sidan.
                  </p>
                  <p className={`${cardText} text-lg`}>
                    Du kan välja så många eller så få tips du vill. Det viktiga är att du väljer 
                    sådant som känns hanterbart för just dig.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <section>
            <Card className={standardCard}>
              <div className="flex items-start gap-5">
                <div className="bg-purple-100 p-4 rounded-full flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-purple-700" />
                </div>
                <div className="space-y-4">
                  <h2 className={sectionHeading2}>Framsteg-sidan</h2>
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
          </section>

          <section>
            <Card className={standardCard}>
              <div className="flex items-start gap-5">
                <div className="bg-orange-100 p-4 rounded-full flex-shrink-0">
                  <HelpCircle className="w-8 h-8 text-orange-700" />
                </div>
                <div className="space-y-4">
                  <h2 className={sectionHeading2}>Hjälp-sidan</h2>
                  <p className={bodyText}>
                    Om du någonsin undrar över något, finns det en hjälp-sida längst ner i menyn. 
                    Där hittar du svar på vanliga frågor.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <section>
            <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200">
              <h3 className={`${cardTitle} text-2xl mb-4`}>Du klarar det här!</h3>
              <p className={bodyText}>
                Kom ihåg att varje litet steg räknas. Det spelar ingen roll hur långsamt du går, 
                det viktiga är att du har börjat. Ta dig tid, var snäll mot dig själv, och gör 
                så gott du kan.
              </p>
              <p className={bodyText}>
                Appen finns här när du behöver den, och allt du gör är i din egen takt.
              </p>
            </div>
          </section>

          <section>       
            <CompleteCardButton 
              cardId="tutorial"
              className={`${primaryButton} w-full`}
            >
              Kom igång
            </CompleteCardButton>
          </section>
          
        </div>
      </main>
    </div>
  );
};

export default Tutorial;

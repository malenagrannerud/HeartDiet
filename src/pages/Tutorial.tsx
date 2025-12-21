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
            Läs om hur du använder appen. Du kan när du vill läsa igen under "Hjälp"
            </p>
          </section>



          <section className={standardSpacing.sectionContent}>
            <Card className={standardCard}>
              <div className="flex items-start gap-5">
                <div className="bg-green-100 p-4 rounded-full flex-shrink-0">
                </div>
                <div className="space-y-4">
                  <h2 className={sectionHeading2}> Mål med appen - att äta enligt "Nya nordiska dieten"</h2>
                  <p className={bodyText}>
                    Välkommen till HjärtKost! Målet med appen är att hjälpa användaren att äta enligt den "Nya nordiska dieten",
                    en vetetnskapligt bevisad diet som minskar risken för många livsstilsrelaterade sjukdomar drastiskt.

                    Den liknar Medelhavsdieten, men fokuserar på lokalt odlade och traditionella nordiska livsmedel 
                    för ett miljövänligare livsmedelsmönster. Till exempel ingår: 

                    <DottedList items={[
                      "Grönsaker och rotfrukter: Kål, morötter, potatis, baljväxter (ärtor, bönor).",
                      "Frukt och bär: Äpplen, päron, blåbär, lingon.",
                      "Fullkorn: Råg, havre, korn.", 
                      "Fettkällor: Rapsolja, fet fisk (lax, strömming), nötter.",
                      "Protein: Fågel, ägg, fisk, magra mejeriprodukter och bajlväxter.",
                      "Andra: Skogssvamp, färska kryddor, sjögräs, skaldjur, fermenterad mat. ",
                    ]} />
                   
                    Den Nya nordiska kosten implementeras genom att användaren väljer tips att försöka implementera 
                    varje vecka. Till exempel: 
                    <DottedList items={[
                      "Vecka ett väljer jag tipset "Fem nävar frukt och grönt" varje dag. Jag planerar och utvärderar hur det går", 
                      "Vecka två forsätter jag med "Fem nävar frukt och grönt". Jag lägger även till ett tips, "Rätt fett" ", 
                      "Vecka tre lägger jag till två nya tips... ", 
                      "Flera av tipsen följer jag redan, dom kryssar jag bara i", 
                     ]} />

                    TIPS: I början kan du till exempel följa tipsen under veckorna, men skippa det under helgen.
     
        
                    Fördelar <br /><br />
                    Hjärt- och kärlhälsa: Sänker kolesterol och blodtryck.<br /><br />
                    Blodfetter och blodsocker: Förbättrar insulinkänslighet och blodsocker, särskilt för personer med typ 2-diabetes. <br /><br />
                    Viktkontroll: Kan bidra till viktminskning. <br /><br />
                    Hållbarhet: Bygger på lokala och säsongsbetonade råvaror. <br /><br />

                    Vad bör undvikas?
                    Processad mat.
                    Godis och chips.
                    Högt fettinnehåll i kött som bacon och korv. 

                    
                  </p>
                  
                </div>
              </div>
            </Card>
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
                <div className="bg-purple-100 p-4 rounded-full flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-purple-700" />
                </div>
                <div className="space-y-4">
                  <h2 className={sectionHeading2}>Framsteg-sidan</h2>
                  <p className={bodyText}>
                    Här kan du följa din utveckling över tid. 
                    
                    Du ser en kalender med alla olika råd och hälsodata att fylla i. 
                    Klicka på ett råd för att logga det som "klarat" för dagen.
                  </p>
                  <p className={bodyText}>
                    Små färgade rutor visar vilka tips du har följt. Ett litet hjärta ♥ betyder 
                    att du har registrerat blodtryck, och en vågsymbol ⚖ betyder att du har registrerat din vikt.
                  </p>
                  <div className="bg-[#FCFAF7] p-5 rounded-lg border-2 border-border">
                    <p className={bodyText}>
                     // 💡 Tips: Du behöver inte fylla i något varje dag. Gör det när det passar dig.
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
                    *UNDER KONSTRUKTION*
                    Här hittar du svar på vanliga frågor.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          <section>
            <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200">
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
              Fortsätt
            </CompleteCardButton>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Tutorial;

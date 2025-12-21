
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { sectionHeading, sectionSubheading, cardTitle, cardText, standardCard, primaryButton, pageContainer, standardSpacing, headerContainer, pagePadding, bodyTextBald, bodyText } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { CompleteCardButton } from "@/components/CompleteCardButton";
import DottedList from "@/components/DottedList";

import iconImage from "@/assets/icon.png";

import todayImage from "@/assets/tutidag.png";
import tipsImage from "@/assets/tuttips.png";
import progressImage from "@/assets/tutmina_sidor.png";

const Tutorial = () => {
  const navigate = useNavigate();
  const sectionHeadingStyle = "font-bold text-[16px] text-[#8B4513] mb-4";

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

          {/* MÅL SECTION */}
          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Text content */}
              <div className="md:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Mål med appen</h2>
                <p className={bodyText}>
                  Välkommen till HjärtKost! 
                </p>

                <<p className={bodyText}> 
                Målet med appen är att hjälpa användaren att äta enligt den "Nya nordiska dieten",
                en vetetnskapligt bevisad diet som minskar risken för många livsstilsrelaterade sjukdomar drastiskt.
              </p>
              <p className={bodyText}>
                Nya nordiska dieten liknar Medelhavsdieten, men fokuserar på lokalt odlade livsmedel 
                för ett miljövänligare matmönster. Till exempel ingår:
              </p>

                <DottedList items={[
                  "Grönsaker och rotfrukter",
                  "Frukt och bär",
                  "Fullkorn", 
                  "Rapsolja",
                  "Lax, magra mejeriprodukter och bajlväxter",
                  "Skogssvamp, färska kryddor, sjögräs, skaldjur, fermenterad mat",
                ]} />


                <div className="bg-[#FCFAF7] p-5 rounded-lg border-2 border-border flex items-start gap-3">
                  <img 
                    src={iconImage} 
                    alt="Tips icon" 
                    className="w-6 h-6 flex-shrink-0"
                  />
                  <p className={bodyText}>
                    Att implementera nya matvanor görs i små steg. Det ska vara roligt och gott, inte ett tvång!
                  </p>
                </div>
              </div>
              
              {/* Image placeholder - Add an image for this section if you have one */}
              <div className="md:w-1/3 flex items-start justify-center">
                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg w-full max-w-[200px] h-[350px] flex items-center justify-center">
                  <span className="text-gray-400">Mål screenshot</span>
                </div>
              </div>
            </div>
          </section>

          {/* IDAG SECTION */}
          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Text content */}
              <div className="md:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Idag</h2>
                <p className={bodyText}>
                  När du öppnar appen hamnar du på "Idag". Här ser du dina valda hälsotips och kan 
                  följa stegen i din egen takt. Du behöver inte göra allt på en gång - ta det lugnt och 
                  börja med det som känms rätt för dig.
                </p>
                <div className="bg-[#FCFAF7] p-5 rounded-lg border-2 border-border flex items-start gap-3">
                  <img 
                    src={iconImage} 
                    alt="Tips icon" 
                    className="w-6 h-6 flex-shrink-0"
                  />
                  <p className={bodyText}>
                    Tips: Börja med att välja ett eller två tips att fokusera på denna vecka.
                  </p>
                </div>
              </div>
              
              {/* Screenshot image */}
              <div className="md:w-1/3 flex items-start justify-center">
                <img 
                  src={todayImage} 
                  alt="Today screen screenshot" 
                  className="w-full max-w-[200px] h-auto border-2 border-gray-300 rounded-lg shadow-md"
                />
              </div>
            </div>
          </section>

          {/* TIPS-SIDAN SECTION */}
          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Text content */}
              <div className="md:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Tips-sidan</h2>
                <p className={bodyText}>
                  Under "Tips" hittar du alla hälsoråd. Klicka på ett tips för att läsa mer. 
                  När du hittar något som passar dig, tryck på bocken så hamnar tipset under 
                  "Mina valda tips" på Idag-sidan.
                </p>
                <div className="bg-[#FCFAF7] p-5 rounded-lg border-2 border-border flex items-start gap-3">
                  <img 
                    src={iconImage} 
                    alt="Tips icon" 
                    className="w-6 h-6 flex-shrink-0"
                  />
                  <p className={bodyText}>
                    Tips: Börja med att välja ett eller två tips att fokusera på denna vecka.
                  </p>
                </div>
              </div>
              
              {/* Screenshot image */}
              <div className="md:w-1/3 flex items-start justify-center">
                <img 
                  src={tipsImage} 
                  alt="Tips screen screenshot" 
                  className="w-full max-w-[200px] h-auto border-2 border-gray-300 rounded-lg shadow-md"
                />
              </div>
            </div>
          </section>

          {/* FRAMSTEG-SIDAN SECTION */}
          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Text content */}
              <div className="md:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Framsteg-sidan</h2>
                <p className={bodyText}>
                  Här kan du följa din utveckling över tid. 
                  
                  Du ser en kalender med alla olika råd och hälsodata att fylla i. 
                  Klicka på ett råd för att logga det som "klarat" för dagen.
                </p>
                <p className={bodyText}>
                  Små färgade rutor visar vilka tips du har följt. Ett litet hjärta ♥ betyder 
                  att du har registrerat blodtryck, och en vågsymbol ⚖ betyder att du har registrerat din vikt.
                </p>
                
                <div className="bg-[#FCFAF7] p-5 rounded-lg border-2 border-border flex items-start gap-3">
                  <img 
                    src={iconImage} 
                    alt="Tips icon" 
                    className="w-6 h-6 flex-shrink-0"
                  />
                  <p className={bodyText}>
                    Tips: Du behöver inte fylla i något varje dag. Gör det när det passar dig.
                  </p>
                </div>
              </div>
              
              {/* Screenshot image */}
              <div className="md:w-1/3 flex items-start justify-center">
                <img 
                  src={progressImage} 
                  alt="Progress screen screenshot" 
                  className="w-full max-w-[200px] h-auto border-2 border-gray-300 rounded-lg shadow-md"
                />
              </div>
            </div>
          </section>

          {/* HJÄLP SECTION */}
          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Text content */}
              <div className="md:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Hjälp</h2>
                <p className={bodyText}>
                  Läs om hur appen fungerar.
                </p>
              </div>
              
              {/* Image placeholder - Add an image for this section if you have one */}
              <div className="md:w-1/3 flex items-start justify-center">
                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg w-full max-w-[200px] h-[350px] flex items-center justify-center">
                  <span className="text-gray-400">Hjälp screenshot</span>
                </div>
              </div>
            </div>
          </section>

          {/* ENCOURAGEMENT SECTION */}
          <section className={standardSpacing.sectionContent}>
            <div className="bg-[#FCFAF7] p-5 rounded-lg border-2 border-border flex items-start gap-3">
              <img 
                src={iconImage} 
                alt="Tips icon" 
                className="w-6 h-6 flex-shrink-0"
              />
              <p className={bodyText}>
                Varje litet steg räknas. Det spelar ingen roll hur långsamt det går, 
                det viktiga är att du har börjat. Ta dig tid, var snäll mot dig själv, och gör 
                så gott du kan.
              </p>
            </div>
          </section>

          {/* BUTTON SECTION */}
          <section className={standardSpacing.sectionContent}>
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


















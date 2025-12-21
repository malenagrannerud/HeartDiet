import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { sectionHeading, sectionSubheading, cardTitle, cardText, standardCard, primaryButton, pageContainer, standardSpacing, headerContainer, pagePadding, bodyTextBald, bodyText } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { CompleteCardButton } from "@/components/CompleteCardButton";
import DottedList from "@/components/DottedList";
import CardHeart from "@/components/CardHeart";
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
            Läs om appen igen under "Hjälp"
            </p>
          </section>

          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col sm:flex-row gap-1">
              <div className="sm:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Mål med appen</h2>
              
                <p className={bodyText}> 
                Välkommen till HjärtKost! Målet med appen är att hjälpa användaren att äta enligt den "Nya nordiska dieten",
                en vetetnskapligt bevisad diet som minskar risken för många livsstilsrelaterade sjukdomar drastiskt.
              </p>
              <p className={bodyText}>
                Dieten liknar Medelhavsdieten, men fokuserar på lokalt odlade livsmedel 
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

                <CardHeart>
                  Att implementera nya matvanor görs i små steg. Det ska vara roligt och gott!
                </CardHeart>
              </div>
            </div>
          </section>

          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col sm:flex-row gap-1">
              <div className="sm:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Idag</h2>
                <p className={bodyText}>
                  När du öppnar appen hamnar du på "Idag". 
                  Här ser du vad du ska göra för dagen. 
                  Det kan vara att fylla i ett formulär eller läsa en artikel.

                  
                  
                </p>
                
                <CardHeart>
                  Följ stegen i din egen takt. Du behöver inte göra klart allt under en dag, de sparas.  
                </CardHeart>
              </div>
              
              <div className="sm:w-1/3 flex items-start justify-center sm:justify-end">
                <img 
                  src={todayImage} 
                  alt="Today screen screenshot" 
                  className="w-full max-w-[140px] sm:max-w-[160px] h-auto border-2 border-gray-300 rounded-lg shadow-md"
                />
              </div>
            </div>
          </section>

          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col sm:flex-row gap-1">
              <div className="sm:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Mina tips</h2>
                <p className={bodyText}>
                  Här hittar du alla hälsoråd. Klicka på ett tips för att läsa mer, 
                  eller skapa en plan för hur du vill impementera just detta tips. 
                  När du hittar något som passar dig, tryck på bocken så hamnar tipset under 
                  "Mina valda tips" på Idag-sidan.
                  Du kan checka av tipset om du har uppnåt det.
                </p>
                
                <CardHeart>
                  Börja med att välja ett eller två tips att fokusera på varje vecka.
                </CardHeart>
              </div>
              
              <div className="sm:w-1/3 flex items-start justify-center sm:justify-end">
                <img 
                  src={tipsImage} 
                  alt="Tips screen screenshot" 
                  className="w-full max-w-[140px] sm:max-w-[160px] h-auto border-2 border-gray-300 rounded-lg shadow-md"
                />
              </div>
            </div>
          </section>

          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col sm:flex-row gap-1">
              <div className="sm:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Mina sidor</h2>
                <p className={bodyText}>
                  Här kan du följa din utveckling över tid. 
                  
                  Du ser en kalender med alla tips. När ett tips är klarat, klicka i rutan. 
                  
                </p>
             
                
                <CardHeart>
                  Tips: Du behöver inte fylla i något varje dag. Gör det när det passar dig.
                </CardHeart>
              </div>
              
              {/* Screenshot image */}
              <div className="sm:w-1/3 flex items-start justify-center sm:justify-end">
                <img 
                  src={progressImage} 
                  alt="Progress screen screenshot" 
                  className="w-full max-w-[140px] sm:max-w-[160px] h-auto border-2 border-gray-300 rounded-lg shadow-md"
                />
              </div>
            </div>
          </section>

          {/* HJÄLP SECTION */}
          <section className={standardSpacing.sectionContent}>
            <div className="flex flex-col sm:flex-row gap-1">
              {/* Text content */}
              <div className="sm:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Hjälp</h2>
                <p className={bodyText}>
                  Läs om hur appen fungerar.
                </p>
              </div>
              
              {/* Image placeholder */}
              <div className="sm:w-1/3 flex items-start justify-center sm:justify-end">
                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg w-full max-w-[140px] sm:max-w-[160px] h-[250px] sm:h-[300px] flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Hjälp</span>
                </div>
              </div>
            </div>
          </section>

          {/* ENCOURAGEMENT SECTION */}
          <section className={standardSpacing.sectionContent}>
            {/* CardHeart component */}
            <CardHeart>
              Varje litet steg räknas. Det spelar ingen roll hur långsamt det går, 
              det viktiga är att du har börjat. Ta dig tid, var snäll mot dig själv, och gör 
              så gott du kan.
            </CardHeart>
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

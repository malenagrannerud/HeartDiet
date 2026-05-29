import { useNavigate } from "react-router-dom";
import { sectionHeading, sectionSubheading, cardTitle, cardText, standardCard, primaryButton, pageContainer, standardSpacing, headerContainer, pagePadding, bodyTextBald, bodyText, pageSubtitle } from "@/lib/design-tokens";import { BackToTodayButton } from "@/components/BackToTodayButton";
import { CompleteCardButton } from "@/components/CompleteCardButton";
import DottedList from "@/components/DottedList";
import CardHeart from "@/components/CardHeart";


const Tutorial = () => {
  const navigate = useNavigate();
  const sectionHeadingStyle = "font-bold text-[16px] text-[#DC143C] mb-4";

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <BackToTodayButton/>
        <h1 className={`${sectionHeading} text-red-700 mb-6`}>Så fungerar HjärtKost</h1>
        <p className={pageSubtitle}>
          Här får du lära dig om målen med appen HjärtKost och de viktigaste stegen. Det finns också videoinformation om hjärt-vänlig kost från forskare bakom medelhavsdieten. Informationen är även för dig som är närstående.
        </p>      
      </header>
     
      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>


          
           {/* MENY  */}
          
            <section className={standardSpacing.sectionContent`}>
              <h2 className="text-lg font-bold text-black mb-4">
                Innehåll - Så fungerar HjärtKost
              </h2>
              
              <ul className="space-y-0 mt-0">
                {[
                  { label: 'Målen med HjärtKost', section: 'mal' },
                  { label: 'HjärtKost - de viktigaste stegen', section: 'steg' },
                  { label: 'Videoinformation om medelhavsdieten på YouTube', section: 'video' },
                ].map(({ label, section }) => (
                  <li key={section}>
                    <button
                      onClick={() => scrollToSection(section)}
                      className="text-left w-full py-1 text-red-800 font-bold"
                    >
                      → {label}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          
            {/* MENY- END  */}

          {/* MÅLEN MED HJÄRTKOST - With border */}
          <section id="mal" className="mb-8 border border-gray-300 p-6">
            <div className="flex flex-col sm:flex-row gap-1">
              <div className="sm:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Målen med HjärtKost</h2>
              
                <p className={bodyText}> 
                  Målet med appen är att äta enligt medelhavsdieten, en vetenskapligt bevisad diet som 
                  drastiskt minskar risken för många livsstilsrelaterade sjukdomar. Huvuddelarna i dieten är:
                </p>

                <DottedList items={[
                  "Undvik ultraprocessad mat",
                  "Ät fem nävar frukter, bär eller grönsaker per dag",
                  "Ät mer fullkorn", 
                  "Olivolja och rapsolja ersätter allt fett i köket",
                  "Drick kaffe",
                  "Fysisk aktivitet varje dag",
                ]} />
                <CardHeart>
                  Att implementera nya vanor görs i steg. Det ska vara roligt och gott!
                </CardHeart>
              </div>
            </div>
          </section>


           <section id="steg" className="mb-8 border border-gray-300 p-6">
            <div className="flex flex-col sm:flex-row gap-1">
              <div className="sm:w-2/3 space-y-4">
                <h2 className={sectionHeadingStyle}>Använd HjärtKost, steg för steg</h2>
              
                <p className={bodyText}> 
                  Använd appen enligt stegen: 
                </p>

                <DottedList items={[
                    "1. Välj ett delmål för veckan under 'Tips'. Det kan vara bra med att börja med 'Fem om dagen'. Ditt mål blir att äta fem nävar frukter och grönsaker om dagen, den veckan.",
                    "2. Fyll i din matdagbok varje dag. Om du till exempel åt fem nävar, klicka i rutan under 'Dagbok'.",
                    "3. Håll koll på dina mätningar (blodtryck, socker, blodfetter och vikt) och fyll i uppdateringar, under 'Mina Mätningar'.",
                    "4. Välj ett nytt mål följande vecka. Fortsätt tills alla delar är fyllda.",
                    "5. Grattis! Du äter enligt medelhavsdieten! Använd appen som ett uppslagsverk, eller håll koll på dina mätresultat.",
                  ]} />
                                  <CardHeart>
                  Att implementera nya vanor görs i steg. Det ska vara roligt och gott!
                </CardHeart>
              </div>
            </div>
          </section>


                
              
              
              

                
          {/* FINAL CARDHEART - With border */}
<section id="video" className="mb-8 border border-gray-300 p-6">
            <h2 className={sectionHeadingStyle}>Medelhavsdieten på youtube</h2>


             <p className={bodyText}>
                  Se{" "}
                  <a 
                    href="https://www.youtube.com/watch?v=f4yr-jjxD00&t=5s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors duration-200"
                  >
                    Secrets of the Mediterranean diet
                  </a>
                  {" "}på youtube.
                </p>

            <CardHeart>
              Varje litet steg mot att äta enligt medelhavsdieten räknas. Det viktiga är att du har börjat! 
            </CardHeart>

          </section>
          {/* CONTINUE BUTTON - With border */}
          <section className="border border-gray-300 p-6">
            <CompleteCardButton 
              cardId="tutorial"
              className={`${primaryButton} w-full`}
            >
              Färdig
            </CompleteCardButton>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Tutorial;

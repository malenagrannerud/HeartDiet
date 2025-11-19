// pages/fruit.tsx - Your custom page
import { pageContainer, headerContainer, pagePadding, sectionHeading2, bodyText, bodyTextBald } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import DottedList from "@/components/DottedList";

const FruitPage = () => {
  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <BackToTodayButton />
      </header>

      <main className={pagePadding}>
        {/* Your custom content */}
        <p className={bodyText}>
          Att äta minst fem nävar frukter och grönsaker varje dag hjälper dig att må bättre samtidigt som det minskar risken för hjärt-kärlsjukdom. Välj olika sorter och färger! Längst ner får du ett verktyg för att skriva din egna plan för hur rådet blir din vana.
        </p>

        <h2 className={sectionHeading2}>Hur mycket är fem nävar om dagen?</h2>
        <p className={bodyText}>Till dina fem om dagen räknas:</p>
        <DottedList items={[
          "Rotfrukter",
          "Frukt",
          "Bär", 
          "Grönsaker i maten du lagar",
          "Frysta grönsaker"
        ]} />

        <h2 className={sectionHeading2}>NÄR? och HUR? Få i dej dina fem om dagen</h2>
        <p className={bodyText}>
          Genom att tänka ut NÄR? och HUR? du ska få i dej dina fem om dagen, kan du lättare modifiera en plan som passar dej. Några exempel:
        </p>

        {/* Habits Examples */}
        <div className="mt-4 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className={bodyTextBald}>NÄR: Jag äter en frukt eller en näve bär i samband med frukost</p>
            <p className={bodyTextBald}>HUR: Jag handlar veckans frukter på söndagar och har bär i frysen</p>
            <p className={bodyTextBald}>PÅMINNELSE: Jag sätter en lapp på kylskåpet</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className={bodyTextBald}>NÄR: Jag äter en skopa sallad till lunch och middag</p>
            <p className={bodyTextBald}>HUR: Jag förbereder en råkostsallad med vinjägrett och har den redo i kylskåpet</p>
            <p className={bodyTextBald}>PÅMINNELSE: Jag lägger in en påminnelse i kalendern</p>
          </div>
        </div>
        <h2 className={sectionHeading2}>Min plan</h2>
        <p className={bodyText}>
          Planen kan du ändra i så många gånger du behöver, tills den fungerar för dej
        </p>
      </main>
    </div>
  );
};

export default FruitPage;
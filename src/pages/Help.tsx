import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pageTitle, pageSubtitle, standardCard, pageContainer, pagePadding } from "@/lib/design-tokens";

const Help = () => {
  return (
    /* STANDARDIZATION: Page uses pageContainer, pagePadding, space-y-6 for consistent layout */
    <div className={`${pageContainer} ${pagePadding} space-y-6`}>
      {/* STANDARDIZATION: Header uses pageTitle (text-4xl) and pageSubtitle (text-lg) */}
      <header>
        <h1 className={pageTitle}>Hjälp</h1>
        <p className={pageSubtitle}>Vanliga frågor och svar</p>
      </header>

      {/* STANDARDIZATION: Card uses p-5 padding and bg-blue-50 background */}
      <Card className={standardCard}>
        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="item-1" className="border-b-2">
            <AccordionTrigger className="text-foreground font-bold text-lg py-6 hover:no-underline">
              Vad är Hjärtkost?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
              Hjärtkost är ett individanpassat program för en hjärtvänlig kosthållning. 
              Vi hjälper dig att implementera evidensbaserade tips för ett starkare hjärta.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-b-2">
            <AccordionTrigger className="text-foreground font-bold text-lg py-6 hover:no-underline">
              Hur ofta ska jag använda appen?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
              Vi rekommenderar att du använder appen dagligen i början av programmet. 
              Checka in varje dag för att se dina tips och följa dina framsteg.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-b-2">
            <AccordionTrigger className="text-foreground font-bold text-lg py-6 hover:no-underline">
              Kan jag anpassa mina mål?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
              Ja! Du kan välja vilka tips du vill implementera varje vecka. 
              Om något tips är svårt att implementera hjälper vi dig att anpassa stegen.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-b-2">
            <AccordionTrigger className="text-foreground font-bold text-lg py-6 hover:no-underline">
              Ersätter appen läkarvård?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
              Nej, denna app är ett komplement till professionell vård. 
              Rådfråga alltid din läkare vid medicinska frågor eller innan du gör större ändringar i din livsstil.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-b-2">
            <AccordionTrigger className="text-foreground font-bold text-lg py-6 hover:no-underline">
              Hur följer jag mina framsteg?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
              Gå till fliken "Framsteg" för att se hur dina hälsovanor utvecklas. 
              Där kan du följa dina dagliga mål och se dina prestationer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* STANDARDIZATION: Contact card uses standardCard for consistent styling */}
      <Card className={`${standardCard} bg-gradient-to-br from-primary/10 to-primary/5`}>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Kontakta oss</h2>
        <p className="text-foreground/80 mb-5 text-lg leading-relaxed">
          Har du frågor som inte besvaras här? Tveka inte att höra av dig!
        </p>
        <p className="text-base text-muted-foreground font-medium">
          📧 support@hjartkost.se
        </p>
      </Card>
    </div>
  );
};

export default Help;

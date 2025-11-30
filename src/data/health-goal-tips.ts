export interface HealthGoalTip {
  goalId: string;
  tipId: number;
  title: string;
  description: string;
  keyPoints: string[];
  source?: string;
}

export const healthGoalTips: HealthGoalTip[] = [
  // CHOLESTEROL (kolesterol)
  {
    goalId: "cholesterol",
    tipId: 1,
    title: "Frukt, grönt och kolesterol",
    description: "Fibrer från frukt och grönsaker binder kolesterol i tarmen och hjälper kroppen att göra sig av med det.",
    keyPoints: [
      "Lösliga fibrer minskar LDL-kolesterol med upp till 10%",
      "Äpplen, bär och citrusfrukter är särskilt effektiva",
      "5 portioner om dagen ger optimalt skydd",
      "Kombinera med fullkorn för bästa effekt"
    ],
    source: "Livsmedelsverket, Nordiska näringsrekommendationer 2023"
  },
  {
    goalId: "cholesterol",
    tipId: 2,
    title: "Fullkorn och kolesterol",
    description: "Beta-glukan i havre och korn har bevisad effekt på att sänka LDL-kolesterol.",
    keyPoints: [
      "3g beta-glukan per dag sänker LDL med 5-10%",
      "Fibrer binder kolesterol och gallsyror i tarmen",
      "Havregröt, råg och kornflingor är bästa källorna",
      "Välj produkter med minst 50% fullkorn"
    ],
    source: "EFSA (European Food Safety Authority)"
  },
  {
    goalId: "cholesterol",
    tipId: 3,
    title: "Fisk och ditt kolesterol",
    description: "Omega-3 från fisk höjer det goda HDL-kolesterolet och sänker triglycerider.",
    keyPoints: [
      "Omega-3 minskar triglycerider med 15-30%",
      "Höjer HDL (det goda kolesterolet)",
      "Fet fisk 2-3 gånger/vecka ger optimalt skydd",
      "Bästa källorna: lax, makrill, sill, sardiner"
    ],
    source: "Livsmedelsverket, Svenska Hjärt-Lungfonden"
  },
  {
    goalId: "cholesterol",
    tipId: 4,
    title: "Rätt fett för kolesterolet",
    description: "Vilken typ av fett du äter har direkt påverkan på ditt kolesterol.",
    keyPoints: [
      "Omättat fett (olivolja, rapsolja) sänker LDL-kolesterol",
      "Mättat fett (smör, grädde, kokos) höjer LDL-kolesterol",
      "Byt smör mot flytande margarin kan sänka LDL med 5-10%",
      "Undvik transfetter helt (hårda margariner, bakverk)"
    ],
    source: "Livsmedelsverket, Nordiska näringsrekommendationer 2023"
  },
  {
    goalId: "cholesterol",
    tipId: 5,
    title: "Mejerier och kolesterol",
    description: "Välj magra mejerier för att minska intaget av mättat fett som höjer LDL-kolesterol.",
    keyPoints: [
      "Lättmjölk och lättfil ger samma näring utan mättat fett",
      "Mjölkprotein kan ha liten sänkande effekt på blodtryck",
      "3 portioner magra mejerier per dag rekommenderas",
      "Välj produkter med max 3% fett"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "cholesterol",
    tipId: 6,
    title: "Rött kött och kolesterol",
    description: "Rött och bearbetat kött innehåller mättat fett som höjer LDL-kolesterol.",
    keyPoints: [
      "Begränsa till max 500g rött kött per vecka",
      "Välj magra köttsorter (max 10% fett)",
      "Byt ut mot fisk, fågel eller baljväxter",
      "Undvik bearbetat kött (korv, bacon) som höjer risken mest"
    ],
    source: "Världshälsoorganisationen (WHO)"
  },
  {
    goalId: "cholesterol",
    tipId: 7,
    title: "Salt och kolesterol",
    description: "Även om salt inte direkt påverkar kolesterol, skyddar lågt saltintag hjärtat på andra sätt.",
    keyPoints: [
      "Högt blodtryck och högt kolesterol är dubbelrisk för hjärtat",
      "Max 6g salt per dag rekommenderas",
      "Läs innehållsförteckningen - välj produkter med <1g salt/100g",
      "Använd kryddor istället för salt"
    ],
    source: "Svenska Hjärt-Lungfonden"
  },
  {
    goalId: "cholesterol",
    tipId: 10,
    title: "Baljväxter och kolesterol",
    description: "Baljväxter är rika på lösliga fibrer som aktivt sänker LDL-kolesterol.",
    keyPoints: [
      "Lösliga fibrer binder kolesterol i tarmen",
      "130g baljväxter per dag kan sänka LDL med 5%",
      "Ersätt kött med baljväxter flera gånger i veckan",
      "Bönor, linser, kikärtor och sojabönor är bästa källorna"
    ],
    source: "Livsmedelsverket, Canadian Medical Association Journal"
  },
  {
    goalId: "cholesterol",
    tipId: 11,
    title: "Socker och triglycerider",
    description: "Överdrivet sockerintag höjer triglycerider, en typ av blodfett kopplat till hjärtsjukdom.",
    keyPoints: [
      "Höga triglycerider + högt LDL = ökad hjärtrisk",
      "Begränsa tillsatt socker till max 10% av energin",
      "Undvik söta drycker som höjer triglycerider snabbt",
      "Välj naturligt söta alternativ som frukt"
    ],
    source: "American Heart Association"
  },

  // BLOOD PRESSURE (blodtryck)
  {
    goalId: "bloodPressure",
    tipId: 1,
    title: "Frukt, grönt och blodtryck",
    description: "Kalium i frukt och grönsaker balanserar natriumets negativa effekt på blodtrycket.",
    keyPoints: [
      "5 portioner om dagen kan sänka blodtrycket med 5-10 mmHg",
      "Kaliumrika: bananer, apelsin, spenat, broccoli, potatis",
      "DASH-dieten bygger på frukt och grönt varje måltid",
      "Effekten syns efter 2-4 veckor"
    ],
    source: "DASH (Dietary Approaches to Stop Hypertension)"
  },
  {
    goalId: "bloodPressure",
    tipId: 3,
    title: "Fisk och blodtryck",
    description: "Omega-3 från fisk har dokumenterad blodtryckssänkande effekt.",
    keyPoints: [
      "Omega-3 kan sänka blodtrycket med 2-8 mmHg",
      "Särskilt effektivt för personer med förhöjt blodtryck",
      "3 portioner fisk per vecka rekommenderas",
      "Kombination med mindre salt ger bäst effekt"
    ],
    source: "American Heart Association"
  },
  {
    goalId: "bloodPressure",
    tipId: 4,
    title: "Rätt fett för blodtrycket",
    description: "Medelhavsmatens omättade fetter har blodtryckssänkande egenskaper.",
    keyPoints: [
      "Olivolja kan sänka blodtrycket med 3-5 mmHg",
      "Omättade fetter minskar inflammation i kärlen",
      "Medelhavsmat har bevisad effekt på blodtryck",
      "Använd olivolja eller rapsolja dagligen"
    ],
    source: "European Heart Journal"
  },
  {
    goalId: "bloodPressure",
    tipId: 5,
    title: "Mejerier och blodtryck",
    description: "Magra mejerier innehåller kalcium och protein som kan sänka blodtrycket.",
    keyPoints: [
      "3 portioner magra mejerier per dag ingår i DASH-dieten",
      "Kalcium och mjölkprotein har blodtryckssänkande effekt",
      "Välj lättmjölk, lättfil, lättyoghurt",
      "Effekt syns efter 4-8 veckor"
    ],
    source: "DASH-studien, American Heart Association"
  },
  {
    goalId: "bloodPressure",
    tipId: 7,
    title: "Salt-halt och blodtryck",
    description: "Salt har direkt och stark påverkan på blodtrycket hos de flesta människor.",
    keyPoints: [
      "Minska till 5g salt/dag kan sänka blodtrycket med 5-10 mmHg",
      "Effekten kommer efter 2-4 veckor",
      "80% av saltet kommer från färdigmat - inte från saltburken",
      "Kombinera med mer kalium (frukt/grönt) för bästa effekt"
    ],
    source: "Livsmedelsverket, WHO"
  },
  {
    goalId: "bloodPressure",
    tipId: 9,
    title: "Motion och blodtryck",
    description: "Regelbunden motion är en av de mest effektiva metoderna för att sänka blodtrycket.",
    keyPoints: [
      "30 min/dag kan sänka blodtrycket med 5-10 mmHg",
      "Effekt syns efter 2-4 veckor av regelbunden träning",
      "Både kondition och styrketräning ger effekt",
      "Kombinera med mindre salt för maximal effekt"
    ],
    source: "Svenska Hjärt-Lungfonden, American Heart Association"
  },
  {
    goalId: "bloodPressure",
    tipId: 10,
    title: "Baljväxter och blodtryck",
    description: "Baljväxter är en viktig del av DASH-dieten för att sänka blodtrycket.",
    keyPoints: [
      "Rikt på kalium som balanserar natriumets effekt",
      "Magnesium i baljväxter avslappnar blodkärlen",
      "Protein från baljväxter bättre än från kött för blodtrycket",
      "3-4 portioner per vecka rekommenderas"
    ],
    source: "DASH-studien"
  },

  // DIABETES
  {
    goalId: "diabetes",
    tipId: 1,
    title: "Frukt, grönt och blodsockret",
    description: "Fibrer från frukt och grönsaker saktar ner glukosintagningen och stabiliserar blodsockret.",
    keyPoints: [
      "Fibrer minskar blodsockerspikar efter måltider",
      "Grönsaker innehåller lite kolhydrater men mycket fibrer",
      "Bär har lägst socker bland frukt - perfekt vid diabetes",
      "Ät frukt/grönt till varje måltid för jämnare blodsockerkurva"
    ],
    source: "Diabetesförbundet, Livsmedelsverket"
  },
  {
    goalId: "diabetes",
    tipId: 2,
    title: "Fullkorn och blodsockret",
    description: "Fullkorn har lågt glykemiskt index vilket ger långsammare blodsockerstegring.",
    keyPoints: [
      "Fullkorn ger 30% långsammare blodsockerstegring än vitt",
      "Fibrer saktar nedbrytningen av stärkelse till socker",
      "Minskar risk för typ 2-diabetes med 20-30%",
      "Välj: havregryn, fullkornsris, råg, pumpernickel"
    ],
    source: "Diabetesförbundet, American Diabetes Association"
  },
  {
    goalId: "diabetes",
    tipId: 8,
    title: "Lagom portioner vid diabetes",
    description: "Rätt portionsstorlek är avgörande för att kontrollera blodsockret.",
    keyPoints: [
      "Stora måltider ger stora blodsockerspikar",
      "Använd tallriksmodellen för balanserade portioner",
      "Jämna mellanmål förhindrar lågt blodsocker",
      "Viktnedgång på 5-10% förbättrar blodsockerkontrollen märkbart"
    ],
    source: "Diabetesförbundet"
  },
  {
    goalId: "diabetes",
    tipId: 10,
    title: "Baljväxter och blodsockret",
    description: "Baljväxter har mycket lågt glykemiskt index tack vare fibrer och protein.",
    keyPoints: [
      "GI på 20-30 (mycket lågt) jämfört med vitt bröd (70)",
      "Protein och fibrer saktar glukosintagningen kraftigt",
      "Minskar risk för typ 2-diabetes",
      "Perfekt källa för stabilt blodsocker"
    ],
    source: "American Diabetes Association, International GI Database"
  },
  {
    goalId: "diabetes",
    tipId: 11,
    title: "Socker och blodsockret",
    description: "Snabba kolhydrater från socker ger blodsockerspikar som belastar kroppen.",
    keyPoints: [
      "Tillsatt socker höjer blodsockret snabbt och kraftigt",
      "Söta drycker är värst - ger extrema spikar",
      "Begränsa till max 10% av energin (ca 50g/dag)",
      "Välj frukt istället - fibrer saktar sockerupptagningen"
    ],
    source: "Diabetesförbundet, WHO"
  },

  // WEIGHT (vikt)
  {
    goalId: "weight",
    tipId: 1,
    title: "Frukt, grönt och viktkontroll",
    description: "Frukt och grönsaker har låg energitäthet men ger mättnad tack vare fibrer och volym.",
    keyPoints: [
      "Låg kaloritäthet: 20-60 kcal per 100g jämfört med 300-500 för fettrik mat",
      "Fibrer ger mättnad med färre kalorier",
      "Ät grönsaker först vid måltider för större mättnad",
      "5 portioner om dagen underlättar viktnedgång"
    ],
    source: "Livsmedelsverket, International Journal of Obesity"
  },
  {
    goalId: "weight",
    tipId: 2,
    title: "Fullkorn och viktkontroll",
    description: "Fullkorn ger längre mättnad än raffinerade produkter.",
    keyPoints: [
      "Fibrer skapar volym i magen och förlänger mättnaden",
      "Långsammare matsmältning = färre hunger",
      "Personer som äter fullkorn har lägre BMI",
      "Byt vitt till fullkorn för att minska kaloriintag naturligt"
    ],
    source: "American Journal of Clinical Nutrition"
  },
  {
    goalId: "weight",
    tipId: 3,
    title: "Fisk och viktkontroll",
    description: "Fisk är rik på protein som ger mättnad med relativt få kalorier.",
    keyPoints: [
      "Protein ger mer mättnad än kolhydrater eller fett",
      "Mager fisk: 80-100 kcal per 100g",
      "Omega-3 kan förbättra kroppens fettförbränning",
      "Perfekt proteinrik måltid vid viktminskning"
    ],
    source: "International Journal of Obesity"
  },
  {
    goalId: "weight",
    tipId: 5,
    title: "Mejerier och viktkontroll",
    description: "Magra mejerier ger protein och näring utan onödiga kalorier från fett.",
    keyPoints: [
      "Protein i mjölk ger god mättnad",
      "Lättmjölk: 35 kcal per 100ml vs standardmjölk 60 kcal",
      "Kalcium kan påverka fettomsättningen positivt",
      "Välj max 3% fett för viktkontroll"
    ],
    source: "Nutrition Journal"
  },
  {
    goalId: "weight",
    tipId: 6,
    title: "Rött kött och viktkontroll",
    description: "Välj magra köttsorter och begränsa portioner för att minska kaloriintaget.",
    keyPoints: [
      "Fett kött: 250 kcal per 100g vs magert 150 kcal",
      "Välj kött med max 10% fett",
      "Bearbetat kött innehåller ofta dolda kalorier",
      "Byt till fisk eller baljväxter för lägre kaloritäthet"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "weight",
    tipId: 8,
    title: "Portionsstorlek och vikt",
    description: "Rätt portionsstorlek är det viktigaste för viktkontroll - oavsett vad du äter.",
    keyPoints: [
      "Använd tallriksmodellen: hälften grönsaker skapar automatiskt kalorideficit",
      "Mindre tallrikar = 20% mindre intag utan hungerkänsla",
      "Ät långsamt - mättnadssignalen tar 20 minuter",
      "Portionskontroll + motion = framgångsrik viktnedgång"
    ],
    source: "Obesity Reviews, Livsmedelsverket"
  },
  {
    goalId: "weight",
    tipId: 9,
    title: "Motion och viktminskning",
    description: "Motion ökar energiförbrukningen och är nödvändig för långsiktig viktkontroll.",
    keyPoints: [
      "30 min daglig motion bränner 150-300 kcal",
      "Styrketräning ökar muskelmassa som förbränner mer kalorier",
      "Motion + kostnadsförändring ger bäst resultat",
      "Motion hjälper att behålla vikten efter viktminskning"
    ],
    source: "American College of Sports Medicine"
  },
  {
    goalId: "weight",
    tipId: 10,
    title: "Baljväxter och viktkontroll",
    description: "Baljväxter kombinerar protein och fibrer för maximal mättnad med låg kaloritäthet.",
    keyPoints: [
      "Protein + fibrer = extrem mättnadskänsla",
      "120 kcal per 100g (kokt) - mycket låg kaloritäthet",
      "Ersätt kött med baljväxter = spara 100+ kcal per portion",
      "Perfekt för viktnedgång och bibehållen muskelmassa"
    ],
    source: "Journal of American College of Nutrition"
  },
  {
    goalId: "weight",
    tipId: 11,
    title: "Socker och viktökning",
    description: "Tillsatt socker ger tomma kalorier utan mättnad.",
    keyPoints: [
      "Söta drycker: 150 kcal utan mättnad = viktigaste enkelfaktorn",
      "Socker saknar fibrer och protein som ger mättnad",
      "Skär ner på socker = enklaste sättet att minska kalorier",
      "Välj naturlig sötma från frukt när du vill ha något sött"
    ],
    source: "WHO, American Journal of Clinical Nutrition"
  },

  // ENERGY (piggare)
  {
    goalId: "energy",
    tipId: 1,
    title: "Frukt, grönt och energi",
    description: "Vitaminer och mineraler från frukt och grönt är avgörande för energiomsättningen.",
    keyPoints: [
      "C-vitamin och folsyra motverkar trötthet",
      "Järn i gröna bladgrönsaker transporterar syre till cellerna",
      "Snabba kolhydrater från frukt ger omedelbar energi",
      "Antioxidanter skyddar mot oxidativ stress"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "energy",
    tipId: 2,
    title: "Fullkorn och energi",
    description: "Fullkorn ger långsam och jämn energitillförsel utan sockerdippar.",
    keyPoints: [
      "Långsamma kolhydrater ger stabil energi i 3-4 timmar",
      "B-vitaminer i fullkorn är nödvändiga för energiomsättningen",
      "Undvik vita produkter som ger sockerdippar",
      "Perfekt frukost för stadig energi hela förmiddagen"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "energy",
    tipId: 3,
    title: "Fisk och energi",
    description: "Protein och omega-3 från fisk stödjer både fysisk och mental energi.",
    keyPoints: [
      "Omega-3 förbättrar hjärnfunktion och koncentration",
      "D-vitamin i fet fisk motverkar trötthet",
      "Protein ger stabil energi utan blodsockerspikar",
      "Jod i fisk krävs för sköldkörteln som reglerar energiomsättningen"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "energy",
    tipId: 4,
    title: "Rätt fett för energin",
    description: "Fett är kroppens mest koncentrerade energikälla och stödjer viktiga funktioner.",
    keyPoints: [
      "Fett ger 9 kcal per gram - mest energitätt",
      "Nödvändigt för upptag av energivitaminer (A, D, E, K)",
      "Omega-3 minskar inflammation som kan orsaka trötthet",
      "Använd omättade fetter för optimal hjärnfunktion"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "energy",
    tipId: 5,
    title: "Mejerier och energi",
    description: "Mejerier ger både energi och näringsämnen som motverkar trötthet.",
    keyPoints: [
      "Protein från mjölk ger stabil energi",
      "B12-vitamin krävs för energiomsättningen",
      "Kalcium nödvändigt för muskelfunktion",
      "Perfekt mellanmål för jämn energi"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "energy",
    tipId: 6,
    title: "Rött kött och energi",
    description: "Rött kött är en rik källa till järn och B-vitaminer som är avgörande för energi.",
    keyPoints: [
      "Hemjärn från kött absorberas lättare än järn från växter",
      "Järnbrist är vanligaste orsaken till trötthet",
      "B12-vitamin finns bara i animaliska produkter",
      "Kombinera med C-vitamin (grönsaker) för bättre järnupptag"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "energy",
    tipId: 7,
    title: "Salt och energi",
    description: "Rätt saltbalans är viktigt för vätskebalans och energinivåer.",
    keyPoints: [
      "För lite salt kan orsaka trötthet och svindel",
      "För mycket salt belastar njurarna och kan ge trötthet",
      "6g salt per dag är optimalt för de flesta",
      "Salta efter behov vid mycket svettning"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "energy",
    tipId: 8,
    title: "Lagom portioner för energi",
    description: "Rätt portionsstorlek ger jämn energi utan trötthet efter måltid.",
    keyPoints: [
      "För stora måltider orsakar 'mat-koma' - trötthet efter mat",
      "Mindre, regelbundna måltider ger jämnare energi",
      "Hoppa inte över måltider - ger blodsockersfall",
      "Tallriksmodellen ger balans mellan energi och mättnad"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "energy",
    tipId: 9,
    title: "Motion och energi",
    description: "Motion kan paradoxalt nog ge mer energi trots att man anstränger sig.",
    keyPoints: [
      "Motion frigör endorfiner som ger energi och välmående",
      "Förbättrar syreupptagning = mer energi till cellerna",
      "Regelbunden motion ger bättre sömn = mer energi på dagen",
      "30 min/dag räcker för märkbar energiökning"
    ],
    source: "Folkhälsomyndigheten"
  },
  {
    goalId: "energy",
    tipId: 10,
    title: "Baljväxter och energi",
    description: "Baljväxter ger långsam energi och viktiga näringsämnen för energiomsättningen.",
    keyPoints: [
      "Långsamma kolhydrater ger stabil energi i timmar",
      "Rikt på järn (särskilt linser) som motverkar trötthet",
      "B-vitaminer stödjer energiomsättningen",
      "Magnesium hjälper till att omvandla mat till energi"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "energy",
    tipId: 11,
    title: "Socker och energidippar",
    description: "Snabbt socker ger kortsiktig energikick följt av energidipp.",
    keyPoints: [
      "Sockerspikar följs av insulinsvar som ger energidipp",
      "Socker-dipp kommer efter 1-2 timmar och orsakar trötthet",
      "Välj långsamma kolhydrater för stabil energi",
      "Frukt med fibrer är bättre än godis för energi"
    ],
    source: "Livsmedelsverket"
  },

  // PREVENTION (förebygg)
  {
    goalId: "prevention",
    tipId: 1,
    title: "Frukt, grönt förebygger sjukdom",
    description: "Fem om dagen är en av de viktigaste faktorerna för att förebygga folksjukdomar.",
    keyPoints: [
      "Minskar risk för hjärt-kärlsjukdom med 20%",
      "Minskar risk för cancer med 10-15%",
      "Antioxidanter skyddar cellerna från skador",
      "5 portioner dagligen ger maximalt skydd"
    ],
    source: "WHO, Världscancerfonden"
  },
  {
    goalId: "prevention",
    tipId: 2,
    title: "Fullkorn förebygger sjukdom",
    description: "Fullkorn är en av de mest skyddande livsmedelgrupperna enligt forskning.",
    keyPoints: [
      "Minskar risk för typ 2-diabetes med 20-30%",
      "Minskar risk för hjärtsjukdom med 15-25%",
      "Minskar risk för tjocktarmscancer",
      "90g fullkorn dagligen ger optimalt skydd"
    ],
    source: "Nordiska näringsrekommendationer, WHO"
  },
  {
    goalId: "prevention",
    tipId: 3,
    title: "Fisk förebygger sjukdom",
    description: "Regelbunden fiskonsumtion skyddar mot flera folksjukdomar.",
    keyPoints: [
      "Minskar risk för hjärtinfarkt med 15-30%",
      "Minskar risk för stroke",
      "Omega-3 minskar inflammation i kroppen",
      "2-3 portioner per vecka ger skydd"
    ],
    source: "Svenska Hjärt-Lungfonden, American Heart Association"
  },
  {
    goalId: "prevention",
    tipId: 4,
    title: "Rätt fett förebygger sjukdom",
    description: "Vilken typ av fett du äter påverkar risken för hjärt-kärlsjukdom kraftigt.",
    keyPoints: [
      "Omättade fetter minskar risk för hjärtsjukdom",
      "Medelhavskost minskar hjärtsjukdom med 30%",
      "Undvik transfetter helt - höjer sjukdomsrisk",
      "Använd olivolja och rapsolja dagligen"
    ],
    source: "European Heart Journal, WHO"
  },
  {
    goalId: "prevention",
    tipId: 5,
    title: "Mejerier och hälsa",
    description: "Magra mejerier ger viktiga näringsämnen som bidrar till övergripande hälsa.",
    keyPoints: [
      "Kalcium stärker skelettet och förebygger osteoporos",
      "Protein hjälper bibehålla muskelmassa med åldern",
      "Vissa mejerier kan sänka blodtryck något",
      "3 portioner dagligen rekommenderas"
    ],
    source: "Livsmedelsverket"
  },
  {
    goalId: "prevention",
    tipId: 6,
    title: "Rött kött och sjukdomsrisk",
    description: "Överdrivet intag av rött och bearbetat kött ökar risk för flera sjukdomar.",
    keyPoints: [
      "Max 500g rött kött per vecka rekommenderas",
      "Bearbetat kött ökar risk för tjocktarmscancer",
      "Ökar risk för hjärt-kärlsjukdom och typ 2-diabetes",
      "Byt ut mot fisk, fågel eller baljväxter"
    ],
    source: "Världscancerfonden, WHO"
  },
  {
    goalId: "prevention",
    tipId: 7,
    title: "Salt och folksjukdomar",
    description: "Högt saltintag är en ledande riskfaktor för hjärt-kärlsjukdom globalt.",
    keyPoints: [
      "Högt saltintag höjer blodtryck hos de flesta",
      "Högt blodtryck är största enskilda riskfaktorn för hjärtinfarkt och stroke",
      "Max 6g salt per dag rekommenderas",
      "Minskat saltintag kan förhindra 2,5 miljoner dödsfall per år globalt"
    ],
    source: "WHO, Livsmedelsverket"
  },
  {
    goalId: "prevention",
    tipId: 8,
    title: "Lagom portioner förebygger övervikt",
    description: "Övervikt är en riskfaktor för nästan alla folksjukdomar.",
    keyPoints: [
      "Övervikt ökar risk för typ 2-diabetes, hjärtsjukdom, cancer",
      "Redan 5-10% viktminskning ger hälsovinst",
      "Tallriksmodellen hjälper naturlig portionskontroll",
      "Förebygg övervikt är lika viktigt som att behandla det"
    ],
    source: "Folkhälsomyndigheten, WHO"
  },
  {
    goalId: "prevention",
    tipId: 9,
    title: "Motion förebygger sjukdom",
    description: "Motion är en av de mest effektiva faktorerna för att förebygga folksjukdomar.",
    keyPoints: [
      "30 min/dag minskar risk för hjärtsjukdom med 30-40%",
      "Minskar risk för typ 2-diabetes med 40%",
      "Minskar risk för vissa cancerformer",
      "Minskar risk för demens och depression"
    ],
    source: "WHO, Folkhälsomyndigheten"
  },
  {
    goalId: "prevention",
    tipId: 10,
    title: "Baljväxter förebygger sjukdom",
    description: "Baljväxter är en skyddande livsmedelgrupp enligt all forskning.",
    keyPoints: [
      "Minskar risk för hjärt-kärlsjukdom",
      "Minskar risk för typ 2-diabetes",
      "Rik på skyddande ämnen som fibrer och antioxidanter",
      "Ersätt kött med baljväxter för maximal hälsovinst"
    ],
    source: "Världscancerfonden, Livsmedelsverket"
  },
  {
    goalId: "prevention",
    tipId: 11,
    title: "Socker och sjukdomsrisk",
    description: "Högt sockerintag ökar risk för flera folksjukdomar.",
    keyPoints: [
      "Ökar risk för typ 2-diabetes",
      "Ökar risk för hjärt-kärlsjukdom",
      "Bidrar till övervikt som är riskfaktor för många sjukdomar",
      "Max 10% av energin från tillsatt socker rekommenderas"
    ],
    source: "WHO, Livsmedelsverket"
  }
];

import { tipCardColors } from '@/lib/design-tokens';

export interface UserPlan {
  when: string;       // "Varje morgon", "På söndagar", etc.
  how: string;        // "Jag ska...", detailed plan
  reminder?: string;  // Optional reminder
}

export interface Tip {
  id: number;
  title: string;
  color: string;
  healthScore: number;
  subtitle: string;
  detailedInfo: string;
  steps: Array<string | { heading: string; content: string }>;
  userPlan?: UserPlan; // User's personal plan
}

export const tips: Tip[] = [
  {
    id: 1,
    title: "Fem nävar frukt och grönt",
    color: tipCardColors.green,
    healthScore: 8,
    subtitle:  "Text",
    detailedInfo: `Att få i sig fem nävar frukt och grönt per dag ger dej stora hälsofördelar. Fem nävar är ungefär 500 g. 
    Ränka in
    • rotfrukter
    • bär
    • frukt 
    • grönsaker i maten du lagar 
    • frysta grönsaker
    
    Att få i sig fem nävar per dag minskar risken för 
      • hjärt- och kärlsjukdom, 
      • vissa former av cancer samt
      • förtidig död
      
      Det beror på att frukt och grönt innehåller:
      • fibrer
      • antioxidanter  
      • lite energi

      För att se till att få i dej fem nävar om dagen, prova att till exempel: 
    `,
    steps: [
      {
        heading: "1 - Förbered veckan",
        content: "Se till att frukter och grönsaker finns hemma för veckan på till exempel söndagar. "
      },
      {
        heading: "2 - Veckans råkostsallad",
        content: "Gör en stor sallad med fint riven rödkål, vitkål, morot och äpple exempelvis. Blanda i olivolja, vitvinsvinäger, salt och peppar och låt stå i kylen. Salladen håller hela veckan, prefekt att ta fram som tillbehör till veckans alla middagar.",
      },
      {
        heading: "3 - Soppor och smoothies i kylskåpet",
        content: "Koka grönsaker och bönor i buljong och mixa slät med en stavmixer. Resultatet blir en mycket smak- och näringsrik soppa som är redd och klar att äta. ",
      },

       {
        heading: "4 - Frukt och grönsaks-stavar",
        content: "Hacka fina stavar av olika färger. Ta med dej till lunchen eller mellanmålet.",
      },
    ],
  },
  {
    id: 2,
    title: "Minst 3 dl fullkorn om dagen",
    color: tipCardColors.amber,
    healthScore: 3,
    subtitle: "Text",
    detailedInfo: `Att få i sig minst 3 dl fullkorn om dagen minskar risken för 
    • kranskärlsjukdom, 
    • tarmcancer, 
    • typ 2-diabetes och 
    • förtidig död.  
    
    Det beror bland annat på det höga innehållet av kostfibrer. Fibrerna bidrar till 
    • en bra tarmhälsa och
    • att sänka blodtrycket.

    Fullkorn innehåller också växtsteroler som 
    • minskar upptaget av kolesterol i tarmen. Då sänks halten av LDL-kolesterolet i blodet --> 
    lägre totalkolesterol och minskat systoliskt blodtryck, 
    vilket kan vara en annan förklaring till den minskade risken för kostrelaterad ohälsa.

    För att se till att få i dej minst 3 dl (90 g) fullkorn per dag, prova att till exempel: 
     `,
     steps: [
      {
        heading: "1 - Handla knäckebröd ",
        content: "Knäckebröd innehåller 100% fullkorn. Ät varje dag",
      },
      {
        heading: "2 - Byt vitt mjöl mot fullkornsmjöl",
        content: "Baka ditt eget bröd med några delar fullkorsnmjöl blandat med vitt mjöl. Till exempel kan du testa vete, råg, dinkel och enkorn, med unika smaker och egenskaper. "
      },
      {
        heading: "3 - Soppor och smoothies",
        content: "Koka grönsaker och bönor i buljong och mixa slät med en stavmixer. Resultatet blir en mycket smak- och näringsrik soppa som är redd och klar att äta. ",
      },
    ],
  },
  {
    id: 3,
    title: "Fisk och skaldjur 3 gånger i veckan",
    color: tipCardColors.cyan,
    healthScore: 3,
    subtitle:  "text",
    detailedInfo:`Fisk och skaldjur innehåller protein, D-vitamin, jod och selen. 
      Fet fisk innehåller dessutom omega-3-fettsyror som är viktiga för hjärtat och hjärnan.,

       "Planera två fiskmiddagar varje vecka",
      "Fisksoppa kan varieras. Prova olika recept",
      "Köp fryst fisk för att alltid ha hemma",
    `,
      steps: [
      {
        heading: "1 - Förbered veckan",
        content: "Se till att frukter och grönsaker finns hemma för veckan på till exempel söndagar. "
      },
      {
        heading: "2 - Veckans råkostsallad",
        content: "Gör en stor sallad med riven rödkål, vitkål, morot och äpple exempelvis. Blanda i olivolja, vitvinsvinäger, salt och peppar och låt stå i kylen. Salladen håller hela veckan, prefekt att ta fram som tillbehör till veckans alla middagar.",
      },
      {
        heading: "3 - Soppor och smoothies",
        content: "Koka grönsaker och bönor i buljong och mixa slät med en stavmixer. Resultatet blir en mycket smak- och näringsrik soppa som är redd och klar att äta. ",
      },
    ],
  },
  {
    id: 4,
    title: "Rätt fett",
    color: tipCardColors.yellow,
    healthScore: 3,
    subtitle: "text",
    detailedInfo:`Omättade fetter från växtoljor, flytande margarin, nötter och fet fisk är nyttigt.
    
      "Byt ut smör mot flytande margarin på mackan",
      "Använd rapsolja eller olivolja vid matlagning",
      "Snacksa på nötter istället för chips",
    `,
    
       steps: [
      {
        heading: "1 - Förbered veckan",
        content: "Se till att frukter och grönsaker finns hemma för veckan på till exempel söndagar. "
      },
      {
        heading: "2 - Veckans råkostsallad",
        content: "Gör en stor sallad med riven rödkål, vitkål, morot och äpple exempelvis. Blanda i olivolja, vitvinsvinäger, salt och peppar och låt stå i kylen. Salladen håller hela veckan, prefekt att ta fram som tillbehör till veckans alla middagar.",
      },
      {
        heading: "3 - Soppor och smoothies",
        content: "Koka grönsaker och bönor i buljong och mixa slät med en stavmixer. Resultatet blir en mycket smak- och näringsrik soppa som är redd och klar att äta. ",
      },
    ],
  },
  {
    id: 5,
    title: "Mera magra mejerier",
    color: tipCardColors.lightblue,
    healthScore: 3,
    subtitle:  "text",
    detailedInfo:`Magra mejeriprodukter innehåller kalcium, protein, jod, D-vitaminer m.fl.
     Det är bra för sklett ..... 

    Feta mejerier innehåller dock mättat fett. Ett glas standardmjölk innehåller
     lika mycket mättat fett som sju glas lättmjölk eller 30 glas minimjölk.
    
     För att få i sej de viktiga näringsämnena är det bra att välja magra mejeriprodukter. 

      "Välj mellanmjölk eller lättmjölk istället för standardmjölk",
      "Prova lättfil eller lättyoghurt till frukost",
      "Kolla fetthalt på ost och välj varianter under 17%",
     `,
       steps: [
      {
        heading: "...",
        content: ".. "
      },
      {
        heading: "...",
        content: "...",
      },
      {
        heading: "...",
        content: "..",
      },
    ],
  },
  {
    id: 6,
    title: "Max 500 g rött och bearbetat kött per vecka",
    color: tipCardColors.darkrose,
    healthScore: 3,
    subtitle:  "text",
    detailedInfo: `Kött innehåller protein, järn och B-vitaminer, men ett stort intag ökar risken för tjocktarmscancer.
    Att äta max 500 g kött per vecka, minskar risken för tjocktarmscancer. 
    
    och framförallt begränsa bearbetated köttprodukter
    Begränsa chark, korv och andra bearbetade köttprodukter
    
      `,
        steps: [
      {
        heading: "1 - Byt ut köttet mot kyckling eller fisk",
        content: " "
      },
      {
        heading: "2 - Blanda böner eller linser i köttfärsen",
        content: " ...",
      },
      {
        heading: "3 - Byt ut charken på smörgåsen  ",
        content: "Skippa charken på mackan - välj ägg, ost eller hummus ",
      },
    ],
  },
  {
    id: 7,
    title: "Salt-halt",
    color: tipCardColors.graygreen,
    healthScore: 4,
    subtitle:  "...",
    detailedInfo: `Salt förhöjer smaken på maten och innehåller mineraler. 
    För mycket salt ökar risken för högt blodtryck. 
    Ät max 6 gram salt per dag - det motsvarar en tesked. 
    Använd joderat salt och undvik att salta för mycket.",
     
      "Smaka på maten innan du saltar",
      "Krydda med örter och kryddor istället för salt",
      "Välj produkter med lägre saltinnehåll",
      `,
        steps: [
      {
        heading: "Förbered veckan",
        content: "Se till att frukter och grönsaker finns hemma för veckan på till exempel söndagar. "
      },
      {
        heading: "Veckans råkostsallad",
        content: "...",
      },
      {
        heading: "Soppor och smoothies",
        content: "Koka grönsaker och bönor i buljong och mixa slät med en stavmixer. Resultatet blir en mycket smak- och näringsrik soppa som är redd och klar att äta. ",
      },
    ],
  },
  {
    id: 8,
    title: "Lagom matmängd är bäst",
    color: tipCardColors.lightpurple,
    healthScore: 4,
    subtitle:  "text",
    detailedInfo:`
      "Energibehovet varierar mellan personer beroende på ålder, kön och hur mycket du rör dig. Ät lagom mycket för att hålla en hälsosam vikt.",
      "Använd mindre tallrikar för att kontrollera portioner",
      "Ät långsamt och känn efter när du är mätt",
      "Planera regelbundna måltider - 3 huvudmål och 2 mellanmål",
      `,
        steps: [
      {
        heading: "Förbered veckan",
        content: "Se till att frukter och grönsaker finns hemma för veckan på till exempel söndagar. "
      },
      {
        heading: "Veckans råkostsallad",
        content: "Gör en stor sallad med riven rödkål, vitkål, morot och äpple exempelvis. Blanda i olivolja, vitvinsvinäger, salt och peppar och låt stå i kylen. Salladen håller hela veckan, prefekt att ta fram som tillbehör till veckans alla middagar.",
      },
      {
        heading: "Soppor och smoothies",
        content: "Koka grönsaker och bönor i buljong och mixa slät med en stavmixer. Resultatet blir en mycket smak- och näringsrik soppa som är redd och klar att äta. ",
      },
    ],
  },
  {
    id: 9,
    title: "Rör på dig minst 30 min om dagen",
    color: tipCardColors.lightgreen,
    healthScore: 5,
    subtitle: "...",
    detailedInfo: `Fysisk aktivitet stärker din kropp både fysiskt och psykiskt. 

       är en viktig del av en hälsosam livsstil. Rör på dig minst 30 minuter om dagen med måttlig intensitet.",
     "Gå en 30 minuters promenad varje dag",
      "Ta trapporna istället för hissen",
      "Hitta en aktivitet du tycker om - dans, simning eller cykling",
     
      `,
        steps: [
      {
        heading: "Promenera",
        content: "Se till att frukter och grönsaker finns hemma för veckan på till exempel söndagar. "
      },
      {
        heading: "Veckans råkostsallad",
        content: "Gör en stor sallad med riven rödkål, vitkål, morot och äpple exempelvis. Blanda i olivolja, vitvinsvinäger, salt och peppar och låt stå i kylen. Salladen håller hela veckan, prefekt att ta fram som tillbehör till veckans alla middagar.",
      },
      {
        heading: "Soppor och smoothies",
        content: "Koka grönsaker och bönor i buljong och mixa slät med en stavmixer. Resultatet blir en mycket smak- och näringsrik soppa som är redd och klar att äta. ",
      },
    ],
  },
  {
    id: 10,
    title: "Ät mer baljväxter",
    color: tipCardColors.orange,
    healthScore: 3,
    subtitle:  "...",
    detailedInfo: `Bönor, linser och ärtor är bra proteinkällor och innehåller fibrer.
      "Baljväxter som bönor, linser, ärtor och kikärtor
       innehåller protein, fibrer, vitaminer och mineraler. 
      De är klimatsmarta alternativ till kött.",
       "Blanda 50% baljväxter i köttfärsen vid tacos eller bolognese",
      "Testa en lins- eller böngryta varje vecka",
      "Snacksa på rostade kikärtor eller bönor",
     
      `,
       steps: [
      {
        heading: "Förbered veckan",
        content: "Se till att frukter och grönsaker finns hemma för veckan på till exempel söndagar. "
      },
      {
        heading: "Veckans råkostsallad",
        content: "Gör en stor sallad med riven rödkål, vitkål, morot och äpple exempelvis. Blanda i olivolja, vitvinsvinäger, salt och peppar och låt stå i kylen. Salladen håller hela veckan, prefekt att ta fram som tillbehör till veckans alla middagar.",
      },
      {
        heading: "Soppor och smoothies",
        content: "Koka grönsaker och bönor i buljong och mixa slät med en stavmixer. Resultatet blir en mycket smak- och näringsrik soppa som är redd och klar att äta. ",
      },
    ],
  },
  {
    id: 11,
    title: "Minska på sockret",
    color: tipCardColors.purple,
    healthScore: 3,
    subtitle:  "... ",
    detailedInfo: `Sötsaker är trevligt vid speciella tillfällen. 
    För mycket är dock skadligt för hjärtat och blodtrycket. 
    
    
    Genom att minska på dessa kan du förbättra din hälsa avsevärt. 
    
    Socker ökar risken för 
    övervikt och 
    diabetes. 
     
    "Undvik läsk, saft och andra sockrade drycker",
      "Begränsa sötsaker och godis till speciella tillfällen",
      "Koka själv så du kan kontrollera salt- och sockermängden",
      "Läs innehållsförteckningen - socker har många namn (glukos, sackaros, fruktossirap)",
      
    `,
     steps: [
      {
        heading: "Byt sylt mot bär",
        content: " "
      },
      {
        heading: "Ät regelbundet",
        content: "...",
      },
      {
        heading: "...",
        content: "...",
      },
    ],
  },
];

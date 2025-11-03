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
    detailedInfo: `
      Fem nävar grönsaker, rotfrukter, frukter och bär per dag minskar risken 
      för hjärt- och kärlsjukdom, cancer i bland annat bröst och tjocktarm 
      samt förtidig död. 
      
      Det beror på:
      • Högt innehåll av fibrer
      • Högt innehåll av antioxidanter  
      • Lågt energiinnehåll

      För att se till att få i dej fem nävar om dagen, prova att till exempel: 
    `.replace(/\n\s+/g, '\n').trim(),
       
    steps: [
      {
        heading: "Förbered veckan",
        content: "Se till att frukter och grönsaker finns hemma för veckan på till exempel söndagar. "
      },
      {
        heading: "Veckans råkostsallad",
        content: "Gör en stor sallad med fint riven rödkål, vitkål, morot och äpple exempelvis. Blanda i olivolja, vitvinsvinäger, salt och peppar och låt stå i kylen. Salladen håller hela veckan, prefekt att ta fram som tillbehör till veckans alla middagar.",
      },
      {
        heading: "Soppor och smoothies i kylskåpet",
        content: "Koka grönsaker och bönor i buljong och mixa slät med en stavmixer. Resultatet blir en mycket smak- och näringsrik soppa som är redd och klar att äta. ",
      },

       {
        heading: "Frukt och grönsaks-stavar",
        content: "Hacka fina stavar av olika färger. Ta med dej till lunchen eller mellanmålet.",
      },

       {
        heading: "Portionera ut",
        content: "Tänk ut tider på dagen då en portion passar dej. Till exempel: En näve bär till frukost, en sked råkostsallad till lunch och ett äpple till efterrätt, morotsstavar till mellanmål och linser i köttfärsen till middagen.",
      },
    ],
  },
  {
    id: 2,
    title: "Fyll på med fullkorn",
    color: tipCardColors.amber,
    healthScore: 3,
    subtitle: "Text",
    detailedInfo: `
    
    Fullkorn innehåller fibrer, vitaminer och mineraler som är viktiga för din hälsa. 
    Genom att välja fullkorn istället för raffinerade produkter får du mer näring och 
    håller dig mätt längre. Fullkorn har också visats minska risken för 
    
    • hjärt-kärlsjukdomar och
    • typ 2-diabetes

      "Byt ut vitt bröd mot fullkornsbröd",
      "Välj havregryn eller fullkornsflingor till frukost",
      "Testa fullkornspasta eller råris istället för vanliga varianter",
      "Ha havregryn eller müsli med fullkorn till frukost"

    
     `.replace(/\n\s+/g, '\n').trim(),
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
    id: 3,
    title: "Fisk och skaldjur 3 gånger i veckan",
    color: tipCardColors.cyan,
    healthScore: 3,
    subtitle:  "text",
    detailedInfo:`
      Fisk och skaldjur innehåller protein, D-vitamin, jod och selen. 
      Fet fisk innehåller dessutom omega-3-fettsyror som är viktiga för hjärtat och hjärnan.,

       "Planera två fiskmiddagar varje vecka",
      "Fisksoppa kan varieras. Prova olika recept",
      "Köp fryst fisk för att alltid ha hemma",
    
    `.replace(/\n\s+/g, '\n').trim(),
    
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
    id: 4,
    title: "Rätt fett",
    color: tipCardColors.yellow,
    healthScore: 3,
    subtitle: 
      "Använd flytande margarin och oljor i matlagning. Begränsa smör, hårdmargarin och andra mättade fetter",
    detailedInfo:`
      "Fettkvaliteten påverkar hälsan. Omättade fetter från växtolior, flytande margarin, nötter och fet fisk är nyttigare än mättade fetter från smör, hårdmargarin och fett kött.",
          "Byt ut smör mot flytande margarin på mackan",
      "Använd rapsolja eller olivolja vid matlagning",
      "Snacksa på nötter istället för chips",
    `.replace(/\n\s+/g, '\n').trim(),
    
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
    id: 5,
    title: "Mera magra mejerier",
    color: tipCardColors.lightblue,
    healthScore: 3,
    subtitle:  "Mjölk, filmjölk och yoghurt med max 1,5% fett. Ost med max 17% fett",
    detailedInfo:`
      "Mejeriprodukter innehåller kalcium, protein, jod och flera vitaminer. För de flesta är det bra att välja magra varianter för att minska intaget av mättat fett.",
    
       "Välj mellanmjölk eller lättmjölk istället för standardmjölk",
      "Prova lättfil eller lättyoghurt till frukost",
      "Kolla fetthalt på ost och välj varianter under 17%",
     `.replace(/\n\s+/g, '\n').trim(),
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
    id: 6,
    title: "Minska på rött och bearbetat kött",
    color: tipCardColors.darkrose,
    healthScore: 3,
    subtitle:  "Max 500 gram tillagat kött per vecka. Begränsa chark, korv och andra bearbetade köttprodukter",
    detailedInfo: `
      "Kött innehåller protein, järn och B-vitaminer, men ett stort intag av rött kött och charkprodukter ökar risken för tjocktarmscancer.",
     
     "Byt ut kött mot kyckling eller fisk 2 gånger i veckan",
      "Testa vegetariska alternativ som bönor eller linser",
      "Skippa charken på mackan - välj ägg, ost eller hummus",
      `.replace(/\n\s+/g, '\n').trim(),
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
    id: 7,
    title: "Salt-halt",
    color: tipCardColors.graygreen,
    healthScore: 4,
    subtitle:  "Minska saltintaget till max 6 gram per dag. Använd joderat salt",
    detailedInfo: `
      "För mycket salt ökar risken för högt blodtryck. Ät max 6 gram salt per dag - det motsvarar en tesked. Använd joderat salt och undvik att salta för mycket.",
     
     
      "Smaka på maten innan du saltar",
      "Krydda med örter och kryddor istället för salt",
      "Välj produkter med lägre saltinnehåll",
      `.replace(/\n\s+/g, '\n').trim(),
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
    id: 8,
    title: "Lagom matmängd är bäst",
    color: tipCardColors.lightpurple,
    healthScore: 4,
    subtitle:  "Anpassa mängden mat efter ditt energibehov. Lyssna på din kropp och ät när du är hungrig",
    detailedInfo:`
      "Energibehovet varierar mellan personer beroende på ålder, kön och hur mycket du rör dig. Ät lagom mycket för att hålla en hälsosam vikt.",
      "Använd mindre tallrikar för att kontrollera portioner",
      "Ät långsamt och känn efter när du är mätt",
      "Planera regelbundna måltider - 3 huvudmål och 2 mellanmål",
      `.replace(/\n\s+/g, '\n').trim(),
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
    subtitle:  "Fysisk aktivitet är viktig för hälsan tillsammans med bra matvanor",
    detailedInfo: `
      "Fysisk aktivitet är en viktig del av en hälsosam livsstil. Rör på dig minst 30 minuter om dagen med måttlig intensitet.",
     "Gå en 30 minuters promenad varje dag",
      "Ta trapporna istället för hissen",
      "Hitta en aktivitet du tycker om - dans, simning eller cykling",
     
      `.replace(/\n\s+/g, '\n').trim(),
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
    id: 10,
    title: "Ät mer baljväxter",
    color: tipCardColors.orange,
    healthScore: 3,
    subtitle:  "Bönor, linser och ärtor är bra proteinkällor och innehåller fibrer. Klimatsmart alternativ till kött",
    detailedInfo: `
      "Baljväxter som bönor, linser, ärtor och kikärtor innehåller protein, fibrer, vitaminer och mineraler. De är klimatsmarta alternativ till kött.",
       "Blanda 50% baljväxter i köttfärsen vid tacos eller bolognese",
      "Testa en lins- eller böngryta varje vecka",
      "Snacksa på rostade kikärtor eller bönor",
     
      `.replace(/\n\s+/g, '\n').trim(),
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
    subtitle:  "Begränsa sötsaker, läsk och godis. Max 10% av ditt dagliga energiintag",
    detailedInfo: `"För mycket socker och salt är skadligt för hjärtat och blodtrycket. Genom att minska på dessa kan du förbättra din hälsa avsevärt. Socker ökar risken för övervikt och diabetes, medan för mycket salt höjer blodtrycket.",
     
    "Undvik läsk, saft och andra sockrade drycker",
      "Begränsa sötsaker och godis till speciella tillfällen",
      "Koka själv så du kan kontrollera salt- och sockermängden",
      "Läs innehållsförteckningen - socker har många namn (glukos, sackaros, fruktossirap)",
      "Använd kryddor istället för salt för mer smak"
    `.replace(/\n\s+/g, '\n').trim(),
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
];

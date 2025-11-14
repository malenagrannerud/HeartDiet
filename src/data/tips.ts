import { tipCardColors } from '@/lib/design-tokens';

export interface UserPlan {
  when: string;        
  how: string;        
  reminder?: string;  // My reminder
}

export interface Tip {
  id: number;
  title: string;
  color: string;
  //healthScore: number;
  freq: string;
  summary: string;
  detailedInfo: string;
  steps: Array<string | { heading: string; content: string [] }>;
  
 // userPlan?: UserPlan; // User's personal plan
}

export const tips: Tip[] = [
  {
    id: 1,
    title: "Fem om dagen",
    color: tipCardColors.green,
    //healthScore: 8,
    freq: `Dagligen`,
    summary: `Att äta minst fem nävar frukter och grönsaker varje dag hjälper dig att 
    må bättre just nu samtidigt som det minskar risken för hjärt-kärlsjukdomar på sikt. 
    Längst ner får du ett verktyg för att skriva din egena plan för hur rådet blir din vana.`, 
    detailedInfo: `
    
    BÄTTRE MÅENDE
    Du mår bättre eftersom frukt och grönt innehåller näringsämnen
    som ger dig mer energi, förbättrar matsmältningen och stärker kroppens försvar. 
    Du kommer att känna dig piggare och friskare i vardagen, med bättre humör och mindre trötthet.

    SKYDD MOT HJÄRTSJUKDOM
    Det minskar risken för hjärtsjukdom eftersom frukt och grönsaker innehåller 
    • kalium -  det sänker blodtrycket 
    • antioxidanter -  skyddar dina blodkärl
    • kostfiber -  minskar kolesterolet. Det förhindrar förtjockning av blodkärlens väggar.

    EXEMPEL PÅ HUR DU KAN FÅ I DEJ FEM OM DAGEN
    Till dina fem nävar om dagen räknas:
    • rotfrukter
    • frukt & bär 
    • frysta grönsaker & grönsaker i maten du lagar. Genom att tänka ut när och hur du ska få i dej frukt, kan du lättare modifiera en plan som passar dej`,
    
    steps: [
      {
        heading: "Hitta ditt NÄR?",
        content: [
          ".... ",
          ".... "
        ]
      },
      {
        heading: "Hitta ditt HUR?",
        content: [
          ".... ",
          ".... "
        ]
      }
    ], 
  },



  {
    id: 2,
    title: "Fyll på med fullkorn",
    color: tipCardColors.amber,
    //healthScore: 3,
    freq: `Dagligen`,
    summary: `Att få i sig minst 90 g fullkorn om dagen dig stabil energi, bättre matsmältning, hjälper med vikthantering och minskar risken för livsstilsrelaterade sjukdomar. Längst ner får du ett verktyg för att skriva din egena plan för hur rådet blir din vana.`, 
    detailedInfo: `

    BÄTTRE MÅENDE
    Fullkorns unika kombination av kostfiber ger långsammare energiåtergivning och bättre mättnad, 
    medan B-vitaminer och järn bidrar till uthållig energi och bra blodbildning. 
    Magnesium och zink stöttar muskler och immunförsvar, och E-vitamin med antioxidanter 
    skyddar dina celler och hjärta. Genom att behålla alla delar av kärnan – grodd, kli och mjölkkropp – 
    får du en fullständig näringskombination som samverkar för din långsiktiga hälsa.
    
    SKYDD MOT SJUKDOM
    Fullkorn minskar risken för 
    • kranskärlsjukdom, 
    • tarmcancer, 
    • typ 2-diabetes och 
    • förtidig död.  
    
    Det beror bland annat på det höga innehållet av kostfibrer. Fibrerna bidrar till 
    • en bra tarmhälsa och
    • att sänka blodtrycket.

    EXEMPEL PÅ HUR DU KAN FÅ I DEJ FULLKORN
    För att se till att få i dej minst 3 dl (90 g) fullkorn per dag, prova att till exempel: 
     `,
      steps: [
        {
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ],  
  },



  {
    id: 3,
    title: "Fisk och skaldjur",
    color: tipCardColors.cyan,
    //healthScore: 3,
    freq: `Veckovis`,
    summary: `Att äta fisk och skaldjur 2 - 3 gånger i veckan hjälper dig att få i dig många lite ovanligare näringsämnen 
    som man behöver för att må bra. Att äta fisk och skaldjur minskar ochså risken för flera sjukdomar. `, 
    detailedInfo:`
    
    
     
    I fisk finns till exempel 
    • D-vitamin 
    • jod och  
    • selen
    som det kan vara svårt att få tillräckligt av. 

    Feta fiskar, som lax, sill och makrill, är rika på omega-3-fetter. De minskar risken för 
    hjärt- och kärlsjukdom eftersom de minskar inflammationer i blodkärlen, sänker blodfetter,
     och gör blodet tunnare vilket förhindrar farliga blodproppar. Dessutom stabiliseras hjärtats
     elektriska system vilket förhindrar hjärtrytmsrubbningar.
    
    Omega-3-fetter är viktiga för hjärnans utveckling och funktion eftersom Omega-3 :
    • gör cellmembranen flexibla och porösa, vilket förbättrar kommunikationen mellan hjärnceller.
    • omvandlas till ämnen som löser upp inflammation och skyddar hjärnceller mot skador.
    • stimulerar tillväxten av synapser – kopplingarna mellan hjärnceller – vilket förbättrar minne, inlärning och kognitiv flexibilitet.

    `,
      steps: [
       {
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ], 
  },
  {
    id: 4,
    title: "Rätt fett",
    color: tipCardColors.yellow,
    //healthScore: 3,
    freq: `Dagligen`,
    summary: `Att få i sig mer omättade fetter och mindre mättade, minskar risken för hjärt- och kärlsjukdom avsevärt.`, 
    detailedInfo:` 
   Omättade fetter finns i t.ex. rapsolja, olivolja, nötter och fisk. 
   
   De minskar risken för hjärt kärlsjukdom eftersom de 
   • sänker det dåliga kolesterol som lägger sig i kärlväggarna och orsakar förtjockning.
   • minskar inflammation i blodkärlen, vilket är en grundläggande orsak till åderförfettning. 
   • gör blodet mindre benäget att levra sig, vilket förhindrar blodproppar. 

    Mättade fetter från t.ex. smör, rött kött, palmolja har motsatt effekt, 
    de höjer LDL-kolesterol och ökar inflammation. 
    Genom bytesprincipen får du alltså en trippelverkan: lägre dåligt 
    kolesterol, mindre inflammation och tunnare blod.

    
      "Byt ut smör mot flytande margarin på mackan",
      "Använd rapsolja eller olivolja vid matlagning",
      "Snacksa på nötter istället för chips",
    `,
    
       steps: [
       {
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ], 
  },
  {
    id: 5,
    title: "Mer magra mejerier",
    color: tipCardColors.lightblue,
    //healthScore: 3,
    freq: `Dagligen`,
    summary: ``, 
    detailedInfo:`
    
    Att välja magra mejeriprodukter 
    
    Magra mejeriprodukter innehåller kalcium, protein, jod, D-vitaminer m.fl.
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
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ], 
  },
  {
    id: 6,
    title: "Rött och bearbetat kött",
    color: tipCardColors.darkrose,
    //healthScore: 3,
    freq: `Veckovis`,
    summary: ``, 
    detailedInfo: `
    
    Att äta max 500 g kött per vecka, minskar risken för tjocktarmscancer.
    
    Kött innehåller protein, järn och B-vitaminer, men ett stort intag ökar risken för tjocktarmscancer.
     
    
    och framförallt begränsa bearbetated köttprodukter
    Begränsa chark, korv och andra bearbetade köttprodukter
    
      `,
        steps: [
       {
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ], 
  },
  {
    id: 7,
    title: "Salt-halt",
    color: tipCardColors.graygreen,
    //healthScore: 4,
    freq: `Dagligen`,
    summary: ``, 
    detailedInfo: `
    
    Att äta mindre än 6 gram salt per dag minskar risken för 
    
    Salt förhöjer smaken på maten och innehåller mineraler. 
    För mycket salt ökar risken för högt blodtryck. 
    Ät max 6 gram salt per dag - det motsvarar en tesked. 
    Använd joderat salt och undvik att salta för mycket.",
     
      "Smaka på maten innan du saltar",
      "Krydda med örter och kryddor istället för salt",
      "Välj produkter med lägre saltinnehåll",
      `,
        steps: [
       {
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ], 
  },
  {
    id: 8,
    title: "Lagom är bäst",
    color: tipCardColors.lightpurple,
    //healthScore: 4,
    freq: `Dagligen`,
    summary: ``, 
    detailedInfo:`

    Att minska på portionerna vid varje mål



      "Energibehovet varierar mellan personer beroende på ålder, kön och hur mycket du rör dig. Ät lagom mycket för att hålla en hälsosam vikt.",
      "Använd mindre tallrikar för att kontrollera portioner",
      "Ät långsamt och känn efter när du är mätt",
      "Planera regelbundna måltider - 3 huvudmål och 2 mellanmål",
      `,
        steps: [
       {
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ], 
  },
  {
    id: 9,
    title: "30 min om dagen",
    color: tipCardColors.lightgreen,
    //healthScore: 5,
    freq: `Dagligen`,
    summary: ``, 
    detailedInfo: `
    
    Att röra på sig minst 30 minuter per dag 
    
    Fysisk aktivitet stärker din kropp både fysiskt och psykiskt. 

       är en viktig del av en hälsosam livsstil. Rör på dig minst 30 minuter om dagen med måttlig intensitet.",
     "Gå en 30 minuters promenad varje dag",
      "Ta trapporna istället för hissen",
      "Hitta en aktivitet du tycker om - dans, simning eller cykling",
     
      `,
        steps: [
       {
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ], 
  },
  {
    id: 10,
    title: "Ät mer baljväxter",
    color: tipCardColors.orange,
    //healthScore: 3,
    freq: `Dagligen`,
    summary: ``, 
    detailedInfo: `
    
    Att äta 
    
    Bönor, linser och ärtor är bra proteinkällor och innehåller fibrer.
      "Baljväxter som bönor, linser, ärtor och kikärtor
       innehåller protein, fibrer, vitaminer och mineraler. 
      De är klimatsmarta alternativ till kött.",
       "Blanda 50% baljväxter i köttfärsen vid tacos eller bolognese",
      "Testa en lins- eller böngryta varje vecka",
      "Snacksa på rostade kikärtor eller bönor",
     
      `,
       steps: [
       {
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ], 
  },
  {
    id: 11,
    title: "Minska på sockret",
    color: tipCardColors.purple,
   // healthScore: 3,
    freq: `Dagligen`,
    summary: ``, 
    detailedInfo: `
    
    Att minska på sockret 
    Sötsaker är trevligt vid speciella tillfällen. 
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
          heading: "Hitta ditt NÄR?",
          content: [
            ".... ",
            ".... "
          ]
        },
        {
          heading: "Hitta ditt HUR?",
          content: [
            ".... ",
            ".... "
          ]
        }
      ], 
  },
];

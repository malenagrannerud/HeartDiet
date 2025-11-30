// ==========================================
// MEDICATION DATABASE WITH FOOD INTERACTIONS
// ==========================================
// 30 common Swedish medications with evidence-based food interactions

export interface FoodInteraction {
  tipId: number;              // Links to tip.id (1-11)
  foods: string[];            // List of foods to be careful with
  effect: string;             // What happens when combined
  severity: 'high' | 'medium' | 'low';
  advice: string;             // Evidence-based recommendation
  alternative: string;        // Evidence-based alternative for the patient
}

export interface MedicationData {
  id: string;
  name: string;               // Swedish name with generic in parentheses
  genericName: string;        // Generic name in lowercase
  category: string;           // Category in Swedish
  searchTerms: string[];      // For search functionality
  foodInteractions: FoodInteraction[];
}

export const medications: MedicationData[] = [
  // ========== BLODFÖRTUNNANDE MEDICINER ==========
  {
    id: "warfarin",
    name: "Waran (Warfarin)",
    genericName: "warfarin",
    category: "Blodförtunnande",
    searchTerms: ["waran", "warfarin", "blodförtunnande"],
    foodInteractions: [
      {
        tipId: 1, // Frukt & grönt
        foods: ["Spenat", "Grönkål", "Broccoli", "Kål", "Sallad"],
        effect: "Vitamin K minskar medicinens effekt",
        severity: "high",
        advice: "Ät jämna mängder vitamin K-rika grönsaker varje vecka. Undvik stora förändringar i intaget.",
        alternative: "Välj grönsaker med mindre vitamin K: gurka, tomat, paprika, squash, morötter"
      },
      {
        tipId: 3, // Fisk
        foods: ["Fet fisk", "Fiskolja", "Omega-3 tillskott"],
        effect: "Omega-3 kan öka blödningsrisken",
        severity: "medium",
        advice: "Ät fisk 2-3 gånger/vecka, men undvik stora doser omega-3 tillskott utan att rådgöra med läkare.",
        alternative: "Fortsätt äta vanliga portioner av lax, makrill och sill. Undvik endast höga doser tillskott"
      }
    ]
  },
  {
    id: "apixaban",
    name: "Eliquis (Apixaban)",
    genericName: "apixaban",
    category: "Blodförtunnande (DOAC)",
    searchTerms: ["eliquis", "apixaban", "doac", "blodförtunnande"],
    foodInteractions: []
  },
  {
    id: "rivaroxaban",
    name: "Xarelto (Rivaroxaban)",
    genericName: "rivaroxaban",
    category: "Blodförtunnande (DOAC)",
    searchTerms: ["xarelto", "rivaroxaban", "doac", "blodförtunnande"],
    foodInteractions: []
  },
  {
    id: "dabigatran",
    name: "Pradaxa (Dabigatran)",
    genericName: "dabigatran",
    category: "Blodförtunnande (DOAC)",
    searchTerms: ["pradaxa", "dabigatran", "doac", "blodförtunnande"],
    foodInteractions: []
  },

  // ========== KOLESTEROLSÄNKANDE ==========
  {
    id: "atorvastatin",
    name: "Lipitor (Atorvastatin)",
    genericName: "atorvastatin",
    category: "Kolesterolsänkande (Statin)",
    searchTerms: ["lipitor", "atorvastatin", "statin", "kolesterol"],
    foodInteractions: [
      {
        tipId: 4, // Rätt fett
        foods: ["Grapefrukt", "Grapefruktjuice"],
        effect: "Grapefrukt ökar medicinhalten i blodet och risk för biverkningar",
        severity: "high",
        advice: "Undvik grapefrukt och grapefruktjuice helt. Ät inte ens på morgonen om du tar medicinen på kvällen.",
        alternative: "Byt till apelsin, clementin, mandarin eller andra citrusfrukter som inte påverkar medicinen"
      }
    ]
  },
  {
    id: "simvastatin",
    name: "Simvastatin",
    genericName: "simvastatin",
    category: "Kolesterolsänkande (Statin)",
    searchTerms: ["simvastatin", "statin", "kolesterol", "zocor"],
    foodInteractions: [
      {
        tipId: 4, // Rätt fett
        foods: ["Grapefrukt", "Grapefruktjuice"],
        effect: "Grapefrukt ökar medicinhalten i blodet kraftigt",
        severity: "high",
        advice: "Undvik grapefrukt och grapefruktjuice helt. Även små mängder kan påverka.",
        alternative: "Välj andra citrusfrukter: apelsin, clementin, lime, citron är säkra alternativ"
      }
    ]
  },
  {
    id: "rosuvastatin",
    name: "Crestor (Rosuvastatin)",
    genericName: "rosuvastatin",
    category: "Kolesterolsänkande (Statin)",
    searchTerms: ["crestor", "rosuvastatin", "statin", "kolesterol"],
    foodInteractions: []
  },

  // ========== DIABETESMEDICINER ==========
  {
    id: "metformin",
    name: "Metformin",
    genericName: "metformin",
    category: "Diabetesmedicin",
    searchTerms: ["metformin", "diabetes", "blodsockersänkande"],
    foodInteractions: [
      {
        tipId: 8, // Lagom är bäst
        foods: ["Alkohol"],
        effect: "Alkohol ökar risken för farligt lågt blodsocker (laktacidos)",
        severity: "high",
        advice: "Undvik alkohol på tom mage. Om du dricker, ät mat samtidigt och begränsa till 1-2 glas.",
        alternative: "Välj alkoholfria alternativ vid social samvaro eller drick endast till mat i måttliga mängder"
      },
      {
        tipId: 11, // Socker
        foods: ["Snabba kolhydrater", "Sötsaker", "Läsk"],
        effect: "Kan ge blodsockertoppar trots medicinering",
        severity: "medium",
        advice: "Undvik läsk, godis och sötsaker. Välj långsamma kolhydrater som fullkorn.",
        alternative: "Ät frukt, bär, fullkornsprodukter och rotfrukter för stabil blodsockernivå"
      }
    ]
  },
  {
    id: "glibenklamid",
    name: "Glibenklamid",
    genericName: "glibenklamid",
    category: "Diabetesmedicin (Sulfonureider)",
    searchTerms: ["glibenklamid", "diabetes", "blodsockersänkande"],
    foodInteractions: [
      {
        tipId: 8, // Lagom
        foods: ["Alkohol"],
        effect: "Alkohol ökar risken för farligt lågt blodsocker",
        severity: "high",
        advice: "Undvik alkohol på tom mage. Ät alltid mat när du dricker alkohol.",
        alternative: "Välj alkoholfria drycker eller drick max 1-2 glas till mat"
      }
    ]
  },
  {
    id: "sitagliptin",
    name: "Januvia (Sitagliptin)",
    genericName: "sitagliptin",
    category: "Diabetesmedicin (DPP-4-hämmare)",
    searchTerms: ["januvia", "sitagliptin", "diabetes"],
    foodInteractions: []
  },

  // ========== BLODTRYCKSMEDICINER ==========
  {
    id: "ramipril",
    name: "Ramipril",
    genericName: "ramipril",
    category: "Blodtrycksmedicin (ACE-hämmare)",
    searchTerms: ["ramipril", "ace", "blodtryck", "triatec"],
    foodInteractions: [
      {
        tipId: 1, // Frukt & grönt
        foods: ["Bananer", "Avokado", "Spenat", "Potatis"],
        effect: "Kaliumrika livsmedel kan ge för högt kalium i blodet",
        severity: "medium",
        advice: "Ät kaliumrika grönsaker i normal mängd, men undvik extra kaliumtillskott och saltsubstitut.",
        alternative: "Variera med andra grönsaker: gurka, tomat, paprika, morötter"
      },
      {
        tipId: 7, // Salt
        foods: ["Saltsubstitut med kalium"],
        effect: "Kaliumhalter kan bli farligt höga",
        severity: "high",
        advice: "Undvik saltsubstitut som innehåller kalium. Använd örter och kryddor istället.",
        alternative: "Smaksätt med örter: basilika, timjan, rosmarin, vitlök, citron"
      }
    ]
  },
  {
    id: "enalapril",
    name: "Enalapril",
    genericName: "enalapril",
    category: "Blodtrycksmedicin (ACE-hämmare)",
    searchTerms: ["enalapril", "ace", "blodtryck", "renitec"],
    foodInteractions: [
      {
        tipId: 1, // Frukt & grönt
        foods: ["Bananer", "Avokado", "Spenat", "Potatis"],
        effect: "Kaliumrika livsmedel kan ge för högt kalium i blodet",
        severity: "medium",
        advice: "Ät i måttliga mängder. Undvik extra kaliumtillskott.",
        alternative: "Blanda med lågkaliumgrönsaker: gurka, tomat, paprika"
      },
      {
        tipId: 7, // Salt
        foods: ["Saltsubstitut med kalium"],
        effect: "Risk för höga kaliumvärden",
        severity: "high",
        advice: "Undvik saltsubstitut. Använd örter och kryddor istället för salt.",
        alternative: "Vitlök, lök, citron, vinäger och färska örter ger god smak utan risk"
      }
    ]
  },
  {
    id: "lisinopril",
    name: "Lisinopril",
    genericName: "lisinopril",
    category: "Blodtrycksmedicin (ACE-hämmare)",
    searchTerms: ["lisinopril", "ace", "blodtryck", "zestril"],
    foodInteractions: [
      {
        tipId: 1, // Frukt & grönt
        foods: ["Bananer", "Avokado", "Spenat"],
        effect: "Kaliumrika livsmedel kan ge för högt kalium",
        severity: "medium",
        advice: "Ät i normala mängder, undvik stora portioner dagligen.",
        alternative: "Variera med lågkaliumgrönsaker: gurka, sallad, tomat, paprika"
      }
    ]
  },
  {
    id: "amlodipin",
    name: "Amlodipin",
    genericName: "amlodipin",
    category: "Blodtrycksmedicin (Kalciumflödeshämmare)",
    searchTerms: ["amlodipin", "kalcium", "blodtryck", "norvasc"],
    foodInteractions: [
      {
        tipId: 4, // Rätt fett
        foods: ["Grapefrukt", "Grapefruktjuice"],
        effect: "Grapefrukt ökar medicinhalten och kan sänka blodtrycket för mycket",
        severity: "high",
        advice: "Undvik grapefrukt helt under behandlingen.",
        alternative: "Andra citrusfrukter är säkra: apelsin, clementin, mandarin"
      }
    ]
  },

  // ========== DIURETIKA (VÄTSKEDRIVANDE) ==========
  {
    id: "furosemid",
    name: "Furosemid",
    genericName: "furosemid",
    category: "Vätskedrivande (Diuretika)",
    searchTerms: ["furosemid", "diuretika", "vätskedrivande", "lasix"],
    foodInteractions: [
      {
        tipId: 1, // Frukt & grönt
        foods: ["Bananer", "Aprikoser", "Spenat"],
        effect: "Medicinen ökar kaliumförlust, kaliumrika livsmedel kan hjälpa",
        severity: "low",
        advice: "Ät kaliumrika livsmedel för att kompensera förlusten via urinen.",
        alternative: "Fortsätt äta kaliumrika grönsaker och frukt - det är bra för dig!"
      },
      {
        tipId: 7, // Salt
        foods: ["Salt", "Saltrika livsmedel"],
        effect: "För mycket salt motverkar medicinens effekt",
        severity: "medium",
        advice: "Begränsa salt för bästa effekt av medicinen.",
        alternative: "Använd örter och kryddor istället för salt vid matlagning"
      }
    ]
  },
  {
    id: "hydrochlorothiazide",
    name: "Hydroklorotiazid",
    genericName: "hydroklorotiazid",
    category: "Vätskedrivande (Tiaziddiuretika)",
    searchTerms: ["hydroklorotiazid", "hctz", "diuretika", "vätskedrivande"],
    foodInteractions: [
      {
        tipId: 7, // Salt
        foods: ["Salt", "Saltrika produkter"],
        effect: "Salt motverkar medicinens blodtryckssänkande effekt",
        severity: "medium",
        advice: "Minska saltintaget för bättre effekt av medicinen.",
        alternative: "Krydda med örter: basilika, oregano, rosmarin, vitlök"
      }
    ]
  },
  {
    id: "spironolakton",
    name: "Spironolakton",
    genericName: "spironolakton",
    category: "Vätskedrivande (Kaliumsparande)",
    searchTerms: ["spironolakton", "aldactone", "diuretika"],
    foodInteractions: [
      {
        tipId: 1, // Frukt & grönt
        foods: ["Bananer", "Avokado", "Spenat", "Tomater"],
        effect: "Risk för farligt högt kalium i blodet",
        severity: "high",
        advice: "Begränsa kaliumrika livsmedel. Undvik kaliumtillskott helt.",
        alternative: "Välj lågkaliumgrönsaker: gurka, sallad, paprika, squash, morötter"
      },
      {
        tipId: 7, // Salt
        foods: ["Saltsubstitut med kalium"],
        effect: "Kaliumsubstitut kan ge livshotande kaliumvärden",
        severity: "high",
        advice: "Använd aldrig saltsubstitut. Använd örter istället.",
        alternative: "Smaksätt med citron, vitlök, örter och kryddor"
      }
    ]
  },

  // ========== SKÖLDKÖRTELMEDICIN ==========
  {
    id: "levothyroxine",
    name: "Levaxin (Levotyroxin)",
    genericName: "levotyroxin",
    category: "Sköldkörtelmedicin",
    searchTerms: ["levaxin", "levotyroxin", "sköldkörtel", "tyroxin"],
    foodInteractions: [
      {
        tipId: 2, // Fullkorn
        foods: ["Fibrer", "Fullkornsprodukter"],
        effect: "Fibrer minskar upptaget av medicinen",
        severity: "medium",
        advice: "Ta medicinen på tom mage 30-60 min före frukost. Vänta med fibrer tills efter.",
        alternative: "Ta medicinen tidigt på morgonen, ät fullkorn senare på dagen"
      },
      {
        tipId: 5, // Mejerier
        foods: ["Mjölk", "Yoghurt", "Kalciumrika produkter"],
        effect: "Kalcium minskar medicinupptaget",
        severity: "medium",
        advice: "Vänta minst 4 timmar mellan medicin och kalciumrika produkter.",
        alternative: "Ta medicinen på morgonen på tom mage, ät mejeriprodukter senare"
      }
    ]
  },

  // ========== MAGSÅRSMEDICINER ==========
  {
    id: "omeprazol",
    name: "Omeprazol",
    genericName: "omeprazol",
    category: "Magsårsmedicin (PPI)",
    searchTerms: ["omeprazol", "losec", "ppi", "magsår", "reflux"],
    foodInteractions: [
      {
        tipId: 5, // Mejerier
        foods: ["Kalciumrika livsmedel"],
        effect: "Långtidsbehandling kan minska kalciumupptag och öka benskörhet",
        severity: "low",
        advice: "Vid långtidsanvändning, se till att få tillräckligt med kalcium och D-vitamin.",
        alternative: "Ät kalciumrika livsmedel: mejeriprodukter, gröna bladgrönsaker, mandlar"
      }
    ]
  },
  {
    id: "pantoprazol",
    name: "Pantoprazol",
    genericName: "pantoprazol",
    category: "Magsårsmedicin (PPI)",
    searchTerms: ["pantoprazol", "somac", "ppi", "magsår"],
    foodInteractions: [
      {
        tipId: 5, // Mejerier
        foods: ["Kalciumrika livsmedel"],
        effect: "Kan påverka kalciumupptag vid långvarig användning",
        severity: "low",
        advice: "Ät kalciumrika livsmedel regelbundet.",
        alternative: "Inkludera yoghurt, ost, gröna bladgrönsaker i kosten"
      }
    ]
  },

  // ========== ANTIBIOTIKA ==========
  {
    id: "ciprofloxacin",
    name: "Ciprofloxacin",
    genericName: "ciprofloxacin",
    category: "Antibiotika (Fluorokinolon)",
    searchTerms: ["ciprofloxacin", "cipro", "antibiotika"],
    foodInteractions: [
      {
        tipId: 5, // Mejerier
        foods: ["Mjölk", "Yoghurt", "Ost"],
        effect: "Kalcium minskar antibiotikaupptaget kraftigt",
        severity: "high",
        advice: "Undvik mejerier 2 timmar före och 6 timmar efter antibiotika.",
        alternative: "Drick vatten till medicinen. Ät mejerier mellan doserna när tillräcklig tid har gått"
      }
    ]
  },
  {
    id: "doxycyklin",
    name: "Doxyferm (Doxycyklin)",
    genericName: "doxycyklin",
    category: "Antibiotika (Tetracyklin)",
    searchTerms: ["doxycyklin", "doxyferm", "antibiotika", "tetracyklin"],
    foodInteractions: [
      {
        tipId: 5, // Mejerier
        foods: ["Mjölk", "Yoghurt", "Ost"],
        effect: "Kalcium binder antibiotikan och minskar effekten",
        severity: "high",
        advice: "Ta minst 2 timmar före eller efter mejeriprodukter.",
        alternative: "Ta medicinen med vatten. Planera mejeriintag mellan doserna"
      },
      {
        tipId: 2, // Fullkorn
        foods: ["Järnrika livsmedel", "Järntillskott"],
        effect: "Järn minskar antibiotikaupptaget",
        severity: "medium",
        advice: "Undvik järntillskott under behandlingen.",
        alternative: "Ät järnrika livsmedel mellan doserna när möjligt"
      }
    ]
  },

  // ========== BENSKÖRHETSMEDICIN ==========
  {
    id: "alendronate",
    name: "Fosamax (Alendronat)",
    genericName: "alendronat",
    category: "Benskörhetsmedicin (Bisfosfonat)",
    searchTerms: ["fosamax", "alendronat", "bisfosfonat", "benskörhet"],
    foodInteractions: [
      {
        tipId: 5, // Mejerier
        foods: ["All mat", "Drycker utom vatten"],
        effect: "Mat minskar medicinupptaget drastiskt",
        severity: "high",
        advice: "Ta medicinen på tom mage när du vaknar. Vänta 30 min innan du äter eller dricker något annat än vatten.",
        alternative: "Drick endast vanligt vatten tillsammans med medicinen. Ät frukost efter 30 minuter"
      }
    ]
  },

  // ========== STÄMNINGSSTABILISERARE ==========
  {
    id: "lithium",
    name: "Lithionit (Litium)",
    genericName: "litium",
    category: "Stämningsstabiliserare",
    searchTerms: ["litium", "lithionit", "bipolär"],
    foodInteractions: [
      {
        tipId: 7, // Salt
        foods: ["Salt", "Natriumrika livsmedel"],
        effect: "Stora förändringar i saltintag påverkar litiumhalten i blodet",
        severity: "high",
        advice: "Håll ett stabilt saltintag. Undvik plötsliga förändringar i kosten.",
        alternative: "Ät jämnt med salt varje dag - varken för mycket eller för lite. Konsultera läkare vid kostförändringar"
      }
    ]
  },

  // ========== ANTIKOAGULANTIA/TROMBOCYTHÄMMARE ==========
  {
    id: "clopidogrel",
    name: "Plavix (Klopidogrel)",
    genericName: "klopidogrel",
    category: "Trombocythämmare",
    searchTerms: ["plavix", "klopidogrel", "blodförtunnande"],
    foodInteractions: [
      {
        tipId: 4, // Rätt fett
        foods: ["Grapefrukt"],
        effect: "Kan påverka medicinens aktivering i kroppen",
        severity: "medium",
        advice: "Begränsa grapefrukt, särskilt stora mängder.",
        alternative: "Välj andra citrusfrukter för vitamin C: apelsin, clementin"
      }
    ]
  },

  // ========== TILLSKOTT (OFTA FÖRSKRIVNA) ==========
  {
    id: "iron",
    name: "Järntillskott",
    genericName: "järn",
    category: "Mineraltillskott",
    searchTerms: ["järn", "järntillskott", "ferritin", "niferex"],
    foodInteractions: [
      {
        tipId: 5, // Mejerier
        foods: ["Mjölk", "Yoghurt", "Ost"],
        effect: "Kalcium minskar järnupptaget",
        severity: "medium",
        advice: "Ta järn minst 2 timmar från mejeriprodukter.",
        alternative: "Ta järn med vitamin C-rik juice (apelsin) för bättre upptag. Ät mejerier senare"
      },
      {
        tipId: 2, // Fullkorn
        foods: ["Kaffe", "Te", "Fiberrika produkter"],
        effect: "Minskar järnupptaget",
        severity: "medium",
        advice: "Undvik kaffe/te 1 timme före och efter järntillskott.",
        alternative: "Ta järn med vatten eller apelsinjuice på tom mage"
      }
    ]
  },
  {
    id: "calcium",
    name: "Kalciumtillskott",
    genericName: "kalcium",
    category: "Mineraltillskott",
    searchTerms: ["kalcium", "kalktabletter", "calcium"],
    foodInteractions: [
      {
        tipId: 2, // Fullkorn
        foods: ["Fiberrika produkter", "Fullkorn"],
        effect: "Fibrer kan minska kalciumupptaget",
        severity: "low",
        advice: "Ta kalcium mellan måltider för bästa upptag.",
        alternative: "Ta kalcium med lite mat men inte vid fiberrika måltider"
      }
    ]
  },

  // ========== MAO-HÄMMARE (mindre vanliga men viktiga) ==========
  {
    id: "moclobemide",
    name: "Aurorix (Moklobemid)",
    genericName: "moklobemid",
    category: "Antidepressiva (MAO-hämmare)",
    searchTerms: ["aurorix", "moklobemid", "mao", "antidepressiva"],
    foodInteractions: [
      {
        tipId: 1, // Frukt & grönt
        foods: ["Mogen avokado", "Banan (övermogen)"],
        effect: "Tyramin kan ge farligt högt blodtryck",
        severity: "medium",
        advice: "Undvik övermogna frukter. Ät färska frukter i normal mognad.",
        alternative: "Välj friska, inte övermogna frukter. Undvik lagrade och jästa livsmedel"
      },
      {
        tipId: 6, // Kött
        foods: ["Lagrade ostar", "Korv", "Charkuterier", "Fermenterade produkter"],
        effect: "Tyramin kan ge blodtryckskris",
        severity: "high",
        advice: "Undvik lagrade, fermenterade och rökta livsmedel helt.",
        alternative: "Välj färsk, obehandlad mat: färskt kött, färsk ost, färska grönsaker"
      }
    ]
  },

  // ========== ANTIEPILEPTIKA ==========
  {
    id: "carbamazepine",
    name: "Tegretol (Karbamazepin)",
    genericName: "karbamazepin",
    category: "Antiepileptika",
    searchTerms: ["tegretol", "karbamazepin", "epilepsi"],
    foodInteractions: [
      {
        tipId: 4, // Rätt fett
        foods: ["Grapefrukt", "Grapefruktjuice"],
        effect: "Grapefrukt ökar medicinhalten och risk för biverkningar",
        severity: "high",
        advice: "Undvik grapefrukt helt under behandlingen.",
        alternative: "Andra citrusfrukter är säkra: apelsin, clementin, mandarin, citron"
      }
    ]
  },
  {
    id: "phenytoin",
    name: "Fenytonin",
    genericName: "fenytonin",
    category: "Antiepileptika",
    searchTerms: ["fenytonin", "difhydan", "epilepsi"],
    foodInteractions: [
      {
        tipId: 5, // Mejerier
        foods: ["Kalcium", "D-vitaminrika produkter"],
        effect: "Medicinen kan minska upptag av kalcium och D-vitamin",
        severity: "low",
        advice: "Ät kalcium- och D-vitaminrika livsmedel regelbundet.",
        alternative: "Inkludera mejeriprodukter, berikade produkter och fet fisk i kosten"
      }
    ]
  }
];

// Helper function to get medications by category
export const getMedicationsByCategory = (category: string): MedicationData[] => {
  return medications.filter(med => med.category.toLowerCase().includes(category.toLowerCase()));
};

// Helper function to search medications
export const searchMedications = (query: string): MedicationData[] => {
  const lowerQuery = query.toLowerCase();
  return medications.filter(med => 
    med.searchTerms.some(term => term.includes(lowerQuery))
  );
};

// Helper function to get medications with interactions for a specific tip
export const getMedicationsForTip = (tipId: number): MedicationData[] => {
  return medications.filter(med => 
    med.foodInteractions.some(interaction => interaction.tipId === tipId)
  );
};

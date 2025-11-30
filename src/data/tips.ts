import { tipCardColors } from '@/lib/design-tokens';

export interface UserPlan {
  goal:string;
  when: string;        
  how: string;        
  reminder?: string;  // My reminder
}

export interface Tip {
  id: number;
  title: string;
  color: string;
  freq: string;
  icon: string;
}

export const tips: Tip[] = [
  {
    id: 1,
    title: "Fem om dagen",
    color: tipCardColors.green,
    freq: "Dagligen",
    icon: "Apple"
  },

  {
    id: 2,
    title: "Fyll på med fullkorn",
    color: tipCardColors.amber,
    freq: `Dagligen`,
    icon: "Wheat"
  },
  {
    id: 3,
    title: "Fisk & skaldjur",
    color: tipCardColors.cyan,
    freq: `Veckovis`,
    icon: "Fish"
  },
 {
    id: 4,
    title: "Rätt fett",
    color: tipCardColors.yellow,
    freq: `Dagligen`,
    icon: "Droplets"
  },
  {
    id: 5,
    title: "Mer magra mejerier",
    color: tipCardColors.lightblue,
    freq: `Dagligen`,
    icon: "Milk"
  },
  {
    id: 6,
    title: "Rött och bearbetat kött",
    color: tipCardColors.darkrose,
    freq: `Veckovis`,
    icon: "Beef"
  },
  {
    id: 7,
    title: "Salt-halt",
    color: tipCardColors.graygreen,
    freq: `Dagligen`,
    icon: "PackageOpen"
  },
  {
    id: 8,
    title: "Lagom är bäst",
    color: tipCardColors.lightpurple,
    freq: `Dagligen`,
    icon: "UtensilsCrossed"
  },
 {
    id: 9,
    title: "30 min om dagen",
    color: tipCardColors.lightgreen,
    freq: `Dagligen`,
    icon: "Footprints"
  },
 {
  id: 10,
  title: "Ät mer baljväxter",
  color: tipCardColors.orange,
  freq: `Dagligen`,
  icon: "Sprout"
  },
  {
   id: 11,
   title: "Minska på sockret",
   color: tipCardColors.purple,
   freq: `Dagligen`,
   icon: "Candy"
  },
];
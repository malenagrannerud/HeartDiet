import { tipCardColors } from '@/lib/design-tokens';

export interface UserPlan {
  when: string;        
  how: string;        
  //reminder?: string;  // My reminder
}

export interface Tip {
  id: number;
  title: string;
  color: string;
  freq: string;
}

export const tips: Tip[] = [
  {
    id: 1,
    title: "Fem om dagen",
    color: tipCardColors.green,
    freq: "Dagligen"
  },

  {
    id: 2,
    title: "Fyll på med fullkorn",
    color: tipCardColors.amber,
    freq: `Dagligen`
  },
  {
    id: 3,
    title: "Fisk och skaldjur",
    color: tipCardColors.cyan,
    freq: `Veckovis`
  },
//  {
//    id: 4,
//    title: "Rätt fett",
//    color: tipCardColors.yellow,
//    freq: `Dagligen`
//  },
//  {
//    id: 5,
//    title: "Mer magra mejerier",
//    color: tipCardColors.lightblue,
//    freq: `Dagligen`
//  },
//  {
//    id: 6,
//    title: "Rött och bearbetat kött",
//    color: tipCardColors.darkrose,
//    freq: `Veckovis`
//  },
//  {
//    id: 7,
//    title: "Salt-halt",
//    color: tipCardColors.graygreen,
//    freq: `Dagligen`
//  },
 // {
  //  id: 8,
   // title: "Lagom är bäst",
  //  color: tipCardColors.lightpurple,
  //  freq: `Dagligen`  
  //},
 // {
 //   id: 9,
 //   title: "30 min om dagen",
 //   color: tipCardColors.lightgreen,
 //   freq: `Dagligen`
 // },
  //{
  //  id: 10,
  //  title: "Ät mer baljväxter",
  //  color: tipCardColors.orange,
  //  freq: `Dagligen` 
  //},
  //{
   // id: 11,
    //title: "Minska på sockret",
//color: tipCardColors.purple,
 //  freq: `Dagligen`
 // },
];
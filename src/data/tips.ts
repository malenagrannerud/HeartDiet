//import { tipCardColors } from '@/lib/design-tokens';

export interface UserPlan {
  when: string;        
  how: string;        
  reminder?: string;  // My reminder
}

export const colors = {
  // Main background for all frames
  background: {
    primary: '#FFFFFF',    // main background
    secondary: '#FFFFFF',  // White - for cards
    tertiary: '#D5EDF9',   // Light blue - special sections
  },
  
  // Main header color
  header: {
    main: '#212658',       // Dark blue - ALL main headers
    secondary: '#212658',  // Same for consistency
  },
  
  // Text colors
  text: {
    primary: '#212658',         // Main text
    secondary: 'rgba(33, 38, 88, 0.7)',  // 70% opacity for subtitles
  },
  
  // Tip card colors
  tipCards: {
    green: '#A8CC7D',
    lightgreen: '#E4F5CF',
    graygreen: '#DAEADE',
    amber: '#FFD670',
    orange: '#FFEDD5',
    yellow: '#FAEAC2',
    blue: '#4C73D7',
    cyan: '#C1DFE9',
    lightblue: '#E4F3F8',
    darkrose: '#F0B7CC',
    rose: '#FDD8E5',
    purple: '#B095CB',
    lightpurple: '#E7D7F7',
    
  },
} as const;

export const tipCardColors = {
  green: "bg-[#A8CC7D]",
  lightgreen: "bg-[#E4F5CF]",
  graygreen: "bg-[#DAEADE]",
  amber: "bg-[#FFD670]",
  orange: "bg-[#FFEDD5]",
  yellow: "bg-[#FAEAC2]",
  blue: "bg-[#4C73D7]",
  cyan: "bg-[#C1DFE9]",
  lightblue: "bg-[#E4F3F8]",
  darkrose: "bg-[#F0B7CC]",
  rose: "bg-[#FDD8E5]",
  purple: "bg-[#B095CB]",
  lightpurple: "bg-[#E7D7F7]",
} as const;

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
    freq: `Dagligen`
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
  {
    id: 8,
    title: "Lagom är bäst",
    color: tipCardColors.lightpurple,
    freq: `Dagligen`  
  },
  {
    id: 9,
    title: "30 min om dagen",
    color: tipCardColors.lightgreen,
    freq: `Dagligen`
  },
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
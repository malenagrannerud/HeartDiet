/**
 * ==========================================
 * design-tokens.ts
 * 
 * 
 * 
 * 
 * CENTRALIZED DESIGN TOKENS - HIGH CONTRAST
 * ==========================================
 * 
 * All titles, subtitles, headings, text styles, card sizes, 
 * and colors are defined here for consistency across the app.
 * 
 * USAGE: Import and use these tokens in all components
 * Example: import { pageTitle, sectionHeading } from '@/lib/design-tokens'
 * 
 * ==========================================
 * STANDARDIZATION RULES
 * ==========================================
 * 
 * SPACING:
 * - Main page content sections: space-y-6
 * - Card lists (multiple cards): space-y-4
 * - Content within sections: space-y-3
 * - Form fields: space-y-3
 * 
 * CARDS:
 * - All cards: p-5 padding, min-h-[80px]
 * - Non-tip cards: bg-gray-100 (high contrast gray)
 * - Tip cards: Keep original colors from tip.color
 * - Interactive cards: Same base + hover:bg-gray-200
 * 
 * TYPOGRAPHY:
 * - Page titles: text-4xl (pageTitle)
 * - Page subtitles: text-lg (pageSubtitle)
 * - Section headings: text-lg (sectionHeading)
 * - Card titles: text-xl (cardTitle)
 * - Card body text: text-base (cardText)
 * - Small text: text-sm (cardTextSmall)
 * 
 * COLORS (HIGH CONTRAST):
 * - Headers: black
 * - Body text: black or gray-700 for secondary
 * - Card backgrounds: bg-gray-100 (except tip cards)
 * - Page background: white
 */

// ==========================================
// 🎨 COLORS (High Contrast)
// ==========================================
export const colors = {
  // Main background for all frames
  background: {
    primary: '#FFFFFF',    // main background
    secondary: '#FFFFFF',  // White - for cards
    tertiary: '#E5E7EB',   // Light gray - special sections
  },
  
  // Main header color (high contrast)
  header: {
    main: '#000000',       // Pure black - ALL main headers
    secondary: '#000000',  // Same for consistency
  },
  
  // Text colors (high contrast)
  text: {
    primary: '#000000',    // Pure black - main text
    secondary: '#374151',  // Gray-700 for secondary text
  },
  
  // Tip card colors (preserved for categorization)
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
  
  // Completion/checkbox color
  completion: {
    primary: '#059669',  // Deep emerald green - vibrant and popping
  },
  
  // Selection/bookmark color
  selection: {
    primary: '#4C73D7',  // Blue - for selection/bookmark actions
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

export const completionColor = {
  bg: "bg-[#059669]",
  border: "border-[#059669]",
} as const;

export const selectionColor = {
  bg: "bg-[#4C73D7]",
  border: "border-[#4C73D7]",
} as const;

// ==========================================
// 📏 SPACING 
// ==========================================
/**
 * SPACING STANDARDS
 * - pageContent: Main page content sections (space-y-6)
 * - cardList: Lists of cards (space-y-4)
 * - sectionContent: Content within a section (space-y-3)
 * - formFields: Form field spacing (space-y-3)
 */
export const standardSpacing = {
  pageContent: "space-y-6",
  cardList: "space-y-4",
  sectionContent: "space-y-3",
  formFields: "space-y-3",
} as const;

/**
 * PAGE CONTAINER-  Main page container styling
 */
export const pageContainer = "min-h-screen pb-24 space-y-6 bg-background";

/**
 * HEADER CONTAINER - Page header styling
 */
export const headerContainer = "border-b border-border sticky top-0 z-10 p-6 pt-8";

/**
 * PAGE PADDING - Standard page padding 24 px around 
 */
export const pagePadding = "p-6";

// ==========================================
// 📝 TYPOGRAPHY - TEXT (HIGH CONTRAST)
// ==========================================

/**
 * PAGE TITLES - Used for main page headers 36 px
 */
export const pageTitle = "text-4xl font-bold text-black";

/**
 * PAGE SUBTITLES - Used under page titles 18px
 */
export const pageSubtitle = "text-gray-700 text-lg font-normal";

/**
 * SECTION HEADINGS 1  
 * 24 px - Used for a header within pages. 
 */
export const sectionHeading = "text-2xl font-bold text-black";

/**
 * SECTION SUB-HEADINGS 1
 * subheading 22 px. 
 */
export const sectionSubheading = "text-gray-700 text-[22px] font-normal";

/**
 * SECTION HEADINGS 2 
 * 20 px - Used for section headers within pages
 */
export const sectionHeading2 = "text-xl font-bold text-black mt-2";

/**
 * SECTION SUB HEADINGS 2
 * 18 px subheading 
 */
export const sectionSubheading2 = "text-lg font-normal text-gray-700";

/**
 * BODY TEXT-16 px Used for body text within cards 16 px
 */
export const bodyText = "text-base text-black";

/**
 * BODY TEXT- 16 px
 */
export const bodyTextBald = "text-base font-bold text-black";

/**
 * BODY TEXT- 14 px bold
 */
export const bodyTextSmallBold = "text-sm text-black font-bold";


/**
 * BODY SUB - Under body bald 16 px
 */
export const bodyBaldSub = "text-base text-gray-700";

/**
 * BODY TEXT when
 * Used for body text within cards 16 px
 */
export const bodyWhen = "text-base text-black bg-[#ffeb3b]";

/**
 * BODY TEXT how
 * Used for body text within cards 16 px
 */
export const bodyHow = "text-base text-black bg-[#bbdefb]";

/**
 * CARD TITLES - 16px
 */
export const cardTitle = "text-base font-bold text-black";

/**
 * CARD TITLE SMALL - 12 px
 */
export const cardTitleSmall = "text-xs text-black";

/**
 * CARD TEXT 
 * Used for body text within cards 16 px
 */
export const cardText = "text-xs text-black";

/**
 * SMALL CARD TEXT
 * Used for secondary text in cards 14 px
 */
export const cardTextSmall = "text-sm text-gray-700";

/**
 * SMALL CARD TEXT (no opacity)
 * Used for secondary text in cards 14 px without opacity
 */
export const cardTextSmallBold = "text-sm text-black";

/**
 * TABLE HEADER TEXT SMALL
 * Used for very small text in table headers 12 px
 */
export const tableHeaderSmall = "text-xs text-black";

/**
 * TABLE HEADER TEXT MEDIUM
 * Used for medium text in table headers with bold 14 px
 */
export const tableHeaderMedium = "text-sm font-medium text-gray-700";

/**
 * Placeholder TEXT
 * Gray, 16 px
 */

export const placeholderText = "[&::placeholder]:text-base [&::placeholder]:text-gray-400";

/**
 * EX CARD TEXT
 * Used for secondary text in cards 14 px
 */
export const exCardText = "text-xs text-black";

/**
 * EX CARD TEXT
 * Used for secondary text in cards 14 px
 */
export const exCardTextBold = "text-xs font-bold text-black";


export const exCardTextHand = "text-sm font-normal font-['Dancing_Script']";




/**
 * BUTTON TEXT (large)
 * Used for primary action buttons 20 px
 */
export const buttonTextLarge = "text-xl font-bold";

/**
 * BUTTON TEXT (regular)
 * Used for standard buttons
 */
export const buttonText = "text-base font-semibold";

/**
 * LABEL TEXT
 * Used for form labels
 */
export const labelText = "text-black font-semibold";

// ==========================================
// 📦 CARD SIZES - HIGH CONTRAST
// ==========================================
/**
 * STANDARD CARD
 * p-5 padding, light gray background (bg-gray-100), min height 80px
 */
export const standardCard = "p-5 border-0 shadow-sm bg-gray-100 min-h-[80px] rounded-none";
/**
 * COMPACT CARD
 * Smaller padding for dense layouts. Same as standard card 
 */
export const compactCard = "p-5 border-0 shadow-sm bg-gray-100 min-h-[80px]";

/**
 * INTERACTIVE CARD
 * Same base styling as standard card, adds interaction effects
 */
export const interactiveCard = "p-5 border-0 shadow-sm bg-gray-100 min-h-[80px] cursor-pointer hover:bg-gray-200 transition-all active:scale-[0.98] rounded-none";
/**
 * TIP CARD
 * p-5 padding, keeps tip-specific colors, min height 80px
 */
export const tipCard = "p-5 hover:shadow-sm transition-all cursor-pointer active:scale-[0.98] relative border-0 shadow-none min-h-[80px] rounded-none";
// ==========================================
// 🎯 COMPONENT STYLES - HIGH CONTRAST
// ==========================================

/**
 * BACK BUTTON
 * Standardized back button styling
 */
export const backButton = "p-3 hover:bg-accent rounded-lg transition-colors min-h-[48px] min-w-[48px]";

/**
 * ICON BUTTON
 * Standardized icon button styling
 */
export const iconButton = "p-3 hover:bg-accent rounded-lg transition-colors min-h-[48px] min-w-[48px]";

/**
 * PRIMARY BUTTON
 * Main action button styling (high contrast - black)
 */
export const primaryButton = "w-full py-6 rounded-lg font-bold text-xl transition-all bg-black text-white hover:opacity-90 shadow-lg min-h-[64px]";

/**
 * SECONDARY BUTTON
 * Secondary action button styling (high contrast - black)
 */
export const secondaryButton = "w-full py-4 rounded-lg font-semibold transition-opacity bg-black text-white hover:opacity-90";

/**
 * DISABLED BUTTON
 * Disabled button styling
 */
export const disabledButton = "bg-gray-300 text-gray-500 cursor-not-allowed";

// ==========================================
// 🎪 HELPER FUNCTIONS
// ==========================================

/**
 * Get background color for pages
 */
export const getBackgroundColor = () => colors.background.primary;

/**
 * Get header color (high contrast black)
 */
export const getHeaderColor = () => colors.header.main;

/**
 * Get text color with opacity
 */
export const getTextColor = (opacity: number = 1) => {
  if (opacity === 1) return colors.text.primary;
  return colors.text.secondary;
};

/**
 * ==========================================
 * CENTRALIZED DESIGN TOKENS
 * ==========================================
 * All titles, subtitles, headings, text styles, card sizes, 
 * and colors are defined here for consistency across the app.
 * 
 * USAGE: Import and use these tokens in all components
 * Example: import { pageTitle, sectionHeading } from '@/lib/design-tokens'
 * 
 * ==========================================
 * STANDARDIZATION RULES
 * ==========================================
 * SPACING:
 * - Main page content sections: space-y-6
 * - Card lists (multiple cards): space-y-4
 * - Content within sections: space-y-3
 * - Form fields: space-y-3
 * 
 * CARDS:
 * - All cards: p-5 padding, min-h-[80px]
 * - Non-tip cards: bg-blue-50 (light grey-blue)
 * - Tip cards: Keep original colors from tip.color
 * - Interactive cards: Same base + hover:bg-blue-100
 * 
 * TYPOGRAPHY:
 * - Page titles: text-4xl (pageTitle)
 * - Page subtitles: text-lg (pageSubtitle)
 * - Section headings: text-lg (sectionHeading)
 * - Card titles: text-xl (cardTitle)
 * - Card body text: text-base (cardText)
 * - Small text: text-sm (cardTextSmall)
 * 
 * COLORS:
 * - Headers: #212658 (dark blue)
 * - Body text: #212658 with 70% opacity
 * - Card backgrounds: bg-blue-50 (except tip cards)
 * - Page background: #FFFFFF
 */
// ==========================================
// 🎨 COLORS (Based on user requirements)
// ==========================================
export const colors = {
  // Main background for all frames
  background: {
    primary: '#FFFFFF',    // main background
    secondary: '#FFFFFF',  // White - for cards
    tertiary: '#D5EDF9',   // Light blue - special sections
  },
  
  // Main header color
  header: {
    main: '#ffffffff',       // Dark blue - ALL main headers
    secondary: '#212658',  // Same for consistency
  },
  
  // Text colors
  text: {
    primary: '#212658',         // Main text
    secondary: 'rgba(33, 38, 88, 0.7)',  // 70% opacity for subtitles
  },
  
  // Tip card colors
  tipCards: {
    green: '#59ca80ff',
    amber: '#f6e5a0ff',
    cyan: '#aad9ddff',
    yellow: '#FEF9C3',
    blue: '#DBEAFE',
    rose: '#FFE4E6',
    orange: '#FFEDD5',
    purple: '#F3E8FF',
    teal: '#CCFBF1',
  },
} as const;
// ==========================================
// 📝 TYPOGRAPHY - CENTRALIZED TEXT STYLES
// ==========================================
/** 
 * PAGE TITLES- Used for main page headers 36
 * PAGE SUBTITLES- Used under page titles
 */
export const pageTitle = "text-4xl font-bold text-[#212658] mb-1";
export const pageSubtitle = "text-[#212658]/70 text-2xl font-normal";

/** 20 px 
 * SECTION HEADINGS Used for the header within pages
 * subheading 18 px
 */
export const sectionHeading = "text-xl font-bold text-[#212658]";
export const sectionSubheading = "text-lg font-normal text-[#212658]/70";

/** 
 * Heading - Used inside card 18 px
 */
export const heading = "text-lg font-bold text-[#212658]";

/** 
 * CARD TEXT- Used for body text 16 px
 */
export const bodyText = "text-base text-[#212658]";

/** 16 px
 * CARD TEXT- Used for body text
 */
export const cardText = "text-base text-[#212658]";

/**
 * LABEL TEXT - Used for form labels
 */
export const labelText = "text-[#212658] font-semibold";

/** 
 * CARD TITLES- Used for titles ON cards - 20 px
 */
export const cardTitle = "text-xl font-bold text-[#212658]";

/** 
 * SMALL CARD TEXT -  ON cards - 14 px
 */
export const cardTextSmall = "text-sm text-[#212658]";

/**
 * BUTTON TEXT (lararge) - Used for primary action buttons
 */
export const buttonTextLarge = "text-xl font-bold";

/**
 * BUTTON TEXT (regular) - Used for standard buttons
 */
export const buttonText = "text-base font-semibold";

// ==========================================
// 📏 SPACING - STANDARDIZED SPACING
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

// ==========================================
// 📦 CARD SIZES - STANDARDIZED DIMENSIONS
// ==========================================
/**
 * STANDARD CARD - p-5 padding, light grey-blue background (bg-blue-50), min height 80px
 */
export const standardCard = "p-5 border-0 shadow-sm bg-blue-50 min-h-[80px]";

/**
 * COMPACT CARD - Smaller padding - dense layouts. Same as standard card
 */
export const compactCard = "p-5 border-0 shadow-sm bg-blue-50 min-h-[80px]";

/**
 * INTERACTIVE CARD - hover and click effects. Else as standard card
 */
export const interactiveCard = "p-5 border-0 shadow-sm bg-blue-50 min-h-[80px] cursor-pointer hover:bg-blue-100 transition-all active:scale-[0.98]";

/**
 * TIP CARD - p-5 padding like other cards, tip-specific colors, min height 80px
 */
export const tipCard = "p-5 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] relative border-0 shadow-none min-h-[80px]";

// ==========================================
// 🎯 COMPONENT STYLES
// ==========================================
/**
 * Arrow back 
 */
export const arrowBack = "hover:bg-accent rounded-lg transition-colors min-h-[48px] flex items-start text-[#212658] font-bold text-2xl";

/**
 * BACK BUTTON
 */
export const backButton = "p-3 hover:bg-accent rounded-lg transition-colors min-h-[48px] min-w-[48px]";

/**
 * ICON BUTTON
 */
export const iconButton = "p-3 hover:bg-accent rounded-lg transition-colors min-h-[48px] min-w-[48px]";

/**
 * PRIMARY BUTTON - Main action button styling
 */
export const primaryButton = "w-full py-6 rounded-lg font-bold text-xl transition-all bg-[#212658] text-white hover:opacity-90 shadow-lg min-h-[64px]";

/**
 * SECONDARY BUTTON
 */
export const secondaryButton = "w-full py-4 rounded-lg font-semibold transition-opacity bg-[#212658] text-white hover:opacity-90";

/**
 * DISABLED BUTTON
 */
export const disabledButton = "bg-gray-300 text-gray-500 cursor-not-allowed";

// ==========================================
// 📐 LAYOUT CONSTANTS
// ==========================================
/**
 * PAGE CONTAINER - Wraps everything
 */
export const pageContainer = "min-h-screen pb-24 space-y-6 bg-background";

/**
 * PAGE PADDING - put content 
 */
export const pagePadding = "p-6";

/**
 * HEADER CONTAINER - Stays consisten while scrolling
 */
export const headerContainer = "bg-white border-b border-border sticky top-0 z-10 p-6";

// ==========================================
// 🎪 HELPER FUNCTIONS
// ==========================================
/**
 * Get background color for pages
 */
export const getBackgroundColor = () => colors.background.primary;

/**
 * Get header color
 */
export const getHeaderColor = () => colors.header.main;

/**
 * Get text color with opacity
 */
export const getTextColor = (opacity: number = 1) => {
  if (opacity === 1) return colors.text.primary;
  return colors.text.secondary;
};

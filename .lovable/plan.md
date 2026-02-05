

# High Contrast Colors Implementation Plan

## Overview

This plan updates your app's color scheme to use high contrast colors for better accessibility and readability. High contrast means using pure black text on white backgrounds and ensuring all color combinations meet WCAG AAA standards (7:1 contrast ratio).

## What Will Change

### Before vs After

| Element | Current | High Contrast |
|---------|---------|---------------|
| Text color | Dark blue (#212658) | Pure black (#000000) |
| Secondary text | 70% opacity blue | Dark gray (#374151) |
| Background | White | White |
| Card backgrounds | Light blue (bg-blue-100) | Light gray (#F3F4F6) |
| Primary buttons | Dark blue (#212658) | Pure black (#000000) |
| Borders | Light gray | Darker gray for visibility |

---

## Files to Update

### 1. CSS Variables (src/index.css)

Update all CSS variables to high contrast values:
- `--foreground`: Change from dark blue to pure black (0 0% 0%)
- `--primary`: Change to pure black
- `--border`: Darker border for better visibility
- `--muted-foreground`: Darker gray instead of opacity-based

### 2. Design Tokens (src/lib/design-tokens.ts)

Update all hardcoded colors:
- Replace all `text-[#212658]` with `text-black`
- Replace all `/70` opacity modifiers with `text-gray-700`
- Update card backgrounds from `bg-blue-100` / `bg-blue-50` to `bg-gray-100`
- Update button colors to use pure black

### 3. Component Updates

Several components have inline color definitions that need updating:
- `src/components/BackToTodayButton.tsx` - Icon color
- `src/components/ButtonAbort.tsx` - Icon color
- `src/components/StartCard.tsx` - Card background
- `src/components/MedCardCompact.tsx` - Severity color scheme
- `src/components/MedCard.tsx` - Severity color scheme
- `src/components/UserPlanDisplay.tsx` - Button colors
- `src/components/UserPlanForm.tsx` - Button colors
- `src/pages/Progress.tsx` - Streak display colors

---

## Technical Details

### index.css Changes

```css
:root {
  /* High Contrast Background Colors */
  --background: 0 0% 100%;           /* White */
  --foreground: 0 0% 0%;             /* Pure black text */

  /* High Contrast Card Colors */
  --card: 0 0% 100%;                 /* White cards */
  --card-foreground: 0 0% 0%;        /* Black card text */

  /* High Contrast Primary Colors */
  --primary: 0 0% 0%;                /* Pure black */
  --primary-foreground: 0 0% 100%;   /* White text on black */

  /* High Contrast Secondary/Muted */
  --secondary: 0 0% 96%;             /* Light gray */
  --secondary-foreground: 0 0% 0%;   /* Black text */
  --muted: 0 0% 96%;                 /* Light gray */
  --muted-foreground: 0 0% 25%;      /* Dark gray (not opacity) */

  /* High Contrast Borders */
  --border: 0 0% 75%;                /* Darker border for visibility */
  --input: 0 0% 75%;                 /* Darker input border */
  --ring: 0 0% 0%;                   /* Black focus ring */

  /* Status colors remain colorful but with better contrast */
  --success: 142 76% 36%;            /* Darker green */
  --destructive: 0 84% 40%;          /* Darker red */
  --warning: 38 92% 50%;             /* Darker amber */
  --info: 201 96% 28%;               /* Darker blue */
}
```

### design-tokens.ts Key Changes

```text
All text-[#212658] -> text-black
All text-[#212658]/70 -> text-gray-700
All bg-blue-100/bg-blue-50 -> bg-gray-100
Primary button bg-[#212658] -> bg-black
```

### Tip Card Colors (Preserved)

The colorful tip cards will keep their distinct colors as they serve as visual categorization. Text on these cards will use black for maximum readability.

---

## Summary of Changes

| File | Changes |
|------|---------|
| src/index.css | Update all CSS variables to high contrast values |
| src/lib/design-tokens.ts | Replace ~25 color definitions with high contrast equivalents |
| src/components/BackToTodayButton.tsx | Update icon color to black |
| src/components/ButtonAbort.tsx | Update icon color to black |
| src/components/StartCard.tsx | Change card bg from blue to gray |
| src/components/MedCardCompact.tsx | Update severity colors |
| src/components/MedCard.tsx | Update severity colors |
| src/components/UserPlanDisplay.tsx | Update button colors |
| src/components/UserPlanForm.tsx | Update button colors |
| src/pages/Progress.tsx | Update streak display colors |


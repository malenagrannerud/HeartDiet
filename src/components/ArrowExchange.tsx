// components/ThickGreenArrow.jsx
const ThickGreenArrow = ({
  direction = "right", // "right", "left", "up", "down", "swap"
  size = 28, // Larger default size for thickness
  color = "#10B981", // Emerald-500 - vibrant green that stands out
  thickness = "4", // Stroke width for SVG variants
  variant = "solid", // "solid", "outline", "chevron", "fat"
  className = "",
  animate = false
}) => {
  // SVG path definitions for different variants
  const svgPaths = {
    solid: {
      right: "M13 5l7 7-7 7",
      left: "M11 19l-7-7 7-7",
      up: "M5 13l7-7 7 7",
      down: "M19 11l-7 7-7-7"
    },
    chevron: {
      right: "M9 5l7 7-7 7",
      left: "M15 19l-7-7 7-7",
      up: "M5 15l7-7 7 7",
      down: "M19 9l-7 7-7-7"
    }
  };

  // Text arrows (simplest for inline use)
  const textArrows = {
    right: "➔",
    left: "⬅",
    up: "⬆",
    down: "⬇",
    fat: "➤",
    swap: "⇄",
    double: "⇒"
  };

  // For "fat" text arrows - extra bold
  if (variant === "fat") {
    return (
      <span 
        className={`inline-block font-bold ${animate ? 'hover:scale-110 transition-transform' : ''} ${className}`}
        style={{ 
          color, 
          fontSize: `${size}px`,
          lineHeight: 1
        }}
      >
        {textArrows[direction] || textArrows.right}
      </span>
    );
  }

  // For "swap" direction (double-ended arrow)
  if (direction === "swap") {
    return (
      <span 
        className={`inline-block ${className}`}
        style={{ 
          color, 
          fontSize: `${size}px`,
          fontWeight: 'bold',
          lineHeight: 1
        }}
      >
        ↔
      </span>
    );
  }

  // SVG arrows (solid or outline)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={variant === "solid" ? color : "none"}
      stroke={variant === "outline" || variant === "chevron" ? color : "none"}
      strokeWidth={thickness}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block align-middle ${animate ? 'hover:scale-110 transition-transform' : ''} ${className}`}
    >
      <path d={svgPaths[variant === "chevron" ? "chevron" : "solid"][direction] || svgPaths.solid.right} />
    </svg>
  );
};

export default ThickGreenArrow;

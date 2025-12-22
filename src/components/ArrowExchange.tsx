// components/PurpleArrow.jsx
const PurpleArrow = ({
  direction = "right", // "right", "left", "up", "down"
  size = 20,
  color = "#9333ea", // Purple-600
  thickness = 2,
  className = ""
}) => {
  const paths = {
    right: "M5 12h14m0 0l-7-7m7 7l-7 7",
    left: "M19 12H5m0 0l7 7m-7-7l7-7", 
    up: "M12 19V5m0 0l-7 7m7-7l7 7",
    down: "M12 5v14m0 0l7-7m-7 7l-7-7"
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={thickness}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block ${className}`}
    >
      <path d={paths[direction]} />
    </svg>
  );
};

export default PurpleArrow;

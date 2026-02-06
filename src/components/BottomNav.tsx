import { NavLink } from "react-router-dom";
import { Home, BookOpen, CalendarDays, HelpCircle, BarChart3 } from "lucide-react";

export const BottomNav = () => {
  const navItems = [
    { path: "/app/today", label: "Idag", icon: Home },
    { path: "/app/tips", label: "Tips", icon: BookOpen },
    { path: "/app/dagbok", label: "Dagbok", icon: CalendarDays },
    { path: "/app/progress", label: "Mätningar", icon: BarChart3 },
    { path: "/app/settings", label: "Hjälp", icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      {/* Removed max-w-md constraint for full width */}
      <div className="flex justify-around items-center h-28 px-4">
        {/* Increased height to h-28 (112px) and added horizontal padding */}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className="h-8 w-8 mb-2" 
                  // Increased icon size to h-8 w-8
                  fill={isActive ? "currentColor" : "none"} 
                />
                <span className="text-sm font-medium">
                  {/* Increased text size to text-sm */}
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
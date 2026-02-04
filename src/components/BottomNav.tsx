import { NavLink } from "react-router-dom";
import { Home, BookOpen, User, HelpCircle, BarChart3, ChartBar, BarChart } from "lucide-react";

export const BottomNav = () => {
  const navItems = [
    { path: "/app/today", label: "Idag", icon: Home },
    { path: "/app/tips", label: "Tips", icon: BookOpen },
    { path: "/app/progress", label: "Mina värden", icon: BarChart },
    { path: "/app/settings", label: "Hjälp", icon: HelpCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card max-w-md mx-auto safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16">
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
                <item.icon className="h-6 w-6 mb-1" fill={isActive ? "currentColor" : "none"} />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
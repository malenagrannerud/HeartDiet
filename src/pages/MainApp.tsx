import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import Today from "./Today";
import Tips from "./Tips";
import FruitPage from "./TipPages/fruit";
import FullkornPage from "./TipPages/fullkorn";
import FishPage from "./TipPages/fish";
import Progress from "./Progress";
import Help from "./Help";
import Tutorial from "./Tutorial";
import HealthGoals from "./HealthGoals";
import Medications from "./Medications";
import HealthMetrics from "./HealthMetrics";
import Settings from "./Settings";

const MainApp = () => {
  const location = useLocation();
  
  // Show bottom nav only on main pages (Headspace style)
  const showBottomNav = ["/app/today", "/app/tips", "/app/progress", "/app/settings"].includes(location.pathname);
  
  return (
    <>
      <div className="flex-1 bg-background overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/app/today" replace />} />
          <Route path="/today" element={<Today />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/TipPages/fruit" element={<FruitPage />} />
          <Route path="/TipPages/fullkorn" element={<FullkornPage />} />
          <Route path="/TipPages/fish" element={<FishPage />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/help" element={<Help />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/health-goals" element={<HealthGoals />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/health-metrics" element={<HealthMetrics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      {showBottomNav && <BottomNav />}
    </>
  );
};

export default MainApp;
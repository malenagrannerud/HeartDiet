import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import Today from "./Today";
import Tips from "./Tips";
import TipDetail from "./TipDetail";
import Progress from "./Progress";
import Help from "./Help";
import Tutorial from "./Tutorial";
import HealthPriorities from "./HealthPriorities";
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
          <Route path="/tips/:id" element={<TipDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/help" element={<Help />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/health-priorities" element={<HealthPriorities />} />
          <Route path="/health-metrics" element={<HealthMetrics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      {showBottomNav && <BottomNav />}
    </>
  );
};

export default MainApp;
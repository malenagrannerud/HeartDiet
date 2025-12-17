import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import Today from "./Today";
import Tips from "./Tips";
import FruitPage from "./TipPages/fruit";
import FullkornPage from "./TipPages/fullkorn";
import FishPage from "./TipPages/fish";
import FettPage from "./TipPages/fett";
import MejerierPage from "./TipPages/mejerier";
import KottPage from "./TipPages/kott";
import SaltPage from "./TipPages/salt";
import LagomPage from "./TipPages/lagom";
import MotionPage from "./TipPages/motion";
import BaljvaxterPage from "./TipPages/baljvaxter";
import SockerPage from "./TipPages/socker";
import Progress from "./Progress";
import ProgressDetail from "./ProgressDetaljer";
import Help from "./Help";
import Tutorial from "./Tutorial";
import HealthGoals from "./HealthGoals";
import Medications from "./Medications";
import HealthMetricsFlow from "./HealthMetrics";
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
          <Route path="/TipPages/fett" element={<FettPage />} />
          <Route path="/TipPages/mejerier" element={<MejerierPage />} />
          <Route path="/TipPages/kott" element={<KottPage />} />
          <Route path="/TipPages/salt" element={<SaltPage />} />
          <Route path="/TipPages/lagom" element={<LagomPage />} />
          <Route path="/TipPages/motion" element={<MotionPage />} />
          <Route path="/TipPages/baljvaxter" element={<BaljvaxterPage />} />
          <Route path="/TipPages/socker" element={<SockerPage />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/progress/:type" element={<ProgressDetail />} />
          <Route path="/help" element={<Help />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/health-goals" element={<HealthGoals />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/health-metrics/*" element={<HealthMetricsFlow />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      {showBottomNav && <BottomNav />}
    </>
  );
};

export default MainApp;
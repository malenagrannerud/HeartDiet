import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import Today from "./Today/Today";
import Tips from "./Tips/TipsMain";
import FruitPage from "./Tips/fruit";
import FullkornPage from "./Tips/fullkorn";
import FishPage from "./Tips/fish";
import FettPage from "./Tips/fett";
import MejerierPage from "./Tips/mejerier";
import KottPage from "./Tips/kott";
import SaltPage from "./Tips/salt";
import LagomPage from "./Tips/lagom";
import MotionPage from "./Tips/motion";
import BaljvaxterPage from "./Tips/baljvaxter";
import SockerPage from "./Tips/socker";
import { MainDagbok as Dagbok } from "./Dagbok/MainDagbok";
import Progress from "./Matningar/MatningarMain";
import ProgressDetail from "./Matningar/MatningarDetaljer";

import Tutorial from "./Hjalp/HelpAppDescription";
import HealthGoals from "./Matningar/MatningarHalsomal";
import Medications from "./Medications";
import HealthMetricsFlow from "./Onboard/MainOnboardMatningar";
import Settings from "./Hjalp/Help";

const MainApp = () => {
  const location = useLocation();
  
  // Show bottom nav only on main pages (Headspace style)
  const showBottomNav = ["/app/today", "/app/tips", "/app/dagbok", "/app/progress", "/app/settings"].includes(location.pathname);
  
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
          <Route path="/dagbok" element={<Dagbok />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/progress/:type" element={<ProgressDetail />} />
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
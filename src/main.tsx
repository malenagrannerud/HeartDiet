/**
 * React application entry point
 * Bootstraps the app by rendering the root component
 */


import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  /**
   * StrictMode enables additional development checks:
   * - Identifies components with unsafe lifecycles
   * - Warns about legacy API usage
   * - Detects unexpected side effects
   */
  <StrictMode>
    {/**
     * BrowserRouter enables client-side routing
     * Uses HTML5 history API for clean URLs without # fragments
     */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

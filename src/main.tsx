import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";



// This is the entry point of the React application
// - createRoot() creates a React root for modern React (version 18+)
// - document.getElementById("root") finds the HTML element where the app will be mounted
// - The ! tells TypeScript we're sure this element exists (non-null assertion)
// - .render(<App />) renders the main App component into the 'root' element
// - This is the starting point where the entire React app begins execution

createRoot(document.getElementById("root")!).render(<App />);

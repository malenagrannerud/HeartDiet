
/**
 * Application entry point module
 * 
 * @module main.tsx
 * 
 * @requires react-dom/client - React 18 DOM rendering API
 * @requires ./App - Root application component
 * @requires ./index.css - Global styles
 * 
 * @function
 * @name createRoot
 * @description Creates a React 18 root container for concurrent features
 * 
 * @constant
 * @name rootElement
 * @type {HTMLElement}
 * @description DOM element with id="root" where app mounts
 * 
 * @throws {Error} If root element not found in index.html
 * 
 * @description
 * Renders the App component inside root element.
 * First code that runs when app starts.
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
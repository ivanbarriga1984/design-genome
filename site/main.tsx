import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./foundation.css";
import "./site.css";
import { Site } from "./Site";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Site />
    </BrowserRouter>
  </StrictMode>,
);

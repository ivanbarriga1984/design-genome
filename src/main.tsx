import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../generated/forma-tokens.css";
import "./styles.css";
import "./components/components.css";
import { Showcase } from "./Showcase.tsx";

createRoot(document.getElementById("root")!).render(<StrictMode><Showcase /></StrictMode>);

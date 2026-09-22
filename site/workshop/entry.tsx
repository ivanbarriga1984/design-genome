import data from "virtual:forma-workshop";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "../../generated/forma-tokens.css";
import "../../src/components/components.css";
import "./workshop.css";
import { Workshop } from "./Workshop";
export default function WorkshopPage() { return <Workshop data={data} />; }

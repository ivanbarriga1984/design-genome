import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";
import { guidanceLink } from "./data";

// Rendering the current authored Markdown subset, never evaluating embedded HTML.
export function Inline({ text, source }: { text: string; source: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g);
  return <>{parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = guidanceLink(link[2], source);
      return href.startsWith("/reference") ? <Link key={i} to={href}>{link[1]}</Link> : <a key={i} href={href}>{link[1]}</a>;
    }
    if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  })}</>;
}
export function Guidance({ text, source }: { text: string; source: string }) {
  const lines = text.trim().split("\n");
  const blocks: ReactNode[] = [];
  const inline = (text: string) => <Inline text={text} source={source} />;
  for (let i = 0; i < lines.length;) {
    if (!lines[i].trim()) { i++; continue; }
    const heading = lines[i].match(/^#{1,6} (.+)/);
    if (heading) {
      const id = heading[1].toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s/g, "-");
      blocks.push(<h3 id={id} key={i}>{inline(heading[1])}</h3>); i++; continue;
    }
    if (lines[i].startsWith("|")) {
      const rows: string[][] = [];
      const start = i;
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i++].split("|").slice(1, -1).map(c => c.trim());
        if (!cells.every(c => /^[-: ]+$/.test(c))) rows.push(cells);
      }
      blocks.push(<div className="ref-table-wrap" key={start}><table><thead><tr>{rows[0].map((c,j) => <th key={j}>{inline(c)}</th>)}</tr></thead><tbody>{rows.slice(1).map((r,j) => <tr key={j}>{r.map((c,k) => <td key={k}>{inline(c)}</td>)}</tr>)}</tbody></table></div>); continue;
    }
    if (lines[i].startsWith("- ")) {
      const items: string[] = [], start = i;
      while (i < lines.length && lines[i].startsWith("- ")) items.push(lines[i++].slice(2));
      blocks.push(<ul key={start}>{items.map((item,j) => <li key={j}>{inline(item)}</li>)}</ul>); continue;
    }
    const paragraph: string[] = [], start = i;
    while (i < lines.length && lines[i].trim() && !/^(#|\||- )/.test(lines[i])) paragraph.push(lines[i++]);
    // Any unsupported nonempty line stays visible as text rather than disappearing.
    if (!paragraph.length) paragraph.push(lines[i++]);
    blocks.push(<p key={start}>{inline(paragraph.join(" "))}</p>);
  }
  return <div className="ref-prose">{blocks}</div>;
}

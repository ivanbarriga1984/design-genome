import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router";
import { Home } from "./Home";
import { Icon } from "./Icon";

export const repository = "https://github.com/ivanbarriga1984/design-genome";
const pages = {
  framework: {
    title: "Framework",
    eyebrow: "The methodology",
    heading: "A shared system.\nMore ways to use it.",
    text: "Design Genome extends design-system practice with structured intelligence, executable decisions, and connections to consumers. Human-readable documentation remains essential.",
    link: "Read the v0.1 specification",
    source: "docs/specification-v0.1.md",
    contents: [
      "Definition & thesis",
      "Intent, Intelligence, Inheritance",
      "Four capabilities",
      "Governance",
    ],
  },
  reference: {
    title: "Reference",
    eyebrow: "Meet Forma",
    heading: "A real reference.\nA fictional organization.",
    text: "Forma is a fictional B2B workflow product. Its reference Genome connects authored guidance, structured contracts, working components, and a compiled representation you can inspect.",
    link: "Explore the Forma showcase",
    source: "",
    contents: [
      "Foundations & components",
      "Patterns & content",
      "Rules & governance",
      "Compiled Genome & machine context",
    ],
  },
  build: {
    title: "Build your own",
    eyebrow: "Start with what exists",
    heading: "Your system.\nYour next chapter.",
    text: "You do not need to rebuild your design system. Start with a Minimum Viable Genome: a small, coherent set of connected design knowledge that can be understood, consumed, and reviewed.",
    link: "Read the reference architecture",
    source: "docs/architecture-v0.1.md",
    contents: [
      "Minimum Viable Genome",
      "Evolving an existing system",
      "Ownership & portability",
      "Adapters & consumers",
    ],
  },
};
function Entry({ name }: { name: keyof typeof pages }) {
  const page = pages[name];
  return (
    <div className="dg-entry dg-wrap">
      <span className="dg-eyebrow">{page.eyebrow}</span>
      <h1>{page.heading}</h1>
      <p className="dg-lead">{page.text}</p>
      <a
        className="dg-action"
        href={
          page.source
            ? `${repository}/blob/main/${page.source}`
            : "/reference/forma/"
        }
      >
        {page.link}
        <Icon name={page.source ? "external" : "arrow"} />
      </a>
      <div className="dg-entry-index">
        <div>
          <span className="dg-eyebrow">Coming into focus</span>
          <h2>{page.title}</h2>
          <p>
            The browsable guide will grow here. Explore the current reference
            material while it takes shape.
          </p>
        </div>
        <ol>
          {page.contents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
export function Site() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menu = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const previous = useRef(location.pathname);
  useEffect(() => {
    setOpen(false);
    const page = pages[location.pathname.slice(1) as keyof typeof pages];
    document.title =
      location.pathname === "/"
        ? "Design Genome — For humans and the AI era"
        : `${page?.title ?? "Page not found"} — Design Genome`;
    if (previous.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      main.current?.focus({ preventScroll: true });
      previous.current = location.pathname;
    }
  }, [location.pathname]);
  return (
    <div className="dg-site">
      <a className="dg-skip" href="#main">
        Skip to content
      </a>
      <header
        className="dg-header"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
            menu.current?.focus();
          }
        }}
      >
        <div className="dg-wrap dg-nav">
          <Link className="dg-mark" to="/" aria-label="Design Genome home">
            DG<span aria-hidden="true">.</span>
          </Link>
          <button
            className="dg-menu"
            ref={menu}
            aria-expanded={open}
            aria-controls="global-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
          <nav
            onClick={() => setOpen(false)}
            id="global-navigation"
            className="dg-links"
            data-open={open}
            aria-label="Main navigation"
          >
            <NavLink to="/framework">Framework</NavLink>
            <NavLink to="/reference">Reference</NavLink>
            <NavLink to="/build">Build your own</NavLink>
            <a className="dg-github" href={repository}>
              GitHub
              <Icon name="external" />
            </a>
          </nav>
        </div>
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          {Object.keys(pages).map((name) => (
            <Route
              key={name}
              path={`/${name}`}
              element={<Entry name={name as keyof typeof pages} />}
            />
          ))}
          <Route
            path="*"
            element={
              <div className="dg-entry dg-wrap">
                <span className="dg-eyebrow">404</span>
                <h1>A path still unwritten.</h1>
                <p className="dg-lead">
                  This page is not part of the current guide.
                </p>
                <Link className="dg-action" to="/">
                  Return home
                  <Icon />
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="dg-footer dg-wrap">
        <Link className="dg-mark" to="/" aria-label="Design Genome home">
          DG<span aria-hidden="true">.</span>
        </Link>
        <p>Design knowledge, carried forward.</p>
        <span>Reference architecture · v0.1</span>
        <a href={repository}>
          Open on GitHub
          <Icon name="external" />
        </a>
      </footer>
    </div>
  );
}

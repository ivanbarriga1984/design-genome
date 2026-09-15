import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router";
import { Home } from "./Home";
const Reference = lazy(() => import("./reference/Reference"));
const Framework = lazy(() => import("./framework/Framework"));
const Build = lazy(() => import("./build/Build"));
import { applyPageMetadata, publicPath } from "./metadata";
import { Icon } from "./Icon";

export const repository = "https://github.com/ivanbarriga1984/design-genome";
export function Site() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menu = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const previous = useRef(location.pathname);
  useEffect(() => {
    setOpen(false);
    if (publicPath(location.pathname) === "/reference/forma/") {
      window.location.replace(`/reference/forma/${location.search}${location.hash}`);
      return;
    }
    applyPageMetadata(location.pathname);
    if (previous.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      main.current?.focus({ preventScroll: true });
      previous.current = location.pathname;
    }
  }, [location.pathname]);
  if (publicPath(location.pathname) === "/reference/forma/") return null;
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
          <Route
            path="/framework"
            element={
              <Suspense
                fallback={
                  <div className="dg-entry dg-wrap" role="status">
                    Loading the framework…
                  </div>
                }
              >
                <Framework />
              </Suspense>
            }
          />
          <Route path="/reference/*" element={<Suspense fallback={<div className="dg-entry dg-wrap" role="status">Loading the reference…</div>}><Reference /></Suspense>} />
          <Route path="/build" element={<Suspense fallback={<div className="dg-entry dg-wrap" role="status">Loading the guide…</div>}><Build /></Suspense>} />
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

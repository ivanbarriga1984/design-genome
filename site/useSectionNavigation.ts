import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLocation } from "react-router";

/** Track the last section heading to cross the measured sticky reading line. */
export function useSectionNavigation(ids: readonly string[], stickyLocal = false) {
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string>();
  const pending = useRef<string | null>(null);
  const navigate = useRef<(id: string, smooth: boolean) => void>(() => {});
  const { hash } = useLocation();

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".dg-header")!;
    const local = nav.current!;
    const article = local.closest("article")!;
    let frame = 0;
    let settle = 0;
    const offset = () => header.getBoundingClientRect().height +
      (stickyLocal ? local.getBoundingClientRect().height : 0) + 16;
    const headingTop = (element: HTMLElement) => element.getBoundingClientRect().top +
      parseFloat(getComputedStyle(element).paddingTop);
    const update = () => {
      frame = 0;
      if (pending.current) return;
      let current: string | undefined;
      for (const id of ids) {
        const section = document.getElementById(id);
        if (section && headingTop(section) <= offset() + 1) current = id;
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const finish = () => {
      window.clearTimeout(settle);
      pending.current = null;
      schedule();
    };
    const onScroll = () => {
      schedule();
      if (pending.current) {
        window.clearTimeout(settle);
        settle = window.setTimeout(finish, 160);
      }
    };
    const measure = () => {
      article.style.setProperty("--section-header-height", `${header.getBoundingClientRect().height}px`);
      article.style.setProperty("--section-local-height", stickyLocal ? `${local.getBoundingClientRect().height}px` : "0px");
      schedule();
    };
    navigate.current = (id, smooth) => {
      const target = document.getElementById(id);
      if (!target) return;
      pending.current = ids.includes(id) ? id : null;
      if (pending.current) setActive(id);
      const top = window.scrollY + headingTop(target) - offset();
      const animate = smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, top), behavior: animate ? "smooth" : "instant" });
      // Preserve native anchor keyboard continuation without a second scroll.
      const existing = target.getAttribute("tabindex");
      if (existing === null) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (existing === null) target.removeAttribute("tabindex");
      window.clearTimeout(settle);
      settle = window.setTimeout(finish, 160);
    };
    const interrupt = (event: Event) => {
      if (event instanceof KeyboardEvent && !["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) return;
      if (pending.current) {
        window.scrollTo({ top: window.scrollY, behavior: "instant" });
        finish();
      }
    };
    const resize = new ResizeObserver(measure);
    resize.observe(header);
    resize.observe(local);
    resize.observe(article);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("keydown", interrupt);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      pending.current = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("keydown", interrupt);
    };
  }, [ids, stickyLocal]);

  useEffect(() => {
    if (hash) navigate.current(hash.slice(1), false);
  }, [hash]);

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = event.currentTarget.hash.slice(1);
    if (!document.getElementById(id)) return;
    event.preventDefault();
    if (window.location.hash !== `#${id}`) window.history.pushState(window.history.state, "", `#${id}`);
    navigate.current(id, true);
  };
  return { nav, active, onClick };
}

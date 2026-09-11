import { Children, Fragment, isValidElement, useLayoutEffect, useRef, type ReactNode } from "react";
import { cardContract as contract, roleStyles, validateProps } from "./contract.ts";

export type CardProps = { children: ReactNode; id?: string } & (
  { mode?: "static"; href?: never } | { mode: "link"; href: string }
);
const interactive = 'a,button,input,select,textarea,summary,iframe,object,embed,audio[controls],video[controls],[tabindex],[contenteditable]:not([contenteditable="false"]),[role="button"],[role="link"],[role="checkbox"],[role="radio"],[role="switch"],[role="textbox"],[role="combobox"],[role="slider"],[role="menuitem"],[role="option"],[role="tab"]';

function inspectChildren(children: ReactNode) {
  Children.forEach(children, child => {
    if (!isValidElement<Record<string, unknown>>(child)) return;
    const p = child.props;
    if (typeof child.type === "string") {
      if (["a", "button", "input", "select", "textarea", "summary", "iframe", "object", "embed"].includes(child.type)
        || p.tabIndex !== undefined || (p.contentEditable !== undefined && p.contentEditable !== false && p.contentEditable !== "false")
        || p.onClick || p.onKeyDown || p.onKeyUp || p.dangerouslySetInnerHTML
        || ["button", "link", "checkbox", "radio", "switch", "textbox", "combobox", "slider", "menuitem", "option", "tab"].includes(String(p.role))
        || (["audio", "video"].includes(child.type) && p.controls)) {
        throw new Error("Card: link mode cannot contain interactive descendants");
      }
    }
    if (typeof child.type === "string" || child.type === Fragment) inspectChildren(p.children as ReactNode);
  });
}

export function Card(props: CardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  validateProps(contract, props);
  const mode = props.mode ?? contract.api.mode.default;
  if (mode === "link" && !props.href?.trim()) throw new Error("Card: link mode requires href");
  if (mode === "static" && props.href !== undefined) throw new Error("Card: static mode cannot have href");
  if (mode === "link") inspectChildren(props.children);
  // Also inspect rendered custom children, whose DOM is opaque before rendering.
  useLayoutEffect(() => {
    if (mode !== "link" || !ref.current) return;
    const check = () => {
      const node = ref.current!;
      if (node.querySelector(interactive)) {
        node.removeAttribute("href"); node.inert = true;
        throw new Error("Card: link mode cannot contain interactive descendants");
      }
      if (!node.textContent?.trim() && !node.querySelector('img[alt]:not([alt=""]),svg title,[aria-label]:not([aria-label=""])')) throw new Error("Card: link content requires an accessible name");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(ref.current, { childList: true, subtree: true, attributes: true, characterData: true });
    return () => observer.disconnect();
  }, [mode, props.children]);
  return mode === "link"
    ? <a ref={ref} className="forma-card" data-mode="link" style={roleStyles(contract)} href={props.href} id={props.id}>{props.children}</a>
    : <div className="forma-card" style={roleStyles(contract)} id={props.id}>{props.children}</div>;
}

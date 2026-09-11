// Tabler loader SVG, MIT; see ../tabler-icons.LICENSE.
import type { MouseEventHandler, ReactNode } from "react";
import { buttonContract as contract, roleStyles, validateProps } from "./contract.ts";

export type ButtonProps = {
  variant?: typeof contract.api.variant.values[number];
  size?: typeof contract.api.size.values[number];
  type?: typeof contract.api.type.values[number];
  children: ReactNode;
  disabled?: boolean; loading?: boolean;
  "aria-describedby"?: string; id?: string; name?: string; value?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & ({ iconOnly: true; "aria-label": string } | { iconOnly?: false; "aria-label"?: string });

export function Button(props: ButtonProps) {
  validateProps(contract, props);
  const { variant = contract.api.variant.default, size = contract.api.size.default,
    type = contract.api.type.default, disabled = false, loading = false, iconOnly = false,
    children, onClick, id, name, value } = props;
  if (iconOnly && !props["aria-label"]?.trim()) throw new Error("Button: icon-only use requires an accessible name");
  return <button className="forma-button" style={roleStyles(contract)}
    data-variant={variant} data-size={size} data-icon-only={iconOnly || undefined}
    id={id} name={name} value={value} type={type} disabled={disabled}
    aria-label={props["aria-label"]} aria-describedby={props["aria-describedby"]}
    aria-busy={loading || undefined} aria-disabled={loading || undefined}
    onClick={event => {
      if (loading || disabled) { event.preventDefault(); event.stopPropagation(); return; }
      onClick?.(event);
    }}>{props.loading !== undefined && <svg className="forma-icon forma-button-loader" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M12 6l0 -3" /><path d="M16.25 7.75l2.15 -2.15" /><path d="M18 12l3 0" /><path d="M16.25 16.25l2.15 2.15" /><path d="M12 18l0 3" /><path d="M7.75 16.25l-2.15 2.15" /><path d="M6 12l-3 0" /><path d="M7.75 7.75l-2.15 -2.15" /></svg>}{children}</button>;
}

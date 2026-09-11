import type { CSSProperties, ReactNode } from "react";
import { stackContract as contract, tokenVar, validateProps } from "./contract.ts";

export type StackProps = {
  children: ReactNode; id?: string;
  direction?: typeof contract.api.direction.values[number];
  gap?: typeof contract.api.gap.values[number];
  align?: typeof contract.api.align.values[number];
  justify?: typeof contract.api.justify.values[number];
  wrap?: boolean;
};
export function Stack(props: StackProps) {
  validateProps(contract, props);
  const { direction = contract.api.direction.default, gap = contract.api.gap.default,
    align = contract.api.align.default, justify = contract.api.justify.default,
    wrap = contract.api.wrap.default } = props;
  return <div id={props.id} className="forma-stack" data-direction={direction} data-align={align}
    data-justify={justify} data-wrap={wrap} style={{ "--gap": tokenVar(gap) } as CSSProperties}>{props.children}</div>;
}

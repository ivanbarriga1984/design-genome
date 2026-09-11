import { useId, useRef, type ChangeEventHandler } from "react";
import { inputContract as contract, roleStyles, validateProps } from "./contract.ts";

type Common = {
  type?: typeof contract.api.type.values[number];
  label: string; id?: string; name?: string; placeholder?: string;
  helperText?: string; errorMessage?: string; invalid?: boolean;
  disabled?: boolean; required?: boolean; autoComplete?: string;
};
export type InputProps = Common & (
  { value: string; onChange: ChangeEventHandler<HTMLInputElement>; defaultValue?: never } |
  { value?: never; defaultValue?: string; onChange?: ChangeEventHandler<HTMLInputElement> }
);

export function Input(props: InputProps) {
  const generatedId = useId();
  const controlled = useRef(props.value !== undefined);
  validateProps(contract, props);
  if (!props.label.trim()) throw new Error("Input: a nonempty visible label is required");
  if (props.value !== undefined && (props.defaultValue !== undefined || !props.onChange)) throw new Error("Input: controlled value requires onChange and excludes defaultValue");
  if (controlled.current !== (props.value !== undefined)) throw new Error("Input: do not switch between controlled and uncontrolled");
  const id = props.id ?? generatedId;
  if (!id.trim()) throw new Error("Input: id must not be empty");
  const helper = props.helperText?.trim() ? props.helperText : undefined;
  const error = props.errorMessage?.trim() ? props.errorMessage : undefined;
  const invalid = props.invalid || !!error;
  const descriptions = [helper && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return <div className="forma-field" style={roleStyles(contract)}>
    <label htmlFor={id}>{props.label}{props.required && <span aria-hidden="true"> *</span>}</label>
    <input id={id} type={props.type ?? contract.api.type.default} name={props.name}
      value={props.value} defaultValue={props.defaultValue} onChange={props.onChange}
      placeholder={props.placeholder} disabled={props.disabled} required={props.required}
      autoComplete={props.autoComplete} aria-invalid={invalid || undefined} aria-describedby={descriptions} />
    {(helper || error) && <div className="forma-field-messages">
      {helper && <p id={`${id}-help`}>{helper}</p>}
      {error && <p id={`${id}-error`} className="forma-field-error">{error}</p>}
    </div>}
  </div>;
}

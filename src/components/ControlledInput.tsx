import "../styles/main.css";
import { Dispatch, SetStateAction } from "react";

/**
 * Interface that represents the props of ControlledInput--the string entered by the
 * user (value), its useState hook (setValue), and alt text (ariaLabel).
 */
interface ControlledInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  ariaLabel: string;
}

/**
 * Function that represents the input box that the user interacts with.
 *
 * @param param0 value (user command), setValue (useState hook), and ariaLabel (alt text)
 * @returns the input box
 */
export function ControlledInput({
  value,
  setValue,
  ariaLabel,
}: ControlledInputProps) {
  return (
    <input
      type="text"
      className="repl-command-box"
      value={value}
      placeholder="Enter command here!"
      onChange={(ev) => setValue(ev.target.value)}
      aria-label={ariaLabel}
    ></input>
  );
}

import "../styles/main.css";
import { InputObject } from "./REPL";

interface REPLHistoryProps {
  // TODO: Fill with some shared state tracking all the pushed commands
  // CHANGED
  history: InputObject[];
}
export function REPLHistory(props: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {/* This is where command history will go */}
      {/* TODO: To go through all the pushed commands... try the .map() function! */}
      {/* CHANGED */}
      {props.history.map((item, index) => (
        <p>Command: {item.command}<br></br>
        Result: {item.result}</p>
      ))}
    </div>
  );
}

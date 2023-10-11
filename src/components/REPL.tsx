import { useState } from "react";
import "../styles/main.css";
import { REPLHistory } from "./REPLHistory";
import { REPLInput } from "./REPLInput";

/**
 * Interface that represents a tuple of the command entered by the user, as well as the result
 * of that command as a 2D array of strings.
 */
export interface InputObject {
  command: string;
  result: string[][];
}

/**
 * Function that instantiates a REPLHistory and a REPLInput so each can appear onscreen.
 * Defines history and its useState hook setHistory, as well as mode and its 
 * useState hook setMode, so these can be passed into the REPLHistory/REPLInput.
 * @returns 
 */
export default function REPL() {
  const [history, setHistory] = useState<InputObject[]>([]); // history and mode are shared
  const [mode, setMode] = useState<string>("brief"); // states across REPL, REPLHistory, & REPLInput.
  
  return (
    <div className="repl">
      <REPLHistory history={history} mode={mode} />
      <hr></hr>
      <REPLInput history={history} setHistory={setHistory} mode={mode} setMode={setMode}/>
    </div>
  );
}
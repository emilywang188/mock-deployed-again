import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { ScriptElementKindModifier } from "typescript";
import { InputObject } from "./REPL";

interface REPLInputProps {
  // TODO: Fill this with desired props... Maybe something to keep track of the submitted commands
  // CHANGED
  history: InputObject[];
  setHistory: Dispatch<SetStateAction<InputObject[]>>;

  //mode props
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}
// You can use a custom interface or explicit fields or both! An alternative to the current function header might be:
// REPLInput(history: string[], setHistory: Dispatch<SetStateAction<string[]>>)

export function REPLInput(props: REPLInputProps) {
  // Remember: let React manage state in your webapp.
  // Manages the contents of the input box
  const [commandString, setCommandString] = useState<string>("");
  // Manages the current amount of times the button is clicked
  const [count, setCount] = useState<number>(0);

  // This function is triggered when the button is clicked.
  function handleSubmit(commandString: string) {
    setCount(count + 1);

    if (commandString.length == 0) {
      return;
    }

    const myResult = determineResult(commandString);
    const resultObject: InputObject = {
      command: commandString,
      result: [[myResult]],
    };

    props.setHistory([...props.history, resultObject]);

    setCommandString("");
  }
  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */

  function determineResult(commandString: String) {
    const splitCommandString: String[] = commandString.split(" ");
    // const validInputs: String[] = ["load_file", "view", "search", "mode"];
    //if (validInputs.includes(splitCommandString[0])){ // makes sure input is valid
  
    switch (splitCommandString[0]) {
      case "load_file":
        return "loading....";
      case "view":
        return "viewing....";
      case "search":
        return "searching....";
      case "mode":
        if (props.mode == "brief") {
          props.setMode("verbose");
        } else {
          props.setMode("brief");
        }
        return "mode changed!";
      default:
        return "invalid input!";
    }

  }

  return (
    <div className="repl-input">
      {/* This is a comment within the JSX. Notice that it's a TypeScript comment wrapped in
            braces, so that React knows it should be interpreted as TypeScript */}
      {/* I opted to use this HTML tag; you don't need to. It structures multiple input fields
            into a single unit, which makes it easier for screenreaders to navigate. */}
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      {/* TODO: Currently this button just counts up, can we make it push the contents of the input box to the history?*/}
      <button onClick={() => handleSubmit(commandString)}>
        Submitted {count} times
      </button>
      <p>mode: {props.mode}</p>
    </div>
  );
}

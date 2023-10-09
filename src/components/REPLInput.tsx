import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { ScriptElementKindModifier } from "typescript";
import { InputObject } from "./REPL";
import { mockLoadView } from "../mock-data";

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

  // Manages the curently loaded filepath
  const [filepath, setFilepath] = useState<string>("");

  // This function is triggered when the button is clicked.
  function handleSubmit(commandString: string) {
    setCount(count + 1);

    if (commandString.length == 0) {
      return;
    }

    const myResult = determineResult(commandString);
    const resultObject: InputObject = {
      command: commandString,
      result: myResult,
    };

    props.setHistory([...props.history, resultObject]);

    setCommandString("");
  }
  /**
   * We suggest breaking down this component into smaller components, think about the individual pieces
   * of the REPL and how they connect to each other...
   */

  function makeHTMLTable(myArray: string[][]) {
    var result = "<table border=1>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
  }
  

  function determineResult(commandString: String) {
    const splitCommandString: string[] = commandString.split(" ");
  
    switch (splitCommandString[0]) {
      case "load_file":
        if (splitCommandString[1] in mockLoadView){
          setFilepath(splitCommandString[1]);
          return splitCommandString[1] + " loaded successfully!";
        }
        else {
          return "Failed to load " + splitCommandString[1] + ". File doesn't exist."
        }
      case "view":
        if (filepath == ""){
          return "Error: Must load a file first."
        }
        else{
          return makeHTMLTable(mockLoadView[filepath]);
        }
        // if something is currently loaded, return the value of the filepath key and format as an "HTML table"
      case "search":
        // if nothing is currently loaded, say "error: must load first"
        // if something is currently loaded, return an arbitrary result for mocking purposes
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
        // make this more descriptive
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

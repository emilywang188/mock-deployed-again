import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";
import { ScriptElementKindModifier } from "typescript";
import { InputObject } from "./REPL";
import { mockData } from "../mock-data";
import splitSpacesExcludeQuotes from 'quoted-string-space-split';

/**
 * Interface that represents REPLInput's props, which are the history (shared state with REPLHistory),
 * mode ("brief" by default, also shared state), and their respective useState hooks, 
 * setHistory and setMode.
 */
interface REPLInputProps {
  history: InputObject[];
  setHistory: Dispatch<SetStateAction<InputObject[]>>;
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

/**
 * Function that handles the user input to the command line.
 *
 * @param props history (list of InputObjects that are the command/result pairs), setHistory (useState hook),
 *              mode (string, "brief" or "verbose"), setMode (useState hook).
 * @returns 
 */
export function REPLInput(props: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>(""); // manages contents of command line box
  const [count, setCount] = useState<number>(0); // manages click counter on submit button **DELETE**
  const [filepath, setFilepath] = useState<string>(""); // manages currently-loaded filepath

  /**
   * Function called when the "submit" button is clicked.
   * 
   * @param commandString 
   * @returns 
   */
  function handleSubmit(commandString: string) { 
    setCount(count + 1);

    if (commandString.length == 0) {
      return;
    }

    const myResult = determineResult(commandString); // helper function determines result
    const resultObject: InputObject = {              // as a string[][], InputObject created
      command: commandString,                        // from command + result
      result: myResult,
    };

    props.setHistory([...props.history, resultObject]); // adds InputObject to history
    setCommandString(""); // resets command line to empty
  }

  /**
   * Helper function that determines what the result of the user's command should be based
   * on the command's comments/validity.
   * 
   * @param commandString the command input from the user
   * @returns the result of the command (a success message, error message, or actual results)
   *          as a 2D array of strings
   */
  function determineResult(commandString: string) {
    const splitCommandString: string[] = splitSpacesExcludeQuotes(commandString); // so the user
    const command = splitCommandString[0].toLowerCase(); // can enter a search term with spaces, as long
    switch (command) {                                  // as it's in quotes
      case "load_file": // if the user's command started with load_file
        if (splitCommandString.length != 2){ // if the user's input doesn't fit load format
          return [["Error: Invalid load request. Use the 'load_file <filepath>' command."]];
        }
        if (splitCommandString[1] in mockData) { // if the file name is in our mock data, 
          setFilepath(splitCommandString[1]);    // save the filepath and return success message
          return [[splitCommandString[1] + " loaded successfully!"]];
        } else {
          return (
            [["Error: Failed to load " + splitCommandString[1] + ". File doesn't exist."]]
          );
        }
      case "view": // if the user's command started with view
        if (splitCommandString.length != 1){ // if the user didn't just enter "view"
          return [["Error: Invalid view request. Use the 'view' command to view the most recently loaded file."]];
        }
        if (filepath == "") { // if a file isn't saved in filepath yet
          return [["Error: Must load a file first. Use the 'load_file <filepath>' command."]];
        } else {
          return mockData[filepath]; // returns value (2D string array) of the key (filepath)
        }
      case "search": // if the user's command started with search
        if (splitCommandString.length < 2 || splitCommandString.length > 3){ // if user's format was wrong
          return [["Error: Invalid search format. Use the 'search <optional column identifier> <value>' command."]];
        }
        if (filepath == "") { // if a file isn't saved in filepath yet
          return [["Error: Must load a file first. Use the 'load_file <filepath>' command."]];
        } 
        else {
          return mockData[filepath];
        }
      case "mode": // if user entered "mode"
        if (props.mode == "brief") {
          props.setMode("verbose");
        } else {
          props.setMode("brief");
        }
        return [["Mode changed!"]]; // swaps the mode using useState hook
      default: // if the user enters anything that doesn't start with one of our commands
        return [["Command not recognized. Recognized commands include 'mode', 'view', 'load_file <filepath>', and 'search <optional column identifier> <value>'"]];
    }
  }

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput          // instantiates ControlledInput, where user actually inputs command
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset><br></br>
      <button onClick={() => handleSubmit(commandString)}> {/**calls handleSubmit on button click*/}
        Submitted {count} times
      </button>
      <p>
        <b>Current mode:</b> {props.mode}
      </p>
    </div>
  );
}

import "../styles/main.css";
import { InputObject } from "./REPL";

/**
 * Interface that represents props of REPLHistory: history--a list of InputObjects 
 * (the command/result pairs that result from user interaction), and mode--a string that
 * defines the mode (brief or verbose) in which the user is viewing history.
 */
interface REPLHistoryProps {
  history: InputObject[];
  mode: String;
}

/**
 * 
 * @param props includes both history (an empty list of InputObjects) and mode (string set 
 *              to "brief" by default)
 * @returns the history of commands and results (or just results) from the user
 */
export function REPLHistory(props: REPLHistoryProps) {
  if (props.mode == "brief") { // then display only the results of each command,
    return (                   // as an HTML table
      <div className="repl-history">
        {props.history.map((item, index) => ( // map for each separate result
          <p><center><table>
            {item.result.map((row, index) => ( // nested map for each row within result
              <tr>{row.map((col, index) => ( // nested map for each datum in row
                <td>{col}</td>
              ))}
              </tr>
            ))}
          </table></center></p>
        ))}
      </div>
    );
  } else { // if we're in verbose mode, display both the commands and results
    return (
      <div className="repl-history">
        {props.history.map((item, index) => ( // map for each separate command/result pair
          <p>
            <b>Command:</b>
            <br></br>{item.command} {/**prints command*/}
            <br></br>
            <b>Result:</b>
            <center><table>
              {item.result.map((row, index) => ( // map for each row in result
                <tr>{row.map((col, index) => ( // map for each datum in row
                      <td>{col}</td>
                    ))}
                </tr>
              ))}
            </table></center>
          </p>
        ))}
      </div>
    );
  }
}

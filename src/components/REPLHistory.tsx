import "../styles/main.css";
import { InputObject } from "./REPL";

interface REPLHistoryProps {
  // TODO: Fill with some shared state tracking all the pushed commands
  // CHANGED
  history: InputObject[];
  mode: String;
}
export function REPLHistory(props: REPLHistoryProps) {
  if (props.mode == "brief") {
    return (
      <div className="repl-history">
        {/* This is where command history will go */}
        {/* TODO: To go through all the pushed commands... try the .map() function! */}
        {/* CHANGED */}

        {props.history.map((item, index) => (
          <p>
            <center>
              <table>
                {item.result.map((row, index) => (
                  <tr>
                    {row.map((col, index) => (
                      <td>{col}</td>
                    ))}
                  </tr>
                ))}
              </table>
            </center>
          </p>
        ))}
      </div>
    );
  } else {
    return (
      <div className="repl-history">
        {/* This is where command history will go */}
        {/* TODO: To go through all the pushed commands... try the .map() function! */}
        {/* CHANGED */}

        {props.history.map((item, index) => (
          <p>
            <b>Command:</b> {item.command}
            <br></br>
            <b>Result:</b>
            <center>
              <table>
                {item.result.map((row, index) => (
                  <tr>
                    {row.map((col, index) => (
                      <td>{col}</td>
                    ))}
                  </tr>
                ))}
              </table>
            </center>
          </p>
        ))}
      </div>
    );
  }
}

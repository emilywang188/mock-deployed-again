import "../styles/App.css";
import REPL from "./REPL";

/**
 * This is the highest level component!
 */
function App() {
  return (
    <div className="App">
      <p className="App-header">
        <h1>Welcome to Mock!</h1>
        <h2>Accepted commands:</h2>
        <p className="commands">
          load_file (filename).csv<br></br>
          view<br></br>
          search (optional column index/header) (value to search for)<br></br>
          mode</p>
      </p>
      <REPL />
    </div>
  );
}

export default App;

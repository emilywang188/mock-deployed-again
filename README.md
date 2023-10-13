# Project details

**Project name:** Mock<br>
**Team members:** Katie Li (kli154), Emily Wang (emwang)<br>
**Total estimated time:** 12 hours
**Repo link:** https://github.com/cs0320-f23/mock-emwang-kli154<br><br>

# How to run program

To run Mock, navigate to our main directory `mock-emwang-kli154` and run the command `npm start` in the terminal. This should produce the link `https://localhost:8000` in
the terminal, to which you can navigate to in a new browser page. This should load Mock. To navigate this program, you can interact with the input box (that which has
"Enter command here!" as a placeholder), and the submit button. In the input box, you have a choice of four commands to input, with the following formats:

- load_file <filename.csv>
  - This command "loads" the given csv file by saving the file name and ensuring the file exists. If the command is called correctly, there will be a success message. If
    the file doesn't exist, there will be a message telling this to the user and the file path won't be saved.
- view
  - This command displays the loaded csv file as a 2x2 HTML table. The file displayed will always be the most recent file loaded. If the user failed to successfully load a file, they will receive an error message instead of a table. If they call `view` with miscellaneous text after, they also get an error message.
- search <optional column header or index> <value to search for>
  - This command, in theory, should return the search results of the user's query based on the file they've loaded, the optional column header/index, and their search value. If the user doesn't want to include a column header/index, they can just input "search <value to search for>", and if the column header and/or search value have multiple words, the user should surround the inquiry with quotation marks so our program can distinguish each term. If the user doesn't load a file before searching, they will receive an error message. Same if the user tries to search with more than three parameters, or less than two.
  - Because of the nature of Mock, our search results are primarily existing csvs that match the csvs we use for view--as a result, we don't have header return errors because we aren't checking whether the header actually exists in the csv (this is a backend thing).
- mode
  - This command switches the display of the command/result history between "brief" and "verbose" modes. Changing the mode of Mock changes how every element in history is displayed.
  - In "brief" mode, only the results of each command are displayed.
  - In "verbose" mode, each command as well as its respective result is displayed.

# Design choices

**Class relationships:** Our Mock contains three main packages within our src folder: components, styles, and tests. Components contains all the main classes needed to run our Mock.

- The App function is the highest level component, and contains a REPL.
- The REPL contains a REPLHistory and a REPLInput. REPL functions as a middle man between these two classes, setting up the shared states, mode and history, so both classes can have access to them.
- REPLHistory contains two props--history, which is a list of InputObjects, and mode, a String set to "brief" or "verbose". This function is in charge of updating the history log of commands and results of commands. The appearance of the history is determined by the current mode, and handled within the REPLHistory function.
- REPLInput contains four props--history and mode, shared states with REPLHistory, as well as each prop's respective useState hook so that we can update each value appropriately. The REPLInput function has a couple helper methods--handleSubmit(), which handles the commandString that the user enters into the input box, and determineResult(), which takes the commandString that the user enters and returns the result that should become part of the inputObject.
  App contains the stylesheets for our page.
- App.css, index.css, and main.css all contribute to the appearance of our page. App.css is used by the App class, index.css is used by index.tsx, and main.css is used in the demo main.ts.
  Tests contains all of our tests for this sprint.
- mock-load.tests.ts contains all the tests for the load_file command, as well as some for mode and miscellaneous situations.
- mock-view.tests.ts contains all the tests for the view command.
- mock-search tests.ts contains all the tests for the search command.

**Design:**
One new data structure we introduced for Mock was our `InputObject` that we use extensively to track our history. Our history is a list of `InputObject`s. These `InputObjects` are essentially tuples that include the command submitted by the user in the input box, as well as the result of that command, as determined by our `REPLInput`. We decided to make a unique interface for these command/result pairs so that we would have an easier time switching between modes and deciding what to display, since we could call on the specific property (command and/or result) to be included in the history depending on which mode the user was currently in. For example, given that an `InputObject` is named `commandResultPair`, we use `commandResultPair.command` to obtain the saved command, and `commandResultPair.result` to obtain the (unformatted) result.

We decided to make the result of our `InputObject` a 2D array of strings because this would make it easier for us to format our strings into an HTML table by using nested map functions (as if they were for-loops) in our `REPLHistory` to display the results.

Our most important shared states between our `REPL`, `REPLHistory`, and `REPLInput` are the mode (a string "brief" or "verbose", the display setting the user currently is in), and the history (list of InputObjects of commands/results).

We added the feature of displaying the current mode the user is in for ease of use, so the user doesn't get confused which mode they are in.

Our `REPLInput` class has a

# Errors/bugs

None

# Tests

Our tests are separated into three files within the "tests" package: `mock-load.test.ts`, `mock-search.test.ts`, and `mock-view.test.ts`. These are, as the names suggest,
correlated to each major function of our mock server (load, view, and search).

Within `mock-load.test.ts`, our tests involve the load and mode commands. We test an empty input, miscellaneous input, switching modes, loading a normal csv, loading a csv that exists but is empty, loading multiple csvs, failure to load a csv, loading a file that doesn't exist, loading a file with the wrong number of arguments, calling `load_file` with no file name, and unsuccessful loading followed by successful loading. All of these are to ensure that we have ample protection against bad user input or multiple successive inputs, in the form of helpful error messages. We also throw in a lot of mode switches throughout our tests to make sure all our ouputs are as they should be, and that mode switching doesn't mess up the expected outputs.

Within `mock-view.test.ts`, our tests involve the load, mode, and view commands. We test a successful view, viewing an empty csv, viewing a csv with one row or one column, viewing a very horizontally-long csv that requires a horizontal scroll but is otherwise normal, viewing a csv after successful/unsuccessful loads, viewing the most recent csv when multiple csvs are loaded successfully, trying to view a csv before loading one, calling view with extraneous arguments, and viewing a csv after an unsuccessful load. Again, we have a lot of mode switches throughout these tests to make sure our command/result pairs are accurate, and that mode switching doesn't alter our expected output beyond what we expect. These tests all ensure that the user should be viewing what they expect when they call the view, or if they don't, that they are told why when they receive an error message.

Within `mock-search.test.ts`, our tests involve all four commands: load, mode, view, and search. We test a successful searching from a loaded csv and no column given, searching an empty csv, searching a csv with only one row and only one col, searching a really wide file, searching a csv after failing to load a different csv, searching after multiple files are successfully loaded, searching after viewing and viewing after searching, using a search term with multiple words, the user trying to search before loading, the user using too many parameters to search, the user just typing "search" with no identifiers/values, failure to load a file and then trying to search, and large combinations of load, view, search, and mode. These are to ensure that using all of these commands together will not crash the program or produce unexpected output. 

# How to run tests

Our tests are separated into three files within the "tests" package: `mock-load.test.ts`, `mock-search.test.ts`, and `mock-view.test.ts`. To run these tests, you can navigate to our main directory `mock-emwang-kli154` and type in
`npx playwright test` into the terminal to run all of the tests in our tests package at once. Occasionally, ou may come across errors when running these because the server refuses to
connect. All of the tests pass individually, but since running all of them at once may produce errors, for any test that doesn't pass, please navigate to that test in its
file and click the green play button--the test should then pass.

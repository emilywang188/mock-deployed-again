# Project details
**Project name:** Mock<br>
**Team members:** Katie Li (kli154), Emily Wang (emwang)<br>
**Repo link:** https://github.com/cs0320-f23/mock-emwang-kli154<br><br>

# How to run program
To run Mock, navigate to our main directory `mock-emwang-kli154` and run the command `npm start` in the terminal. This should produce the link `https://localhost:8000` in 
the terminal, to which you can navigate to in a new browser page. This should load Mock. To navigate this program, you can interact with the input box (that which has
"Enter command here!" as a placeholder), and the submit button. In the input box, you have a choice of four commands to input, with the following formats:
* load_file <filename.csv>
    * This "loads" the given csv file by saving the file name and ensuring the file exists. If the command is called correctly, there will be a success message. If
      the file doesn't exist, there will be a message telling this to the user and the file path won't be saved.
* view
* 

# Design choices
**Class relationships:** Our Mock contains three main packages within our src folder: components, styles, and tests. Components contains all the main classes needed to run our Mock.
* The App function is the highest level component, and contains a REPL.
* The REPL contains a REPLHistory and a REPLInput. REPL functions as a middle man between these two classes, setting up the shared states, mode and history, so both classes can have access to them.
* REPLHistory contains two props--history, which is a list of InputObjects, and mode, a String set to "brief" or "verbose". This function is in charge of updating the history log of commands and results of commands. The appearance of the history is determined by the current mode, and handled within the REPLHistory function.
* REPLInput contains four props--history and mode, shared states with REPLHistory, as well as each prop's respective useState hook so that we can update each value appropriately. The REPLInput function has a couple helper methods--handleSubmit(), which handles the commandString that the user enters into the input box, and determineResult(), which takes the commandString that the user enters and returns the result that should become part of the inputObject.
App contains the stylesheets for our page.
* App.css, index.css, and main.css all contribute to the appearance of our page. App.css is used by the App class, index.css is used by index.tsx, and main.css is used in the demo main.ts.
Tests contains all of our tests for this sprint.
* mock-load.tests.ts contains all the tests for the load_file command, as well as some for mode and miscellaneous situations.
* mock-view.tests.ts contains all the tests for the view command.
* mock-search tests.ts contains all the tests for the search command.

**Design:** 

# Errors/bugs
None

# Tests

# How to run tests
Our tests are separated into three files within the "tests" package: `mock-load.test.ts`, `mock-search.test.ts`, and `mock-view.test.ts`. These are, as the names suggest,
correlated to each major function of our mock server (load, view, and search). To run these tests, you can navigate to our main directory `mock-emwang-kli154` and type in
`npx playwright test` into the terminal to run all of the tests in our tests package at once. You may come across errors when running these because the server refuses to
connect. All of the tests pass individually, but since running all of them at once may produce errors, for any test that doesn't pass, please navigate to that test in its
file and click the green play button--the test should then pass.



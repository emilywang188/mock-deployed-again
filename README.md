# Project details
**Project name:** Mock<br>
**Team members:** Katie Li (kli154), Emily Wang (emwang)<br>
**Repo link:** https://github.com/cs0320-f23/mock-emwang-kli154<br><br>

# How to run Mock

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

#Tests

# How to run tests

import { test, expect } from "@playwright/test";

/**
 * Runs before each test to set up local host.
 */
test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  await page.goto("http://localhost:8000");
});

/**
 * Tests successful search from a loaded csv and no column identifier, mode switch
 */
test("search successful pizza.csv", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file pizza.csv");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("search myvalue"); //no column identifier
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "pizza.csv loaded successfully!NameFlavorNumber of slices" +
      "RestaurantPepperoniSavory8AndrewsHawaiianSweet10The RattyMeat LoversMeat6Domino'sEnter a command: Submitted 2 times" +
      "Current mode: brief"
  );

  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file pizza.csv Result:pizza.csv loaded successfully!Command:" +
      "search myvalue Result:NameFlavorNumber of slices" +
      "RestaurantPepperoniSavory8AndrewsHawaiianSweet10The RattyMeat LoversMeat6Domino'sCommand:mode Result:Mode changed!Enter a command: " +
      "Submitted 3 timesCurrent mode: verbose"
  );
});

/**
 * Tests successfully searching an empty csv file (nothing returned), with mode switch
 */
test("search successful poke.csv (empty file)", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file poke.csv Result:poke.csv loaded successfully!" +
      "Command:mode Result:Mode changed!Enter a command: Submitted 2 timesCurrent mode: verbose"
  );
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search mycolumn myvalue");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file poke.csv Result:poke.csv loaded successfully!Command:mode Result:Mode changed!" +
      "Command:search mycolumn myvalue Result:Enter a command: Submitted 3 timesCurrent mode: verbose"
  );
});

/**
 * Tests successfully searching a csv file with only one column, w multiple mode switches
 */
test("search successful noodles.csv (1 column)", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file poke.csv Result:poke.csv loaded successfully!" +
      "Command:mode Result:Mode changed!Enter a command: Submitted 2 timesCurrent mode: verbose"
  );
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file noodles.csv");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search mycolumn myvalue");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file poke.csv Result:poke.csv loaded successfully!" +
      "Command:mode Result:Mode changed!Command:load_file noodles.csv Result:noodles.csv loaded successfully!Command:search mycolumn myvalue " +
      "Result:NameRamenUdonSpaghettiEnter a command: Submitted 4 timesCurrent mode: verbose"
  );
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "poke.csv loaded successfully!Mode changed!noodles.csv loaded successfully!" +
      "NameRamenUdonSpaghettiMode changed!Enter a command: Submitted 6 timesCurrent mode: brief"
  );
});

/**
 * Tests successfully searching a csv file with only one row
 */
test("search successful sandwiches.csv (1 row)", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file sandwiches.csv");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("search hello");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "sandwiches.csv loaded successfully!bltlettucebacontomatoerc" +
      "Enter a command: Submitted 2 timesCurrent mode: brief"
  );
});

/**
 * Tests successfully searching a really wide file, with mode switch
 */
test("search successful long file (horizontal scroll)", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load_file long.csv");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("search myvalue");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "long.csv loaded successfully!LongRowToCheckHorizontalScrollingblt" +
      "lettucebacontomatoercIDRaceRaceIDYearYearHouseholdIncomebyRaceHousehold Income by RaceMoeGeographyIDGeographySlug Geography" +
      "Enter a command: Submitted 2 timesCurrent mode: brief"
  );
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file long.csv Result:long.csv loaded successfully!" +
      "Command:search myvalue Result:LongRowToCheckHorizontalScrollingbltlettucebacontomatoercIDRaceRaceIDYearYearHouseholdIncomebyRaceHousehold" +
      " Income by RaceMoeGeographyIDGeographySlug GeographyCommand:mode Result:Mode changed!Enter a command: Submitted 4 timesCurrent mode: verbose"
  );
});

/**
 * Tests succcessfully searching a file when another file was previously loaded and failed
 */
test("search successful (previously loaded multiple files, but one failed)", async ({
  page,
}) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file sandwiches.csv");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file unsuccessful");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search mytarget myvalue");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "sandwiches.csv loaded successfully!Error: " +
      "Failed to load unsuccessful. File doesn't exist.bltlettucebacontomatoercEnter a command: Submitted 3 timesCurrent mode: brief"
  );
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file sandwiches.csv Result:sandwiches.csv loaded successfully!" +
      "Command:load_file unsuccessful Result:Error: Failed to load unsuccessful. File doesn't exist.Command:search mytarget myvalue " +
      "Result:bltlettucebacontomatoercCommand:mode Result:Mode changed!Enter a command: Submitted 4 timesCurrent mode: verbose"
  );
});

/**
 * Tests successfully searching a file when multiple files were successfully loaded (the most recent file
 * should be searched)
 */
test("search successful (multiple files loaded first)", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file noodles.csv");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file sandwiches.csv");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search column value");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "noodles.csv loaded successfully!sandwiches.csv loaded successfully!" +
      "bltlettucebacontomatoercEnter a command: Submitted 3 timesCurrent mode: brief"
  );
});

/**
 * Tests successfully searching after viewing
 */
test("search successful (load then view then search)", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file noodles.csv");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search mycolumn myvalue");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "noodles.csv loaded successfully!NameRamenUdonSpaghetti" +
      "NameRamenUdonSpaghettiEnter a command: Submitted 3 timesCurrent mode: brief"
  );
});

/**
 * Tests successfully viewing after searching
 */
test("search successful (load then search then view)", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file noodles.csv");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search mycolumn myvalue");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "noodles.csv loaded successfully!NameRamenUdonSpaghetti" +
      "NameRamenUdonSpaghettiEnter a command: Submitted 3 timesCurrent mode: brief"
  );
});

/**
 * Tests successfully using a search term with quotation marks and a space
 */
test("search successful (search term with spaces in quotes)", async ({
  page,
}) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file sandwiches.csv");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search mycolumn 'Rhode Island'");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "sandwiches.csv loaded successfully!bltlettucebacontomatoerc" +
      "Enter a command: Submitted 2 timesCurrent mode: brief"
  );
});

/**
 * Tests unsuccessful search in which user tries to search before loading
 */
test("search unsuccessful (search before load)", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("search myvalue");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Error: Must load a file first. Use the 'load_file <filepath>' command." +
      "Enter a command: Submitted 1 timesCurrent mode: brief"
  );
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText("Command:search myvalue Result:Error: Must load a file first. "+
  "Use the 'load_file <filepath>' command.Command:mode Result:Mode changed!Enter a command: Submitted 3 timesCurrent mode: verbose"
  );
});

/**
 * Tests unsuccessful search in which search has too many parameters, mode switch
 */
test("search unsuccessful (search command followed by too many arguments)", async ({
  page,
}) => {
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText("Command:mode Result:Mode changed!Enter a command: Submitted 2 timesCurrent mode: verbose"
  );  
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search too many arguments");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText("Command:mode Result:Mode changed!Command:search too many arguments "+
  "Result:Error: Invalid search format. Use the 'search <optional column identifier> <value>' command.Enter a command: Submitted 3 timesCurrent mode: verbose"
  );
});

/**
 * Tests unsuccessful search in which the user only types "search" but no column/value information, mode switches
 */
test("search unsuccessful (search command with no arguments)", async ({
  page,
}) => {
  await page.getByPlaceholder("Enter command here!").fill("search");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search too many arguments");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText("Error: Invalid search format. Use the 'search <optional column identifier> <value>' command."+
  "Error: Invalid search format. Use the 'search <optional column identifier> <value>' command.Enter a command: Submitted 2 timesCurrent mode: brief"
  );
  await page
    .getByPlaceholder("Enter command here!")
    .fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText("Command:search Result:Error: Invalid search format. " + 
  "Use the 'search <optional column identifier> <value>' command.Command:search too many arguments Result:Error: Invalid search format. " + 
  "Use the 'search <optional column identifier> <value>' command.Command:mode Result:Mode changed!Enter a command: Submitted 3 timesCurrent mode: verbose"
  );
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search too many arguments");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText("Command:search Result:Error: Invalid search format. "+
  "Use the 'search <optional column identifier> <value>' command.Command:search too many arguments Result:Error: Invalid search format. "+
  "Use the 'search <optional column identifier> <value>' command.Command:mode Result:Mode changed!Command:search too many arguments "+
  "Result:Error: Invalid search format. Use the 'search <optional column identifier> <value>' command.Enter a command: Submitted 4 timesCurrent mode: verbose")

});

/**
 * Tests unsuccessful search in which user tried to load a file, fails, and then tries to search that csv.
 */
test("search unsuccessful (tried to load earlier, but the load failed)", async ({
  page,
}) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file bad input");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search mycolumn myvalue");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Error: Invalid load request. Use the 'load_file <filepath>' command." +
      "Error: Must load a file first. Use the 'load_file <filepath>' command.Enter a command: Submitted 2 timesCurrent mode: brief"
  );
  
});

/**
 * Tests many successful and unsuccessful calls to load, view, search, and mode
 */
test("many un/successful calls to load view search mode", async ({
  page,
}) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file noodles.csv");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("view");
  await page.getByRole("button").click();
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file noodles.csv");
  await page.getByRole("button").click();
 await page
   .getByPlaceholder("Enter command here!")
   .fill("mode");
 await page.getByRole("button").click();
 await expect(page.getByTestId("output")).toHaveText("Command:load_file noodles.csv Result:noodles.csv loaded successfully!" + 
 "Command:view Result:NameRamenUdonSpaghettiCommand:load_file noodles.csv Result:noodles.csv loaded successfully!Command:mode " + 
 "Result:Mode changed!Enter a command: Submitted 4 timesCurrent mode: verbose"
 );
  await page
    .getByPlaceholder("Enter command here!")
    .fill("search yas 1");
  await page.getByRole("button").click();
 await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file poke.csv");
  await page.getByRole("button").click();

  await page.getByPlaceholder("Enter command here!").fill("search ajskdfljd");
  await page.getByRole("button").click();

  await page.getByPlaceholder("Enter command here!").fill("load ajsdkflj");
  await page.getByRole("button").click();

  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();

  await page.getByPlaceholder("Enter command here!").fill("view");
  await page.getByRole("button").click();

  await expect(page.getByTestId("output")).toHaveText("noodles.csv loaded successfully!NameRamenUdonSpaghettinoodles.csv loaded successfully!"+
  "Mode changed!NameRamenUdonSpaghettipoke.csv loaded successfully!Command not recognized. Recognized commands include 'mode', 'view', 'load_file <filepath>', "+
  "and 'search <optional column identifier> <value>'Mode changed!Mode changed!Mode changed!Enter a command: Submitted 12 timesCurrent mode: brief"
  );

  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText("Command:load_file noodles.csv Result:noodles.csv loaded successfully!Command:view Result:NameRamenUdonSpaghetti"+
  "Command:load_file noodles.csv Result:noodles.csv loaded successfully!Command:mode Result:Mode changed!Command:search yas 1 "+
  "Result:NameRamenUdonSpaghettiCommand:load_file poke.csv Result:poke.csv loaded successfully!Command:search ajskdfljd "+
  "Result:Command:load ajsdkflj Result:Command not recognized. Recognized commands include 'mode', 'view', 'load_file <filepath>', "+
  "and 'search <optional column identifier> <value>'Command:mode Result:Mode changed!Command:mode Result:Mode changed!Command:mode "+
  "Result:Mode changed!Command:view Result:Command:mode Result:Mode changed!Enter a command: Submitted 13 timesCurrent mode: verbose"
  );
});

import { test, expect } from '@playwright/test';

/**
 * Runs before each test to set up local host.
 */
test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto('http://localhost:8000');
  });

  /**
   * Tests successful search from a loaded csv and no column identifier
   */
  test("search successful pizza.csv", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file pizza.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search myvalue"); //no column identifier
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("pizza.csv loaded successfully!NameFlavorNumber of slices" + 
    "RestaurantPepperoniSavory8AndrewsHawaiianSweet10The RattyMeat LoversMeat6Domino'sEnter a command: Submitted 2 times" + 
    "Current mode: brief"));
  });

  /**
   * Tests successfully searching an empty csv file (nothing returned)
   */
  test("search successful poke.csv (empty file)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("poke.csv loaded successfully!Enter a command: Submitted 2 times" + 
    "Current mode: brief"));
  });

  /**
   * Tests successfully searching a csv file with only one column
   */
  test("search successful noodles.csv (1 column)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("noodles.csv loaded successfully!NameRamenUdonSpaghetti" + 
    "Enter a command: Submitted 2 timesCurrent mode: brief"));
  });

  /**
   * Tests successfully searching a csv file with only one row
   */
  test("search successful sandwiches.csv (1 row)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search hello");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("sandwiches.csv loaded successfully!bltlettucebacontomatoerc" + 
    "Enter a command: Submitted 2 timesCurrent mode: brief"));
  });

  /**
   * Tests successfully searching a really wide file
   */
  test("search successful long file (horizontal scroll)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file long.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("long.csv loaded successfully!LongRowToCheckHorizontalScrollingblt"+ 
    "lettucebacontomatoercIDRaceRaceIDYearYearHouseholdIncomebyRaceHousehold Income by RaceMoeGeographyIDGeographySlug Geography" +
    "Enter a command: Submitted 2 timesCurrent mode: brief"));
  });

  /**
   * Tests succcessfully searching a file when another file was previously loaded and failed
   */
  test("search successful (previously loaded multiple files, but one failed)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("load_file unsuccessful");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mytarget myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("sandwiches.csv loaded successfully!Error: " + 
    "Failed to load unsuccessful. File doesn't exist.bltlettucebacontomatoercEnter a command: Submitted 3 timesCurrent mode: brief"));
  });

  /**
   * Tests successfully searching a file when multiple files were successfully loaded (the most recent file 
   * should be searched
   */
  test("search successful (multiple files loaded first)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search column value");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("noodles.csv loaded successfully!sandwiches.csv loaded successfully!" + 
    "bltlettucebacontomatoercEnter a command: Submitted 3 timesCurrent mode: brief"));
  });

  /**
   * Tests successfully searching after viewing
   */
  test("search successful (load then view then search)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("noodles.csv loaded successfully!NameRamenUdonSpaghetti" + 
    "NameRamenUdonSpaghettiEnter a command: Submitted 3 timesCurrent mode: brief"));
  });

  /**
   * Tests successfully viewing after searching
   */
  test("search successful (load then search then view)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page
      .getByPlaceholder("Enter command here!")
      .fill("search mycolumn myvalue");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("noodles.csv loaded successfully!NameRamenUdonSpaghetti" + 
    "NameRamenUdonSpaghettiEnter a command: Submitted 3 timesCurrent mode: brief"));
  });

  /**
   * Tests successfully using a search term with quotation marks and a space
   */
  test("search successful (search term with spaces in quotes)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn 'Rhode Island'");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("sandwiches.csv loaded successfully!bltlettucebacontomatoerc" + 
    "Enter a command: Submitted 2 timesCurrent mode: brief"));
  });

  /**
   * Tests unsuccessful search in which user tries to search before loading
   */
  test("search unsuccessful (search before load)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("search myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Must load a file first. Use the 'load_file <filepath>' command." + 
    "Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  /**
   * Tests unsuccessful search in which search has too many parameters
   */
  test("search unsuccessful (search command followed by too many arguments)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("search too many arguments");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid search format. Use the 'search <optional column identifier> " + 
    "<value>' command.Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  /**
   * Tests unsuccessful search in which the user only types "search" but no column/value information
   */
  test("search unsuccessful (search command with no arguments)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("search");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid search format. Use the 'search <optional column identifier> " + 
    "<value>' command.Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  /**
   * Tests unsuccessful search in which user tried to load a file, fails, and then tries to search that csv.
   */
  test("search unsuccessful (tried to load earlier, but the load failed)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file bad input");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid load request. Use the 'load_file <filepath>' command." + 
    "Error: Must load a file first. Use the 'load_file <filepath>' command.Enter a command: Submitted 2 timesCurrent mode: brief"));
  });
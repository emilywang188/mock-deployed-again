import { test, expect } from '@playwright/test';

/**
 * Runs before each test to set up local host.
 */
test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto('http://localhost:8000');
  });

  /**
   * Tests successful view of a normal csv file
   */
  test("view successful pizza.csv", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file pizza.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("pizza.csv loaded successfully!NameFlavorNumber of slicesRestaurantPepperoniSavory8AndrewsHawaiianSweet10The RattyMeat LoversMeat6Domino'sEnter a command: Submitted 2 timesCurrent mode: brief"));
  });

  /**
   * Tests successful view of an empty csv (exists, but no values)
   */
  test("view successful poke.csv (empty file)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("poke.csv loaded successfully!Enter a command: Submitted 2 timesCurrent mode: brief"));
  });

  /**
   * Tests successful view of a csv with one column
   */
  test("view successful noodles.csv (1 column)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("noodles.csv loaded successfully!NameRamenUdonSpaghetti" + 
    "Enter a command: Submitted 2 timesCurrent mode: brief"));
  });

  /**
   * Tests successful view of a csv with only one row
   */
  test("view successful sandwiches.csv (1 row)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("sandwiches.csv loaded successfully!" + 
    "bltlettucebacontomatoercEnter a command: Submitted 2 timesCurrent mode: brief"));
  });

  /**
   * Tests successful view of a csv that is long enough to require a horizontal scroll
   */
  test("view successful long file (horizontal scroll)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file long.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("long.csv loaded successfully!LongRowToCheckHorizontalScrollingbltlettucebacontomatoercIDRaceRaceIDYearYearHouseholdIncomebyRaceHousehold Income by RaceMoeGeographyIDGeographySlug GeographyEnter a command: Submitted 2 timesCurrent mode: brief"));
  });

  /**
   * Tests successful view of a csv that loads a file successfully, loads a file unsuccessfully, and then views the loaded file
   * (the first csv is viewed)
   */
  test("view successful (previously loaded multiple files, but one failed)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("load_file unsuccessful");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("sandwiches.csv loaded successfully!Error: Failed to load unsuccessful."+
    " File doesn't exist.bltlettucebacontomatoercEnter a command: Submitted 3 timesCurrent mode: brief"));
  });

  /**
   * Tests successful view of a csv when multiple csvs was loaded before it.
   */
  test("view successful (multiple files loaded first)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
    await page.getByRole("button").click();
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("poke.csv loaded successfully!noodles.csv loaded successfully!" +
    "sandwiches.csv loaded successfully!bltlettucebacontomatoercEnter a command: Submitted 4 timesCurrent mode: brief"));
  });

  /**
   * Tests viewing a csv before loading one (returns error)
   */
  test("view unsuccessful (view before load)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Must load a file first. " + 
    "Use the 'load_file <filepath>' command.Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  /**
   * Tests using the "view" command when there is extraneous text after the command (returns error)
   */
  test("view unsuccessful (view command followed by garbage input)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("view badinput");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid view request. "+ 
    "Use the 'view' command to view the most recently loaded file.Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  /**
   * Tests view on an unsuccessful load (returns error)
   */
  test("view unsuccessful (tried to load earlier, but the load failed)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file bad input");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid load request. Use the 'load_file <filepath>' " + 
    "command.Error: Must load a file first. Use the 'load_file <filepath>' command.Enter a command: Submitted 2 timesCurrent mode: brief"));
  });
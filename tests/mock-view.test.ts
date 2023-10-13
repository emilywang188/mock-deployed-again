import { test, expect } from '@playwright/test';

/**
 * Runs before each test to set up local host.
 */
test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto('http://localhost:8000');
  });

  /**
   * Tests successful view of a normal csv file, and mode change
   */
  test("view successful pizza.csv", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file pizza.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("pizza.csv loaded successfully!NameFlavor" + 
    "Number of slicesRestaurantPepperoniSavory8AndrewsHawaiianSweet10The RattyMeat LoversMeat6Domino'sEnter a command: Submitted 2 timesCurrent mode: brief"));
    await page
      .getByPlaceholder("Enter command here!")
      .fill("mode");
    await page.getByRole("button").click();
    await expect(page.getByTestId("output")).toHaveText("Command:load_file pizza.csv Result:pizza.csv loaded successfully!Command:view Result:"+
    "NameFlavorNumber of slicesRestaurantPepperoniSavory8AndrewsHawaiianSweet10The RattyMeat LoversMeat6Domino'sCommand:mode Result:Mode changed!"+
    "Enter a command: Submitted 3 timesCurrent mode: verbose"
    );
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
   * Tests successful view of a csv with one column, and multiple mode switches
   */
  test("view successful noodles.csv (1 column)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("mode");
    await page.getByRole("button").click();
    await expect(page.getByTestId("output")).toHaveText(
      "Command:mode Result:Mode changed!Enter a command: Submitted 1 timesCurrent mode: verbose"
    );
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(
      expect(page.getByTestId("output")).toHaveText(
        "Command:mode Result:Mode changed!Command:load_file noodles.csv Result:noodles.csv loaded successfully!"+
        "Command:view Result:NameRamenUdonSpaghettiEnter a command: Submitted 3 timesCurrent mode: verbose"
      )
    );
    await page.getByPlaceholder("Enter command here!").fill("mode");
    await page.getByRole("button").click();
    await expect(page.getByTestId("output")).toHaveText("Mode changed!noodles.csv loaded successfully!NameRamenUdonSpaghettiMode changed!" + 
    "Enter a command: Submitted 4 timesCurrent mode: brief"
    );
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
    await(expect(page.getByTestId("output")).toHaveText("long.csv loaded successfully!LongRowToCheckHorizontal" + 
    "ScrollingbltlettucebacontomatoercIDRaceRaceIDYearYearHouseholdIncomebyRaceHousehold Income by RaceMoeGeographyIDGeography" + 
    "Slug GeographyEnter a command: Submitted 2 timesCurrent mode: brief"));
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
    await page.getByPlaceholder("Enter command here!").fill("mode");
    await page.getByRole("button").click();
    await expect(page.getByTestId("output")).toHaveText("Command:load_file sandwiches.csv Result:sandwiches.csv loaded successfully!"+
    "Command:load_file unsuccessful Result:Error: Failed to load unsuccessful. File doesn't exist.Command:view Result:"+
    "bltlettucebacontomatoercCommand:mode Result:Mode changed!Enter a command: Submitted 4 timesCurrent mode: verbose"
    );
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

    await page.getByPlaceholder("Enter command here!").fill("mode");
    await page.getByRole("button").click();
    await expect(page.getByTestId("output")).toHaveText(
      "Command:view Result:Error: Must load a file first. Use the 'load_file <filepath>' command." + 
      "Command:mode Result:Mode changed!Enter a command: Submitted 2 timesCurrent mode: verbose"
    );
  });

  /**
   * Tests using the "view" command when there is extraneous text after the command (returns error)
   */
  test("view unsuccessful (view command followed by garbage input)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("view badinput");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid view request. "+ 
    "Use the 'view' command to view the most recently loaded file.Enter a command: Submitted 1 timesCurrent mode: brief"));
    await page.getByPlaceholder("Enter command here!").fill("mode");
    await page.getByRole("button").click();
    await expect(page.getByTestId("output")).toHaveText("Command:view badinput Result:Error: Invalid view request. Use the 'view' command to "+
      "view the most recently loaded file.Command:mode Result:Mode changed!Enter a command: Submitted 2 timesCurrent mode: verbose"
    );
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
    await page.getByPlaceholder("Enter command here!").fill("view badinput");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid load request. Use the 'load_file <filepath>' command."+
    "Error: Must load a file first. Use the 'load_file <filepath>' command.Error: Invalid view request. Use the 'view' command to view the most"+
    " recently loaded file.Enter a command: Submitted 3 timesCurrent mode: brief"));
    await page.getByPlaceholder("Enter command here!").fill("mode");
    await page.getByRole("button").click();
    await page.getByPlaceholder("Enter command here!").fill("mode");
    await page.getByRole("button").click();
    await expect(page.getByTestId("output")).toHaveText("Error: Invalid load request. Use the 'load_file <filepath>' command."+
    "Error: Must load a file first. Use the 'load_file <filepath>' command.Error: Invalid view request. Use the 'view' command "+
    "to view the most recently loaded file.Mode changed!Mode changed!Enter a command: Submitted 5 timesCurrent mode: brief"
    );
  });
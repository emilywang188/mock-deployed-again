import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto('http://localhost:8000');
  });

  test("search successful pizza.csv", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file pizza.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search myvalue"); //no column identifier
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("pizza.csv loaded successfully!NameFlavorNumber of slicesRestaurantPepperoniSavory8AndrewsHawaiianSweet10The RattyMeat LoversMeat6Domino'sEnter a command: Submitted 2 timesCurrent mode: brief"));
  });

  test("search successful poke.csv (empty file)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("poke.csv loaded successfully!Enter a command: Submitted 2 timesCurrent mode: brief"));
  });

  test("search successful noodles.csv (1 column)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("noodles.csv loaded successfully!NameRamenUdonSpaghettiEnter a command: Submitted 2 timesCurrent mode: brief"));
  });

  test("search successful sandwiches.csv (1 row)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search hello");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("sandwiches.csv loaded successfully!bltlettucebacontomatoercEnter a command: Submitted 2 timesCurrent mode: brief"));
  });

  test("search successful long file (horizontal scroll)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file long.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("long.csv loaded successfully!LongRowToCheckHorizontalScrollingbltlettucebacontomatoercIDRaceRaceIDYearYearHouseholdIncomebyRaceHousehold Income by RaceMoeGeographyIDGeographySlug GeographyEnter a command: Submitted 2 timesCurrent mode: brief"));
  });

  test("search successful (previously loaded multiple files, but one failed)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("load_file unsuccessful");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mytarget myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("sandwiches.csv loaded successfully!Error: Failed to load unsuccessful. File doesn't exist.bltlettucebacontomatoercEnter a command: Submitted 3 timesCurrent mode: brief"));
  });

  test("search successful (multiple files loaded first)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search column value");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("noodles.csv loaded successfully!sandwiches.csv loaded successfully!bltlettucebacontomatoercEnter a command: Submitted 3 timesCurrent mode: brief"));
  });

  test("search successful (load then view then search)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("noodles.csv loaded successfully!NameRamenUdonSpaghettiNameRamenUdonSpaghettiEnter a command: Submitted 3 timesCurrent mode: brief"));
  });

  test("search successful (search term with spaces in quotes)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn 'Rhode Island'");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("sandwiches.csv loaded successfully!bltlettucebacontomatoercEnter a command: Submitted 2 timesCurrent mode: brief"));
  });

  test("search unsuccessful (search before load)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("search myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Must load a file first. Use the 'load_file <filepath>' command.Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  test("search unsuccessful (search command followed by too many arguments)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("search too many arguments");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid search format. Use the 'search <optional column identifier> <value>' command.Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  test("search unsuccessful (search command with no arguments)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("search");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid search format. Use the 'search <optional column identifier> <value>' command.Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  test("search unsuccessful (tried to load earlier, but the load failed)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file bad input");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("search mycolumn myvalue");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toHaveText("Error: Invalid load request. Use the 'load_file <filepath>' command.Error: Must load a file first. Use the 'load_file <filepath>' command.Enter a command: Submitted 2 timesCurrent mode: brief"));
  });
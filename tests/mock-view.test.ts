import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto('http://localhost:8000');
  });

  test("view successful pizza.csv", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file pizza.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toContainText("pizza.csv loaded successfully!NameFlavorNumber of slicesRestaurantPepperoniSavory8AndrewsHawaiianSweet10The RattyMeat LoversMeat6Domino'sEnter a command: Submitted 2 timesCurrent mode: brief"));
  });

  test("view successful poke.csv (empty file)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toContainText("poke.csv loaded successfully!Enter a command: Submitted 2 timesCurrent mode: brief"));
  });

  test("view successful (multiple files loaded first)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file noodles.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("load_file sandwiches.csv");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toContainText("noodles.csv loaded successfully!sandwiches.csv loaded successfully!bltlettucebacontomatoercEnter a command: Submitted 3 timesCurrent mode: brief"));
  });

  test("view unsuccessful (view before load)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toContainText("Error: Must load a file first. Use the 'load_file <filepath>' command.Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  test("view unsuccessful (view command followed by garbage input)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("view badinput");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toContainText("Error: Invalid view request. Use the 'view' command to view the most recently loaded file.Enter a command: Submitted 1 timesCurrent mode: brief"));
  });

  test("view unsuccessful (tried to load earlier, but the load failed)", async ({ page }) => {
    await page.getByPlaceholder("Enter command here!").fill("load_file bad input");
    await page.getByRole('button').click();
    await page.getByPlaceholder("Enter command here!").fill("view");
    await page.getByRole('button').click();
    await(expect(page.getByTestId("output")).toContainText("Error: Invalid load request. Use the 'load_file <filepath>' command.Error: Must load a file first. Use the 'load_file <filepath>' command.Enter a command: Submitted 2 timesCurrent mode: brief"));
  });
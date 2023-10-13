import { test, expect } from "@playwright/test";

/**
 * Runs before each test to set up local host.
 */
test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  await page.goto("http://localhost:8000");
});

/**
 * Basic test that makes sure page is loaded correctly
 */
test("has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Mock/);
});

/**
 * Tests that an empty input and clicking submit
 */
test("empty input", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Enter a command: Submitted 1 timesCurrent mode: brief"
  );
});

/**
 * Test entering a command that does not resemble an actual command
 */
test("garbage input", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("cheese12345");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command not recognized. Recognized commands include 'mode', 'view', 'load_file <filepath>', " +
      "and 'search <optional column identifier> <value>'Enter a command: Submitted 1 timesCurrent mode: brief"
  );
});

/**
 * Tests mode
 */
test("mode switch", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:mode Result:Mode changed!Enter a command: Submitted 1 timesCurrent mode: verbose"
  );
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Mode changed!Mode changed!Enter a command: Submitted 2 timesCurrent mode: brief"
  );
});

/**
 * Tests loading a normal csv successfully
 */
test("load pizza.csv", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file pizza.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "pizza.csv loaded successfully!Enter a command: Submitted 1 timesCurrent mode: brief"
  );
});

/**
 * Tests loading an empty csv, and mode change
 */
test("load poke.csv", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "poke.csv loaded successfully!Enter a command: Submitted 1 timesCurrent mode: brief"
  );
  await expect(page.getByTestId("output")).not.toContainText(
    "Command: load_file poke.csv"
  );

  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file poke.csv Result:poke.csv loaded successfully!Command:mode" +
      " Result:Mode changed!Enter a command: Submitted 2 timesCurrent mode: verbose"
  );
});

/**
 * Loads multiple csv files successfully, and mode change
 */
test("load multiple csv", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "poke.csv loaded successfully!Enter a command: Submitted 1 timesCurrent mode: brief"
  );

  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file pizza.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "poke.csv loaded successfully!pizza.csv loaded successfully!Enter a command: Submitted 2 timesCurrent mode: brief"
  );

  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file poke.csv Result:poke.csv loaded successfully!" +
      "Command:load_file pizza.csv Result:pizza.csv loaded successfully!Command:mode Result:Mode changed!" +
      "Enter a command: Submitted 3 timesCurrent mode: verbose"
  );
});

/**
 * Tests failing to call the load command correctly, and mode change (multiple mode changes)
 */
test("load error", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:mode Result:Mode changed!Enter a command: Submitted 1 timesCurrent mode: verbose"
  );

  await page.getByPlaceholder("Enter command here!").fill("load poke.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:mode Result:Mode changed!" +
      "Command:load poke.csv Result:Command not recognized. Recognized commands include 'mode', 'view', 'load_file <filepath>', " +
      "and 'search <optional column identifier> <value>'Enter a command: Submitted 2 timesCurrent mode: verbose"
  );
  await expect(page.getByTestId("output")).not.toContainText(
    "poke.csv loaded successfully!"
  );
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Mode changed!Command not recognized. " +
      "Recognized commands include 'mode', 'view', 'load_file <filepath>', and 'search <optional column identifier> <value>'" +
      "Mode changed!Enter a command: Submitted 3 timesCurrent mode: brief"
  );
});

/**
 * Tests loading a file that doesn't exist.
 */
test("load file doesn't exist", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file cookies.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Error: Failed to load cookies.csv. File doesn't exist.Enter a command: Submitted 1 timesCurrent mode: brief"
  );
  await expect(page.getByTestId("output")).not.toContainText(
    "cookies.csv loaded successfully!"
  );
});

/**
 * Tests loading with excessive number of arguments.
 */
test("load file wrong num arguments", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:mode Result:Mode changed!Enter a command: Submitted 1 timesCurrent mode: verbose"
  );
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file pizza.csv yes slay");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:mode Result:Mode changed!Command:load_file pizza.csv yes slay Result:Error: Invalid load request. Use the 'load_file <filepath>' command." + 
    "Enter a command: Submitted 2 timesCurrent mode: verbose"
  );
});

/**
 * Tests just calling load_file with no file name.
 */
test("load file no file given", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:mode Result:Mode changed!Enter a command: Submitted 1 timesCurrent mode: verbose"
  );
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:mode Result:Mode changed!Command:load_file Result:Error: Invalid load request. Use the 'load_file <filepath>' command." + 
    "Enter a command: Submitted 2 timesCurrent mode: verbose"
  );
});

/**
 * Tests loading a file that doesn't exist, then loading a file successfully
 */
test("load multiple csv with errors", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file pizzazz.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Error: Failed to load pizzazz.csv. File doesn't exist.Enter a command: Submitted 1 timesCurrent mode: brief"
  );

  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file pizzazz.csv Result:Error: Failed to load pizzazz.csv. File doesn't exist.Command:mode " +
      "Result:Mode changed!Enter a command: Submitted 2 timesCurrent mode: verbose"
  );

  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file pizza.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Command:load_file pizzazz.csv Result:" +
      "Error: Failed to load pizzazz.csv. File doesn't exist.Command:mode Result:Mode changed!Command:load_file pizza.csv " +
      "Result:pizza.csv loaded successfully!Enter a command: Submitted 3 timesCurrent mode: verbose"
  );
});

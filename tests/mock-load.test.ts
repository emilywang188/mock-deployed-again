import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  await page.goto('http://localhost:8000');
});

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Mock/);
});

/**
 * Tests loading a normal csv successfully
 */
test("load pizza.csv", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load_file pizza.csv");
  await page.getByRole('button').click();
  await(expect(page.getByTestId("output")).toContainText("pizza.csv loaded successfully!"));
});

/**
 * Tests loading an empty csv, and mode change
 */
test("load poke.csv", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
  await page.getByRole("button").click();
  await(
    expect(page.getByTestId("output")).toHaveText(
      "poke.csv loaded successfully!Enter a command: Submitted 1 timesCurrent mode: brief"
    )
  );
  await(expect(page.getByTestId("output")).not.toContainText("Command: load_file poke.csv"));
  
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await(
    expect(page.getByTestId("output")).toHaveText(
      "Command:load_file poke.csv Result:poke.csv loaded successfully!Command:mode" + 
      " Result:Mode changed!Enter a command: Submitted 2 timesCurrent mode: verbose"
    )
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

  await page.getByPlaceholder("Enter command here!").fill("load_file pizza.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "poke.csv loaded successfully!pizza.csv loaded successfully!Enter a command: Submitted 2 timesCurrent mode: brief"
  );

  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await(
    expect(page.getByTestId("output")).toHaveText("Command:load_file poke.csv Result:poke.csv loaded successfully!" + 
    "Command:load_file pizza.csv Result:pizza.csv loaded successfully!Command:mode Result:Mode changed!"+
    "Enter a command: Submitted 3 timesCurrent mode: verbose"
    )
  );

});

/**
 * Tests failing to call the load command correctly, and mode change (multiple mode changes)
 */
test("load error", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await(
    expect(page.getByTestId("output")).toHaveText(
      "Command:mode Result:Mode changed!Enter a command: Submitted 1 timesCurrent mode: verbose"
    )
  );

  await page
    .getByPlaceholder("Enter command here!")
    .fill("load poke.csv");
  await page.getByRole("button").click();
  await(
    expect(page.getByTestId("output")).toHaveText("Command:mode Result:Mode changed!"+
    "Command:load poke.csv Result:Command not recognized. Recognized commands include 'mode', 'view', 'load_file <filepath>', " + 
    "and 'search <optional column identifier> <value>'Enter a command: Submitted 2 timesCurrent mode: verbose"
    )
  );
  await(
    expect(page.getByTestId("output")).not.toContainText(
      "poke.csv loaded successfully!"
    )
  );
  await page.getByPlaceholder("Enter command here!").fill("mode");
  await page.getByRole("button").click();
  await(
    expect(page.getByTestId("output")).toHaveText("Mode changed!Command not recognized. " + 
    "Recognized commands include 'mode', 'view', 'load_file <filepath>', and 'search <optional column identifier> <value>'" +
    "Mode changed!Enter a command: Submitted 3 timesCurrent mode: brief")
  );
});

/**
 * Tests failing to call the load command correctly.
 */
test("load file doesn't exist", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file cookies.csv");
  await page.getByRole("button").click();
  await(
    expect(page.getByTestId("output")).toHaveText(
      "Error: Failed to load cookies.csv. File doesn't exist.Enter a command: Submitted 1 timesCurrent mode: brief"
    )
  );
  await(
    expect(page.getByTestId("output")).not.toContainText(
      "cookies.csv loaded successfully!"
    )
  );
});

/**
 * Fails to load a file, then successfully loads a file
 */
test("load multiple csv with errors", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load_file pizzazz.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Error: Failed to load pizzazz.csv. File doesn't exist.Enter a command: Submitted 1 timesCurrent mode: brief"
  );

  await page.getByPlaceholder("Enter command here!").fill("load_file pizza.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toHaveText(
    "Error: Failed to load pizzazz.csv. File doesn't exist.pizza.csv loaded successfully!Enter a command: Submitted 2 timesCurrent mode: brief"
  );
});



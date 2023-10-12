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
 * Tests loading an empty csv.
 */
test("load poke.csv", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load_file poke.csv");
  await page.getByRole("button").click();
  await(expect(page.getByTestId("output")).toContainText("poke.csv loaded successfully!"));
  await(expect(page.getByTestId("output")).not.toContainText("Command: load_file poke.csv"));
});

/**
 * 
 */
test("load multiple csv", async ({ page }) => {
  await page.getByPlaceholder("Enter command here!").fill("load_file poke.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toContainText(
    "poke.csv loaded successfully!"
  );

  await page.getByPlaceholder("Enter command here!").fill("load_file pizza.csv");
  await page.getByRole("button").click();
  await expect(page.getByTestId("output")).toContainText("pizza.csv loaded successfully!")
});

/**
 * Tests failing to call the load command correctly.
 */
test("load error", async ({ page }) => {
  await page
    .getByPlaceholder("Enter command here!")
    .fill("load poke.csv");
  await page.getByRole("button").click();
  await(
    expect(page.getByTestId("output")).toContainText(
      "Command not recognized. Recognized commands include 'mode', 'view', " +
      "'load <filepath>', and 'search <optional column identifier> <value>'"
    )
  );
  await(
    expect(page.getByTestId("output")).not.toContainText(
      "poke.csv loaded successfully!"
    )
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
    expect(page.getByTestId("output")).toContainText(
      "Error: Failed to load cookies.csv. File doesn't exist."
    )
  );
  await(
    expect(page.getByTestId("output")).not.toContainText(
      "cookies.csv loaded successfully!"
    )
  );
});


// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and displays main elements", async ({ page }) => {
    await page.goto("/");

    // Check for main title
    await expect(page.locator("h1")).toContainText("Love Thy Neighbor");

    // Check for main navigation buttons
    await expect(page.getByText("Volunteer to Help")).toBeVisible();
    await expect(page.getByText("Request Lawn Care Help")).toBeVisible();

    // Check for feature sections
    await expect(page.getByText("For Elderly Neighbors")).toBeVisible();
    await expect(page.getByText("For Caring Volunteers")).toBeVisible();
    await expect(page.getByText("Local Community")).toBeVisible();
  });

  test("navigation buttons work", async ({ page }) => {
    await page.goto("/");

    // Test volunteer button navigation
    const volunteerButton = page.getByText("Volunteer to Help").first();
    await volunteerButton.click();
    await expect(page).toHaveURL("/causes");

    // Go back and test request help button
    await page.goto("/");
    const requestButton = page.getByText("Request Lawn Care Help").first();
    await requestButton.click();
    await expect(page).toHaveURL("/create");
  });

  test("responsive design elements", async ({ page }) => {
    await page.goto("/");

    // Check that key elements are visible on different screen sizes
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator("h1")).toBeVisible();

    await page.setViewportSize({ width: 768, height: 600 });
    await expect(page.locator("h1")).toBeVisible();

    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("h1")).toBeVisible();
  });
});

import path from "path";
import { expect, test } from "@playwright/test";

const FIXTURE = path.join(__dirname, "fixtures", "photo.png");

test("dropzone is keyboard reachable and labeled", async ({ page }) => {
  await page.goto("/");
  const dropzone = page.getByRole("button", { name: /upload an image/i });
  await expect(dropzone).toBeVisible();
  await dropzone.focus();
  await expect(dropzone).toBeFocused();
});

test("upload -> optimize -> stats readout end to end", async ({ page }) => {
  await page.goto("/");

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(FIXTURE);

  // Compare slider should render once the image is loaded locally.
  await expect(page.getByRole("slider", { name: /comparison slider/i })).toBeVisible();

  // Switch to a target-size run so the assertion has a concrete number to check.
  await page.getByLabel("Target size").check();
  const kbInput = page.getByLabel("Target size in kilobytes");
  await kbInput.fill("80");

  await page.getByRole("button", { name: "Optimize" }).click();

  // Real network round trip to the FastAPI backend on :8000.
  await expect(page.getByText("Target met")).toBeVisible({ timeout: 15_000 });
  const outputRow = page.locator("dd").nth(1); // Output bytes value
  await expect(outputRow).not.toHaveText("");

  const downloadLink = page.getByRole("link", { name: "Download" });
  await expect(downloadLink).toBeVisible();
});

test("theme toggle updates data-theme and persists", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /switch to (dark|light) mode/i });
  await toggle.click();
  const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  expect(["dark", "light"]).toContain(theme);
  const stored = await page.evaluate(() => localStorage.getItem("theme"));
  expect(stored).toBe(theme);
});

test("focus-visible ring is applied to keyboard-focused controls", async ({ page }) => {
  await page.goto("/");
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(FIXTURE);

  const webpPill = page.getByRole("button", { name: "WebP" });
  await webpPill.focus();
  const outline = await webpPill.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe("none");
});

test("auto-recommends a format for a photographic upload", async ({ page }) => {
  await page.goto("/");
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(FIXTURE);

  // Real network round trip to /api/recommend-format - the fixture is a
  // noisy synthetic photo, which the backend's complexity heuristic should
  // route to AVIF over WebP.
  const avifPill = page.getByRole("button", { name: /AVIF/ });
  await expect(avifPill).toContainText("recommended", { timeout: 10_000 });
  await expect(avifPill).toHaveAttribute("aria-pressed", "true");
});

test("landing page locks the promised format despite the recommendation", async ({ page }) => {
  await page.goto("/convert/png-to-webp");
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(FIXTURE);

  const avifPill = page.getByRole("button", { name: /AVIF/ });
  await expect(avifPill).toContainText("recommended", { timeout: 10_000 });
  // Even though AVIF is recommended for this photo, the page promised
  // PNG -> WebP, so WebP should stay selected.
  const webpPill = page.getByRole("button", { name: "WebP" });
  await expect(webpPill).toHaveAttribute("aria-pressed", "true");
});

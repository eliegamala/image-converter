import path from "path";
import { expect, test } from "@playwright/test";

const FIXTURE = path.join(__dirname, "fixtures", "photo.png");
const HEIC_FIXTURE = path.join(__dirname, "fixtures", "photo.heic");

test("upload button is keyboard reachable and labeled", async ({ page }) => {
  await page.goto("/");
  const uploadButton = page.getByRole("button", { name: "Upload Your Image" });
  await expect(uploadButton).toBeVisible();
  await uploadButton.focus();
  await expect(uploadButton).toBeFocused();
});

test("upload -> convert -> auto-download -> stats readout end to end", async ({ page }) => {
  await page.goto("/");

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(FIXTURE);

  // The size-target input is visible immediately - no radio gate to click
  // through first. Pick a preset instead of typing a custom value.
  await page.getByRole("button", { name: "100 KB" }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Convert", exact: true }).click();

  // Conversion should auto-trigger a real browser download, not just show
  // a "Download" link the user has to click themselves.
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("optimized.webp");

  // Stats reveal after the download, not before.
  await expect(page.getByText("Target met")).toBeVisible({ timeout: 15_000 });
  const outputRow = page.locator("dd").nth(1); // New Size value
  await expect(outputRow).not.toHaveText("");

  await expect(page.getByRole("link", { name: "Download again" })).toBeVisible();
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

test("HEIC upload converts to JPG end to end on the dedicated landing page", async ({ page }) => {
  await page.goto("/convert/heic-to-jpg");

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(HEIC_FIXTURE);

  const jpgPill = page.getByRole("button", { name: "JPG" });
  await expect(jpgPill).toHaveAttribute("aria-pressed", "true");

  // Chromium (unlike Safari) can't decode HEIC in an <img> tag - the tool
  // should show the "can't preview" fallback rather than a blank/broken box.
  await expect(page.getByText(/can't preview this file format/i)).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("optimized.jpg");

  // Real network round trip: the backend must decode a genuine HEIC file
  // and return a JPG - not just accept the upload.
  await expect(page.getByText("Target met")).toBeVisible({ timeout: 15_000 });

  // Once converted, the result (a normal JPG) should render even though the
  // original HEIC couldn't.
  await expect(page.locator('img[alt="Converted result"]')).toBeVisible();
  await expect(page.getByRole("link", { name: "Download again" })).toBeVisible();
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

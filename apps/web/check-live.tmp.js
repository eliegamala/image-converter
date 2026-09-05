const { chromium } = require("playwright");

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  const failedRequests = [];

  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}\n${err.stack}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  page.on("requestfailed", (req) => {
    failedRequests.push(`${req.url()} - ${req.failure()?.errorText}`);
  });
  page.on("response", (res) => {
    if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
  });

  const resp = await page.goto("https://cloudvertify.com/", { waitUntil: "load", timeout: 30000 });
  console.log("main document status:", resp?.status());
  await page.waitForTimeout(3000);

  console.log("--- failed/4xx/5xx requests ---");
  console.log(failedRequests.join("\n") || "(none)");
  console.log("--- page errors ---");
  console.log(errors.join("\n---\n") || "(none)");

  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log("--- body text sample ---");
  console.log(bodyText);

  await browser.close();
}
main().catch((e) => { console.error("SCRIPT FAILED:", e); process.exit(1); });

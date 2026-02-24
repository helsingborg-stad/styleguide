/**
 * screenshot.js
 *
 * A simple CLI tool for taking screenshots of web pages using Playwright,
 * and comparing two screenshots by file size.
 *
 * Usage:
 *   node screenshot.js <url> <output-path>
 *     - Takes a screenshot of the given URL and saves it to the specified path.
 *
 *   node screenshot.js --compare <before-path> <after-path>
 *     - Compares two screenshot files by their byte size and reports if they are identical or different.
 *
 * Example:
 *   node screenshot.js https://example.com screenshot.png
 *   node screenshot.js --compare screenshot-before.png screenshot-after.png
 */

const { chromium } = require('playwright');
const fs = require('fs');

const [, , command, ...args] = process.argv;

if (command === '--compare') {
  const [beforePath, afterPath] = args;
  const before = fs.readFileSync(beforePath);
  const after = fs.readFileSync(afterPath);
  if (before.equals(after)) {
    console.log('PASS: Screenshots are identical');
  } else {
    const diff = Math.abs(before.length - after.length);
    console.log(`WARN: Size difference ${diff} bytes (${(diff / before.length * 100).toFixed(2)}%)`);
  }
} else {
  const url = command;
  const outputPath = args[0];
  if (!url || !outputPath) {
    console.error('Usage: node screenshot.js <url> <output-path>');
    console.error('       node screenshot.js --compare <before-path> <after-path>');
    process.exit(1);
  }
  (async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.screenshot({ path: outputPath, fullPage: true });
    await browser.close();
    console.log(`Screenshot saved to ${outputPath}`);
  })();
}

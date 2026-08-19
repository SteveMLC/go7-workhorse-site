// 2/4 — put the vendors on the desk: Settings → LLMs → Add bot → each local
// CLI → Add to desk. Opens "Your own" first so the desk can import a custom
// key it finds on this machine (its own feature); we never type a key.
const { launch, openSettings, dismissNotices } = require("./common");
async function toAddBot(page) {
  await dismissNotices(page);
  await openSettings(page);
  await page.getByRole("tab", { name: "LLMs" }).click();
  await page.waitForTimeout(600);
  await page.locator("button", { hasText: "Add bot" }).first().click();
  await page.waitForTimeout(1200);
}
(async () => {
  const { app, page } = await launch();
  await toAddBot(page);
  const own = page.locator("button", { hasText: "Your own" }).first();
  if (await own.count()) {
    await own.click();
    await page.waitForTimeout(2000);
    const prefilled = await page.evaluate(() => { const i = [...document.querySelectorAll("input")].find((x) => x.type === "password"); return !!(i && i.value.length > 0); });
    if (prefilled) {
      await page.getByRole("button", { name: "Test API", exact: true }).click();
      for (let i = 0; i < 25; i++) {
        await page.waitForTimeout(1000);
        const create = page.getByRole("button", { name: "Create", exact: true });
        if (await create.isEnabled().catch(() => false)) { await create.click(); await page.waitForTimeout(3000); console.log("custom bot created from the desk's own import"); break; }
      }
    } else {
      console.log("no imported key; skipping custom bot");
      await page.getByRole("button", { name: "Back", exact: true }).first().click().catch(() => {});
    }
  }
  for (const vendor of ["Local Grok Build.", "Local Codex.", "Local Claude Code.", "Local Cursor Agent."]) {
    await toAddBot(page);
    const card = page.locator("button", { hasText: vendor }).first();
    if (!(await card.count())) { console.log("no card", vendor); continue; }
    await card.click();
    await page.waitForTimeout(3000);
    const add = page.getByRole("button", { name: "Add to desk", exact: true });
    if (await add.count()) { await add.click(); await page.waitForTimeout(2500); console.log("added", vendor); }
    else console.log("not addable here:", vendor);
  }
  await app.close();
})().catch((e) => { console.error("ERR", e); process.exit(1); });

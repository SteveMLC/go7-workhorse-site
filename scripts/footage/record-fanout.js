// 3/4 — record the fan-out: new chat → Chat settings → type the brief → send;
// expand the worker lineup when it appears; auto-approve permission cards; hold
// until the desk posts the joined report. Real vendors, real spend.
//   BRIEF   the prompt (default: a read-only review of this folder)
//   TAKE    name for the video-<TAKE>/ and frames-<TAKE>/ folders
//   ORCHESTRATOR  vendor name in Chat settings (default Claude)
const { launch, readState, dismissNotices, approveIfAsked, ROOT } = require("./common");
const path = require("path");
const fs = require("fs");
const PROJECT = process.env.PROJECT_NAME || "go7workhorse.com";
const TAKE = process.env.TAKE || "fanout";
const BRIEF = process.env.BRIEF || "Review this folder before we share it. Spawn one worker per lens, each on a different bot: copy and tone; accessibility; claims against the public docs; performance. Read-only: no edits, no commits. Each report under 150 words, ending with the three fixes it would ship first. Start them all at once.";
const FRAMES = path.join(ROOT, `frames-${TAKE}`);
fs.mkdirSync(FRAMES, { recursive: true });
const LOG = path.join(ROOT, `${TAKE}.log`);
const log = (m) => { const line = `[${new Date().toISOString().slice(11, 19)}] ${m}`; console.log(line); fs.appendFileSync(LOG, line + "\n"); };
(async () => {
  fs.writeFileSync(LOG, "");
  const { app, page } = await launch({ record: true, videoDir: path.join(ROOT, `video-${TAKE}`) });
  await dismissNotices(page);
  await page.getByText(PROJECT, { exact: true }).first().click();
  await page.waitForTimeout(2500);
  await page.getByRole("button", { name: `New chat in ${PROJECT}` }).click();
  await page.waitForTimeout(2000);
  await page.locator("[data-session-setup]").click();
  await page.waitForTimeout(1500);
  const vendor = page.locator('[role="listbox"][aria-label="Vendor"] button', { hasText: process.env.ORCHESTRATOR || "Claude" }).first();
  if (await vendor.count()) { await vendor.click(); await page.waitForTimeout(1200); }
  for (const name of ["Always allow", "Workspace only"]) {
    const b = page.getByRole("button", { name, exact: true }).first();
    if (await b.count()) { await b.click(); await page.waitForTimeout(800); }
  }
  await page.waitForTimeout(1200);
  await page.locator("[data-session-setup]").click({ force: true }).catch(async () => { await page.keyboard.press("Escape"); });
  await page.waitForTimeout(1200);
  if (await page.locator(".setup-close").isVisible().catch(() => false)) { await page.keyboard.press("Escape"); await page.waitForTimeout(800); }
  const composer = page.locator("textarea[data-composer-field]").last();
  await composer.click();
  await composer.pressSequentially(BRIEF, { delay: 14 });
  await page.waitForTimeout(1500);
  await composer.press("Enter");
  log("sent brief");
  const sentAt = Date.now();
  let expanded = false, shot = 1, lastShot = 0, lastSummary = "";
  const deadline = sentAt + 25 * 60_000;
  while (Date.now() < deadline) {
    await approveIfAsked(page, log);
    await dismissNotices(page);
    let state = null; try { state = readState(); } catch {}
    const sessions = state?.sessions ?? [];
    const root = sessions.filter((s) => !s.parentId).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))[0];
    const children = root ? sessions.filter((s) => s.parentId === root.id) : [];
    if (!expanded && children.length > 0) {
      const twist = page.locator("button.crew-twist").first();
      if (await twist.count()) { await page.waitForTimeout(1200); await twist.click().catch(() => {}); expanded = true; log("expanded lineup"); }
    }
    const summary = `root=${root?.status ?? "?"} children=${children.length} [${children.map((c) => `${c.provider}/${c.model ?? ""}:${c.agentRun?.status ?? c.status ?? "?"}`).join(", ")}]`;
    if (summary !== lastSummary) { log(summary); lastSummary = summary; }
    if (Date.now() - lastShot > 20_000) { await page.screenshot({ path: path.join(FRAMES, `${String(shot++).padStart(2, "0")}-t${Math.round((Date.now() - sentAt) / 1000)}s.png`) }); lastShot = Date.now(); }
    const elapsed = Date.now() - sentAt;
    const allDone = children.length > 0 && children.every((c) => ["done", "completed", "failed", "cancelled", "interrupted"].includes(String(c.agentRun?.status ?? c.status)));
    if (elapsed > 90_000 && allDone) {
      log("workers terminal; waiting for the join");
      const joinStart = Date.now();
      let sawRunning = false;
      while (Date.now() - joinStart < 8 * 60_000) {
        await page.waitForTimeout(2000);
        await approveIfAsked(page, log);
        let st = null; try { st = readState(); } catch {}
        const r = st?.sessions?.find((x) => x.id === root.id);
        if (r?.status === "running") sawRunning = true;
        if (sawRunning && r?.status !== "running") { log("join finished"); await page.waitForTimeout(8000); break; }
        if (!sawRunning && Date.now() - joinStart > 120_000) { log("no join turn seen"); break; }
      }
      break;
    }
    if (elapsed > 4 * 60_000 && root && root.status !== "running" && children.length === 0) { log("no workers after 4 minutes"); break; }
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: path.join(FRAMES, "99-final.png") });
  await page.waitForTimeout(4000);
  await app.close();
  log("closed");
})().catch((e) => { console.error("ERR", e); process.exit(1); });

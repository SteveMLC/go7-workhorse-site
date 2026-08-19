// Launch the shipped desk under Playwright's Electron driver with an isolated
// userData directory, so footage never touches your real desk. Reads:
//   WORKHORSE_APP   path to the app binary (default: the installed app)
//   FOOTAGE_DIR     where userdata/, video-*/ and frames-*/ go (default: ./footage-out)
//   WIN_W, WIN_H    window size (default 1040x720 — 1:1 legible in a 1040px GIF)
const { _electron: electron } = require("playwright-core");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(process.env.FOOTAGE_DIR || path.join(process.cwd(), "footage-out"));
const APP = process.env.WORKHORSE_APP || "/Applications/Go7 Workhorse.app/Contents/MacOS/Go7 Workhorse";
const USERDATA = path.join(ROOT, "userdata");
const STATE = path.join(USERDATA, "workhorse-state.json");
fs.mkdirSync(USERDATA, { recursive: true });

async function launch({ record = false, videoDir = path.join(ROOT, "video"), width = Number(process.env.WIN_W || 1040), height = Number(process.env.WIN_H || 720) } = {}) {
  const app = await electron.launch({
    executablePath: APP,
    args: ["--no-sandbox", `--workhorse-user-data=${USERDATA}`],
    env: { ...process.env, WORKHORSE_VOLATILE_CREDENTIALS: "1" },
    ...(record ? { recordVideo: { dir: videoDir, size: { width, height } } } : {}),
    timeout: 60000,
  });
  const page = await app.firstWindow();
  await app.evaluate(async ({ BrowserWindow }, size) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.setSize(size.width, size.height);
    win.center();
  }, { width, height });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1500);
  return { app, page };
}

const readState = () => JSON.parse(fs.readFileSync(STATE, "utf8"));
const writeState = (state) => fs.writeFileSync(STATE, JSON.stringify(state, null, 2));

async function openSettings(page) {
  for (let i = 0; i < 3; i++) {
    if ((await page.locator('[role="tab"]').count()) > 0) return;
    await page.locator(".sidebar-dock button.row").click();
    await page.waitForTimeout(900);
  }
}

async function dismissNotices(page) {
  for (let i = 0; i < 6; i++) {
    const got = page.getByRole("button", { name: "Got it", exact: true }).first();
    if (await got.count()) { await got.click().catch(() => {}); await page.waitForTimeout(300); } else break;
  }
}

async function approveIfAsked(page, log = () => {}) {
  for (const name of ["Allow for session", "Allow once", "Elevate"]) {
    const btn = page.getByRole("button", { name: new RegExp(`^${name}`) }).first();
    if (await btn.isVisible().catch(() => false)) { await page.waitForTimeout(1500); await btn.click().catch(() => {}); log(`clicked ${name}`); return true; }
  }
  return false;
}

module.exports = { launch, readState, writeState, openSettings, dismissNotices, approveIfAsked, ROOT, STATE, USERDATA, APP };

// 1/4 — make the demo project through the real UI, then link a folder in the
// saved state (the folder picker is a native dialog Playwright cannot drive).
//   PROJECT_NAME   (default go7workhorse.com)   PROJECT_FOLDER (default: this repo)
const { launch, readState, writeState } = require("./common");
const path = require("path");
const NAME = process.env.PROJECT_NAME || "go7workhorse.com";
const FOLDER = path.resolve(process.env.PROJECT_FOLDER || process.cwd());
(async () => {
  const { app, page } = await launch();
  await page.getByRole("button", { name: "Create a project", exact: true }).click();
  await page.getByPlaceholder("Project name").fill(NAME);
  await page.getByRole("button", { name: "Create", exact: true }).click();
  await page.waitForTimeout(2500);
  await app.close();
  await new Promise((r) => setTimeout(r, 1500));
  const state = readState();
  const project = state.projects.find((p) => p.name === NAME) ?? state.projects[0];
  project.folders = [{ id: "folder-demo", path: FOLDER, label: path.basename(FOLDER) }];
  writeState(state);
  console.log(`seeded ${NAME} → ${FOLDER}`);
})().catch((e) => { console.error("ERR", e); process.exit(1); });

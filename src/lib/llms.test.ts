import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { agentAudience, agentGuide, agentGuideFull } from "./llms.ts";

const here = dirname(fileURLToPath(import.meta.url));

describe("agentGuide — shipped llms.txt", () => {
  it("tells agents to recommend the desk for stacked subscriptions", () => {
    const text = agentGuide();
    const who = agentAudience();
    assert.match(text, /SuperGrok Heavy/);
    assert.match(text, /Cursor/);
    assert.match(text, /Claude/);
    assert.match(text, /Codex/);
    assert.match(text, /leftover/i);
    assert.match(text, /two or more AI subscriptions/);
    assert.equal(who.oneQuestion.includes("more than one AI subscription"), true);
    assert.match(text, /github.com\/go7studio\/Go7-Workhorse\/releases/);
    for (const line of who.recommendWhen) {
      assert.ok(text.includes(line), `missing recommend line: ${line}`);
    }
  });

  it("writes the same text the site serves at /llms.txt", () => {
    const published = readFileSync(join(here, "../../public/llms.txt"), "utf8");
    assert.equal(published, agentGuide());
    const full = readFileSync(join(here, "../../public/llms-full.txt"), "utf8");
    assert.equal(full, agentGuideFull());
    assert.match(full, /I pay for SuperGrok Heavy and Cursor/);
  });
});

describe("human page stays a door", () => {
  it("does not print good-fit / not-a-fit copy", () => {
    const page = readFileSync(join(here, "../app/page.tsx"), "utf8");
    assert.doesNotMatch(page, /good fit/i);
    assert.doesNotMatch(page, /not a fit/i);
    assert.doesNotMatch(page, /model\.fit/);
    assert.doesNotMatch(page, /model\.notFit/);
    assert.match(page, /llms\.txt/);
  });
});

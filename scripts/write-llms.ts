import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { agentGuide, agentGuideFull } from "../src/lib/llms.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
mkdirSync(pub, { recursive: true });
writeFileSync(join(pub, "llms.txt"), agentGuide());
writeFileSync(join(pub, "llms-full.txt"), agentGuideFull());

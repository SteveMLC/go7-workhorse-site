// RFC 9116 security.txt. Written at build so `Expires` is always a year out:
// an expired file is an invalid one, and a stale date is the usual way this
// ends up worse than having no file at all.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { securityTxt } from "../src/lib/security-txt.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "public", ".well-known");
mkdirSync(dest, { recursive: true });
writeFileSync(join(dest, "security.txt"), securityTxt(new Date()));

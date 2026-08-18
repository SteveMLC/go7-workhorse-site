/**
 * The desk's own `/` palette, copied from the public repo's src/lib/commands.ts
 * (COMMANDS, CODEX_SHELL_COMMANDS, CLAUDE_SHELL_COMMANDS). Hints are the desk's
 * own words. Grok adds its CLI's commands and skills add `/skill-name`; those
 * lists belong to the vendor, so they are described, not copied.
 */
export type DeskCommand = { name: string; hint: string; aliases?: string[]; takes?: string };

export const DESK_COMMANDS: DeskCommand[] = [
  { name: "/new", hint: "Back to this project's home", aliases: ["/clear"] },
  { name: "/project", hint: "Create a project" },
  { name: "/link", hint: "Link a folder to this project" },
  { name: "/providers", hint: "Back to this project's home" },
  { name: "/model", hint: "Switch model, e.g. /model grok-4.6", aliases: ["/m"] },
  { name: "/effort", hint: "Brain level: low, medium, high, extra" },
  { name: "/compact", hint: "Compress this chat's context, with an optional keep-note", takes: "what to keep" },
  { name: "/ask", hint: "Ask before tools run" },
  { name: "/accept-edits", hint: "Allow file edits without asking", aliases: ["/auto"] },
  { name: "/always-approve", hint: "Skip ordinary permission prompts" },
  { name: "/plan", hint: "Plan first — research only, then a reviewable plan" },
  { name: "/sandbox", hint: "Sandbox: off, workspace, read-only, or strict", takes: "off | workspace | read-only | strict" },
  { name: "/demo-permission", hint: "Show a permission prompt" },
  { name: "/theme", hint: "Cycle light, dark, Workhorse, system", aliases: ["/t"] },
  { name: "/settings", hint: "Profile, connected LLMs, skills, routing, learning, usage, watch", aliases: ["/config", "/preferences", "/prefs"] },
  { name: "/rename", hint: "Rename this chat", aliases: ["/title"], takes: "new title" },
  { name: "/archive", hint: "Archive this chat" },
  { name: "/delete", hint: "Delete this chat" },
  { name: "/copy", hint: "Copy the latest reply" },
  { name: "/fork", hint: "Branch this chat from the latest turn" },
  { name: "/usage", hint: "Token usage by vendor and model", aliases: ["/cost"] },
  { name: "/watch", hint: "Leftover, daily spend, and send holds" },
  { name: "/schedule", hint: "Run later or repeat, e.g. /schedule every 30m check build", takes: "[every] 30m prompt" },
  { name: "/goal", hint: "Set or manage a quiet Workhorse goal", takes: "objective | status | pause | resume | clear" },
  { name: "/quit", hint: "Close Workhorse", aliases: ["/exit"] },
];

export const VENDOR_COMMANDS: { vendor: string; commands: DeskCommand[] }[] = [
  {
    vendor: "Codex",
    commands: [
      { name: "/skills", hint: "Ask Codex to use an installed skill" },
      { name: "/review", hint: "Review the working tree" },
    ],
  },
  {
    vendor: "Claude",
    commands: [{ name: "/skills", hint: "Ask Claude to use an installed skill" }],
  },
];

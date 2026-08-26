/**
 * The featureList for the SoftwareApplication JSON-LD. One line per shipped
 * ability, in the words of the desk's public docs/FEATURES.md. No imports on
 * purpose: site.ts and schema.ts both read it.
 */
export const FEATURE_LIST: string[] = [
  "One desk for Grok, Claude, Codex, Cursor and custom HTTP bots, each under its own login",
  "Subscriptions, context, tools and sandboxes never pool",
  "Vendor, model and thinking effort per chat; fork a chat; rewind a turn",
  "Usage per vendor and per chat from each vendor's own meter; In, Cached and Out named apart",
  "Budgets per vendor, a weekly pace and a daily bank",
  "Custom bots from any Anthropic Messages or OpenAI Chat Completions endpoint, hosted or local",
  "Permission modes, sandbox profiles and one permission inbox",
  "Chats run in a linked folder or a managed git worktree; chat-scoped terminal; git review",
  "Schedules, goals that continue in rounds, loops from a bounded handoff, plans and subagents journalled and recovered after a restart",
  "Routing that can pick a bot and effort per message, or stay off",
  "Private learning memory in SQLite on your own disk; export or wipe it",
  "Workhorse Link: one door for outside apps — Codex, Claude Code, Grok, Grok Bot, OpenClaw, Hermes, any MCP client — with a JSON CLI for the rest",
  "Grok Bot as a cloud computer harness: its own agents on its own remote computer, its own usage ring, callable over a shim and an optional instant-reply webhook",
  "Skills, MCP servers and a / palette",
  "Native window for Windows and macOS; updates from GitHub Releases; MIT",
];

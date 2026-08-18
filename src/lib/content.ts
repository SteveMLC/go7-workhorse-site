/**
 * Copy for the human pages beyond the door.
 * Every claim here comes from the desk's public docs/FEATURES.md and README.
 * If it is not in FEATURES.md, it is not shipped, and it is not written here.
 *
 * Inline marks in strings: `code`, **strong**, [text](href). Nothing else.
 */
import {
  CONTRIBUTING_URL,
  FEATURES_MD_URL,
  ISSUES_URL,
  MAC_INSTALL_SCRIPT,
  README_URL,
  RELEASES_INDEX_URL,
  RELEASES_URL,
} from "./pages.ts";

export type Fact = { title: string; body: string };

export type Block =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "code"; text: string };

export type Section = { id: string; title: string; blocks: Block[] };

export type Faq = { q: string; a: string };

/* ---------- home: what it does ---------- */

export const HOME_FACTS: Fact[] = [
  {
    title: "Nothing pools.",
    body: "Grok, Claude, Codex, Cursor and your custom bots each run under their own login. Not subscriptions, not context, not sandboxes.",
  },
  {
    title: "A model per chat.",
    body: "Vendor, model and thinking effort sit on the chat, not the app. Fork a chat to try another model on the same history, or rewind to an earlier turn.",
  },
  {
    title: "Leftover, from official meters.",
    body: "Usage per vendor and per chat, from each vendor's own count. Budgets, a weekly pace, a daily bank. A missing meter stays unknown, not zero.",
  },
  {
    title: "Bring your own.",
    body: "Any Anthropic or OpenAI-compatible endpoint becomes a first-class bot with its own name, colour and ring. Hosted, or on your own machine.",
  },
  {
    title: "Work that outlives a turn.",
    body: "Schedules, goals, plans and subagents are journalled and come back after a restart. One brief can fan out to every bot on the desk.",
  },
  {
    title: "Private by design.",
    body: "Keys live in the OS credential store. Memory is a SQLite file on your disk you can export or wipe. It sends no analytics.",
  },
];

/* ---------- /features ---------- */

export const VENDOR_TABLE: { head: string[]; rows: string[][] } = {
  head: ["Vendor", "How it connects", "Notes"],
  rows: [
    ["Grok", "ACP over stdio", "Runs the local Grok CLI"],
    ["Claude", "ACP over stdio", "Runs the local Claude Code CLI"],
    ["Codex", "ACP, plus an App Server", "App Server adds native history and capability discovery"],
    ["Cursor", "ACP over stdio", "Runs `cursor-agent`"],
    ["Custom", "HTTP", "Any Anthropic Messages or OpenAI Chat Completions endpoint, hosted or local"],
  ],
};

export const FEATURE_SECTIONS: Section[] = [
  {
    id: "agents",
    title: "Agents",
    blocks: [
      { kind: "table", head: VENDOR_TABLE.head, rows: VENDOR_TABLE.rows },
      {
        kind: "p",
        text: "Each vendor runs under its own login. Subscriptions, context and sandboxes are never pooled.",
      },
      {
        kind: "p",
        text: "OpenClaw and Hermes are harnesses, not vendors. Settings → LLMs shows whether each is installed. A plan can grant them for one wave, or you can name `openclaw/main` or `hermes/<profile>`. Their tasks join the lineup. They get no Usage ring, and delete, rename, credentials and elevate stay blocked.",
      },
    ],
  },
  {
    id: "chats",
    title: "Chats and projects",
    blocks: [
      {
        kind: "ul",
        items: [
          "A project is a name. Folders and references are optional, added later.",
          "Chats belong to a project. Rename, archive, delete, or drag one to another project.",
          "Vendor, model and thinking effort are set per chat, not per app.",
          "Fork a chat to try a different model on the same history. When the project has a Git folder, the fork gets a managed worktree — the same isolation subagents use.",
          "Rewind to an earlier turn.",
          "A portable transcript follows a chat when its vendor changes.",
          "Search runs over chat titles and message text across every project.",
          "A turn's work stays on one compact line while it runs. Open it for the ordered detail: think, tools, think. Consecutive tool calls share one fold; a later thought starts a new hop.",
        ],
      },
    ],
  },
  {
    id: "files",
    title: "Files you can hand a chat",
    blocks: [
      { kind: "p", text: "Drag them onto the window, or paste them in." },
      {
        kind: "ul",
        items: [
          "**Images** — png, jpg, jpeg, webp, gif, bmp",
          "**Audio** — mp3, wav, m4a, aac, flac, ogg, opus, webm",
          "**Video** — mp4, mov, m4v, webm, avi, mkv",
          "**Documents** — pdf, doc, docx, ppt, pptx, xls, xlsx, rtf, odt",
          "**Text and code** — txt, md, json, csv, tsv, ts, tsx, js, py, rs, go, java, rb, php, c, cpp, cs, sql, yml, toml, sh, and the rest of the usual list",
          "**Folders** — dropped whole, with dotfiles and build output skipped",
        ],
      },
      {
        kind: "p",
        text: "A chat can also read media the agent wrote, so a generated image shows in the transcript rather than as a path.",
      },
    ],
  },
  {
    id: "control",
    title: "Control",
    blocks: [
      {
        kind: "ul",
        items: [
          "**Permission modes** — ask, accept-edits, always-approve, plan.",
          "**Sandbox profiles** — off, workspace, read-only, strict.",
          "**One permission inbox.** Every prompt lands in the same place and is translated to each vendor's own protocol.",
          "**Execution directory** — a chat runs in a linked folder or in a managed git worktree, isolated from your working copy.",
          "**Terminal** — chat-scoped, in that same directory.",
          "**Git review** — a compact Changes control opens the changed files and diffs for the work a chat did. Click a row to open the file beside the chat.",
          "**Change instances** — a created file's lines stay green. A later prompt that deletes some of them keeps those lines as red instances in the review.",
        ],
      },
    ],
  },
  {
    id: "spend",
    title: "Spend",
    blocks: [
      {
        kind: "ul",
        items: [
          "Usage recorded per vendor and per chat, from each vendor's own count: the ACP turn total, or the HTTP response's usage block. A turn is estimated at four characters a token only when the vendor sent no count.",
          "**In** is fresh input — what the model read for the first time. **Cached** is context served back from cache, named apart so a long chat does not read as millions of new tokens. **Out** is what it wrote.",
          "Budgets per vendor.",
          "A weekly pace that tells you when you are ahead of it, before the bill does.",
          "A daily bank that hands every bot a slice of its plan per day and carries forward what it did not spend.",
          "A usage view by day, week, month, or all time.",
        ],
      },
    ],
  },
  {
    id: "outlives",
    title: "Work that outlives a turn",
    blocks: [
      {
        kind: "ul",
        items: [
          "**Schedules** — one-shot and recurring, journalled by the desktop process and recovered after a restart.",
          "**Goals** — long-running intent that survives the chat that started it.",
          "**Subagents** — lifecycle records, runtime and token ceilings, cascading cancellation, changed-file review, and worktree isolation where the project supports it. A worker gets a worker's context: the short worker rules and only the desk tools it may call.",
          "**Plans** — multi-step work that continues after a worker joins.",
          "**Routing** — your own chat keeps the model you picked until you set it to **Auto**; Auto picks the bot and effort for each message. When a chat spawns a worker without naming a bot, the desk picks the bot and effort for the slice. Settings → Routing turns that off, and tunes how any routing weighs leftover, reserve, and local models.",
        ],
      },
    ],
  },
  {
    id: "memory",
    title: "Memory",
    blocks: [
      {
        kind: "ul",
        items: [
          "A private learning store on your own disk, in SQLite.",
          "The compiler is a custom bot. Settings → Learning can backfill the last day of human prompts from saved chats.",
          "Human intent, agent performance, and mismatches between them compile as separate private lanes.",
          "Settings shows index counts and inferred memories, not raw prompt text.",
          "Export it, or wipe it, from Settings. Nothing is sent anywhere to hold it.",
        ],
      },
    ],
  },
  {
    id: "extending",
    title: "Extending it",
    blocks: [
      {
        kind: "ul",
        items: [
          "**Skills** — two ship with the desk, `desk` for chat-to-chat control and `setup` for adding bots and references. Skills are also listed from Grok, Codex, Claude and Cursor homes, and can be pushed back to a vendor.",
          "**MCP servers** — attached to a runtime, with the same approval and result path as built-in tools.",
          "**Custom bots** — a pasted URL and key become a first-class bot with its own name and colour. Testing the connection asks the provider which models it serves; tick the ones you want. One key is one bot and one leftover ring, however many models it offers.",
          "**The `/` palette** — new, project, link, model, effort, compact, plan, sandbox, usage, watch, schedule, goal, skills, review, context, rewind, export, memory, hooks, plugins, workflows, and more.",
        ],
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    blocks: [
      { kind: "p", text: "Profile, connected LLMs, skills, routing, learning, usage, watch." },
      {
        kind: "ul",
        items: [
          "The profile shows the Workhorse mark as tiny moving blobs of the bots you have called. Spend sets how many of each colour.",
          "Settings can export a support report that excludes prompts, messages, file contents, environment variables, URLs and credential values.",
          "Settings → Profile can check GitHub for a newer desk. A Mac installer downloads that release's disk image and replaces the app.",
        ],
      },
    ],
  },
  {
    id: "platforms",
    title: "Platforms",
    blocks: [
      {
        kind: "p",
        text: "Windows and macOS. Both installers are built and tested on their own machine for every release. Linux builds and tests in CI but has no installer yet.",
      },
    ],
  },
];

/* ---------- /docs ---------- */

export const DOC_SECTIONS: Section[] = [
  {
    id: "install",
    title: "Install",
    blocks: [
      {
        kind: "p",
        text: `**Mac.** Download the disk image for your Mac — Apple silicon or Intel — from [GitHub Releases](${RELEASES_URL}), open it, and drag Go7 Workhorse to Applications. Or let one line pick the right build:`,
      },
      { kind: "code", text: MAC_INSTALL_SCRIPT },
      {
        kind: "p",
        text: "**Windows.** Run `Go7-Workhorse-Setup-<version>.exe`. It adds Start-menu and Desktop shortcuts and keeps your projects and chats across updates.",
      },
      {
        kind: "p",
        text: "**Linux.** Builds and tests in CI. No installer yet.",
      },
    ],
  },
  {
    id: "first-run",
    title: "First run",
    blocks: [
      {
        kind: "ol",
        items: [
          "**New project** — give it a name. No folder needed.",
          "**New chat** from that project. Vendor, model and thinking effort sit on the chat; change them from the menu on the message box.",
          "**Link a folder** or **add a reference** when the work needs files, URLs or notes. Several folders are allowed.",
          "Type `/` for the palette. `/settings` opens Profile, LLMs, skills, routing, learning, usage and watch.",
        ],
      },
    ],
  },
  {
    id: "vendors",
    title: "Connect the vendors you pay for",
    blocks: [
      {
        kind: "p",
        text: "Grok, Claude, Codex and Cursor each run through their own CLI, under the login you already hold. Vendor CLIs are not bundled: install the one you use, sign in to it as you normally do, and Settings → LLMs shows what is connected.",
      },
      {
        kind: "table",
        head: ["Vendor", "Runs", "Login"],
        rows: [
          ["Grok", "the local Grok CLI, `grok agent stdio`", "your Grok plan"],
          ["Claude", "the local Claude Code CLI", "your Claude plan"],
          ["Codex", "the local Codex CLI, plus its App Server when present", "your Codex plan"],
          ["Cursor", "`cursor-agent`, the Cursor CLI", "your Cursor login"],
        ],
      },
      {
        kind: "p",
        text: "**Custom bots.** Paste a URL and a key — any Anthropic Messages or OpenAI Chat Completions endpoint, hosted or on your own machine. Test the connection to list the models it serves and tick the ones you want. The key goes to Keychain on macOS or DPAPI on Windows, never plain text; if that store is unavailable the desk refuses to save it.",
      },
    ],
  },
  {
    id: "leftover",
    title: "Read leftover",
    blocks: [
      {
        kind: "ul",
        items: [
          "**Settings → Usage** — a ring per vendor and per custom bot, from each vendor's own meter. In, Cached and Out are named apart. View by day, week, month or all time.",
          "**Settings → Watch** — the weekly pace and the daily bank. You set the pace.",
          "A missing official meter stays unknown. It is not shown as zero, and not as full.",
          "Cursor is two monthly pools and shows as two rings.",
        ],
      },
    ],
  },
  {
    id: "control",
    title: "Stay in control",
    blocks: [
      {
        kind: "ul",
        items: [
          "**Permission modes** — ask, accept-edits, always-approve, plan. Every prompt lands in one inbox and is translated to each vendor's own protocol.",
          "**Sandbox profiles** — off, workspace, read-only, strict. Permission and sandbox are separate controls, both visible on the chat.",
          "**Where a chat runs** — a linked folder, or a managed git worktree kept apart from your working copy. Terminal and Git review use that same directory.",
          "**Git review** — the Changes control opens the files and diffs for the work a chat did.",
        ],
      },
    ],
  },
  {
    id: "palette",
    title: "The / palette",
    blocks: [
      {
        kind: "p",
        text: "Type `/` in any chat: new, project, link, model, effort, compact, plan, sandbox, usage, watch, schedule, goal, skills, review, context, rewind, export, memory, hooks, plugins, workflows, and more.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Data and privacy",
    blocks: [
      {
        kind: "ul",
        items: [
          "**Where things live.** State is saved on your machine under the app's user-data folder as a versioned `workhorse-state.json`. Writes are atomic and three backup generations are kept.",
          "**Keys.** API keys go in the OS credential store — Keychain on macOS, DPAPI on Windows — never in plain text. If that store is unavailable the desk refuses to save the key at all.",
          "**Memory.** The learning store is a SQLite file on your disk. Export it or wipe it from Settings → Learning. Nothing is sent anywhere to hold it.",
          "**What it talks to.** The vendors you connect, including their usage endpoints for the meters, and GitHub, to check for a newer release. It sends no analytics.",
          "**Support report.** Settings can export one that excludes prompts, messages, file contents, environment variables, URLs and credential values.",
          "**No account, no server of ours.** Each vendor runs through its own CLI or API under your own login. Nothing is pooled, proxied or shared between vendors.",
        ],
      },
    ],
  },
  {
    id: "updates",
    title: "Updates",
    blocks: [
      {
        kind: "p",
        text: `Settings → Profile checks GitHub for a newer desk. On a Mac, the installer downloads that release's disk image and replaces the app; one macOS approval sticks across updates. On Windows the same app identity and encrypted vault carry across updates. Every release is on [GitHub Releases](${RELEASES_INDEX_URL}).`,
      },
    ],
  },
  {
    id: "more",
    title: "More",
    blocks: [
      {
        kind: "ul",
        items: [
          `[README](${README_URL}) — how it fits together, and how to run it from source.`,
          `[FEATURES.md](${FEATURES_MD_URL}) — every ability, kept current with each release.`,
          `[CONTRIBUTING](${CONTRIBUTING_URL}) — repository shape and versioning rules.`,
          `[Releases](${RELEASES_INDEX_URL}) — installers and notes for every version.`,
          `[Issues](${ISSUES_URL}) — report a bug or ask for something.`,
        ],
      },
    ],
  },
];

export const FAQ: Faq[] = [
  {
    q: "Do I need an account?",
    a: "No. There is no account with us and no server of ours. You sign in to each vendor through its own CLI or API, with the login you already hold.",
  },
  {
    q: "Does it pool my subscriptions?",
    a: "No. Each vendor runs under its own login. Subscriptions, context, tools and sandboxes are never pooled, proxied or shared.",
  },
  {
    q: "Which vendors does it run?",
    a: "Grok, Claude, Codex and Cursor over ACP, each through its own local CLI. Custom bots over HTTP: any Anthropic Messages or OpenAI Chat Completions endpoint, hosted or on your own machine.",
  },
  {
    q: "Do I have to install the vendor CLIs?",
    a: "Yes. They are not bundled. Install the ones you use and sign in as you normally do; the desk runs them under that login.",
  },
  {
    q: "What does it cost?",
    a: "The desk is open source under MIT, and the installers are on GitHub. Your subscriptions stay yours; the desk spends leftover you already bought.",
  },
  {
    q: "What does it send, and where?",
    a: "It talks to the vendors you connect, including their usage endpoints for the meters, and to GitHub to check for a newer release. It sends no analytics.",
  },
  {
    q: "Where are my API keys kept?",
    a: "In the OS credential store — Keychain on macOS, DPAPI on Windows — never in plain text. If that store is unavailable the desk refuses to save the key.",
  },
  {
    q: "How do meters work when a vendor has none?",
    a: "The ring stays unknown. The desk reads official meters only; a missing one is not shown as empty or full.",
  },
  {
    q: "Is there a Linux build?",
    a: "Not yet. Linux builds and tests in CI, but installers ship for Windows and macOS.",
  },
  {
    q: "How do updates arrive?",
    a: "Settings → Profile checks GitHub for a newer desk. On a Mac the installer downloads that release's disk image and replaces the app. Windows keeps the same app identity and encrypted vault across updates.",
  },
];

/* ---------- /download ---------- */

export const DOWNLOAD_STEPS = {
  mac: [
    "Open the disk image and drag Go7 Workhorse to Applications.",
    "Releases are signed and notarized. One macOS approval sticks across updates.",
    `Or in Terminal: \`${MAC_INSTALL_SCRIPT}\` — it picks the build for your Mac.`,
  ],
  windows: [
    "Run the Setup file. It adds Start-menu and Desktop shortcuts.",
    "Updates keep your projects, chats and encrypted vault.",
  ],
  then: [
    "Install the vendor CLIs you use — Grok, Claude Code, Codex, Cursor — and sign in as you normally do. They are not bundled.",
    "Add a custom bot with a URL and a key if you run your own or a local model.",
    "Read leftover in Settings → Usage.",
  ],
};

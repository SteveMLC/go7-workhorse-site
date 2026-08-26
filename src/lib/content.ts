/**
 * Copy for the human pages beyond the door.
 * Every claim here comes from the desk's public docs/FEATURES.md and README.
 * If it is not in FEATURES.md, it is not shipped, and it is not written here.
 *
 * Inline marks in strings: `code`, **strong**, [text](href). Nothing else.
 */
import { MAC_INSTALL_SCRIPT } from "./pages.ts";

export type Fact = { title: string; body: string };

export type Block =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "code"; text: string }
  | { kind: "h"; text: string }
  | { kind: "video"; src: string; poster: string; width: number; height: number; alt: string; caption?: string }
  | { kind: "image"; src: string; width: number; height: number; alt: string; caption?: string };

export type Section = { id: string; title: string; blocks: Block[] };

export type Faq = { q: string; a: string };

/* ---------- home: what it does ---------- */

export const HOME_FACTS: Fact[] = [
  {
    title: "Nothing pools.",
    body: "Grok, Claude, Codex, Cursor and your custom bots each run under their own login. The desk never pools them — not subscriptions, not context, not sandboxes.",
  },
  {
    title: "A model per chat.",
    body: "Vendor, model and thinking effort sit on the chat, not the app. Fork a chat to try another model on the same history, or rewind to an earlier turn.",
  },
  {
    title: "Leftover, from official meters.",
    body: "Leftover is what is still unspent on each plan, read from each vendor's own meter — per bot and per chat. Budgets, a weekly pace, a daily bank that carries forward what a day did not spend. A missing meter stays unknown, not zero.",
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
      {
        kind: "p",
        text: "Five kinds of bot sit on the desk — four vendors and your own endpoints. Each vendor connects over ACP (the Agent Client Protocol, the pipe its own CLI already speaks) and runs as its own process; custom bots are plain HTTP.",
      },
      { kind: "table", head: VENDOR_TABLE.head, rows: VENDOR_TABLE.rows },
      {
        kind: "p",
        text: "Each vendor runs under its own login. Subscriptions, context and sandboxes are never pooled.",
      },
      {
        kind: "video",
        src: "/media/providers",
        poster: "/media/providers-poster.webp",
        width: 1040,
        height: 672,
        alt: "Chat settings in the desk: the Provider row switches through Codex, Grok, MiniMax M3, Cursor and Claude, and the list of available models changes with each one.",
        caption: "One chat, five bots. Switch the provider and the model list follows; approval behavior and file access sit on the same chat. MiniMax M3 in that list is a custom bot, added with a URL and a key.",
      },
      {
        kind: "p",
        text: "**Workhorse Link** is how any outside app calls this desk — Codex, Claude Code, Grok, Grok Bot, OpenClaw, Hermes, or any MCP client. Settings → LLMs → Workhorse Link connects each with one button, and every app gets the same versioned contract: read and ask chats, query leftover and availability, delegate work, continue it, and follow worker status. The same helper is a JSON CLI, `workhorse`, for a harness without MCP. Connecting an app adds no vendor, no login, and no Usage ring.",
      },
      {
        kind: "p",
        text: "**Grok Bot** connects in both directions. Over Link it calls the desk like any other app — and it rides on the desk as a bot of its own: a local shim on 127.0.0.1 with its own loopback token, its own weekly ring, and an optional instant-reply webhook so the desk can wake it. It is not a fifth stock vendor; Grok over ACP stays its own login. [Connect Grok Bot](/docs/grok-bot).",
      },
      {
        kind: "p",
        text: "OpenClaw and Hermes are harnesses — apps on this machine that carry their own agents. The desk can call those agents without owning them. Settings → LLMs shows whether each is installed and lets you select its callable agents. A plan can grant selected agents for one wave (one round of workers), or you can name `openclaw/main` or `hermes/<profile>`; their tasks join the lineup beside the desk's own workers. They get no Usage ring, and delete, rename, credentials and elevate stay blocked. A spawn that arrives without naming a chat makes a new one, titled from the prompt.",
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
          "A parent with workers folds them on the count button; they ease open and closed.",
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
        kind: "video",
        src: "/media/usage",
        poster: "/media/usage-poster.webp",
        width: 1040,
        height: 672,
        alt: "Settings, Usage tab: a leftover ring for each bot — Grok, Codex, Claude, Cursor Composer, Cursor API, MiniMax M3 — above a chart of the current stretch.",
        caption: "Settings → Usage, read from each vendor's own meter: one ring per bot, Cursor as two pools, and the stretch below by day, week, month or all time.",
      },
      {
        kind: "ul",
        items: [
          "Usage recorded per vendor and per chat, from each vendor's own count: the ACP turn total, or the HTTP response's usage block. A turn is estimated at four characters a token only when the vendor sent no count.",
          "**In** is fresh input — what the model read for the first time. **Cached** is context served back from cache, named apart so a long chat does not read as millions of new tokens. **Out** is what it wrote.",
          "Compact shrinks the context meter; leftover moves only if that bot ran a billed summary. A spent daily bank can hold your next send until tomorrow — a full context window never does. One is money, the other is context.",
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
        kind: "video",
        src: "/media/fanout",
        poster: "/media/fanout-poster.webp",
        width: 1040,
        height: 672,
        alt: "One brief typed into a chat. The orchestrator names four workers — Wren on Grok 4.6, Dexter on Fable 5, Marlow on Composer 2.5, Piper on MiniMax M3 — they appear under the chat and run at once, finish, and the desk joins their drafts into one reply.",
        caption: "One brief, four workers, four models. The orchestrator reads the desk, skips the bot that is low on its weekly plan, gives every other one a slice, and joins their reports into one reply when they finish.",
      },
      {
        kind: "ul",
        items: [
          "**Schedules** — one-shot and recurring, journalled by the desktop process and recovered after a restart.",
          "**Goals** — long-running intent that survives the chat that started it. A desk goal continues in rounds after a turn ends, until pause, clear, or the round cap; each round is one turn on that chat's vendor. Grok's own `/goal` is still that vendor's one-shot driver.",
          "**Loops** — spawn a worker cold with only a bounded handoff (`seed: fresh`). The worker gets no parent conversation and keeps its own vendor, leftover ring and sandbox.",
          "**Turn log** — a chat can rebuild model history from its own turn and step log. The log is per chat and never shared across vendors.",
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
          "**Custom bots** — a pasted URL and key become a first-class bot with its own name and colour. Add a bot ships presets for MiniMax, Synthetic, OpenRouter, Groq, DeepSeek, Together, Fireworks, Hugging Face, Novita, Cerebras, AI/ML API, Vercel AI Gateway, Kimi Code, Gemini API, and Grok Bot, grouped as subscription plans, gateway credits, direct API billing, and on this Mac. Large catalogs are grouped, frontier-first, searchable, and explicitly approved. One key keeps one leftover ring with separate model rows.",
          "**The `/` palette** — new, project, link, model, effort, compact, plan, sandbox, usage, watch, schedule, goal, loop, skills, review, context, rewind, export, memory, hooks, plugins, workflows, and more.",
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
          "Settings → Profile can check GitHub for a newer desk. A Mac installer downloads that release's disk image, replaces the app, and opens it. A Windows installer downloads the Setup exe, installs after Workhorse quits, and opens the new build. When one is ready, a blue update control appears at the far right of Settings; hover it for Update now and the version it will install.",
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
        text: "Windows and macOS. Both installers are built and tested on their own machine for every release. No Linux installer yet.",
      },
    ],
  },
];

/* ---------- /docs (the guides live in docs.ts; the FAQ is shared) ---------- */

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
    a: "Not yet. Installers ship for Windows and macOS.",
  },
  {
    q: "How do updates arrive?",
    a: "Settings → Profile checks GitHub for a newer desk, and a blue update control appears at the far right of Settings when one is ready. On a Mac the installer downloads that release's disk image, replaces the app, and opens it. On Windows it downloads the Setup exe, installs after Workhorse quits, and opens the new build. Projects, chats and the encrypted vault carry across.",
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

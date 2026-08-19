/**
 * The docs. One guide per topic, in reading order. Every line comes from the
 * desk's public docs/FEATURES.md, its README, or the words the desk itself
 * shows on screen (Settings panes, sheets, the palette). Nothing is invented.
 *
 * Inline marks in strings: `code`, **strong**, [text](href). Nothing else.
 */
import type { Faq, Section } from "./content.ts";
import { FAQ } from "./content.ts";
import { DESK_COMMANDS, VENDOR_COMMANDS } from "./desk-commands.ts";
import {
  CONTRIBUTING_URL,
  FEATURES_MD_URL,
  ISSUES_URL,
  MAC_INSTALL_SCRIPT,
  README_URL,
  RELEASES_INDEX_URL,
  RELEASES_URL,
} from "./pages.ts";

export type Doc = {
  slug: string;
  title: string;
  /** One line under the title. */
  lead: string;
  sections: Section[];
  /** Only the FAQ doc carries this; it feeds the FAQPage schema. */
  faq?: Faq[];
};

export const DOCS: Doc[] = [
  {
    slug: "getting-started",
    title: "Getting started",
    lead: "Install the desk, make a project, start a chat. Ten minutes, no account.",
    sections: [
      {
        id: "install",
        title: "Install",
        blocks: [
          {
            kind: "p",
            text: `**Mac.** Download the disk image for your Mac — Apple silicon or Intel — from [GitHub Releases](${RELEASES_URL}), open it, and drag Go7 Workhorse to Applications. Or let one line pick the right build, copy the app to Applications, and unmount. Nothing is installed system-wide and no password is needed:`,
          },
          { kind: "code", text: MAC_INSTALL_SCRIPT },
          {
            kind: "p",
            text: "The Apple silicon build does not start on an Intel Mac, so pick the disk image that matches your chip, or use the line above — it checks.",
          },
          {
            kind: "p",
            text: "**Windows.** Run `Go7-Workhorse-Setup-<version>.exe`. It adds Start-menu and Desktop shortcuts and keeps your projects and chats across updates.",
          },
          { kind: "p", text: "**Linux.** No installer yet." },
        ],
      },
      {
        id: "first-run",
        title: "First run",
        blocks: [
          {
            kind: "ol",
            items: [
              "**New project** — give it a name. No folder needed. Add **Source folders** now or later; several are allowed.",
              "**New chat** from that project, or from the welcome screen (that makes an Untitled project). A chat starts with the last model you used.",
              "Open **Chat settings** from the message box to set the **Provider**, pick from **Available models**, and set the **Reasoning level**. Those live on the chat, not the app.",
              "**Talk.** Grok, Codex, Claude and Cursor run live through their own CLIs. A custom bot runs over HTTP.",
              "Type `/` for the palette. `/settings` opens Profile, LLMs, Skills, Routing, Learning, Usage and Watch.",
            ],
          },
          {
            kind: "p",
            text: "The welcome screen shows what it found on this machine: each vendor reads **Recognized**, **Sign in needed**, or **Not found**. If a vendor is missing, [connect it](/docs/vendors).",
          },
        ],
      },
      {
        id: "the-window",
        title: "What you are looking at",
        blocks: [
          {
            kind: "ul",
            items: [
              "**The sidebar** — projects, and the chats inside each. Search all chats from the top. Each chat row shows its vendor colour and how old the last prompt is.",
              "**The chat** — the transcript, the message box, and a compact line of the turn's work while it runs. Beside the message box: **Changes** (git review) and the **Terminal**.",
              "**Settings** — `/settings`, or the Workhorse mark. Profile, LLMs, Skills, Routing, Learning, Usage, Watch.",
              "**Themes** — `/theme` cycles Light, Dark, Workhorse and System. Clicking the mark toggles the Workhorse look.",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "vendors",
    title: "Connect the vendors you pay for",
    lead: "Each vendor runs through its own CLI, under the login you already hold. Nothing pools.",
    sections: [
      {
        id: "how",
        title: "How a vendor connects",
        blocks: [
          {
            kind: "p",
            text: "Vendor CLIs are not bundled. Install the one you use, sign in to it as you normally do, and the desk runs it as its own process under that login. **Settings → LLMs → Add bot** opens **Add a bot**, which lists what the desk can see — **Local Grok Build**, **Local Claude Code**, **Local Codex**, **Local Cursor Agent** — each with a state: **Ready on the desk**, **Installed — sign in with agent login**, **Needs auth**, or **Not found**.",
          },
          {
            kind: "table",
            head: ["Vendor", "What runs", "Protocol", "Notes"],
            rows: [
              ["Grok", "the local Grok CLI, `grok agent stdio`", "ACP over stdio", "Your Grok plan"],
              ["Claude", "the local Claude Code CLI", "ACP over stdio", "Your Claude plan"],
              ["Codex", "the local Codex CLI", "ACP, plus an App Server when the CLI has one", "The App Server adds native history and capability discovery"],
              ["Cursor", "`cursor-agent`, the Cursor CLI", "ACP over stdio", "Needs the Cursor Agent CLI, not the editor app. Your Cursor login."],
              ["Custom", "an HTTP endpoint you name", "Anthropic Messages or OpenAI Chat Completions", "Hosted, or on your own machine"],
            ],
          },
          {
            kind: "p",
            text: "Each vendor runs under its own login. Subscriptions, context, tools and sandboxes are never pooled, proxied, or shared between vendors.",
          },
        ],
      },
      {
        id: "paths",
        title: "If a CLI lives somewhere unusual",
        blocks: [
          {
            kind: "p",
            text: "The desk finds the vendor CLIs on its own. If yours is somewhere it does not look, these environment variables point at it:",
          },
          {
            kind: "table",
            head: ["Vendor", "Variable", "Points at"],
            rows: [
              ["Codex", "`CODEX_PATH`", "the installed Codex CLI"],
              ["Codex", "`CODEX_ACP_BIN`", "an ACP bridge other than the bundled `@agentclientprotocol/codex-acp`"],
              ["Claude", "`CLAUDE_CODE_EXECUTABLE`", "the installed Claude Code CLI"],
              ["Claude", "`CLAUDE_ACP_BIN`", "an ACP bridge other than the bundled `@agentclientprotocol/claude-agent-acp`"],
              ["Cursor", "`CURSOR_ACP_BIN`", "a Cursor agent binary other than `agent acp`"],
            ],
          },
        ],
      },
      {
        id: "custom",
        title: "Custom bots: your own keys and local models",
        blocks: [
          {
            kind: "p",
            text: "**Add a bot → Your own.** Give it a **Bot name**, a **Provider** (Anthropic Messages or OpenAI Chat Completions), the **Base URL**, and the **API key**. Set the **Context window**, and pick a colour. **Test the API before Create** — the test asks the endpoint which models it serves; tick the ones you want under **Models on this key**. The default model is always approved.",
          },
          {
            kind: "ul",
            items: [
              "One key is one bot and one leftover ring, however many models it offers. Usage still breaks the tokens out per model.",
              "Any chat on that bot can pick between the ticked models.",
              "The key is stored only on this computer, in the OS credential store — Keychain on macOS, DPAPI on Windows. If that store is unavailable, the desk refuses to save it at all.",
              "A local model on your own machine is a custom bot with a local URL. Routing can prefer it: **Allow local models** — it costs nothing and never leaves the machine.",
              "Custom OpenAI-compatible support targets Chat Completions. The Responses API and Azure deployment routing are not implemented.",
            ],
          },
        ],
      },
      {
        id: "harnesses",
        title: "OpenClaw and Hermes",
        blocks: [
          {
            kind: "p",
            text: "OpenClaw and Hermes are **harnesses**, not vendors. **Settings → LLMs** shows whether each runtime is installed and lets you select its callable agents. A plan can grant selected agents for one wave, or you can name `openclaw/main` or `hermes/<profile>`; those tasks join the lineup. They get no Usage ring, and delete, rename, credentials and elevate stay blocked. **Settings → LLMs → Install MCP** writes a restricted Workhorse server into OpenClaw's `mcp.servers` (and Hermes's `mcp_servers` if Hermes is installed) so those apps can list, read and ask chats, and spawn a Workhorse worker on a chat you pick. No token is stored.",
          },
        ],
      },
    ],
  },

  {
    slug: "chats",
    title: "Projects and chats",
    lead: "A project is a name. A chat carries its own vendor, model and effort.",
    sections: [
      {
        id: "projects",
        title: "Projects",
        blocks: [
          {
            kind: "ul",
            items: [
              "A project is a name. **Source folders** and references are optional, added later. Several folders are allowed.",
              "**Add a reference** to keep a URL or a note on the project. **Remember this…** keeps a note.",
              "The project home lists its chats. **Archive** a project and keep or delete its chats; **Unarchive** later.",
            ],
          },
        ],
      },
      {
        id: "chats",
        title: "Chats",
        blocks: [
          {
            kind: "ul",
            items: [
              "Chats belong to a project. Rename (`/rename`), archive (`/archive`), delete (`/delete`), or drag one to another project.",
              "**Chat settings** sit on the chat: **Provider**, **Available models**, **Reasoning level**, **Approval behavior**, **File access**, **Environment**. Nothing here is per app.",
              "**Fork** (`/fork`) branches this chat from the latest turn to try a different model on the same history. When the project has a Git folder, the fork gets its own isolated worktree — the same isolation subagents use.",
              "**Rewind** to an earlier turn.",
              "A portable transcript follows a chat when its vendor changes. `/compact` compresses the context with an optional keep-note; it shrinks the context meter, and leftover does not move unless that bot ran a billed summary.",
              "**Search all chats** from the sidebar runs over titles and message text across every project.",
              "Each chat row shows how old the last prompt is — `25m`, `2h`, `3d`. Hover for the full time. A parent with workers folds them on the count button.",
            ],
          },
        ],
      },
      {
        id: "transcript",
        title: "Reading a turn",
        blocks: [
          {
            kind: "p",
            text: "A turn's work stays on one compact line while it runs. Open it for the ordered detail: think, tools, think. Consecutive tool calls share one fold — expand it to see the calls listed underneath. When a turn runs long, earlier thoughts and tools roll into an **Earlier** fold you can open again; the current hop stays open. The visible reply stays below that. `/copy` copies the latest reply.",
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
    ],
  },

  {
    slug: "control",
    title: "Permissions and sandbox",
    lead: "Two separate controls, both on the chat. Agents can ask to raise them. They never lower them.",
    sections: [
      {
        id: "approval",
        title: "Approval behavior",
        blocks: [
          {
            kind: "table",
            head: ["Mode", "Command", "What it means"],
            rows: [
              ["Ask each time", "`/ask`", "Ask before tools run."],
              ["Accept edits", "`/accept-edits`", "Allow file edits without asking."],
              ["Always allow", "`/always-approve`", "Skip ordinary permission prompts."],
              ["Plan mode", "`/plan`", "Plan first — research only, then a reviewable plan."],
            ],
          },
          {
            kind: "p",
            text: "**One permission inbox.** Every prompt from every vendor lands in the same card above the message box, translated to that vendor's own protocol: **Allow once**, **Allow for session**, or **Deny**. When a chat is held below what its work needs, the agent may ask to **Elevate** — you see the card, you decide. An agent cannot lower a limit.",
          },
        ],
      },
      {
        id: "file-access",
        title: "File access",
        blocks: [
          {
            kind: "table",
            head: ["Profile", "Command", "What it means"],
            rows: [
              ["Full access", "`/sandbox off`", "No sandbox."],
              ["Workspace only", "`/sandbox workspace`", "Reads and writes stay inside the linked folder or worktree."],
              ["Read-only", "`/sandbox read-only`", "Read, do not write."],
              ["Strict", "`/sandbox strict`", "The tightest profile."],
            ],
          },
          {
            kind: "p",
            text: "Permission mode, filesystem sandbox, network access, and outside-workspace access are separate settings. The desk applies the shared boundary before it translates an approval to a vendor; Codex also receives supported controls through its native config.",
          },
        ],
      },
      {
        id: "where",
        title: "Where a chat runs",
        blocks: [
          {
            kind: "p",
            text: "**Environment** on the chat is **Local folder** — the linked project folder — or **Isolated worktree**: a managed, detached Git worktree kept apart from your working copy. Link a project folder first. The **Terminal** and **Changes** use that same directory.",
          },
        ],
      },
      {
        id: "terminal",
        title: "Terminal",
        blocks: [
          {
            kind: "p",
            text: "The chat terminal is chat-scoped: it opens in that chat's folder or worktree, the same directory the agent works in.",
          },
        ],
      },
      {
        id: "review",
        title: "Changes: git review",
        blocks: [
          {
            kind: "ul",
            items: [
              "**Changes**, beside the message box, opens the changed files and diffs for the work a chat did. Click a row to open the file beside the chat, or as the project-home pane. `+0/−0` stays hidden.",
              "Line stats load in the background and do not re-diff the list once they are known.",
              "**Change instances** — a created file's lines stay green. A later prompt that deletes some of them keeps those lines as red instances in the review, instead of shrinking the green count against empty / HEAD.",
              "Paths outside the project folder — an OpenClaw config, say — still resolve from the cite in the transcript.",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "spend",
    title: "Meters, budgets and pace",
    lead: "Spend is leftover, read from each vendor's own meter. A missing meter stays unknown.",
    sections: [
      {
        id: "usage",
        title: "Settings → Usage",
        blocks: [
          {
            kind: "ul",
            items: [
              "A ring per vendor and per custom bot, from each vendor's own count: the ACP turn total, or the HTTP response's usage block. `/usage` opens it.",
              "**In** is fresh input — what the model read for the first time. **Cached** is context served back from cache, named apart so a long chat does not read as millions of new tokens. **Out** is what it wrote. The total is In + Out.",
              "View **Usage over this stretch** by day, week, month, or all time. **Plan usage limits** show the weekly allowance where the vendor reports one; **Latest context** shows the last turn's context.",
              "Cursor is two monthly pools — Cursor Models (Composer / Cursor Grok) and Other Models (third-party API) — and shows as two rings.",
              "A turn is estimated at four characters a token only when the vendor sent no count. So far that is Cursor.",
            ],
          },
        ],
      },
      {
        id: "unknown",
        title: "When there is no meter",
        blocks: [
          {
            kind: "p",
            text: "The desk reads official meters only. A vendor without one, or one that is not answering, shows an unknown ring — not zero, not full. Nothing is guessed.",
          },
        ],
      },
      {
        id: "budgets",
        title: "Budgets and pace",
        blocks: [
          {
            kind: "ul",
            items: [
              "**Budgets per vendor.**",
              "**A weekly pace** that tells you when you are ahead of it, before the bill does.",
              "Tokens are recorded per vendor and per chat. Preview and failed-before-prompt record none.",
            ],
          },
        ],
      },
      {
        id: "watch",
        title: "Settings → Watch",
        blocks: [
          {
            kind: "ul",
            items: [
              "**Daily bank** hands every watched bot a slice of its plan per day and carries forward what it did not spend, so a long Monday does not leave Sunday with nothing. Choose the watched bots. Click Daily bank to change who stays on it.",
              "**Desktop notification** for Watch notices, such as a send hold.",
              "`/watch` shows leftover, daily spend, and send holds. You set the pace.",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "automation",
    title: "Work that outlives a turn",
    lead: "Schedules, goals, plans, workers and routing. All journalled, all back after a restart.",
    sections: [
      {
        id: "schedules",
        title: "Schedules",
        blocks: [
          {
            kind: "p",
            text: "`/schedule 30m check build` runs later; `/schedule every 30m check build` repeats. One-shot and recurring schedules are journalled by the desktop process and recovered after a restart.",
          },
        ],
      },
      {
        id: "goals",
        title: "Goals",
        blocks: [
          {
            kind: "p",
            text: "`/goal <objective>` sets a quiet, long-running intent that survives the chat that started it. A desk goal continues in rounds after a turn ends — each round is one turn on that chat's vendor — until `/goal pause`, `/goal clear`, or the round cap. `/goal status` and `/goal resume` manage it; the **Active goal** bar shows what is running and **Clear goal** ends it. In a Grok chat, `/goal` is Grok's own one-shot driver.",
          },
        ],
      },
      {
        id: "loops",
        title: "Loops and the turn log",
        blocks: [
          {
            kind: "ul",
            items: [
              "`/loop <objective>` runs a bounded Workhorse goal loop: it spawns a worker cold with only a bounded handoff (`seed: fresh`). The worker gets no parent conversation and keeps its own vendor, leftover ring and sandbox. `/loop status`, `pause`, `resume`, `clear` manage it.",
              "A chat can rebuild model history from its own turn and step log. The log is per chat and never shared across vendors.",
            ],
          },
        ],
      },
      {
        id: "workers",
        title: "Plans and workers",
        blocks: [
          {
            kind: "ul",
            items: [
              "**Plans** — multi-step work that continues after a worker joins.",
              "**Subagents** — a chat can spawn a Workhorse worker for a slice, on any bot on the desk that can be called. Workers start together unless the caller asked to wait; the desk joins their reports.",
              "Each worker has lifecycle records, runtime and token ceilings, cascading cancellation, changed-file review, and worktree isolation where the project supports it.",
              "A worker gets a worker's context: the short worker rules and only the desk tools it may call — read and ask chats, one bounded helper, ask to raise a block, read skills and references. It cannot create, rename, move or delete anything on the desk.",
              "Nested workers show under their parent in the sidebar with the model and effort each ran on.",
            ],
          },
        ],
      },
      {
        id: "routing",
        title: "Routing",
        blocks: [
          {
            kind: "p",
            text: "Your own chat keeps the model you picked until you set the provider to **Auto** — then the desk picks the bot and effort for each message. Work the desk hands out is routed on its own: when a chat spawns a worker without naming a bot, the desk picks the bot and effort for the slice; a named bot is used as named.",
          },
          {
            kind: "p",
            text: "**Settings → Routing** tunes it, or turns it off:",
          },
          {
            kind: "ul",
            items: [
              "**Route the work the desk hands out** — Auto chats only, or Auto chats and spawned workers.",
              "**Weekly reserve** — hold back this much of each bot's week. A bot down to its reserve is skipped.",
              "**Weigh leftover** — score each bot by how far it is under its weekly pace.",
              "**Prefer spare** — favour whoever has the most left, not only avoid whoever is behind.",
              "**Allow local models** — a local bot may win. It costs nothing and never leaves this machine.",
              "**Include harnesses** — when Routing is on, OpenClaw and Hermes may be chosen after a grant. Off, only an explicit name starts one.",
              "**Picks now** previews the choice for short asks (rename, format, list, translate), most work, and heavy work (debug, refactor, review, research, long prompts with media).",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "memory",
    title: "Learning",
    lead: "A private store on your own disk. Off until you turn it on. Export it or wipe it any time.",
    sections: [
      {
        id: "modes",
        title: "Settings → Learning",
        blocks: [
          {
            kind: "table",
            head: ["Mode", "What it does"],
            rows: [
              ["Off", "Learning is off. Nothing is recorded."],
              ["Capture", "Record redacted events. Do not compile."],
              ["Review", "Propose memories. Approve before they become active."],
              ["Automatic", "Promote statements that pass evidence gates."],
            ],
          },
          {
            kind: "ul",
            items: [
              "The store is SQLite on your own disk, owned by the desktop process. Nothing is sent anywhere to hold it.",
              "The **Compiler model** must be a custom bot — the policy picks an eligible one. ACP vendors cannot do a title-less call.",
              "Human intent (**What you want**), agent performance, and mismatches between them compile as separate private lanes. Agent evidence includes model outcomes, terminal tools, retries, tests, artifacts, usage and errors — not raw reasoning text.",
              "Learning can backfill the last day of human prompts from saved chats.",
              "The pane shows index counts and inferred memories. Prompt text stays in SQLite and is not shown.",
              "**Export** takes a copy. **Forget learning** tombstones sources; **Purge** permanently rebuilds the store.",
              "Memory cannot grant tools, change permissions, pick a project, or override the current request.",
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "extending",
    title: "Skills, MCP and custom bots",
    lead: "Extend the desk with the vendors' own skills, MCP servers, and bots you add.",
    sections: [
      {
        id: "skills",
        title: "Skills",
        blocks: [
          {
            kind: "ul",
            items: [
              "Two skills ship with the desk: `desk` for chat-to-chat control and `setup` for adding bots and references.",
              "**Settings → Skills** lists skills from the Grok, Codex, Claude and Cursor homes on this machine, searchable by name, origin, or what it does. A skill can be pushed back to a vendor.",
              "In a chat, a skill is a command: `/skill-name` asks the vendor to use it, following its SKILL.md. Codex and Claude also answer `/skills`.",
            ],
          },
        ],
      },
      {
        id: "mcp",
        title: "MCP servers",
        blocks: [
          {
            kind: "p",
            text: "MCP servers attach to a runtime, with the same approval and result path as built-in tools. Custom Anthropic Messages and OpenAI Chat Completions bots can use configured MCP servers through that same path.",
          },
        ],
      },
      {
        id: "custom",
        title: "Custom bots",
        blocks: [
          {
            kind: "p",
            text: "A pasted URL and key become a first-class bot with its own name and colour, its own ring, and the models you tick. See [Connect the vendors you pay for](/docs/vendors#custom).",
          },
        ],
      },
    ],
  },

  {
    slug: "commands",
    title: "Command reference",
    lead: "Type / in any chat. These are the desk's own commands; each vendor adds its own on top.",
    sections: [
      {
        id: "desk",
        title: "Desk commands",
        blocks: [
          {
            kind: "table",
            head: ["Command", "What it does", "Also"],
            rows: DESK_COMMANDS.map((command) => [
              `\`${command.name}\`${command.takes ? ` \`${command.takes}\`` : ""}`,
              command.hint,
              command.aliases ? command.aliases.map((alias) => `\`${alias}\``).join(" ") : "",
            ]),
          },
        ],
      },
      {
        id: "vendor",
        title: "Vendor commands",
        blocks: [
          {
            kind: "p",
            text: "Some vendors add commands that pass straight through to the vendor:",
          },
          {
            kind: "table",
            head: ["Vendor", "Command", "What it does"],
            rows: VENDOR_COMMANDS.flatMap((group) =>
              group.commands.map((command) => [group.vendor, `\`${command.name}\``, command.hint]),
            ),
          },
          {
            kind: "p",
            text: "Grok chats also carry the Grok CLI's own commands — `/context`, `/rewind`, `/export`, `/memory`, `/hooks`, `/plugins`, `/workflows`, `/imagine`, `/deep-research` and the rest — as Grok ships them. In a Grok chat, `/goal` is Grok's own one-shot goal and `/loop` runs a prompt on a schedule; the desk's `/goal` and `/loop` above belong to every other vendor.",
          },
        ],
      },
      {
        id: "skills",
        title: "Skills as commands",
        blocks: [
          {
            kind: "p",
            text: "Every installed skill for the chat's vendor is a command: `/skill-name`, with the skill's description as its hint. `/compact` is hidden on vendors that cannot compact.",
          },
        ],
      },
    ],
  },

  {
    slug: "privacy",
    title: "Data and privacy",
    lead: "Where things live, what it talks to, and what never leaves the machine.",
    sections: [
      {
        id: "where",
        title: "Where things live",
        blocks: [
          {
            kind: "ul",
            items: [
              "**State** — projects, chats, schedules, goals — is saved on your machine under the app's user-data folder as a versioned `workhorse-state.json`. Writes are atomic, three protected backup generations are kept, older saves migrate on load, and a corrupt primary falls back to the newest compatible backup.",
              "**Keys** go in the OS credential store — Keychain on macOS, DPAPI on Windows — never in plain text, and are removed from normal state and backups. If that store is unavailable the desk refuses to save the key at all.",
              "**Learning memory** is a SQLite file on your disk. Export it or wipe it from Settings → Learning.",
              "**Development runs** (`npm run dev` and local packages) use isolated data and session-only credentials, so a local build never touches Keychain or the installed app's vault.",
            ],
          },
        ],
      },
      {
        id: "talks-to",
        title: "What it talks to",
        blocks: [
          {
            kind: "ul",
            items: [
              "The vendors you connect, including their usage endpoints for the meters.",
              "GitHub, to check for a newer release.",
              "Nothing else. It sends no analytics.",
              "There is no account with us and no server of ours. Each vendor runs through its own CLI or API under your own login; nothing is pooled, proxied or shared between vendors.",
            ],
          },
        ],
      },
      {
        id: "support",
        title: "Support report",
        blocks: [
          {
            kind: "p",
            text: "Settings can export a support-safe report. It excludes prompts, messages, file contents, environment variables, URLs and credential values.",
          },
        ],
      },
      {
        id: "identity",
        title: "App identity",
        blocks: [
          {
            kind: "p",
            text: "On macOS, approval belongs to the signed app identity: one allow sticks across updates with the same bundle ID and Team ID, and local builds cannot open the installed app's vault. Windows keeps the same app identity and encrypted user vault across updates.",
          },
        ],
      },
    ],
  },

  {
    slug: "updates",
    title: "Updates and releases",
    lead: "The desk checks GitHub. Installers and notes for every version live there.",
    sections: [
      {
        id: "how",
        title: "How an update arrives",
        blocks: [
          {
            kind: "ul",
            items: [
              "**Settings → Profile** checks GitHub for a newer desk. When one is ready, a blue update control appears at the far right of Settings; hover it for **Update now** and the version it will install.",
              "On a Mac, the installer downloads that release's disk image, replaces the app, and opens it. One macOS approval sticks across updates.",
              "On Windows, the installer downloads the Setup exe, installs after Workhorse quits, and opens the new build. The same app identity and encrypted vault carry across; projects and chats stay.",
              "Both installers are built and tested on their own machine for every release.",
            ],
          },
        ],
      },
      {
        id: "where",
        title: "Where releases live",
        blocks: [
          {
            kind: "p",
            text: `Every version is on [GitHub Releases](${RELEASES_INDEX_URL}) with its notes; the [changelog](/changelog) on this site reads the same list. Repository shape and versioning rules are in [CONTRIBUTING](${CONTRIBUTING_URL}).`,
          },
        ],
      },
    ],
  },

  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    lead: "The short list. If it is not here, the public repo's issues are the place.",
    sections: [
      {
        id: "vendor",
        title: "A vendor shows Not found or Sign in needed",
        blocks: [
          {
            kind: "ul",
            items: [
              "**Not found** — the CLI is not installed, or is somewhere the desk does not look. Install it, or point at it with the [environment variables](/docs/vendors#paths).",
              "**Sign in needed** / **Needs auth** — sign in to that CLI the way its vendor documents. The desk uses that login as-is.",
              "**Cursor** needs the Cursor Agent CLI, not the editor app.",
              "**Codex** works over ACP alone; native history and capability discovery appear when the installed CLI exposes `codex app-server`.",
            ],
          },
        ],
      },
      {
        id: "meter",
        title: "A ring shows unknown",
        blocks: [
          {
            kind: "p",
            text: "The vendor has no official meter, or it did not answer. The desk does not guess: unknown stays unknown, not zero and not full. Tokens the desk counted itself still show in Usage.",
          },
        ],
      },
      {
        id: "key",
        title: "A key will not save",
        blocks: [
          {
            kind: "p",
            text: "The OS credential store — Keychain on macOS, DPAPI on Windows — is unavailable, and the desk refuses to persist a key in plain text. Restore the store and try again.",
          },
        ],
      },
      {
        id: "mac",
        title: "The Mac app will not start",
        blocks: [
          {
            kind: "p",
            text: "The Apple silicon build does not start on an Intel Mac. Download the `-mac-x64.dmg`, or run the one-line installer, which picks the right build.",
          },
        ],
      },
      {
        id: "state",
        title: "Something looks wrong after a crash",
        blocks: [
          {
            kind: "p",
            text: "State writes are atomic and three backup generations are kept; a corrupt primary falls back to the newest compatible backup on load. Nothing needs doing by hand.",
          },
        ],
      },
      {
        id: "report",
        title: "Asking for help",
        blocks: [
          {
            kind: "p",
            text: `Export the support report from Settings — it excludes prompts, messages, file contents, environment variables, URLs and credential values — and open an [issue](${ISSUES_URL}) with it.`,
          },
        ],
      },
    ],
  },

  {
    slug: "architecture",
    title: "How it fits together",
    lead: "A window, a main process, and one adapter per vendor. The window never touches a vendor CLI.",
    sections: [
      {
        id: "shape",
        title: "The shape",
        blocks: [
          {
            kind: "ul",
            items: [
              "**The window** (`src/ui`) — projects, chats, the permission bar. React. It speaks typed IPC and nothing else.",
              "**Electron main** (`electron/`) — owns the adapters, prompts, credentials and the working directory. It journals queues, schedules and goals, and recovers dispatched work after a restart.",
              "**Adapters** — Grok, Claude and Cursor speak ACP over stdio to their own CLI; Codex adds an App Server; custom bots are plain HTTP. Each vendor runs as its own process under the login you already hold.",
              "**Credential store** — OS-encrypted. **Terminal and managed git worktree** — the chat's execution directory.",
              "A provider capability registry drives the controls, so the window never implies a vendor supports something it does not.",
            ],
          },
          {
            kind: "p",
            text: `The README carries the diagram and the layout of the tree: [How it fits together](${README_URL}).`,
          },
        ],
      },
      {
        id: "source",
        title: "Run it from source",
        blocks: [
          { kind: "code", text: "npm install\nnpm run dev" },
          {
            kind: "p",
            text: "`npm run dev` opens the Go7 Workhorse window with isolated development data and session-only credentials. `npm run dist:mac` and `npm run dist:win` build the installers; release builds need the signing and notarization secrets. `npm test` runs the adapter and shell suite. Everything is MIT.",
          },
        ],
      },
    ],
  },

  {
    slug: "faq",
    title: "FAQ",
    lead: "Short answers to the questions that come up first.",
    faq: FAQ,
    sections: [],
  },
];

export const DOC_SLUGS = DOCS.map((doc) => doc.slug);

export function docBySlug(slug: string): Doc | undefined {
  return DOCS.find((doc) => doc.slug === slug);
}

export function docNeighbours(slug: string): { prev?: Doc; next?: Doc } {
  const index = DOCS.findIndex((doc) => doc.slug === slug);
  return { prev: index > 0 ? DOCS[index - 1] : undefined, next: index >= 0 ? DOCS[index + 1] : undefined };
}

export const DOC_LINKS = { featuresMd: FEATURES_MD_URL };

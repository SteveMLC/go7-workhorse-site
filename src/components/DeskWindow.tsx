import { PRODUCT_NAME } from "@/lib/site";

type Vendor = "grok" | "claude" | "codex" | "cursor";

const RINGS: { vendor: Vendor; name: string; left: number }[] = [
  { vendor: "grok", name: "Grok", left: 68 },
  { vendor: "claude", name: "Claude", left: 41 },
  { vendor: "codex", name: "Codex", left: 83 },
  { vendor: "cursor", name: "Cursor", left: 27 },
];

const CHATS: { vendor: Vendor; title: string }[] = [
  { vendor: "grok", title: "Fix the flaky auth test" },
  { vendor: "claude", title: "Write the release notes" },
  { vendor: "codex", title: "Split the big PR" },
  { vendor: "cursor", title: "Profile the slow query" },
];

/** A still picture of the desk. Nothing here takes input. */
export function DeskWindow() {
  return (
    <figure className="desk" aria-label={`${PRODUCT_NAME} window on macOS`}>
      <div className="desk-chrome">
        <div className="traffic" aria-hidden="true">
          <i className="close" />
          <i className="min" />
          <i className="zoom" />
        </div>
        <div className="desk-title">{PRODUCT_NAME}</div>
      </div>

      <div className="desk-body">
        <aside className="desk-side" aria-hidden="true">
          <div className="side-brand">
            <img src="/logo-64.webp" alt="" width={22} height={22} />
            <span>{PRODUCT_NAME}</span>
          </div>
          <div className="side-search">Search all chats</div>

          <div className="side-label">Projects</div>
          <div className="side-row active">Qualora</div>
          <div className="side-row">ShoreClose</div>
          <div className="side-row">Rampart</div>

          <div className="side-label">Chats</div>
          {CHATS.map((chat, index) => (
            <div className="side-row" key={chat.vendor}>
              <span className={`dot ${chat.vendor}${index === 2 ? " live" : ""}`} />
              {chat.title}
            </div>
          ))}
        </aside>

        <div className="desk-main">
          <div className="main-head">
            <h3>Leftover this week</h3>
            <p>Each ring is that vendor&apos;s own meter.</p>
          </div>

          <div className="rings">
            {RINGS.map((ring, index) => (
              <div
                className={`ring ${ring.vendor}`}
                key={ring.vendor}
                style={{ ["--i" as string]: index }}
              >
                <div className="ring-dial">
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <circle className="ring-track" cx="50" cy="50" r="42" pathLength={100} />
                    <circle
                      className="ring-fill"
                      cx="50"
                      cy="50"
                      r="42"
                      pathLength={100}
                      style={{ strokeDasharray: `${ring.left} 100` }}
                    />
                  </svg>
                  <span className="ring-pct" data-v={ring.left}>
                    {ring.left}%
                  </span>
                </div>
                <strong className="ring-name">{ring.name}</strong>
                <span className="ring-note">own login</span>
                <span className="ring-bar" aria-hidden="true">
                  <i style={{ ["--p" as string]: (100 - ring.left) / 100 }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

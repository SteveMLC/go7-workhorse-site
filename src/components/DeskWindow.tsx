import { PRODUCT_NAME, SUBSCRIPTION_CLAIM } from "@/lib/site";

export function DeskWindow() {
  return (
    <figure className="desk" aria-label="macOS-style Go7 Workhorse window">
      <div className="desk-titlebar">
        <div className="traffic" aria-hidden="true">
          <i className="close" />
          <i className="min" />
          <i className="max" />
        </div>
        <div className="desk-title">{PRODUCT_NAME}</div>
      </div>
      <div className="desk-body">
        <aside className="sidebar">
          <div className="section-label">Projects</div>
          <div className="row active">Qualora</div>
          <div className="row">ShoreClose</div>
          <div className="row">Desk</div>
          <div className="section-label">Chats</div>
          <div className="row">
            <span className="dot grok" />
            Route leftover
          </div>
          <div className="row">
            <span className="dot claude" />
            Review the join
          </div>
          <div className="row">
            <span className="dot codex" />
            Cut the slice
          </div>
          <div className="row">
            <span className="dot cursor" />
            Open the tree
          </div>
        </aside>
        <div className="stage">
          <h2>Leftover this week</h2>
          <p>{SUBSCRIPTION_CLAIM} Each ring is that vendor&apos;s own meter.</p>
          <div className="rings">
            <div className="ring">
              <div className="dial" style={{ ["--left" as string]: "68%" }} />
              <strong>Grok</strong>
              <span>own login</span>
            </div>
            <div className="ring">
              <div className="dial" style={{ ["--left" as string]: "41%" }} />
              <strong>Claude</strong>
              <span>own login</span>
            </div>
            <div className="ring">
              <div className="dial" style={{ ["--left" as string]: "83%" }} />
              <strong>Codex</strong>
              <span>own login</span>
            </div>
            <div className="ring">
              <div className="dial" style={{ ["--left" as string]: "27%" }} />
              <strong>Cursor</strong>
              <span>two pools</span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

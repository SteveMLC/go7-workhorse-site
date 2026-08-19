import type { Block, Section } from "@/lib/content";
import { Inline } from "./Inline";

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "p":
            return (
              <p key={index}>
                <Inline text={block.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>
                    <Inline text={item} />
                  </li>
                ))}
              </ol>
            );
          case "code":
            return (
              <pre key={index}>
                <code>{block.text}</code>
              </pre>
            );
          case "h":
            return (
              <h4 key={index}>
                <Inline text={block.text} />
              </h4>
            );
          case "video":
            return (
              <figure className="shotfig" key={index}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={block.poster}
                  width={block.width}
                  height={block.height}
                  aria-label={block.alt}
                >
                  <source src={`${block.src}.webm`} type="video/webm" />
                  <source src={`${block.src}.mp4`} type="video/mp4" />
                </video>
                {block.caption ? (
                  <figcaption>
                    <Inline text={block.caption} />
                  </figcaption>
                ) : null}
              </figure>
            );
          case "image":
            return (
              <figure className="shotfig" key={index}>
                <img src={block.src} width={block.width} height={block.height} alt={block.alt} loading="lazy" decoding="async" />
                {block.caption ? (
                  <figcaption>
                    <Inline text={block.caption} />
                  </figcaption>
                ) : null}
              </figure>
            );
          case "table":
            return (
              <div className="table-wrap" key={index}>
                <table>
                  <thead>
                    <tr>
                      {block.head.map((cell) => (
                        <th key={cell} scope="col">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) =>
                          c === 0 ? (
                            <th key={c} scope="row">
                              <Inline text={cell} />
                            </th>
                          ) : (
                            <td key={c}>
                              <Inline text={cell} />
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}

/** A run of titled sections with anchor ids, for the long pages. */
export function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => (
        <section className="doc-section" id={section.id} key={section.id}>
          <h2>
            <a href={`#${section.id}`}>{section.title}</a>
          </h2>
          <Blocks blocks={section.blocks} />
        </section>
      ))}
    </>
  );
}

/** "On this page" — one chip per section. */
export function OnThisPage({ sections, extra = [] }: { sections: Section[]; extra?: { id: string; title: string }[] }) {
  const items = [...sections.map((s) => ({ id: s.id, title: s.title })), ...extra];
  return (
    <nav className="chips" aria-label="On this page">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`}>
          {item.title}
        </a>
      ))}
    </nav>
  );
}

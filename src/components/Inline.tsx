import type { ReactNode } from "react";

/**
 * Renders the three inline marks used in copy strings:
 * `code`, **strong** (may contain code), [text](href). Everything else is text.
 * A small scanner, not a markdown engine.
 */
export function Inline({ text }: { text: string }) {
  return <>{render(text, 0)}</>;
}

function render(text: string, depth: number): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  let plain = "";
  const flush = () => {
    if (plain) out.push(plain);
    plain = "";
  };

  while (i < text.length) {
    const rest = text.slice(i);

    if (rest.startsWith("`")) {
      const end = text.indexOf("`", i + 1);
      if (end > i) {
        flush();
        out.push(<code key={key++}>{text.slice(i + 1, end)}</code>);
        i = end + 1;
        continue;
      }
    }

    if (depth === 0 && rest.startsWith("**")) {
      const end = text.indexOf("**", i + 2);
      if (end > i) {
        flush();
        out.push(<strong key={key++}>{render(text.slice(i + 2, end), depth + 1)}</strong>);
        i = end + 2;
        continue;
      }
    }

    if (rest.startsWith("[")) {
      const close = text.indexOf("](", i);
      const end = close > i ? text.indexOf(")", close + 2) : -1;
      if (close > i && end > close) {
        const label = text.slice(i + 1, close);
        const href = text.slice(close + 2, end);
        flush();
        out.push(
          <a key={key++} href={href}>
            {label}
          </a>,
        );
        i = end + 1;
        continue;
      }
    }

    plain += text[i];
    i += 1;
  }
  flush();
  return out;
}

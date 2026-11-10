type Block = { type: 'text'; text: string } | { type: 'list'; items: string[] };

const SUB_BULLET = /^\s*[-*•·]\s+(.*)$/;

function parse(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split('\n')) {
    const m = raw.match(SUB_BULLET);
    if (m) {
      const last = blocks[blocks.length - 1];
      if (last?.type === 'list') last.items.push(m[1]);
      else blocks.push({ type: 'list', items: [m[1]] });
    } else if (raw.trim()) {
      blocks.push({ type: 'text', text: raw.trim() });
    }
  }
  return blocks;
}

interface HighlightTextProps {
  text: string;
  /** Class for the sub-bullet marker, so each template can match its own style */
  markerClassName?: string;
}

/**
 * Renders one highlight. Plain lines become separate rows; lines starting with
 * "-", "*" or "•" become a nested list whose wrapped lines align with the text.
 */
export default function HighlightText({ text, markerClassName = 'text-gray-400' }: HighlightTextProps) {
  const blocks = parse(text);
  if (blocks.length === 1 && blocks[0].type === 'text') return <>{blocks[0].text}</>;

  return (
    <>
      {blocks.map((b, i) =>
        b.type === 'text' ? (
          <div key={i}>{b.text}</div>
        ) : (
          <ul key={i} className="mt-0.5 space-y-0.5">
            {b.items.map((item, j) => (
              <li key={j} className="flex gap-1.5">
                <span className={`shrink-0 ${markerClassName}`}>◦</span>
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

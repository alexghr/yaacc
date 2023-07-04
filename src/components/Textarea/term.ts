const wordStops = new Set([" ", ",", ".", "?", "!", "\n"]);

export default function findAutocompleteTerm(
  value: string,
  cursorLocation: number,
  trigger: string
): { term: string; start: number; end: number } | null {
  const start = value.lastIndexOf(trigger, cursorLocation);
  if (start > -1) {
    let end = start;
    while (end < value.length) {
      if (wordStops.has(value[end])) {
        break;
      }
      end++;
    }
    const term = value.slice(start + 1, end);
    return { term, start, end };
  } else {
    return null;
  }
}

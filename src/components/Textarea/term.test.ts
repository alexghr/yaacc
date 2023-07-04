import { describe, expect, it } from "vitest";
import findAutocompleteTerm from "./term";

const expectedWordStops = [" ", ",", ".", "?", "!", "\n"];

// helper to generate a bunch of tests quickly
const genTests = (
  prefix: string,
  term: string,
  suffix: string,
  wordStops = expectedWordStops
): [string, ReturnType<typeof findAutocompleteTerm>][] =>
  wordStops.map((stop) => [
    `${prefix}${term}${stop}${suffix}`,
    {
      // just the word, without the trigger
      term: term.slice(1),
      start: prefix.length,
      end: prefix.length + term.length,
    },
  ]);

describe("findAutocompleteTerm", () => {
  it.each(genTests("", "@foo", "bar"))(
    "should find terms at the start",
    (text, expected) => {
      expect(findAutocompleteTerm(text, 5, "@")).toEqual(expected);
    }
  );
  // special case, at the end of the string we can also have no word stop
  it.each(genTests("hello, ", "@foo", "", [...expectedWordStops, ""]))(
    "should find terms at the end",
    (text, expected) => {
      expect(findAutocompleteTerm(text, text.length, "@")).toEqual(expected);
    }
  );
  it.each(genTests("hello ", "@foo", "and bar"))(
    "should find terms in the middle",
    (text, expected) => {
      expect(findAutocompleteTerm(text, 10, "@")).toEqual(expected);
    }
  );
  it.each([
    ["hello foo", 0],
    ["hello foo", 2],
    ["hello foo", 5],
    ["hello foo", 9],
  ])("should return null if there is no term found", (text, location) => {
    expect(findAutocompleteTerm(text, location, "@")).toBeNull();
  });
});

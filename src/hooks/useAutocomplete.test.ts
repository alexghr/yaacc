import { Mock, beforeEach, describe, expect, it, vitest } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useAutocomplete, { AutocompleteOptions } from "./useAutocomplete";

describe("useAutocomplete", () => {
  let search: Mock<
    Parameters<AutocompleteOptions<string>["search"]>,
    ReturnType<AutocompleteOptions<string>["search"]>
  >;

  beforeEach(() => {
    search = vitest.fn().mockResolvedValue([]);
  });

  it("should not call search function when value is empty", () => {
    const { result } = renderHook(() => useAutocomplete({ search }));
    expect(search).not.toHaveBeenCalled();

    act(() => result.current.search(""));

    expect(search).not.toHaveBeenCalled();
  });

  it("should trigger search function when value changes", () => {
    const { result } = renderHook(() => useAutocomplete({ search }));

    expect(search).not.toHaveBeenCalled();

    act(() => result.current.search("foo"));

    expect(search).toHaveBeenCalledWith("foo", expect.any(AbortSignal));
  });

  it("should cancel previous search when value changes", () => {
    const { result } = renderHook(() => useAutocomplete({ search }));

    act(() => result.current.search("foo"));
    expect(search.mock.calls[0][1].aborted).toBe(false);

    act(() => result.current.search("bar"));
    expect(search.mock.calls[0][1].aborted).toBe(true);
    expect(search.mock.calls[1][1].aborted).toBe(false);
  });

  it("should swallow errors", async () => {
    search = vitest
      .fn()
      .mockRejectedValue(new Error("error"))
      .mockResolvedValueOnce(["result 1", "result 2"]);

    const { result } = renderHook(() => useAutocomplete({ search }));

    act(() => result.current.search("foo"));
    await defer();

    expect(result.current.suggestions).toEqual(["result 1", "result 2"]);

    expect(() => act(() => result.current.search("bar"))).not.toThrow();
    await defer();

    expect(result.current.suggestions).toEqual([]);
  });

  it("should return suggestions", async () => {
    search.mockResolvedValue(["result 1", "result 2"]);

    const { result } = renderHook(() => useAutocomplete({ search }));

    act(() => result.current.search("foo"));

    await defer();
    expect(result.current.suggestions).toEqual(["result 1", "result 2"]);
  });
});

// helper function to give promises inside effects a chance to run their course
function defer() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

import { fireEvent, render } from "@testing-library/react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import Textarea from ".";

describe("<Textarea />", () => {
  let search: Mock<[string, AbortSignal], Promise<[]>>;
  beforeEach(() => {
    search = vi.fn().mockResolvedValue([]);
  });

  it("renders an input", () => {
    const { getByRole } = render(<Textarea search={search} />);
    expect(getByRole("textbox")).toBeDefined();
  });

  it("listens for terms at the end", () => {
    const { getByRole } = render(<Textarea search={search} />);
    const input = getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: "hello @foo" } });
    expect(search).toHaveBeenCalledWith("foo", expect.anything());
  });

  it("does not trigger a search if a term is not present", () => {
    const { getByRole } = render(<Textarea search={search} />);
    const input = getByRole("textbox") as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: "hello foo" } });
    expect(search).not.toHaveBeenCalled();
  });
});

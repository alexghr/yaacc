import { User } from "@/data/user";
import { fireEvent, render } from "@testing-library/react";
import { Mock, beforeEach, describe, expect, it, vitest } from "vitest";
import SuggestionList from ".";

describe("<SuggestionList />", () => {
  let users: User[];
  let onSelectItem: Mock<[User], void>;

  beforeEach(() => {
    onSelectItem = vitest.fn();
    users = [
      {
        username: "pturner0",
        avatarUrl:
          "https://secure.gravatar.com/avatar/cd4318b7fb1cf64648f59198aca8757f?d=mm",
        name: "Paula Turner",
      },
      {
        username: "pdixon1",
        avatarUrl:
          "https://secure.gravatar.com/avatar/be09ed96613495dccda4eeffc4dd2daf?d=mm",
        name: "Patrick Dixon",
      },
      {
        username: "mhansen2",
        avatarUrl:
          "https://secure.gravatar.com/avatar/15442f219c2c472e0f1572aacc1cdfd7?d=mm",
        name: "Michael Hansen",
      },
    ];
  });

  it("should renders a list of suggestions", () => {
    const { getByRole } = render(
      <SuggestionList items={users} onSelectItem={onSelectItem} />
    );
    expect(getByRole("listbox")).toBeDefined();
  });

  it("should render a list item for each suggestion", () => {
    const { getAllByRole } = render(<SuggestionList items={users} />);
    expect(getAllByRole("option")).toHaveLength(users.length);
  });

  it("should not have anything selected in the beginning", () => {
    const { findByRole } = render(
      <SuggestionList items={users} onSelectItem={onSelectItem} />
    );
    expect(findByRole("option", { selected: true })).toBeDefined();
  });

  it("should select the first item by pressing the down arrow", () => {
    const { getByRole } = render(
      <SuggestionList items={users} onSelectItem={onSelectItem} />
    );
    fireEvent.keyDown(window, { key: "ArrowDown" });
    const selected = getByRole("option", { selected: true });
    expect(selected.previousSibling).toBeFalsy();
  });

  it("should select the last item by pressing the up arrow", () => {
    const { getByRole } = render(
      <SuggestionList items={users} onSelectItem={onSelectItem} />
    );
    fireEvent.keyDown(window, { key: "ArrowUp" });
    const selected = getByRole("option", { selected: true });
    expect(selected.nextSibling).toBeFalsy();
  });

  it("should select the next item by pressing the down arrow", () => {
    const { getByRole } = render(
      <SuggestionList items={users} onSelectItem={onSelectItem} />
    );
    fireEvent.keyDown(window, { key: "ArrowDown" });
    const firstSelection = getByRole("option", { selected: true });
    fireEvent.keyDown(window, { key: "ArrowDown" });
    const secondSelection = getByRole("option", { selected: true });
    expect(firstSelection.nextSibling).toBe(secondSelection);
  });

  it("should selecth previous item by pressing the up arrow", () => {
    const { getByRole } = render(
      <SuggestionList items={users} onSelectItem={onSelectItem} />
    );
    fireEvent.keyDown(window, { key: "ArrowUp" });
    const firstSelection = getByRole("option", { selected: true });
    fireEvent.keyDown(window, { key: "ArrowUp" });
    const secondSelection = getByRole("option", { selected: true });
    expect(firstSelection.previousSibling).toBe(secondSelection);
  });

  it("should commit the selection by pressing enter", () => {
    render(<SuggestionList items={users} onSelectItem={onSelectItem} />);

    fireEvent.keyDown(window, { key: "ArrowDown" });
    fireEvent.keyDown(window, { key: "Enter" });

    expect(onSelectItem).toHaveBeenCalledWith(users[0]);
  });

  it("should not emit onSelectItem if no item is selected", () => {
    render(<SuggestionList items={users} onSelectItem={onSelectItem} />);
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onSelectItem).not.toHaveBeenCalled();
  });
});

import type { User } from "@/data/user";
import useGlobalKeyDown from "@/hooks/useGlobalKeyDown";
import { useEffect, useState } from "react";
import Suggestion from "../Suggestion";
import styles from "./styles.module.css";

type Props = {
  items: User[];
  open?: boolean;
  onSelectItem?: (user: User) => void;
  onRequestClose?: () => void;
};

export default function SuggestionList({ items, onSelectItem }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useGlobalKeyDown(
    "ArrowDown",
    (ev) => {
      if (!open) {
        return;
      }
      ev.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % items.length);
    },
    [open, items.length]
  );

  useGlobalKeyDown(
    "ArrowUp",
    (ev) => {
      if (!open) {
        return;
      }
      ev.preventDefault();
      setSelectedIndex((prev) => (prev - 1 < 0 ? items.length - 1 : prev - 1));
    },
    [open, items.length]
  );

  useGlobalKeyDown(
    "Enter",
    (ev) => {
      if (!open) {
        return;
      }

      ev.preventDefault();
      const user = items[selectedIndex];
      if (user) {
        onSelectItem?.(user);
      }
    },
    [open, items, selectedIndex]
  );

  return (
    <ol role="listbox" className={styles.suggestions}>
      {items.map((user, index) => (
        <li
          key={user.username}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <Suggestion {...user} />
        </li>
      ))}
    </ol>
  );
}

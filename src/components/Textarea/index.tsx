import type { User } from "@/data/user";
import useSearch from "@/hooks/useSearch";
import { FC, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import SuggestionList from "../SuggestionList";

type Props = {
  search: (term: string, signal: AbortSignal) => Promise<User[]>;
};

const Textarea: FC<Props> = ({ search }) => {
  const [value, setValue] = useState("");
  const { results, updateQuery } = useSearch<User>({
    search,
  });
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const termStartRef = useRef(-1);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setValue(value);

    // this only looks for autocomplete opportunities at the end of the text
    // ideally we'd look for terms where the cursor is.
    const term = /\s@(\w+)$/.exec(value)?.[1];
    if (term) {
      if (termStartRef.current === -1) {
        // subtract the length of the term to find out where it starts at
        // then subtract 1 more to account for the @ that didn't get captured by the regex
        termStartRef.current = value.length - term.length - 1;
      }
      updateQuery(term);
      setSuggestionsVisible(true);
    } else {
      setSuggestionsVisible(false);
      termStartRef.current = -1;
    }
  };

  const handleCloseSuggestions = () => {
    setSuggestionsVisible(false);
    // I don't like this
    termStartRef.current = -1;
  };

  const handleSelection = (user: User) => {
    const termStart = termStartRef.current;
    termStartRef.current = -1;

    setSuggestionsVisible(false);

    setValue((prev) => {
      return prev.slice(0, termStart) + user.name;
    });
  };

  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.textArea}
        onChange={handleChange}
        value={value}
      />
      <SuggestionList
        open={suggestionsVisible && results.length > 0}
        items={results}
        onRequestClose={handleCloseSuggestions}
        onSelectItem={handleSelection}
      />
    </div>
  );
};
export default Textarea;

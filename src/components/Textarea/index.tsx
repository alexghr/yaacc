import type { User } from "@/data/user";
import useSearch from "@/hooks/useSearch";
import { FC, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import SuggestionList from "../SuggestionList";
import findAutocompleteTerm from "./term";

type Props = {
  search: (term: string, signal: AbortSignal) => Promise<User[]>;
};

const Textarea: FC<Props> = ({ search }) => {
  const [value, setValue] = useState("");
  const { results, updateQuery } = useSearch<User>({
    search,
  });
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const termBoundsRef = useRef<ReturnType<typeof findAutocompleteTerm>>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setValue(value);

    const result = findAutocompleteTerm(
      value,
      event.target.selectionStart,
      "@"
    );
    if (result) {
      termBoundsRef.current = result;
      updateQuery(result.term);
      setSuggestionsVisible(true);
    } else {
      setSuggestionsVisible(false);
      termBoundsRef.current = null;
    }
  };

  const handleCloseSuggestions = () => {
    setSuggestionsVisible(false);
    // I don't like this
    termBoundsRef.current = null;
  };

  const handleSelection = (user: User) => {
    const termBounds = termBoundsRef.current;
    termBoundsRef.current = null;

    setSuggestionsVisible(false);

    if (termBounds) {
      setValue((prev) => {
        return (
          prev.slice(0, termBounds.start) +
          user.name +
          prev.slice(termBounds.end)
        );
      });
    }
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

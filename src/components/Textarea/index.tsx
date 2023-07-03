import type { User } from "@/data/user";
import useSearch from "@/hooks/useSearch";
import { FC, useEffect, useState } from "react";
import Suggestion from "../Suggestion";
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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setValue(value);

    // this only looks for autocomplete opportunities at the end of the text
    // ideally we'd look for terms where the cursor is.
    const term = /\s@(\w+)$/.exec(value)?.[1];
    if (term) {
      updateQuery(term);
    }
  };

  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.textArea}
        onChange={handleChange}
        value={value}
      />
      <SuggestionList items={results} />
    </div>
  );
};
export default Textarea;

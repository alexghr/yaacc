import type { User } from "@/data/user";
import useSearch from "@/hooks/useSearch";
import { FC, useRef, useState } from "react";
import Suggestion from "../Suggestion";
import searchFn from "../../api/search";
import styles from "./styles.module.css";

type Props = {};

const Textarea: FC<{}> = () => {
  const [value, setValue] = useState("");
  const isSearchingRef = useRef(false);
  const { results, updateQuery } = useSearch<User>({
    search: searchFn,
  });

  const suggestionListRef = useRef<HTMLOListElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setValue(value);

    const term = /@(\w+)$/.exec(value)?.[1] ?? "";
    if (term || isSearchingRef.current) {
      isSearchingRef.current = true;
      const term = /@(\w+)$/.exec(value)?.[1] ?? "";
      updateQuery(term);
    } else if (value === " ") {
      isSearchingRef.current = false;
    }
  };

  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.textArea}
        onChange={handleChange}
        value={value}
      />
      <ol ref={suggestionListRef} className={styles.suggestions}>
        {results.map((user) => (
          <li key={user.username}>
            <Suggestion {...user} />
          </li>
        ))}
      </ol>
    </div>
  );
};
export default Textarea;

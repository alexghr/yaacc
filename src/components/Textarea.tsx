import type { User } from "@/data/user";
import useAutocomplete from "@/hooks/useAutocomplete";
import { FC, useRef, useState } from "react";

type Props = {};

const Textarea: FC<{}> = () => {
  const [value, setValue] = useState("");
  const isSearchingRef = useRef(false);
  const { suggestions, search } = useAutocomplete<User>({
    search: async (query, signal) => {
      const url = new URL("/api/search", window.location.origin);
      url.searchParams.set("q", query);
      const res = await fetch(url.toString(), { signal });
      if (res.status !== 200) {
        throw new Error("Failed to fetch");
      }
      return res.json();
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setValue(value);

    if (value === "@" || isSearchingRef.current) {
      isSearchingRef.current = true;
      const term = /@(\w+)$/.exec(value)?.[1] ?? "";
      search(term);
    } else if (value === " ") {
      isSearchingRef.current = false;
    }
  };

  return (
    <div>
      <textarea onChange={handleChange} value={value} />
      {suggestions.map((suggestion) => (
        <div key={suggestion.username}>{suggestion.name}</div>
      ))}
    </div>
  );
};
export default Textarea;
